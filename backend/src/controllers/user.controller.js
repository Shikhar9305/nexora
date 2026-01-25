import UserProfile from "../models/UserProfile.js"

export const submitUserOnboarding = async (req, res) => {
  try {
    const {
      userId,
      preferences,
      location,
      skills,
      preferredRoles,
      experienceLevel,
    } = req.body

    // basic validation
    if (!userId) {
      return res.status(400).json({ message: "userId is required" })
    }

    if (!preferences || !preferences.eventTypes?.length) {
      return res.status(400).json({
        message: "At least one event type preference is required",
      })
    }

    // prevent duplicate onboarding
    const existingProfile = await UserProfile.findOne({ userId })
    if (existingProfile) {
      return res.status(400).json({
        message: "Onboarding already completed",
      })
    }

    const profile = await UserProfile.create({
      userId,
      preferences,
      location,
      skills,
      preferredRoles,
      experienceLevel,
    })

    return res.status(201).json({
      message: "User onboarding completed successfully",
      profile,
    })
  } catch (err) {
    return res.status(500).json({
      message: "User onboarding failed",
      error: err.message,
    })
  }
}
