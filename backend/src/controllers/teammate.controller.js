import mongoose from "mongoose"
import TeammatePool from "../models/TeammatePool.js"
import UserProfile from "../models/UserProfile.js"
import Event from "../models/Event.js"

// ========== JOIN TEAMMATE POOL ==========
export const joinTeammatePool = async (req, res) => {
  try {
    const { eventId, desiredRole, availability,userId } = req.body
    

    if (!eventId || !desiredRole || !userId) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Check if event exists
    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    // Check registration deadline
    const deadlineDate = new Date(event.registrationDeadline)
    if (deadlineDate < new Date()) {
      return res.status(400).json({ message: "Registration deadline has passed" })
    }

    // Check if user already in pool for this event
    const existingEntry = await TeammatePool.findOne({
      eventId,
      userId,
      status: { $in: ["searching", "matched"] },
    })

    if (existingEntry) {
      return res.status(400).json({ message: "You are already in the teammate pool for this event" })
    }

    // Get user profile for skills and experience
    const userProfile = await UserProfile.findOne({ userId })

    // Create pool entry
    const poolEntry = await TeammatePool.create({
      eventId,
      userId,
      userProfileId: userProfile?._id,
      desiredRole,
      skills: userProfile?.skills || [],
      availability,
      location: userProfile?.location || {},
      experienceLevel: userProfile?.experienceLevel || "intermediate",
      status: "searching",
    })

    console.log("[v0] User joined teammate pool:", poolEntry._id)

    res.status(201).json({
      message: "Joined teammate pool successfully",
      poolEntry,
    })
  } catch (error) {
    console.error("[v0] Join pool error:", error)
    res.status(500).json({ message: "Failed to join teammate pool" })
  }
}

// ========== LEAVE TEAMMATE POOL ==========
export const leaveTeammatePool = async (req, res) => {
  try {
    const { eventId } = req.body
    const userId = req.user?.id

    if (!eventId || !userId) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const poolEntry = await TeammatePool.findOneAndUpdate(
      { eventId, userId, status: "searching" },
      { status: "left", matchedWith: [] },
      { new: true }
    )

    if (!poolEntry) {
      return res.status(404).json({ message: "Pool entry not found" })
    }

    console.log("[v0] User left teammate pool:", poolEntry._id)

    res.json({
      message: "Left teammate pool successfully",
    })
  } catch (error) {
    console.error("[v0] Leave pool error:", error)
    res.status(500).json({ message: "Failed to leave teammate pool" })
  }
}

// ========== GET POOL STATUS FOR EVENT ==========
export const getEventTeammatePool = async (req, res) => {
  try {
    const { eventId } = req.params
    const userId = req.user?.id

    // Get all searching users in pool
    const poolUsers = await TeammatePool.find({
      eventId,
      status: "searching",
    })
      .populate("userId", "name email")
      .populate("userProfileId", "skills preferredRoles experienceLevel location")

    // Get current user's pool status
    const currentUserStatus = await TeammatePool.findOne({
      eventId,
      userId,
    }).populate("userProfileId")

    res.json({
      poolSize: poolUsers.length,
      users: poolUsers,
      currentUserStatus,
    })
  } catch (error) {
    console.error("[v0] Get pool error:", error)
    res.status(500).json({ message: "Failed to fetch pool" })
  }
}

// ========== INTELLIGENT MATCHING ENGINE ==========
export const matchTeammates = async (req, res) => {
  try {
    const { eventId, poolEntryId } = req.body

    if (!eventId || !poolEntryId) {
      return res.status(400).json({ message: "Missing eventId or poolEntryId" })
    }

    const currentPoolEntry = await TeammatePool.findById(poolEntryId).populate("userProfileId")

    if (!currentPoolEntry) {
      return res.status(404).json({ message: "Pool entry not found" })
    }

    // Get all other searching users in same event
    const candidates = await TeammatePool.find({
      eventId,
      _id: { $ne: poolEntryId },
      status: "searching",
    }).populate("userProfileId")

    console.log(`[v0] Found ${candidates.length} candidates for matching`)

    // Scoring algorithm
    const scoredMatches = candidates
      .map((candidate) => {
        let score = 0

        // 1. Role complementarity (highest priority)
        const currentRoles = currentPoolEntry.userProfile?.preferredRoles || []
        const candidateRoles = candidate.userProfile?.preferredRoles || []

        if (!currentRoles.includes(candidate.desiredRole) && !candidateRoles.includes(currentPoolEntry.desiredRole)) {
          score += 50 // Complementary roles
        }

        // 2. Skill overlap
        const currentSkills = new Set(currentPoolEntry.skills || [])
        const candidateSkills = new Set(candidate.skills || [])
        const skillOverlap = [...currentSkills].filter((s) => candidateSkills.has(s)).length
        score += skillOverlap * 10

        // 3. Experience level match (should be similar)
        if (currentPoolEntry.experienceLevel === candidate.experienceLevel) {
          score += 30
        } else if (
          (currentPoolEntry.experienceLevel === "beginner" && candidate.experienceLevel === "intermediate") ||
          (currentPoolEntry.experienceLevel === "intermediate" && candidate.experienceLevel === "advanced")
        ) {
          score += 15 // Adjacent levels
        }

        // 4. Location proximity
        const distance = calculateDistance(
          currentPoolEntry.location,
          candidate.location
        )

        if (distance < 10) score += 40 // Same city
        else if (distance < 100) score += 20 // Same state
        else if (distance < 1000) score += 10 // Same country
        // else no points (different countries)

        // 5. Availability overlap
        if (currentPoolEntry.availability === candidate.availability) {
          score += 20
        }

        return {
          poolEntryId: candidate._id,
          user: candidate.userId,
          desiredRole: candidate.desiredRole,
          skills: candidate.skills,
          score,
        }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5) // Top 5 matches

    console.log("[v0] Top matches:", scoredMatches)

    // Update matched status
    if (scoredMatches.length > 0) {
      await TeammatePool.findByIdAndUpdate(currentPoolEntry._id, {
        status: "matched",
        matchedWith: scoredMatches.map((m) => m.user),
      })
    }

    res.json({
      message: "Matching completed",
      matches: scoredMatches,
      totalCandidates: candidates.length,
    })
  } catch (error) {
    console.error("[v0] Matching error:", error)
    res.status(500).json({ message: "Matching failed" })
  }
}

// ========== UTILITY: Calculate Distance ==========
function calculateDistance(loc1, loc2) {
  if (!loc1 || !loc2 || !loc1.lat || !loc2.lat) return Infinity

  // Haversine formula for kilometers
  const R = 6371 // Earth's radius
  const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180
  const dLon = ((loc2.lon - loc1.lon) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((loc1.lat * Math.PI) / 180) *
      Math.cos((loc2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

// ========== CONFIRM TEAM FORMATION ==========
export const confirmTeamFormation = async (req, res) => {
  try {
    const { eventId, selectedUserIds } = req.body
    const userId = req.user?.id

    if (!eventId || !selectedUserIds || selectedUserIds.length === 0) {
      return res.status(400).json({ message: "Invalid team composition" })
    }

    // All team members must be in pool
    const teamMembers = await TeammatePool.find({
      eventId,
      userId: { $in: [userId, ...selectedUserIds] },
      status: "searching",
    })

    if (teamMembers.length !== selectedUserIds.length + 1) {
      return res.status(400).json({ message: "Some team members not found in pool" })
    }

    // Update all team members
    const teamId = new mongoose.Types.ObjectId()
    await TeammatePool.updateMany(
      { eventId, userId: { $in: [userId, ...selectedUserIds] } },
      { status: "team-formed", teamId }
    )

    console.log("[v0] Team formed:", teamId)

    res.json({
      message: "Team formed successfully",
      teamId,
      teamSize: selectedUserIds.length + 1,
    })
  } catch (error) {
    console.error("[v0] Team formation error:", error)
    res.status(500).json({ message: "Failed to form team" })
  }
}
