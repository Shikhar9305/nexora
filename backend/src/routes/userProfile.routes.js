import express from "express"
import {toggleSaveEvent,getUserDashboard} from "../controllers/userProfile.controller.js"


const router = express.Router()
router.post("/save-event/:eventId", toggleSaveEvent)
router.get("/dashboard/:userId", getUserDashboard)


export default router