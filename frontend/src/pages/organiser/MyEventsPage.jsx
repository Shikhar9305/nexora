'use client';

import { useState } from 'react'
import { Eye, Trash2, Edit2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import EventCard from '../../components/organiser/EventCard'

const mockEvents = [
  {
    id: 1,
    title: 'TechHack 2025',
    type: 'hackathon',
    mode: 'hybrid',
    location: 'Mumbai, India',
    dates: 'Mar 15-17, 2025',
    participants: '156/200',
    banner: 'bg-gradient-to-br from-cyan-500 to-blue-500',
    status: 'live'
  },
  {
    id: 2,
    title: 'React Advanced Workshop',
    type: 'workshop',
    mode: 'online',
    location: 'Virtual',
    dates: 'Mar 20-22, 2025',
    participants: '89/150',
    banner: 'bg-gradient-to-br from-purple-500 to-pink-500',
    status: 'live'
  },
  {
    id: 3,
    title: 'AI in Business Conference',
    type: 'event',
    mode: 'offline',
    location: 'Bangalore, India',
    dates: 'Apr 10-12, 2025',
    participants: '234/500',
    banner: 'bg-gradient-to-br from-amber-500 to-orange-500',
    status: 'live'
  },
  {
    id: 4,
    title: 'Cloud Deployment Bootcamp',
    type: 'workshop',
    mode: 'hybrid',
    location: 'Delhi, India',
    dates: 'Apr 25-27, 2025',
    participants: '45/100',
    banner: 'bg-gradient-to-br from-green-500 to-emerald-500',
    status: 'live'
  },
  {
    id: 5,
    title: 'DevOps Summit 2025',
    type: 'event',
    mode: 'hybrid',
    location: 'Hyderabad, India',
    dates: 'May 5-7, 2025',
    participants: '312/600',
    banner: 'bg-gradient-to-br from-red-500 to-rose-500',
    status: 'live'
  },
]

const typeColors = {
  hackathon: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  workshop: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  event: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
}

const modeColors = {
  online: 'text-blue-400',
  offline: 'text-amber-400',
  hybrid: 'text-purple-400',
}

export default function MyEventsPage() {
  const [events] = useState(mockEvents)
  const [selectedEvent, setSelectedEvent] = useState(null)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">My Events</h1>
          <p className="text-slate-400 mt-2">{events.length} events published</p>
        </div>
        <Link to="/organiser/dashboard/events/new"

          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-semibold hover:opacity-90 transition"
        >
          Create Event
        </Link>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map(event => (
          <div key={event.id} className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition group">
            {/* Banner */}
            <div className={`h-32 ${event.banner}`}></div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Title & Type */}
              <div>
                <h3 className="text-white font-bold text-lg group-hover:text-cyan-400 transition">{event.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${typeColors[event.type]}`}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                  <span className={`text-xs font-medium ${modeColors[event.mode]}`}>
                    {event.mode.charAt(0).toUpperCase() + event.mode.slice(1)}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm text-slate-300">
                <p>📍 {event.location}</p>
                <p>📅 {event.dates}</p>
                <p>👥 {event.participants} registered</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-slate-700">
                <Link 
                 to={`/organiser/dashboard/events/${event.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition font-medium text-sm"
                >
                  <Eye size={16} />
                  View
                </Link>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/20 transition font-medium text-sm">
                  <Edit2 size={16} />
                  Edit
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 transition font-medium text-sm">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
