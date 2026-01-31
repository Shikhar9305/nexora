import UserEventInteraction from "../models/UserEventInteraction.js"

export const logInteraction = async (req, res) => {
  try {
    const { userId, eventId, type, metadata } = req.body

    if (!userId || !eventId || !type) {
      return res.status(400).json({ message: "Invalid interaction data" })
    }

    await UserEventInteraction.updateOne(
      { userId, eventId },
      {
        $setOnInsert: { userId, eventId },
        $set: { lastSeenAt: new Date() },
        $inc:
          type === "view"
            ? { viewCount: 1 }
            : {},
        ...(type === "impression" && { $set: { impression: true } }),
        ...(type === "click" && { $set: { click: true } }),
        ...(type === "save" && { $set: { saved: true } }),
        ...(type === "register" && { $set: { registered: true } }),
        ...(type === "view" &&
          metadata?.duration && {
            $inc: { totalViewDuration: metadata.duration },
          }),
      },
      { upsert: true }
    )

    res.sendStatus(204)
  } catch (err) {
    console.error("Interaction log failed:", err)
    res.sendStatus(500)
  }
}
