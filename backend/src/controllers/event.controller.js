



import Event from "../models/Event.js"
import EventRegistration from "../models/EventRegistration.js"

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
    const { eventId, teamName, teamSize, members } = req.body

    if (!eventId || !teamSize || !members) {
      return res.status(400).json({ message: "Invalid registration data" })
    }

    const event = await Event.findById(eventId)

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    // Capacity check
    if (
      event.maxParticipants &&
      event.currentParticipants + teamSize > event.maxParticipants
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
      teamSize,
      members,
      registeredBy,
    })

    // Update participant count
    event.currentParticipants += teamSize
    await event.save()

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
