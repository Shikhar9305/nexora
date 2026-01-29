




'use client';

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  MapPin,
  Calendar,
  Users,
  Globe,
  ArrowLeft,
  Clock,
  Zap,
  Share2,
  Heart,
  CheckCircle,
  UserPlus,
} from "lucide-react"


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

export default function EventDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [registrationDeadlineStatus, setRegistrationDeadlineStatus] = useState(null)


  useEffect(() => {
    // Fetch event from API
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${id}`)
        if (!response.ok) throw new Error("Event not found")
        const data = await response.json()
        setEvent(data)

        // Check if registration deadline has passed
        const deadlineDate = new Date(data.registrationDeadline)
        const now = new Date()
        setRegistrationDeadlineStatus(deadlineDate > now ? "open" : "closed")
      } catch (error) {
        console.error("[v0] Error fetching event:", error)
        setEvent(null)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Event not found</h1>
          <p className="text-muted-foreground mb-4">The event you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/explore")}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90"
          >
            Back to Explore
          </button>
        </div>
      </div>
    )
  }

  const remainingSlots = event.maxParticipants ? event.maxParticipants - event.currentParticipants : null
  const isFull = remainingSlots !== null && remainingSlots === 0
  const registrationOpen = registrationDeadlineStatus === "open" && !isFull

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRegistrationStatusBadge = () => {
    if (isFull) return { text: "Registrations Full", color: "bg-red-500" }
    if (registrationDeadlineStatus === "closed")
      return { text: "Registration Closed", color: "bg-red-500" }
    return { text: "Registration Open", color: "bg-green-500" }
  }

  const statusBadge = getRegistrationStatusBadge()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Navigation */}
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/explore")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Explore</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2 rounded-lg transition ${
                isSaved
                  ? "bg-accent/20 text-accent"
                  : "bg-input hover:bg-input/80 text-muted-foreground"
              }`}
              title="Save event"
            >
              <Heart className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} />
            </button>
            <button
              className="p-2 rounded-lg bg-input hover:bg-input/80 text-muted-foreground transition"
              title="Share event"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Banner Image */}
      <div className="relative w-full h-96 bg-gradient-to-b from-accent/20 to-background overflow-hidden">
        {event.bannerImage && (
          <img
            src={event.bannerImage || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2">
            {/* Title Section */}
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-3">{event.title}</h1>
                  <p className="text-muted-foreground text-lg">{event.organisationName}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${typeColors[event.type]} text-center`}
                  >
                    {event.type.toUpperCase()}
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${modeColors[event.mode]} text-center`}
                  >
                    {event.mode.charAt(0).toUpperCase() + event.mode.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold mb-3">About this event</h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                {event.description}
              </p>
            </div>

            {/* Key Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Date */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  <span className="text-sm text-muted-foreground">Start Date</span>
                </div>
                <p className="font-semibold">{formatDate(event.startDate)}</p>
              </div>

              {/* End Date */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  <span className="text-sm text-muted-foreground">End Date</span>
                </div>
                <p className="font-semibold">{formatDate(event.endDate)}</p>
              </div>

              {/* Location */}
              <div className="bg-card border border-border rounded-lg p-4 col-span-2">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span className="text-sm text-muted-foreground">Location</span>
                </div>
                <p className="font-semibold">
                  {event.location.venue}, {event.location.city}, {event.location.state},
                  {event.location.country}
                </p>
                {event.location.lat && event.location.lon && (
                  <p className="text-xs text-muted-foreground mt-1">
                    📍 {event.location.lat.toFixed(2)}, {event.location.lon.toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            {/* Participation Details */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Participation Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-input rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Participants</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {event.currentParticipants}
                    <span className="text-base text-muted-foreground ml-2">
                      / {event.maxParticipants || "∞"}
                    </span>
                  </p>
                </div>
                <div className="p-4 bg-input rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm">Available Slots</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {remainingSlots !== null
                      ? Math.max(0, remainingSlots)
                      : "Unlimited"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Registration Card */}
          <div className="lg:col-span-1">
            {/* Registration Status Card */}
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24 space-y-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${statusBadge.color}`} />
                <span className="text-sm font-semibold">{statusBadge.text}</span>
              </div>

              {/* Registration Deadline */}
              <div className="bg-input rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs">Registration Deadline</span>
                </div>
                <p className="font-semibold text-sm">
                  {formatDate(event.registrationDeadline)}
                </p>
              </div>

              {/* Capacity Info */}
              {event.maxParticipants && (
                <div className="bg-input rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-2">Capacity</p>
                  <div className="w-full bg-background rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        remainingSlots === 0
                          ? "bg-red-500"
                          : remainingSlots < event.maxParticipants * 0.2
                            ? "bg-orange-500"
                            : "bg-green-500"
                      }`}
                      style={{
                        width: `${(event.currentParticipants / event.maxParticipants) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {remainingSlots === 0
                      ? "Event is full"
                      : `${remainingSlots} slots remaining`}
                  </p>
                </div>
              )}

              {/* Find Teammates (Hackathons only) */}
              {event.type === "hackathon" && registrationOpen && (
                <button
                  onClick={() => navigate(`/event/${event._id || id}/teammates`)}
                  className="w-full py-2 border border-accent text-accent rounded-lg font-semibold hover:bg-accent/10 transition flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Find Teammates
                </button>
              )}

              {/* Registration Button */}
              {registrationOpen ? (
                <button
                  onClick={() => navigate(`/event/${event._id || id}/register`)}
                  className="w-full py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Register Now
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-3 bg-input text-muted-foreground rounded-lg font-semibold cursor-not-allowed opacity-50"
                >
                  Registration Closed
                </button>
              )}

              {/* Website Link */}
              {event.website && (
                <a
                  href={event.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 border border-border rounded-lg text-center text-sm font-semibold hover:bg-input transition flex items-center justify-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Visit Website
                </a>
              )}

              {/* Meta Info */}
              <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t border-border">
                <p>Event ID: {event._id || id}</p>
                <p>Created: {new Date(event.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    
    </div>
  )
}

