import mongoose from "mongoose"

const teamMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      default: "",
      trim: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
)

const teamSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    teamName: {
      type: String,
      required: true,
      trim: true,
    },
    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    members: {
      type: [teamMemberSchema],
      default: [],
    },

    maxSize: {
      type: Number,
      required: true,
      min: 2,
    },

    status: {
      type: String,
      enum: ["forming", "locked"],
      default: "forming",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
)

// Team name unique within an event
teamSchema.index({ eventId: 1, teamName: 1 }, { unique: true })

// Prevent a user from leading multiple teams in the same event
teamSchema.index({ eventId: 1, leaderId: 1 }, { unique: true })

export default mongoose.model("Team", teamSchema)

