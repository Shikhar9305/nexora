import mongoose from "mongoose"
import MatchmakingProfile from "../models/MatchmakingProfile.js"
import Team from "../models/Team.js"
import TeamInvitation from "../models/TeamInvitation.js"

const getUserIdFromRequest = (req) => {
  // In a real system this would come from auth middleware (JWT/session)
  const raw = req.user?.id || req.user?._id || req.body.userId || req.query.userId
  if (!raw) return null
  try {
    return new mongoose.Types.ObjectId(raw)
  } catch {
    return null
  }
}

// Lightweight score helpers for matchmaking logic
const EXPERIENCE_MAP = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
}

const computeCompatibilityScore = (selfProfile, otherProfile) => {
  const selfSkills = selfProfile.skills || []
  const otherSkills = otherProfile.skills || []
  const selfRoles = selfProfile.desiredRoles || []
  const otherRoles = otherProfile.desiredRoles || []

  const skillSetSelf = new Set(selfSkills)
  const skillSetOther = new Set(otherSkills)

  let sharedSkills = 0
  for (const s of skillSetSelf) {
    if (skillSetOther.has(s)) sharedSkills += 1
  }

  // Skills the other person brings that you don't have (complement)
  let complementSkills = 0
  for (const s of skillSetOther) {
    if (!skillSetSelf.has(s)) complementSkills += 1
  }

  const roleSetSelf = new Set(selfRoles)
  const roleSetOther = new Set(otherRoles)
  let sharedRoles = 0
  for (const r of roleSetSelf) {
    if (roleSetOther.has(r)) sharedRoles += 1
  }
  let complementaryRoles = 0
  for (const r of roleSetOther) {
    if (!roleSetSelf.has(r)) complementaryRoles += 1
  }

  const selfLevel = EXPERIENCE_MAP[selfProfile.experienceLevel] ?? 1
  const otherLevel = EXPERIENCE_MAP[otherProfile.experienceLevel] ?? 1
  const levelDiff = Math.abs(selfLevel - otherLevel)

  // Level balance: small differences are ideal, large gaps slightly penalised
  const levelScore = 6 - levelDiff * 2 // in [2,6] range roughly

  // Location bonus: encourage local teams but keep it soft
  let locationBonus = 0
  if (
    selfProfile.location &&
    otherProfile.location &&
    selfProfile.location.trim().length &&
    otherProfile.location.trim().length &&
    selfProfile.location.trim().toLowerCase() ===
      otherProfile.location.trim().toLowerCase()
  ) {
    locationBonus = 4
  }

  // Diversity & exposure: less exposed users get a boost
  const exposure = otherProfile.exposureCount || 0
  const diversityBoost = Math.max(0, 6 - exposure) // falls off as exposure grows
  const exposurePenalty = exposure * 1.5

  const score =
    complementSkills * 3 + // strong weight on complementarity
    sharedSkills * 1 +
    complementaryRoles * 2 +
    sharedRoles * 1 +
    levelScore +
    locationBonus +
    diversityBoost -
    exposurePenalty

  return score
}

export const createOrUpdateProfile = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req)
    const { eventId, skills, desiredRoles, experienceLevel, lookingForTeam, location } =
      req.body || {}

    if (!userId) {
      return res.status(401).json({ message: "userId is required (auth)" })
    }

    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Valid eventId is required" })
    }

    const eventObjectId = new mongoose.Types.ObjectId(eventId)

    if (!experienceLevel || !["beginner", "intermediate", "advanced"].includes(experienceLevel)) {
      return res.status(400).json({
        message: "experienceLevel must be one of beginner, intermediate, advanced",
      })
    }

    const teamsForUser = await Team.findOne({
      eventId: eventObjectId,
      "members.userId": userId,
    })
      .select("_id status")
      .lean()

    const hasTeam = Boolean(teamsForUser)

    const profile = await MatchmakingProfile.findOneAndUpdate(
      { userId, eventId: eventObjectId },
      {
        $set: {
          skills: skills || [],
          desiredRoles: desiredRoles || [],
          experienceLevel,
          lookingForTeam: hasTeam ? false : lookingForTeam ?? true,
          hasTeam,
          location: location || "",
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean()

    return res.status(200).json({ message: "Profile saved", profile })
  } catch (error) {
    console.error("createOrUpdateProfile error:", error)
    return res.status(500).json({ message: "Failed to save profile" })
  }
}

// Internal helper & standalone controller to keep exposure logic explainable
export const updateVisibilityMetrics = async ({ eventId, userIds }) => {
  if (!eventId || !Array.isArray(userIds) || userIds.length === 0) return

  const eventObjectId = new mongoose.Types.ObjectId(eventId)
  const now = new Date()

  await MatchmakingProfile.updateMany(
    { eventId: eventObjectId, userId: { $in: userIds } },
    {
      $inc: { exposureCount: 1 },
      $set: { lastShownAt: now },
    }
  )
}

export const getCuratedPoolForUser = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req)
    const { eventId } = req.params

    if (!userId) {
      return res.status(401).json({ message: "userId is required (auth)" })
    }

    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Valid eventId is required" })
    }
    const eventObjectId = new mongoose.Types.ObjectId(eventId)

    const selfProfile = await MatchmakingProfile.findOne({
      userId,
      eventId: eventObjectId,
    }).lean()

    if (!selfProfile) {
      return res.status(400).json({
        message: "Create your matchmaking profile first",
      })
    }

    // Preload teams for this event to understand which users are in full teams
    const teams = await Team.find({ eventId: eventObjectId }).select(
      "_id members maxSize status"
    )

    const usersInFullTeams = new Set()
    for (const team of teams) {
      if (team.members.length >= team.maxSize) {
        for (const m of team.members) {
          usersInFullTeams.add(String(m.userId))
        }
      }
    }

    // Invitations where current user is the inviter or was rejected
    const invitations = await TeamInvitation.find({
      eventId: eventObjectId,
      status: { $in: ["pending", "accepted", "rejected"] },
    })
      .select("fromUserId toUserId status")
      .lean()

    const alreadyInvitedByMe = new Set()
    const rejectedMe = new Set()

    for (const inv of invitations) {
      const from = String(inv.fromUserId)
      const to = String(inv.toUserId)
      if (from === String(userId)) {
        // Any state counts as "already invited" to avoid spam
        alreadyInvitedByMe.add(to)
      }
      if (to === String(userId) && inv.status === "rejected") {
        // Candidate actively rejected me
        rejectedMe.add(from)
      }
    }

    // Base candidate set
    const candidates = await MatchmakingProfile.find({
      eventId: eventObjectId,
      userId: { $ne: userId },
      lookingForTeam: true,
    }).lean()

    const filtered = candidates.filter((p) => {
      const idStr = String(p.userId)
      if (usersInFullTeams.has(idStr)) return false
      if (alreadyInvitedByMe.has(idStr)) return false
      if (rejectedMe.has(idStr)) return false
      return true
    })

    // Compute compatibility score for each profile
    const scored = filtered.map((p) => ({
      profile: p,
      score: computeCompatibilityScore(selfProfile, p),
    }))

    // Sort descending by score, then by least exposure to avoid popularity bias
    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return (a.profile.exposureCount || 0) - (b.profile.exposureCount || 0)
    })

    const topN = 50
    const limitPool = scored.slice(0, topN)

    const desiredCount = 20
    const takeCount = Math.min(desiredCount, limitPool.length)

    const topCount = Math.round(takeCount * 0.6)
    const randomCount = takeCount - topCount

    const topSelected = limitPool.slice(0, topCount)
    const remainder = limitPool.slice(topCount)

    // Controlled randomness: pick remaining from valid remainder uniformly
    const randomSelected = []
    const poolIndices = remainder.map((_, idx) => idx)
    while (randomSelected.length < randomCount && poolIndices.length > 0) {
      const idx = Math.floor(Math.random() * poolIndices.length)
      const [pickedIndex] = poolIndices.splice(idx, 1)
      randomSelected.push(remainder[pickedIndex])
    }

    const finalList = [...topSelected, ...randomSelected]

    const userIdsToUpdate = finalList.map((x) => x.profile.userId)
    await updateVisibilityMetrics({ eventId: eventObjectId, userIds: userIdsToUpdate })

    return res.status(200).json({
      profiles: finalList.map((x) => ({
        ...x.profile,
        compatibilityScore: x.score,
      })),
    })
  } catch (error) {
    console.error("getCuratedPoolForUser error:", error)
    return res.status(500).json({ message: "Failed to fetch curated pool" })
  }
}
export const getMyProfileForEvent = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req)
    const { eventId } = req.params

    if (!userId) {
      return res.status(401).json({ message: "userId is required" })
    }

    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Valid eventId is required" })
    }

    const profile = await MatchmakingProfile.findOne({
      userId,
      eventId,
    }).lean()

    return res.status(200).json({ profile })
  } catch (err) {
    return res.status(500).json({ message: "Failed to load profile" })
  }
}

