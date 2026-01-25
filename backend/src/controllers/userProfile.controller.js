import UserProfile from "../models/UserProfile.js"
import EventRegistration from "../models/EventRegistration.js"

export const toggleSaveEvent = async (req, res) => {
  try {
    const { userId } = req.body
    const { eventId } = req.params

    const profile = await UserProfile.findOne({ userId })
    if (!profile) {
      return res.status(404).json({ message: "User profile not found" })
    }

    const isSaved = profile.savedEvents.includes(eventId)

    if (isSaved) {
      profile.savedEvents.pull(eventId)
    } else {
      profile.savedEvents.push(eventId)
    }

    await profile.save()

    res.json({ saved: !isSaved })
  } catch (err) {
    res.status(500).json({ message: "Failed to toggle save" })
  }
}


export const getUserDashboard = async (req, res) => {
  try {
    const { userId } = req.params

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" })
    }

    // 1️⃣ Load user profile (saved events)
    const profile = await UserProfile.findOne({ userId })
      .populate("savedEvents")
      .lean()

    if (!profile) {
      return res.status(404).json({ message: "User profile not found" })
    }

    // 2️⃣ Load registered events from EventRegistration
    const registrations = await EventRegistration.find({
      registeredBy: userId,
    })
      .populate("eventId")
      .lean()

    // 3️⃣ Normalize response
    res.status(200).json({
      savedEvents: profile.savedEvents || [],
      registeredEvents: registrations
        .map((r) => r.eventId)
        .filter(Boolean),
    })
  } catch (err) {
    console.error("Dashboard error:", err)
    res.status(500).json({ message: "Failed to load dashboard" })
  }
}

