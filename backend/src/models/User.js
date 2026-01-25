import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true, // hashed
      select: false,  // 🔐 never return by default
    },

    role: {
      type: String,
      enum: ["user", "organiser", "admin"],
      required: true,
      index: true,
    },

    // account state
    isVerified: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
)

export default mongoose.model("User", userSchema)
