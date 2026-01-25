'use client';

import { useNavigate } from "react-router-dom"
import { Lightbulb, MapPin, ArrowUp as Arrow } from "lucide-react"

const typeColors = {
  hackathon: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  workshop: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  event: "bg-green-500/10 text-green-400 border-green-500/20"
}

export default function RecommendationsTab({ events }) {
  const navigate = useNavigate()

  const handleViewEvent = (eventId) => {
    navigate(`/explore?focusEvent=${eventId}`)
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-muted-foreground text-center">
          <p className="text-lg font-medium mb-2">No recommendations available</p>
          <p className="text-sm">Explore more events to get personalized recommendations</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="border border-border rounded-lg p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-muted/20 to-muted/5 relative overflow-hidden"
        >
          {/* Recommendation Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full border border-accent/20">
            <Lightbulb size={12} />
            Recommended
          </div>

          <div className="flex items-start justify-between mb-3 pr-24">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${typeColors[event.type]}`}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </span>
          </div>

          <h3 className="font-bold text-foreground mb-2 line-clamp-2">{event.title}</h3>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <MapPin size={14} />
            <span>
              {event.city}, {event.country}
            </span>
          </div>

          <div className="text-xs text-muted-foreground mb-4">
            {new Date(event.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}
          </div>

          {/* Why Recommended */}
          <div className="bg-muted/30 border border-border/50 rounded px-3 py-2 mb-4">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <Lightbulb size={12} className="text-accent" />
              {event.reason}
            </p>
          </div>

          <button
            onClick={() => handleViewEvent(event.id)}
            className="w-full px-4 py-2 bg-accent hover:bg-accent/80 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            View Event
          </button>
        </div>
      ))}
    </div>
  )
}
