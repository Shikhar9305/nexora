'use client';

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { MapPin, Trash2, Map } from "lucide-react"

const typeColors = {
  hackathon: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  workshop: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  event: "bg-green-500/10 text-green-400 border-green-500/20"
}

export default function SavedEventsTab({ events }) {
  const navigate = useNavigate()
  const [localEvents, setLocalEvents] = useState(events)

 const handleRemove = (id) => {
  setLocalEvents(localEvents.filter((event) => event._id !== id))
}


  const handleViewOnMap = (eventId) => {
    navigate(`/explore?focusEvent=${eventId}`)
  }

  if (localEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-muted-foreground text-center">
          <p className="text-lg font-medium mb-2">No saved events yet</p>
          <p className="text-sm">Start exploring and save events to view them here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {localEvents.map((event) => (
        <div
          key={event._id}
          className="border border-border rounded-lg p-4 hover:shadow-lg transition-shadow bg-muted/20"
        >
          <div className="flex items-start justify-between mb-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${typeColors[event.type]}`}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </span>
          </div>

          <h3 className="font-bold text-foreground mb-2 line-clamp-2">{event.title}</h3>

          <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{event.description}</p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <MapPin size={14} />
            <span>
              {event.location.city}, {event.location.country}
            </span>
          </div>

          <div className="text-xs text-muted-foreground mb-4">
            {new Date(event.startDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleViewOnMap(event._id)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-accent hover:bg-accent/80 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <Map size={14} />
              View on Map
            </button>
            <button
              onClick={() => handleRemove(event._id)}
              className="px-3 py-2 bg-muted hover:bg-destructive/10 text-muted-foreground hover:text-destructive text-xs font-medium rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
