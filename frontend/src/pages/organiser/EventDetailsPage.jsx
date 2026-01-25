'use client';

import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, Users, Globe } from 'lucide-react'

export default function EventDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const mockEvent = {
    id: id,
    title: 'TechHack 2025',
    type: 'hackathon',
    mode: 'hybrid',
    description: 'Join India\'s largest hackathon for innovators and developers! Build groundbreaking solutions, network with industry leaders, and compete for amazing prizes.',
    banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=400&fit=crop',
    location: 'Mumbai, India',
    venue: 'NSCI Dome, Worli',
    startDate: 'March 15, 2025',
    endDate: 'March 17, 2025',
    time: '9:00 AM - 6:00 PM IST',
    timezone: 'Asia/Kolkata (IST)',
    participants: '156/200',
    registrationDeadline: 'March 10, 2025',
    website: 'https://techhack2025.example.com',
    lat: 19.0760,
    lon: 72.8777,
    coordinator: 'Tech Innovations Inc.',
    coordinatorEmail: 'events@techinnovations.com',
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/organiser/events')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition"
      >
        <ArrowLeft size={20} />
        Back to Events
      </button>

      {/* Banner */}
      <div className="w-full h-64 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg overflow-hidden">
        <img 
          src={mockEvent.banner || "/placeholder.svg"} 
          alt={mockEvent.title}
          className="w-full h-full object-cover"
          onError={(e) => e.target.style.display = 'none'}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Event Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Type */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white">{mockEvent.title}</h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-semibold">
                {mockEvent.type.charAt(0).toUpperCase() + mockEvent.type.slice(1)}
              </span>
              <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-sm font-semibold">
                {mockEvent.mode.charAt(0).toUpperCase() + mockEvent.mode.slice(1)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h2 className="text-white font-bold mb-3">About Event</h2>
            <p className="text-slate-300 leading-relaxed">{mockEvent.description}</p>
          </div>

          {/* Event Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date & Time */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Calendar className="text-cyan-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-slate-400 text-sm">Date & Time</p>
                  <p className="text-white font-semibold mt-1">{mockEvent.startDate} - {mockEvent.endDate}</p>
                  <p className="text-slate-400 text-sm mt-1">{mockEvent.time}</p>
                  <p className="text-slate-500 text-xs mt-2">{mockEvent.timezone}</p>
                </div>
              </div>
            </div>

            {/* Participants */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Users className="text-amber-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-slate-400 text-sm">Participants</p>
                  <p className="text-white font-semibold mt-1">{mockEvent.participants}</p>
                  <p className="text-slate-400 text-sm mt-1">Registered / Available</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 md:col-span-2">
              <div className="flex items-start gap-3">
                <MapPin className="text-red-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-slate-400 text-sm">Location</p>
                  <p className="text-white font-semibold mt-1">{mockEvent.venue}</p>
                  <p className="text-slate-400 text-sm mt-1">{mockEvent.location}</p>
                  <p className="text-slate-500 text-xs mt-2">Coordinates: {mockEvent.lat}, {mockEvent.lon}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h2 className="text-white font-bold mb-4">Event Location</h2>
            <div className="w-full h-64 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center border border-slate-600">
              <div className="text-center">
                <MapPin className="mx-auto text-slate-500 mb-2" size={32} />
                <p className="text-slate-400">Map Preview</p>
                <p className="text-slate-500 text-sm mt-1">{mockEvent.lat}, {mockEvent.lon}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-4">
          {/* Registration Deadline */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm">Registration Deadline</p>
            <p className="text-white font-bold text-lg mt-2">{mockEvent.registrationDeadline}</p>
          </div>

          {/* Coordinator Info */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-white font-bold mb-3">Organiser</h3>
            <p className="text-slate-300 font-medium">{mockEvent.coordinator}</p>
            <a href={`mailto:${mockEvent.coordinatorEmail}`} className="text-cyan-400 text-sm hover:underline mt-2 block">
              {mockEvent.coordinatorEmail}
            </a>
          </div>

          {/* Website Link */}
          {mockEvent.website && (
            <a 
              href={mockEvent.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full px-4 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition font-medium"
            >
              <Globe size={18} />
              Visit Website
            </a>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition font-medium">
              Edit Event
            </button>
            <button className="w-full px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 transition font-medium">
              Delete Event
            </button>
          </div>

          {/* Stats */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-white font-bold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Views</span>
                <span className="text-white font-semibold">1,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Registrations</span>
                <span className="text-white font-semibold">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Shares</span>
                <span className="text-white font-semibold">42</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
