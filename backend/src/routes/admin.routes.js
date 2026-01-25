import express from "express"
import {
  getAdminStats,
  approveOrganiser,
   getAllUsers,
  getPendingOrganisers,
  getAllEventsAdmin

} from "../controllers/admin.controller.js"
const router = express.Router()

router.get("/stats", getAdminStats)

router.patch("/organiser/approve/:id", approveOrganiser)


router.get("/users", getAllUsers)
router.get("/organisers/pending", getPendingOrganisers)
router.get("/events", getAllEventsAdmin)
export default router





