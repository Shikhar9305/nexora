import mongoose from "mongoose"

const teammatePoolSchema = new mongoose.Schema(
  {
    // Event reference
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },

    // User reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // User profile reference (for skills, roles, experience)
    userProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
    },

    // Role desired in team
    desiredRole: {
      type: String,
      enum: ["Developer", "Designer", "Product Manager", "Data Analyst", "Founder", "Mentor", "Sponsor"],
      required: true,
    },

    // Skills user brings
    skills: [String],

    // Availability preference
    availability: {
      type: String,
      enum: ["full-time", "part-time", "weekends-only"],
      default: "full-time",
    },

    // User location
    location: {
      lat: Number,
      lon: Number,
      city: String,
      state: String,
      country: String,
    },

    // Experience level
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "intermediate",
    },

    // Pool status
    status: {
      type: String,
      enum: ["searching", "matched", "team-formed"],
      default: "searching",
      index: true,
    },

    // Matched teammates (array of userId)
    matchedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Team ID if user joined a team
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },

    // When user joined pool
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

// Compound index: One user per event in pool
teammatePoolSchema.index(
  { eventId: 1, userId: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { status: { $in: ["searching", "matched"] } },
  }
)

export default mongoose.model("TeammatePool", teammatePoolSchema)
