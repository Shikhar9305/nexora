import express from "express"
import { createEvent } from "../controllers/organiserEvent.controller.js"

const router = express.Router()

// Organiser: create/publish event
router.post("/", createEvent)

export default router

