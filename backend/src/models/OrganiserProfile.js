import mongoose from "mongoose"

const organiserProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    organisationName: {
      type: String,
      required: true,
      trim: true,
    },

    organisationType: {
      type: String,
      enum: ["college", "company", "community"],
      required: true,
    },

    isApproved: {
      type: Boolean,
      default: false, // ADMIN CONTROL
    },

    createdEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],

    contactEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model("OrganiserProfile", organiserProfileSchema)
