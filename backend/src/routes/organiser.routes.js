import express from "express"
import {
  submitOnboarding,
  getOrganiserStatus,
} from "../controllers/organiser.controller.js"
import organiserEventRoutes from "./organiserEvent.routes.js"

const router = express.Router()

router.post("/onboarding", submitOnboarding)
router.get("/status/:userId", getOrganiserStatus)
router.use("/events", organiserEventRoutes)

export default router
