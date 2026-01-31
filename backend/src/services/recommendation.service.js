import Event from "../models/Event.js"
import UserProfile from "../models/UserProfile.js"
import UserEventInteraction from "../models/UserEventInteraction.js"

// ------------------------------
// CONFIG (tune anytime)
// ------------------------------
const WEIGHTS = {
  REGISTERED: 5,
  SAVED: 3,
  CLICK: 1.5,
  VIEW_SECOND: 0.05,

  SAME_TYPE: 1.2,
  NEARBY: 1.0,
  POPULARITY: 0.4,
  SOON: 0.8,
}

const MAX_DISTANCE_KM = 150

// ------------------------------
// UTILS
// ------------------------------
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ------------------------------
// CORE RECOMMENDER
// ------------------------------
export const getRecommendedEvents = async (userId, limit = 20) => {
  const now = new Date()

  // 1️⃣ Load user profile
  const profile = await UserProfile.findOne({ userId }).lean()

  // 2️⃣ Load interactions
  const interactions = await UserEventInteraction.find({ userId }).lean()

  const interactionMap = new Map()
  interactions.forEach((i) => {
    interactionMap.set(String(i.eventId), i)
  })

  // 3️⃣ Load candidate events
  const events = await Event.find({
    status: "approved",
    registrationDeadline: { $gt: now },
  }).lean()

  // 4️⃣ Score events
  const scored = events.map((event) => {
    let score = 0
    const interaction = interactionMap.get(String(event._id))

    // ---- Behavioral signals ----
    if (interaction) {
      if (interaction.registered)
        score += WEIGHTS.REGISTERED

      if (interaction.saved)
        score += WEIGHTS.SAVED

      if (interaction.click)
        score += WEIGHTS.CLICK

      if (interaction.totalViewDuration)
        score +=
          interaction.totalViewDuration *
          WEIGHTS.VIEW_SECOND
    }

    // ---- Preference match ----
    if (
      profile?.preferences?.eventTypes?.includes(event.type)
    ) {
      score += WEIGHTS.SAME_TYPE
    }

    // ---- Location boost ----
    if (
      profile?.location?.lat &&
      event.location?.lat &&
      event.mode !== "online"
    ) {
      const dist = haversineDistance(
        profile.location.lat,
        profile.location.lon,
        event.location.lat,
        event.location.lon
      )

      if (dist < MAX_DISTANCE_KM) {
        score += WEIGHTS.NEARBY * (1 - dist / MAX_DISTANCE_KM)
      }
    }

    // ---- Popularity (log scale) ----
    if (event.currentParticipants > 0) {
      score +=
        Math.log(event.currentParticipants + 1) *
        WEIGHTS.POPULARITY
    }

    // ---- Time sensitivity ----
    const daysToStart =
      (new Date(event.startDate) - now) /
      (1000 * 60 * 60 * 24)

    if (daysToStart > 0 && daysToStart < 14) {
      score += WEIGHTS.SOON
    }

    return {
      ...event,
      recommendationScore: Number(score.toFixed(3)),
    }
  })

  // 5️⃣ Sort & return
  return scored
    .sort(
      (a, b) =>
        b.recommendationScore -
        a.recommendationScore
    )
    .slice(0, limit)
}
