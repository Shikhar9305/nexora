'use client';

import { useEffect, useMemo, useState } from 'react'
import { ChevronRight, ChevronLeft, Crosshair, MapPin, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const steps = ['Basic Info', 'Location', 'Schedule & Mode', 'Participation & Links']

// Fix leaflet marker icons in Vite/React
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function MapPickerModal({ isOpen, onClose, initialLat, initialLon, onPick }) {
  const initialCenter = useMemo(() => {
    const lat = Number.isFinite(Number(initialLat)) ? Number(initialLat) : 20.5937
    const lon = Number.isFinite(Number(initialLon)) ? Number(initialLon) : 78.9629
    return [lat, lon]
  }, [initialLat, initialLon])

  const [markerPos, setMarkerPos] = useState(initialCenter)
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState(null)

  useEffect(() => {
    if (!isOpen) return
    setMarkerPos(initialCenter)
    setSearchQuery('')
    setSearchError(null)
  }, [isOpen, initialCenter])

  const PickerEvents = () => {
    useMapEvents({
      click(e) {
        setMarkerPos([e.latlng.lat, e.latlng.lng])
      },
    })
    return null
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    setSearchError(null)
    try {
      const url = new URL('https://nominatim.openstreetmap.org/search')
      url.searchParams.set('q', searchQuery.trim())
      url.searchParams.set('format', 'json')
      url.searchParams.set('limit', '1')

      const res = await fetch(url.toString(), {
        headers: { 'Accept-Language': 'en' },
      })
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      if (!Array.isArray(data) || data.length === 0) {
        setSearchError('No results found. Try a more specific query.')
        return
      }
      const hit = data[0]
      setMarkerPos([Number(hit.lat), Number(hit.lon)])
    } catch (e) {
      setSearchError(e?.message || 'Failed to search location')
    } finally {
      setSearching(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <div>
            <h3 className="text-white font-semibold">Locate on map</h3>
            <p className="text-slate-400 text-sm">Click the map or drag the marker to set latitude & longitude.</p>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:border-slate-500 transition"
          >
            Close
          </button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-center">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch()
                }}
                placeholder="Search place (e.g., IIT Delhi, Mumbai, India)"
                className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={searching}
              className="px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition font-medium disabled:opacity-50"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {searchError && (
            <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              {searchError}
            </div>
          )}

          <div className="rounded-xl overflow-hidden border border-slate-700">
            <MapContainer
              center={markerPos}
              zoom={13}
              style={{ height: 420, width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <PickerEvents />
              <Marker
                position={markerPos}
                draggable={true}
                eventHandlers={{
                  dragend: (e) => {
                    const ll = e.target.getLatLng()
                    setMarkerPos([ll.lat, ll.lng])
                  },
                }}
              />
            </MapContainer>
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="text-sm text-slate-300">
              <span className="text-slate-400">Selected:</span>{' '}
              <span className="font-mono">
                {Number(markerPos[0]).toFixed(6)}, {Number(markerPos[1]).toFixed(6)}
              </span>
            </div>
            <button
              onClick={() => onPick({ lat: markerPos[0], lon: markerPos[1] })}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90 transition font-semibold"
            >
              Use these coordinates
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CreateEventPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    title: '',
    type: 'hackathon',
    description: '',
    organisationName: '',
    venue: '',
    city: '',
    state: '',
    country: 'India',
    lat: '',
    lon: '',
    startDate: '',
    endDate: '',
    mode: 'hybrid',
    timezone: 'Asia/Kolkata',
    registrationDeadline: '',
    maxParticipants: '',
    bannerImage: '',
    website: '',
    supportsTeams: false,
    maxTeamSize: '',
  })
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState(null)
  const [mapOpen, setMapOpen] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1)
  }

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const toNumberOrNull = (value) => (value === '' ? null : Number(value))

  const buildAddressQuery = () => {
    const parts = [formData.venue, formData.city, formData.state, formData.country]
      .map(v => (v || '').trim())
      .filter(Boolean)
    return parts.join(', ')
  }

  const reverseGeocode = async (lat, lon) => {
    const url = new URL('https://nominatim.openstreetmap.org/reverse')
    url.searchParams.set('format', 'json')
    url.searchParams.set('lat', String(lat))
    url.searchParams.set('lon', String(lon))
    url.searchParams.set('zoom', '16')
    url.searchParams.set('addressdetails', '1')

    const res = await fetch(url.toString(), { headers: { 'Accept-Language': 'en' } })
    if (!res.ok) throw new Error('Reverse geocoding failed')
    const data = await res.json()
    const a = data?.address || {}

    const city = a.city || a.town || a.village || a.hamlet || ''
    const state = a.state || a.region || ''
    const country = a.country || formData.country || ''
    const venue = a.road || a.neighbourhood || a.suburb || a.county || formData.venue || ''

    setFormData(prev => ({
      ...prev,
      venue: prev.venue || venue,
      city: prev.city || city,
      state: prev.state || state,
      country: prev.country || country,
      lat: String(lat),
      lon: String(lon),
    }))
  }

  const geocodeAddress = async () => {
    const q = buildAddressQuery()
    if (!q) return
    setGeoLoading(true)
    setGeoError(null)
    try {
      const url = new URL('https://nominatim.openstreetmap.org/search')
      url.searchParams.set('q', q)
      url.searchParams.set('format', 'json')
      url.searchParams.set('limit', '1')
      url.searchParams.set('addressdetails', '1')

      const res = await fetch(url.toString(), { headers: { 'Accept-Language': 'en' } })
      if (!res.ok) throw new Error('Geocoding failed')
      const data = await res.json()
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Could not find that address. Try adding city/state/country.')
      }
      const hit = data[0]
      const lat = Number(hit.lat)
      const lon = Number(hit.lon)
      setFormData(prev => ({
        ...prev,
        lat: String(lat),
        lon: String(lon),
      }))
    } catch (e) {
      setGeoError(e?.message || 'Failed to convert address to coordinates')
    } finally {
      setGeoLoading(false)
    }
  }

  const useMyLocation = async () => {
    setGeoLoading(true)
    setGeoError(null)
    try {
      if (!navigator.geolocation) throw new Error('Geolocation is not supported in this browser')

      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        })
      })

      const lat = pos.coords.latitude
      const lon = pos.coords.longitude
      setFormData(prev => ({ ...prev, lat: String(lat), lon: String(lon) }))
      await reverseGeocode(lat, lon)
    } catch (e) {
      setGeoError(e?.message || 'Failed to detect location')
    } finally {
      setGeoLoading(false)
    }
  }

  const handleAddressBlur = async () => {
    // Convert manual address -> lat/lon automatically (best effort)
    if (geoLoading) return
    const q = buildAddressQuery()
    if (!q) return
    await geocodeAddress()
  }

  const handleSubmit = () => {
    const organiserId = localStorage.getItem('userId') || null

    const payload = {
      title: formData.title,
      type: formData.type,
      description: formData.description,
      organiserId,
      organisationName: formData.organisationName,
      location: {
        venue: formData.venue,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        lat: toNumberOrNull(formData.lat),
        lon: toNumberOrNull(formData.lon),
      },
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      timezone: formData.timezone,
      mode: formData.mode,
      registrationDeadline: formData.registrationDeadline
        ? new Date(formData.registrationDeadline).toISOString()
        : null,
      maxParticipants: toNumberOrNull(formData.maxParticipants),
      bannerImage: formData.bannerImage || null,
      website: formData.website || null,
      supportsTeams: formData.supportsTeams,
      maxTeamSize: formData.supportsTeams ? toNumberOrNull(formData.maxTeamSize) : null,
    }

    console.log('[v0] Event payload ready for API:', payload)
    // TODO: POST to backend create-event endpoint when available
    navigate('/organiser/events')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Create New Event</h1>
        <p className="text-slate-400 mt-2">Fill in the details to publish your event</p>
      </div>

      {/* Progress Indicator */}
      <div>
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                index <= currentStep 
                  ? 'bg-cyan-500 text-white' 
                  : 'bg-slate-700 text-slate-400'
              }`}>
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded transition ${
                  index < currentStep ? 'bg-cyan-500' : 'bg-slate-700'
                }`}></div>
              )}
            </div>
          ))}
        </div>
        <p className="text-slate-400 text-sm text-center">Step {currentStep + 1} of {steps.length}: {steps[currentStep]}</p>
      </div>

      {/* Form */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 sm:p-8 space-y-8">
        {/* Step 1: Basic Info */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Event Title</label>
              <input 
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., TechHack 2025"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Event Type</label>
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition"
                >
                  <option value="hackathon">Hackathon</option>
                  <option value="workshop">Workshop</option>
                  <option value="event">Event</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Organisation / Host</label>
                <input 
                  type="text"
                  name="organisationName"
                  value={formData.organisationName}
                  onChange={handleInputChange}
                  placeholder="e.g., Nexora Labs"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your event..."
                rows="4"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition resize-none"
              ></textarea>
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-200">Set location quickly</p>
                <p className="text-xs text-slate-400">
                  Use your current location, type an address, or pick on the map for exact coordinates.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={useMyLocation}
                  disabled={geoLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white hover:border-slate-500 transition disabled:opacity-50"
                >
                  <Crosshair size={18} />
                  {geoLoading ? 'Detecting...' : 'Use my location'}
                </button>
                <button
                  type="button"
                  onClick={() => setMapOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white hover:border-slate-500 transition"
                >
                  <MapPin size={18} />
                  Locate on map
                </button>
                <button
                  type="button"
                  onClick={geocodeAddress}
                  disabled={geoLoading || !buildAddressQuery()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition disabled:opacity-50"
                >
                  <Search size={18} />
                  Convert to lat/lon
                </button>
              </div>
            </div>

            {geoError && (
              <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                {geoError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Venue Name</label>
              <input 
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                onBlur={handleAddressBlur}
                placeholder="e.g., Convention Center"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">City</label>
                <input 
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  onBlur={handleAddressBlur}
                  placeholder="e.g., Mumbai"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">State</label>
                <input 
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  onBlur={handleAddressBlur}
                  placeholder="e.g., Maharashtra"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Country</label>
                <input 
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  onBlur={handleAddressBlur}
                  placeholder="e.g., India"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Latitude</label>
                  <input 
                    type="number"
                    name="lat"
                    value={formData.lat}
                    onChange={handleInputChange}
                    placeholder="e.g., 19.0760"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Longitude</label>
                  <input 
                    type="number"
                    name="lon"
                    value={formData.lon}
                    onChange={handleInputChange}
                    placeholder="e.g., 72.8777"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              Tip: If you edit the address fields, we&apos;ll try to auto-convert them to coordinates when you leave the input.
            </div>

            <MapPickerModal
              isOpen={mapOpen}
              onClose={() => setMapOpen(false)}
              initialLat={formData.lat}
              initialLon={formData.lon}
              onPick={async ({ lat, lon }) => {
                setFormData(prev => ({ ...prev, lat: String(lat), lon: String(lon) }))
                setMapOpen(false)
                try {
                  await reverseGeocode(lat, lon)
                } catch {
                  // silent: lat/lon still saved
                }
              }}
            />
          </div>
        )}

        {/* Step 3: Schedule & Mode */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
                <input 
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">End Date</label>
                <input 
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Mode</label>
                <select 
                  name="mode"
                  value={formData.mode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition"
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Timezone</label>
                <select 
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Registration Deadline</label>
              <input 
                type="datetime-local"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
          </div>
        )}

        {/* Step 4: Participation & Links */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Max Participants (leave blank for unlimited)</label>
                <input 
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  placeholder="e.g., 500"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="supportsTeams"
                  type="checkbox"
                  checked={formData.supportsTeams}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      supportsTeams: e.target.checked,
                      maxTeamSize: e.target.checked ? prev.maxTeamSize : '',
                    }))
                  }
                  className="w-5 h-5 accent-cyan-500 bg-slate-700 border border-slate-600 rounded"
                />
                <label htmlFor="supportsTeams" className="text-sm text-slate-200">
                  Allow team registrations
                </label>
              </div>
            </div>

            {formData.supportsTeams && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Max Team Size (2-6)</label>
                  <input 
                    type="number"
                    name="maxTeamSize"
                    value={formData.maxTeamSize}
                    onChange={handleInputChange}
                    min="2"
                    max="6"
                    placeholder="e.g., 4"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>
                <div className="text-sm text-slate-300 flex items-center">
                  Teams will be validated against this size when they register.
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Event Website (optional)</label>
                <input 
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Banner Image URL (optional)</label>
                <input 
                  type="url"
                  name="bannerImage"
                  value={formData.bannerImage}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
                />
              </div>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 text-cyan-300 text-sm">
              Your event will be published immediately and visible on the Explore page!
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button 
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-6 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white hover:border-slate-500 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <ChevronLeft size={20} />
          Previous
        </button>

        {currentStep === steps.length - 1 ? (
          <button 
            onClick={handleSubmit}
            className="flex items-center gap-2 px-8 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white hover:opacity-90 transition font-bold"
          >
            Publish Event
          </button>
        ) : (
          <button 
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2 bg-cyan-500 rounded-lg text-white hover:bg-cyan-600 transition font-medium"
          >
            Next
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  )
}
