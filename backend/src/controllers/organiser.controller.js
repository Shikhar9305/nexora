import OrganiserProfile from "../models/OrganiserProfile.js"

export const submitOnboarding = async (req, res) => {
  try {
    const {
      userId,
      organisationName,
      organisationType,
      contactEmail,
      website,
    } = req.body

    const existing = await OrganiserProfile.findOne({ userId })
    if (existing) {
      return res.status(400).json({ message: "Onboarding already submitted" })
    }

    const organiser = await OrganiserProfile.create({
      userId,
      organisationName,
      organisationType,
      contactEmail,
      website,
      isApproved: false,
    })

    res.status(201).json({
      message: "Onboarding submitted",
      organiserId: organiser._id,
      status: "pending",
    })
  } catch (err) {
    res.status(500).json({ message: "Onboarding failed", error: err.message })
  }
}

export const getOrganiserStatus = async (req, res) => {
  try {
    const organiser = await OrganiserProfile.findOne({
      userId: req.params.userId,
    })

    if (!organiser) {
      return res.status(404).json({ status: "not_found" })
    }

    res.json({
      status: organiser.isApproved ? "approved" : "pending",
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
