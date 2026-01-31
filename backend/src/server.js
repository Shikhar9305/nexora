import app from "./app.js"
import { connectDB } from "./config/db.js"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

// CORS CONFIG
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-frontend.vercel.app"
  ],
  credentials: true
}))

// Health Route
app.get("/", (req, res) => {
  res.send("Nexora API Running 🚀")
})

const PORT = process.env.PORT || 5001

connectDB()

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
