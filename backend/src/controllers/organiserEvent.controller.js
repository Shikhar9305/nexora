import mongoose from "mongoose"
import Event from "../models/Event.js"

const isFiniteNumber = (v) => Number.isFinite(Number(v))

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      type,
      description,
      organiserId,
      organisationName,
      location,
      startDate,
      endDate,
      timezone,
      mode,
      registrationDeadline,
      maxParticipants = null,
      bannerImage,
      website,
      supportsTeams = false,
      maxTeamSize = null,
    } = req.body || {}

    if (!title || !type || !description) {
      return res.status(400).json({ message: "title, type, and description are required" })
    }

    if (!organiserId || !mongoose.Types.ObjectId.isValid(organiserId)) {
      return res.status(400).json({ message: "Valid organiserId is required" })
    }

    if (!organisationName) {
      return res.status(400).json({ message: "organisationName is required" })
    }

    if (!location) {
      return res.status(400).json({ message: "location is required" })
    }

    const { venue, city, state, country, lat, lon } = location
    if (!venue || !city || !state || !country) {
      return res.status(400).json({
        message: "location.venue, location.city, location.state, and location.country are required",
      })
    }
    if (!isFiniteNumber(lat) || !isFiniteNumber(lon)) {
      return res.status(400).json({ message: "location.lat and location.lon must be numbers" })
    }

    if (!startDate || !endDate || !registrationDeadline) {
      return res.status(400).json({ message: "startDate, endDate, and registrationDeadline are required" })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    const regDeadline = new Date(registrationDeadline)

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || Number.isNaN(regDeadline.getTime())) {
      return res.status(400).json({ message: "Invalid date format (use ISO strings)" })
    }
    if (end <= start) {
      return res.status(400).json({ message: "endDate must be after startDate" })
    }
    if (regDeadline > start) {
      return res.status(400).json({ message: "registrationDeadline must be on/before startDate" })
    }

    const mp =
      maxParticipants === null || maxParticipants === "" ? null : Number(maxParticipants)
    if (mp !== null && (!Number.isFinite(mp) || mp <= 0)) {
      return res.status(400).json({ message: "maxParticipants must be a positive number or null" })
    }

    const st = Boolean(supportsTeams)
    const mts = st && maxTeamSize !== null && maxTeamSize !== "" ? Number(maxTeamSize) : null
    if (st) {
      if (!Number.isFinite(mts) || mts < 2 || mts > 6) {
        return res.status(400).json({ message: "maxTeamSize must be between 2 and 6 when supportsTeams=true" })
      }
    }

    const event = await Event.create({
      title,
      type,
      description,
      organiserId,
      organisationName,
      location: {
        venue,
        city,
        state,
        country,
        lat: Number(lat),
        lon: Number(lon),
      },
      startDate: start,
      endDate: end,
      timezone: timezone || "Asia/Kolkata",
      mode,
      registrationDeadline: regDeadline,
      maxParticipants: mp,
      bannerImage: bannerImage || undefined,
      website: website || undefined,
      supportsTeams: st,
      maxTeamSize: st ? mts : undefined,
      status: "approved",
    })

    return res.status(201).json({ message: "Event created", event })
  } catch (error) {
    // Mongoose validation errors
    if (error?.name === "ValidationError") {
      return res.status(400).json({ message: "Validation failed", error: error.message })
    }
    console.error("Create event error:", error)
    return res.status(500).json({ message: "Failed to create event" })
  }
}

