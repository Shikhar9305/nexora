import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import OrganiserProfile from "../models/OrganiserProfile.js"

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    })

    

    return res.status(201).json({
      message: "Signup successful",
      userId: user._id,
      role: user.role,
    })
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message })
  }
}


export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    const user = await User.findOne({ email }).select("+password")

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // 🔑 JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    // 🔥 ORGANISER CHECK
    let organiserApproved = null

    if (user.role === "organiser") {
      const organiserProfile = await OrganiserProfile.findOne({
        userId: user._id,
      })

      organiserApproved = organiserProfile?.isApproved || false
    }

    return res.status(200).json({
      message: "Login successful",
      userId: user._id,
      role: user.role,
      token,
      organiserApproved, // 👈 IMPORTANT
    })
  } catch (err) {
    console.error("🔥 Login error:", err)
    return res.status(500).json({
      message: "Login failed",
      error: err.message,
    })
  }
}



