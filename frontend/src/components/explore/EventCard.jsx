"use client"
import { MapPin, Calendar, Users } from "lucide-react"
import { useEffect } from "react"

/* ================= TRACK HELPER ================= */
const track = (type, eventId) => {
  const userId = localStorage.getItem("userId")
  if (!userId) return

  fetch("/api/interactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, eventId, type }),
  })
}

const typeColors = {
  hackathon: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  workshop: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  event: "bg-green-500/20 text-green-400 border-green-500/30",
}

const modeColors = {
  online: "bg-blue-500/20 text-blue-400",
  offline: "bg-purple-500/20 text-purple-400",
  hybrid: "bg-pink-500/20 text-pink-400",
}

export default function EventCard({ event, isSelected, onSelect }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  /* ================= IMPRESSION TRACK ================= */
  useEffect(() => {
    track("impression", event._id)
  }, [])

  return (
    <button
      onClick={() => {
        track("click", event._id)
        onSelect(event)
      }}
      className={`w-full text-left p-3 rounded-lg border transition-all ${
        isSelected
          ? "bg-primary/10 border-accent shadow-lg shadow-accent/20"
          : "bg-input/50 border-border hover:border-accent/50 hover:bg-input"
      }`}
    >
      {/* Title and Type */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-sm text-foreground truncate flex-1">
          {event.title}
        </h3>
        <span
          className={`px-2 py-1 rounded text-xs font-medium border whitespace-nowrap ${typeColors[event.type]}`}
        >
          {event.type}
        </span>
      </div>

      {/* Mode Badge */}
      <div className="mb-2">
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${modeColors[event.mode]}`}
        >
          {event.mode.charAt(0).toUpperCase() + event.mode.slice(1)}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3" />
          <span>
            {formatDate(event.startDate)} - {formatDate(event.endDate)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-3 h-3" />
          <span>
            {event.location.city}, {event.location.country}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-3 h-3" />
          <span>
            {event.currentParticipants} /{" "}
            {event.maxParticipants || "∞"} participants
          </span>
        </div>
      </div>

      {/* CTA (VISUALLY SAME, NOT A BUTTON) */}
      <a
        href={`/event/${event._id || event.id}`}
        className="block"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full mt-3 py-1.5 bg-accent text-accent-foreground rounded text-xs font-semibold hover:opacity-90 transition text-center">
          View Details
        </div>
      </a>
    </button>
  )
}
