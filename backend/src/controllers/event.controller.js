



import Event from "../models/Event.js"
import EventRegistration from "../models/EventRegistration.js"
import Team from "../models/Team.js"

// GET all approved events (Explore)
export const getApprovedEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" })
      .select("-__v")
      .sort({ startDate: 1 })

    res.json(events)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events" })
  }
}

// GET single event (Event Details)
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).select("-__v")

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    res.json(event)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch event" })
  }
}

// POST register for event
export const registerForEvent = async (req, res) => {
  try {
    const { eventId, teamName, teamSize, members, teamId } = req.body

    if (!eventId || !teamSize || !members) {
      return res.status(400).json({ message: "Invalid registration data" })
    }

    const event = await Event.findById(eventId)

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    let effectiveTeamSize = teamSize
    let finalMembers = members
    let team = null

    // If a matchmaking team is provided, enforce linkage and team constraints
    if (teamId) {
      team = await Team.findById(teamId)
      if (!team) {
        return res.status(404).json({ message: "Team not found" })
      }
      if (String(team.eventId) !== String(eventId)) {
        return res
          .status(400)
          .json({ message: "Team does not belong to this event" })
      }

      const registeredByForTeam = req.body.registeredBy
      if (!registeredByForTeam) {
        return res.status(401).json({
          message: "registeredBy is required for team registration",
        })
      }
      if (String(team.leaderId) !== String(registeredByForTeam)) {
        return res.status(403).json({
          message: "Only the team leader can register this team",
        })
      }

      // Merge existing team membership with manual entries by enforcing final size
      effectiveTeamSize = team.maxSize

      if (!Array.isArray(members) || members.length !== effectiveTeamSize) {
        return res.status(400).json({
          message:
            "You must provide participant details for all team members before registering",
        })
      }

      finalMembers = members

      // If event has a configured maxTeamSize, enforce equality with team.maxSize
      if (event.supportsTeams && event.maxTeamSize) {
        if (effectiveTeamSize !== event.maxTeamSize) {
          return res.status(400).json({
            message: `Team size must be exactly ${event.maxTeamSize} for this event`,
          })
        }
      }
    }

    // 🔒 Enforce event maxTeamSize (authoritative backend check)
    if (event.supportsTeams) {
      if (!event.maxTeamSize) {
        return res.status(500).json({
          message: "Event configuration error: maxTeamSize missing",
        })
      }

      if (effectiveTeamSize > event.maxTeamSize) {
        return res.status(400).json({
          message: `Team size cannot exceed ${event.maxTeamSize} for this event`,
        })
      }
    }

    // Capacity check
    if (
      event.maxParticipants &&
      event.currentParticipants + effectiveTeamSize > event.maxParticipants
    ) {
      return res
        .status(400)
        .json({ message: "Not enough slots remaining" })
    }

    // NOTE: Replace with real userId from auth middleware later
    const registeredBy = req.body.registeredBy || null

    // Create registration
    await EventRegistration.create({
      eventId,
      teamName,
      teamSize: effectiveTeamSize,
      members: finalMembers,
      registeredBy,
    })

    // Update participant count
    event.currentParticipants += effectiveTeamSize
    await event.save()

    // Lock team once registration succeeds
    if (team) {
      team.status = "locked"
      // Optional flag – will be persisted if present in schema without schema changes
      team.registered = true
      await team.save()
    }

    res.status(201).json({ message: "Registration successful" })
  } catch (error) {
    console.error("Registration error:", error)

    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You are already registered for this event" })
    }

    res.status(500).json({ message: "Registration failed" })
  }
}
