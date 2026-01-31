import mongoose from "mongoose"

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, index: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, index: true },

  impression: Boolean,
  click: Boolean,
  saved: Boolean,
  registered: Boolean,

  viewCount: { type: Number, default: 0 },
  totalViewDuration: { type: Number, default: 0 }, // seconds

  lastSeenAt: Date,
}, { timestamps: true })

schema.index({ userId: 1, eventId: 1 }, { unique: true })

export default mongoose.model("UserEventInteraction", schema)
