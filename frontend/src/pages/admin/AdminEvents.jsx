'use client';

import { useEffect, useState } from 'react'
import { Flag, MapPin, Calendar } from 'lucide-react'

export default function AdminEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/events`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch events')
      const data = await res.json()
      setEvents(data)
    } catch (err) {
      console.error('[v0] Events fetch error:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFlag = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/admin/events/${id}/flag`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to flag event')
      const updatedEvents = events.map(e => e._id === id ? { ...e, flagged: true } : e)
      setEvents(updatedEvents)
      console.log('[v0] Event flagged')
    } catch (err) {
      console.error('[v0] Flag error:', err.message)
      alert(err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-light tracking-tight text-foreground mb-2">Events Monitor</h1>
        <p className="text-foreground/60">Active events on platform ({events.length})</p>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-foreground/5">
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Event</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Organiser</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.map((event) => (
                <tr key={event._id} className="hover:bg-foreground/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground text-sm">{event.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-foreground/70 text-sm">{event.organisationName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                      event.type === 'hackathon' ? 'bg-blue-500/10 text-blue-500 border-blue-500/30' :
                      event.type === 'workshop' ? 'bg-purple-500/10 text-purple-500 border-purple-500/30' :
                      'bg-green-500/10 text-green-500 border-green-500/30'
                    }`}>
                      {event.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-foreground/70 text-sm">
                      <MapPin className="w-4 h-4" />
                      {event.location?.city}, {event.location?.state}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-foreground/70 text-sm">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.startDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleFlag(event._id)}
                      disabled={event.flagged}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        event.flagged
                          ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30 cursor-not-allowed'
                          : 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border border-orange-500/30'
                      }`}
                    >
                      <Flag className="w-4 h-4" />
                      {event.flagged ? 'Flagged' : 'Flag'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
