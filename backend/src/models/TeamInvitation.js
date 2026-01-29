import mongoose from "mongoose"

const teamInvitationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
      index: true,
    },
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "expired"],
      default: "pending",
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h from creation
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
)

// Prevent duplicate active invitations from same team to same user for the same event
teamInvitationSchema.index(
  { eventId: 1, teamId: 1, toUserId: 1, status: 1 },
  {
    partialFilterExpression: { status: "pending" },
    unique: true,
  }
)

export default mongoose.model("TeamInvitation", teamInvitationSchema)

