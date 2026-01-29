import mongoose from "mongoose"
import MatchmakingProfile from "../models/MatchmakingProfile.js"
import Team from "../models/Team.js"
import TeamInvitation from "../models/TeamInvitation.js"

const getUserIdFromRequest = (req) => {
  const raw = req.user?.id || req.user?._id || req.body.userId || req.query.userId
  if (!raw) return null
  try {
    return new mongoose.Types.ObjectId(raw)
  } catch {
    return null
  }
}

export const createTeam = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req)
    const { eventId, teamName, maxSize, role } = req.body || {}

    if (!userId) {
      return res.status(401).json({ message: "userId is required (auth)" })
    }
    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Valid eventId is required" })
    }
    if (!teamName || !String(teamName).trim()) {
      return res.status(400).json({ message: "teamName is required" })
    }
    const maxSizeNum = Number(maxSize)
    if (!Number.isFinite(maxSizeNum) || maxSizeNum < 2) {
      return res
        .status(400)
        .json({ message: "maxSize must be a number greater than or equal to 2" })
    }

    const eventObjectId = new mongoose.Types.ObjectId(eventId)

    const existingMembership = await Team.findOne({
      eventId: eventObjectId,
      "members.userId": userId,
    }).lean()
    if (existingMembership) {
      return res.status(400).json({
        message: "You are already in a team for this event",
      })
    }

    const team = await Team.create({
      eventId: eventObjectId,
      teamName: teamName.trim(),
      leaderId: userId,
      maxSize: maxSizeNum,
      members: [
        {
          userId,
          role: role || "Leader",
        },
      ],
      status: "forming",
    })

    // Reflect team membership in matchmaking profile
    await MatchmakingProfile.updateOne(
      { userId, eventId: eventObjectId },
      {
        $set: {
          hasTeam: true,
          lookingForTeam: false,
        },
      }
    )

    return res.status(201).json({ message: "Team created", team })
  } catch (error) {
    console.error("createTeam error:", error)
    if (error?.code === 11000) {
      return res.status(400).json({
        message: "Team name already exists for this event or you already lead a team",
      })
    }
    return res.status(500).json({ message: "Failed to create team" })
  }
}

export const inviteUser = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req)
    const { teamId } = req.params
    const { toUserId, role } = req.body || {}

    if (!userId) {
      return res.status(401).json({ message: "userId is required (auth)" })
    }
    if (!teamId || !mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ message: "Valid teamId is required" })
    }
    if (!toUserId || !mongoose.Types.ObjectId.isValid(toUserId)) {
      return res.status(400).json({ message: "Valid toUserId is required" })
    }

    const team = await Team.findById(teamId)
    if (!team) {
      return res.status(404).json({ message: "Team not found" })
    }

    if (String(team.leaderId) !== String(userId)) {
      return res.status(403).json({
        message: "Only the team leader can send invitations",
      })
    }

    if (team.status === "locked") {
      return res.status(400).json({ message: "This team is already locked" })
    }

    if (team.members.length >= team.maxSize) {
      return res.status(400).json({ message: "Team is already full" })
    }

    const eventId = team.eventId

    const inviteeMembership = await Team.findOne({
      eventId,
      "members.userId": toUserId,
    }).lean()
    if (inviteeMembership) {
      return res
        .status(400)
        .json({ message: "User is already in a team for this event" })
    }

    const pendingCount = await TeamInvitation.countDocuments({
      teamId,
      status: "pending",
    })
    if (pendingCount >= 5) {
      return res.status(400).json({
        message: "Maximum number of pending invitations reached for this team (5)",
      })
    }

    const activeExistingInvite = await TeamInvitation.findOne({
      eventId,
      teamId,
      toUserId,
      status: "pending",
    }).lean()
    if (activeExistingInvite) {
      return res.status(400).json({
        message: "An active invitation to this user already exists for this team",
      })
    }

    const invitation = await TeamInvitation.create({
      eventId,
      teamId,
      fromUserId: userId,
      toUserId,
      status: "pending",
      // expiresAt handled by schema default (24h)
    })

    return res.status(201).json({ message: "Invitation sent", invitation })
  } catch (error) {
    console.error("inviteUser error:", error)
    if (error?.code === 11000) {
      return res.status(400).json({
        message: "A pending invitation already exists for this user and team",
      })
    }
    return res.status(500).json({ message: "Failed to send invitation" })
  }
}

export const acceptInvite = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req)
    const { inviteId } = req.params

    if (!userId) {
      return res.status(401).json({ message: "userId is required (auth)" })
    }
    if (!inviteId || !mongoose.Types.ObjectId.isValid(inviteId)) {
      return res.status(400).json({ message: "Valid inviteId is required" })
    }

    const invitation = await TeamInvitation.findById(inviteId)
    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" })
    }

    if (String(invitation.toUserId) !== String(userId)) {
      return res.status(403).json({
        message: "You are not allowed to act on this invitation",
      })
    }

    if (invitation.status !== "pending") {
      return res.status(400).json({ message: "Invitation is not pending" })
    }

    const now = new Date()
    if (invitation.expiresAt && invitation.expiresAt < now) {
      invitation.status = "expired"
      await invitation.save()
      return res.status(400).json({ message: "Invitation has expired" })
    }

    const team = await Team.findById(invitation.teamId)
    if (!team) {
      invitation.status = "expired"
      await invitation.save()
      return res.status(404).json({ message: "Team not found" })
    }

    // Prevent joining multiple teams in the same event (even without event registration)
    const existingTeamForUser = await Team.findOne({
      eventId: invitation.eventId,
      "members.userId": userId,
    })
      .select("_id")
      .lean()
    if (existingTeamForUser && String(existingTeamForUser._id) !== String(team._id)) {
      return res.status(400).json({
        message: "You are already in a team for this event",
      })
    }

    if (team.status === "locked") {
      invitation.status = "expired"
      await invitation.save()
      return res.status(400).json({ message: "Team is already locked" })
    }

    if (team.members.length >= team.maxSize) {
      invitation.status = "expired"
      await invitation.save()
      return res.status(400).json({ message: "Team is already full" })
    }

    const existingMember = team.members.find(
      (m) => String(m.userId) === String(userId)
    )
    if (!existingMember) {
      team.members.push({
        userId,
        role: "Member",
      })
    }

    if (team.members.length >= team.maxSize) {
      team.status = "locked"
    }

    invitation.status = "accepted"
    await team.save()
    await invitation.save()

    await MatchmakingProfile.updateOne(
      { userId, eventId: invitation.eventId },
      {
        $set: {
          hasTeam: true,
          lookingForTeam: false,
        },
      }
    )

    return res.status(200).json({ message: "Invitation accepted", team })
  } catch (error) {
    console.error("acceptInvite error:", error)
    return res.status(500).json({ message: "Failed to accept invitation" })
  }
}

export const rejectInvite = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req)
    const { inviteId } = req.params

    if (!userId) {
      return res.status(401).json({ message: "userId is required (auth)" })
    }
    if (!inviteId || !mongoose.Types.ObjectId.isValid(inviteId)) {
      return res.status(400).json({ message: "Valid inviteId is required" })
    }

    const invitation = await TeamInvitation.findById(inviteId)
    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" })
    }

    if (String(invitation.toUserId) !== String(userId)) {
      return res.status(403).json({
        message: "You are not allowed to act on this invitation",
      })
    }

    if (invitation.status !== "pending") {
      return res.status(400).json({ message: "Invitation is not pending" })
    }

    invitation.status = "rejected"
    await invitation.save()

    return res.status(200).json({ message: "Invitation rejected" })
  } catch (error) {
    console.error("rejectInvite error:", error)
    return res.status(500).json({ message: "Failed to reject invitation" })
  }
}

export const getInvitationsForEvent = async (req, res) => {
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
    const now = new Date()

    // Mark expired invitations in a single sweep
    await TeamInvitation.updateMany(
      {
        eventId: eventObjectId,
        status: "pending",
        expiresAt: { $lt: now },
      },
      { $set: { status: "expired" } }
    )

    const invitations = await TeamInvitation.find({
      eventId: eventObjectId,
      toUserId: userId,
      status: { $in: ["pending", "accepted"] },
    })
      .sort({ createdAt: -1 })
      .lean()

    // Optionally enrich with team basic info
    const teamIds = [...new Set(invitations.map((i) => String(i.teamId)))]
    const teams = await Team.find({ _id: { $in: teamIds } })
      .select("_id teamName leaderId maxSize members status")
      .lean()
    const teamMap = new Map(teams.map((t) => [String(t._id), t]))

    const result = invitations.map((inv) => ({
      ...inv,
      team: teamMap.get(String(inv.teamId)) || null,
    }))

    return res.status(200).json({ invitations: result })
  } catch (error) {
    console.error("getInvitationsForEvent error:", error)
    return res.status(500).json({ message: "Failed to fetch invitations" })
  }
}

export const getMyTeamForEvent = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req)
    const { eventId } = req.params

    if (!userId) {
      return res.status(401).json({ message: "userId is required" })
    }

    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Valid eventId is required" })
    }

    const team = await Team.findOne({
      eventId,
      "members.userId": userId,
    }).lean()

    return res.status(200).json({ team })
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch team" })
  }
}
