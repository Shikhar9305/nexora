import mongoose from "mongoose"

const matchmakingProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },

    skills: {
      type: [String],
      default: [],
    },
    desiredRoles: {
      type: [String],
      default: [],
    },
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },

    lookingForTeam: {
      type: Boolean,
      default: true,
    },
    hasTeam: {
      type: Boolean,
      default: false,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    exposureCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastShownAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

// One profile per user per event
matchmakingProfileSchema.index({ userId: 1, eventId: 1 }, { unique: true })

export default mongoose.model("MatchmakingProfile", matchmakingProfileSchema)

