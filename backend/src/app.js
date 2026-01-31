import express from "express"
import cors from "cors"

import authRoutes from "./routes/auth.routes.js"
import organiserRoutes from "./routes/organiser.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import userRoutes from "./routes/user.routes.js"
import eventRoutes from "./routes/event.routes.js"
import userProfileRoutes from "./routes/userProfile.routes.js"
import interactionRoutes from "./routes/interactions.js"
import organiserEventRoutes from "./routes/organiserEvent.routes.js"
import matchmakingRoutes from "./routes/matchmaking.routes.js"
import teamRoutes from "./routes/team.routes.js"
import recommendationRoutes from "./routes/recommendation.routes.js"


const app = express()

/* -------------------- CORS (FIXED & SAFE) -------------------- */
app.use(
  cors({
    origin: true, // ✅ reflect request origin
    credentials: true,
  })
)

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json())

/* -------------------- ROUTES -------------------- */
app.use("/api/auth", authRoutes)
app.use("/api/organiser", organiserRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/user", userRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/user-profile", userProfileRoutes)
app.use("/api/organiser-events", organiserEventRoutes)
app.use("/api/matchmaking", matchmakingRoutes)
app.use("/api", teamRoutes)

app.use("/api/interactions", interactionRoutes)
app.use("/api/recommendations", recommendationRoutes)




/* -------------------- HEALTH -------------------- */
app.get("/health", (req, res) => {
  res.send("OK")
})

export default app
