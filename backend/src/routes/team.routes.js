// import express from "express"
// import {
//   createTeam,
//   inviteUser,
//   acceptInvite,
//   rejectInvite,
//   getInvitationsForEvent,
//   getMyTeamForEvent,
// } from "../controllers/team.controller.js"

// const router = express.Router()

// // Team creation
// router.post("/teams", createTeam)

// // Send invitation from a team to a user
// router.post("/teams/:teamId/invite", inviteUser)

// // Accept / reject invitation
// router.post("/invitations/:inviteId/accept", acceptInvite)
// router.post("/invitations/:inviteId/reject", rejectInvite)

// // List invitations for current user for a given event
// router.get("/invitations/event/:eventId", getInvitationsForEvent)

// // Get the team the current user belongs to for a given event
// router.get("/my/:eventId", getMyTeamForEvent)

// export default router

import express from "express"
import {
  createTeam,
  inviteUser,
  acceptInvite,
  rejectInvite,
  getInvitationsForEvent,
  getMyTeamForEvent,
} from "../controllers/team.controller.js"

const router = express.Router()

// Team creation
router.post("/teams", createTeam)

// Send invitation from a team to a user
router.post("/teams/:teamId/invite", inviteUser)

// Accept / reject invitation
router.post("/teams/invitations/:inviteId/accept", acceptInvite)
router.post("/teams/invitations/:inviteId/reject", rejectInvite)

// List invitations for current user for a given event
router.get("/teams/invitations/event/:eventId", getInvitationsForEvent)

// Get the team the current user belongs to for a given event
router.get("/teams/my/:eventId", getMyTeamForEvent)

export default router
