import express from "express"
import { submitUserOnboarding } from "../controllers/user.controller.js"


const router = express.Router()

router.post("/onboarding", submitUserOnboarding)

export default router
