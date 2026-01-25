import mongoose from "mongoose"
const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    savedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],

    preferences: {
      eventTypes: [
        {
          type: String,
          enum: ["hackathon", "workshop", "event"],
        },
      ],
    },

    location: {
      lat: Number,
      lon: Number,
      city: String,
      state: String,
      country: String,
    },

    skills: [String],
    preferredRoles: [String],
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
  },
  { timestamps: true }
)
export default mongoose.model("UserProfile", userProfileSchema)
