"use client"
import EventCard from "./EventCard"
import { Search, ChevronDown } from "lucide-react"

export default function EventList({
  events,
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedMode,
  onModeChange,
  selectedEvent,
  onEventSelect,
}) {
  return (
    <div className="w-96 h-full bg-card border-r border-border overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold mb-4">Discover Events</h2>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Filters */}
        <div className="space-y-2">
          {/* Type Filter */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="hackathon">Hackathons</option>
              <option value="workshop">Workshops</option>
              <option value="event">Events</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Mode Filter */}
          <div className="relative">
            <select
              value={selectedMode}
              onChange={(e) => onModeChange(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer"
            >
              <option value="all">All Modes</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="hybrid">Hybrid</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Event Cards */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-card scrollbar-thumb-muted">
        {events.length > 0 ? (
          <div className="p-3 space-y-3">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                isSelected={selectedEvent?._id=== event._id}
                onSelect={onEventSelect}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p className="text-sm">No events found</p>
          </div>
        )}
      </div>
    </div>
  )
}
