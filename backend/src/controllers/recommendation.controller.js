import { getRecommendedEvents } from "../services/recommendation.service.js"

export const getUserRecommendations = async (req, res) => {
  try {
    const { userId } = req.params

    if (!userId) {
      return res.status(400).json({ message: "User ID required" })
    }

    const events = await getRecommendedEvents(userId, 12)

    // Light transformation for UI
    const formatted = events.map((e) => ({
      id: e._id,
      title: e.title,
      type: e.type,
      city: e.location.city,
      country: e.location.country,
      date: e.startDate,
      score: e.recommendationScore,
      reason: buildReason(e),
    }))

    res.status(200).json(formatted)
  } catch (err) {
    console.error("Recommendation API error:", err)
    res.status(500).json({ message: "Failed to load recommendations" })
  }
}

// simple explainability (important UX)
function buildReason(event) {
  if (event.recommendationScore > 6) return "Strong match based on your activity"
  if (event.currentParticipants > 20) return "Popular among similar users"
  if (event.mode === "online") return "Easy to attend online"
  return "Matches your interests"
}
