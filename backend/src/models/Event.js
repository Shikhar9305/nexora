import mongoose from "mongoose"

const eventSchema = new mongoose.Schema(
  {
    // BASIC INFO
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["hackathon", "workshop", "event"],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    // ORGANISER
    organiserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    organisationName: {
      type: String,
      required: true,
      trim: true,
    },

    // LOCATION (CRITICAL FOR CESIUM)
    location: {
      venue: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      lat: {
        type: Number,
        required: true,
      },
      lon: {
        type: Number,
        required: true,
      },
    },

    // DATE & TIME
    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    // PARTICIPATION DETAILS
    mode: {
      type: String,
      enum: ["online", "offline", "hybrid"],
      required: true,
    },

    registrationDeadline: {
      type: Date,
      required: true,
    },

    maxParticipants: {
      type: Number,
      default: null, // null means unlimited
    },

    // LIVE PARTICIPATION COUNT
    currentParticipants: {
      type: Number,
      default: 0,
      min: 0,
    },

    // MEDIA
    bannerImage: {
      type: String,
    },

    website: {
      type: String,
    },

supportsTeams: {
  type: Boolean,
  default: false
},

maxTeamSize: {
  type: Number,
  min: 2,
  max: 6,
  required: function () {
    return this.supportsTeams === true
  }
}
,
    // STATUS & MODERATION
    status: {
      type: String,
      enum: ["approved", "rejected"],
      default: "approved",
    },

    rejectionReason: {
      type: String,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
)

export default mongoose.model("Event", eventSchema)
