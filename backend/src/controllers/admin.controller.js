import User from "../models/User.js"
import Event from "../models/Event.js"
import EventRegistration from "../models/EventRegistration.js"
import OrganiserProfile from "../models/OrganiserProfile.js"

export const approveOrganiser = async (req, res) => {
  try {
    const organiser = await OrganiserProfile.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    )

    if (!organiser) {
      return res.status(404).json({ message: "Organiser not found" })
    }

    res.json({ message: "Organiser approved" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalEvents,
      totalRegistrations,
      pendingApprovals
    ] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      EventRegistration.countDocuments(),
      OrganiserProfile.countDocuments({ isApproved: false })
    ])

    res.json({
      totalUsers,
      totalEvents,
      totalRegistrations,
      pendingApprovals
    })
  } catch (err) {
    res.status(500).json({ message: "Failed to load stats" })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })

    res.json(users)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" })
  }
}

export const getPendingOrganisers = async (req, res) => {
  try {
    const organisers = await OrganiserProfile.find({ isApproved: false })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })

    res.json(organisers)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch organisers" })
  }
}

export const getAllEventsAdmin = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("organiserId", "organisationName")
      .sort({ createdAt: -1 })

    res.json(events)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch events" })
  }
}

