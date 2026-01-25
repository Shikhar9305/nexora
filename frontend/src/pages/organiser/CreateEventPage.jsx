'use client';

import { useState } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const steps = ['Basic Info', 'Location', 'Schedule & Mode', 'Participation & Links']

export default function CreateEventPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    title: '',
    type: 'hackathon',
    description: '',
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
  })

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

  const handleSubmit = () => {
    console.log('[v0] Form submitted:', formData)
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
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
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

            <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Venue Name</label>
              <input 
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                placeholder="e.g., Convention Center"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">City</label>
                <input 
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
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
                  placeholder="e.g., Maharashtra"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
                />
              </div>
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
