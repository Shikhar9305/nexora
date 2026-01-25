import mongoose from "mongoose"

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  { _id: false }
)

const eventRegistrationSchema = new mongoose.Schema(
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

    teamSize: {
      type: Number,
      required: true,
      min: 1,
    },

    members: {
      type: [teamMemberSchema],
      validate: {
        validator: function (members) {
          return members.length === this.teamSize
        },
        message: "Members count must match team size",
      },
    },

    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// 🔒 Prevent same user from registering twice for the same event
eventRegistrationSchema.index(
  { eventId: 1, registeredBy: 1 },
  { unique: true }
)

export default mongoose.model(
  "EventRegistration",
  eventRegistrationSchema
)
