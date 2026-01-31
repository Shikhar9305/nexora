import { Users, Calendar, CheckCircle, Clock, Sparkles } from "lucide-react"


const typeColors = {
  hackathon: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  workshop: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  event: "bg-green-500/10 text-green-400 border-green-500/20"
}

const statusConfig = {
  upcoming: { label: "Upcoming", icon: Clock, color: "text-blue-400" },
  ongoing: { label: "Ongoing", icon: Sparkles, color: "text-accent" },
  completed: { label: "Completed", icon: CheckCircle, color: "text-green-400" },
}


const getEventStatus = (event) => {
  const now = new Date()
  if (new Date(event.startDate) > now) return "upcoming"
  if (new Date(event.endDate) < now) return "completed"
  return "ongoing"
}


export default function RegisteredEventsTab({ events }) {
  // Group events by status
  const now = new Date()

const upcomingEvents = events.filter(
  (e) => new Date(e.endDate) >= now
)

const completedEvents = events.filter(
  (e) => new Date(e.endDate) < now


)


  const EventSection = ({ title, sectionEvents }) => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      {sectionEvents.length === 0 ? (
        <p className="text-muted-foreground text-sm">No {title.toLowerCase()} events</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* {sectionEvents.map((event) => {
            const StatusIcon = statusConfig[event.status].icon
            return (
              <div
                key={event._id}
                className="border border-border rounded-lg p-4 hover:shadow-lg transition-shadow bg-muted/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${typeColors[event.type]}`}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                  <div className={`flex items-center gap-1 text-xs font-medium ${statusConfig[event.status].color}`}>
                    <StatusIcon size={14} />
                    {statusConfig[event.status].label}
                  </div>
                </div>

                <h3 className="font-bold text-foreground mb-2 line-clamp-2">{event.title}</h3>

                <div className="space-y-2 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    <span>{event.participantCount} participants</span>
                  </div>
                </div>

                <button className="w-full px-4 py-2 bg-accent hover:bg-accent/80 text-white text-xs font-medium rounded-lg transition-colors">
                  {event.status === "upcoming" ? "View Details" : "View Certificate"}
                </button>
              </div>
            )
          })} */}
          {/* {sectionEvents.map((event) => (
  <div
    key={event._id}   // ✅ FIXED KEY
    className="border border-border rounded-lg p-4 hover:shadow-lg transition-shadow bg-muted/20"
  >
    <div className="flex items-start justify-between mb-3">
      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${typeColors[event.type]}`}>
        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
      </span>

      <div className="text-xs font-medium text-muted-foreground">
        {new Date(event.startDate).toLocaleDateString()}
      </div>
    </div>

    <h3 className="font-bold text-foreground mb-2 line-clamp-2">
      {event.title}
    </h3>

    <div className="space-y-2 text-xs text-muted-foreground mb-4">
      <div className="flex items-center gap-2">
        <Users size={14} />
        <span>
          {event.currentParticipants} / {event.maxParticipants || "∞"}
        </span>
      </div>
    </div>

    <a
      href={`/event/${event._id}`}
      className="block text-center px-4 py-2 bg-accent hover:bg-accent/80 text-white text-xs font-medium rounded-lg transition-colors"
    >
      View Details
    </a>
  </div>
))} */}

{sectionEvents.map((event) => {
  const status = getEventStatus(event)
  const StatusIcon = statusConfig[status].icon

  return (
    <div
      key={event._id}
      className="border border-border rounded-lg p-4 hover:shadow-lg transition-shadow bg-muted/20"
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${typeColors[event.type]}`}>
          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
        </span>

        <div className={`flex items-center gap-1 text-xs font-medium ${statusConfig[status].color}`}>
          <StatusIcon size={14} />
          {statusConfig[status].label}
        </div>
      </div>

      <h3 className="font-bold text-foreground mb-2 line-clamp-2">
        {event.title}
      </h3>

      <div className="space-y-2 text-xs text-muted-foreground mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <span>
            {new Date(event.startDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Users size={14} />
          <span>
            {event.currentParticipants} / {event.maxParticipants || "∞"}
          </span>
        </div>
      </div>

      <a
        href={`/event/${event._id}`}
        className="block w-full text-center px-4 py-2 bg-accent hover:bg-accent/80 text-white text-xs font-medium rounded-lg transition-colors"
      >
        {status === "completed" ? "View Certificate" : "View Details"}
      </a>
    </div>
  )
})}


        </div>
      )}
    </div>
  )

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-muted-foreground text-center">
          <p className="text-lg font-medium mb-2">No registered events yet</p>
          <p className="text-sm">Explore events and register to see them here</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <EventSection title="Upcoming Events" sectionEvents={upcomingEvents} />
      <EventSection title="Past Events" sectionEvents={completedEvents} />
    </div>
  )
}
