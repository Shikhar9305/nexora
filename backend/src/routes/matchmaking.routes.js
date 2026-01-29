import express from "express"
import {
  createOrUpdateProfile,
  getCuratedPoolForUser,
  getMyProfileForEvent
} from "../controllers/matchmaking.controller.js"

const router = express.Router()

// Create or update matchmaking profile for a specific event
router.post("/profile", createOrUpdateProfile)

// Get curated pool for a user for a given event
router.get("/pool/:eventId", getCuratedPoolForUser)

router.get("/profile/:eventId", getMyProfileForEvent)


export default router

