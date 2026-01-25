
import express from "express"
import {
  getApprovedEvents,
  getEventById,
  registerForEvent,
} from "../controllers/event.controller.js"

const router = express.Router()

// PUBLIC
router.get("/", getApprovedEvents)
router.get("/:id", getEventById)

// USER
router.post("/register", registerForEvent)

export default router
