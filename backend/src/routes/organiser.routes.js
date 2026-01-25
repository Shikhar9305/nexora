import express from "express"
import {
  submitOnboarding,
  getOrganiserStatus,
} from "../controllers/organiser.controller.js"

const router = express.Router()

router.post("/onboarding", submitOnboarding)
router.get("/status/:userId", getOrganiserStatus)

export default router
