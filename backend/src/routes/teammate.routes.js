import express from "express"
import {
  joinTeammatePool,
  leaveTeammatePool,
  getEventTeammatePool,
  matchTeammates,
  confirmTeamFormation,
} from "../controllers/teammate.controller.js"


const router = express.Router()

/**
 * @route   POST /api/teammates/join
 * @desc    Join teammate pool for an event
 * @access  Private
 * @body    { eventId, desiredRole, availability }
 */
router.post("/join",  joinTeammatePool)

/**
 * @route   POST /api/teammates/leave
 * @desc    Leave teammate pool
 * @access  Private
 * @body    { eventId }
 */
router.post("/leave",  leaveTeammatePool)

/**
 * @route   GET /api/teammates/event/:eventId
 * @desc    Get pool status and users for an event
 * @access  Private
 */
router.get("/event/:eventId", getEventTeammatePool)

/**
 * @route   POST /api/teammates/match
 * @desc    Run matching algorithm for a pool entry
 * @access  Private
 * @body    { eventId, poolEntryId }
 */
router.post("/match", matchTeammates)

/**
 * @route   POST /api/teammates/confirm-team
 * @desc    Confirm team formation with selected members
 * @access  Private
 * @body    { eventId, selectedUserIds[] }
 */
router.post("/confirm-team", confirmTeamFormation)

export default router
