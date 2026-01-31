"use client"
import ExploreNavbar from "../components/explore/ExploreNavbar"
import CesiumMap from "../components/explore/CesiumMap"
import EventList from "../components/explore/EventList"
import { useState, useEffect } from "react"

export default function ExplorePage() {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedMode, setSelectedMode] = useState("all")
  const [selectedEvent, setSelectedEvent] = useState(null)




useEffect(() => {
  const fetchEvents = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events`)
      const data = await res.json()
      setEvents(data)
      setFilteredEvents(data)
    } catch (err) {
      console.error("Failed to load events", err)
    }
  }

  fetchEvents()
}, [])


  // Filter logic
  useEffect(() => {
    let filtered = events

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((event) => event.type === selectedType)
    }

    if (selectedMode !== "all") {
      filtered = filtered.filter((event) => event.mode === selectedMode)
    }

    setFilteredEvents(filtered)
  }, [searchTerm, selectedType, selectedMode, events])

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <ExploreNavbar />
      <div className="pt-16 w-full flex">
        <EventList
          events={filteredEvents}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedMode={selectedMode}
          onModeChange={setSelectedMode}
          selectedEvent={selectedEvent}
          onEventSelect={setSelectedEvent}
        />
        <CesiumMap events={filteredEvents} selectedEvent={selectedEvent} onEventSelect={setSelectedEvent} />
      </div>
    </div>
  )
}
