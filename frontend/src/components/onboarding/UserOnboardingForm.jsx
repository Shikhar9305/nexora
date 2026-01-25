// import { useNavigate } from "react-router-dom"
// import { useState } from "react"
// import { MapPin, Calendar, CheckCircle } from "lucide-react"
// import { apiFetch } from "@/utils/api"

// export default function UserOnboardingForm() {
//   const navigate = useNavigate()

//   const [preferences, setPreferences] = useState({
//     eventTypes: [],
//     locations: [],
//   })

//   const [locationInput, setLocationInput] = useState("")
//   const [isLoading, setIsLoading] = useState(false)

//   const eventTypes = [
//     { value: "hackathon", label: "Hackathons" },
//     { value: "workshop", label: "Workshops" },
//     { value: "event", label: "Events & Meetups" },
//   ]

//   const toggleEventType = (type) => {
//     setPreferences((prev) => ({
//       ...prev,
//       eventTypes: prev.eventTypes.includes(type)
//         ? prev.eventTypes.filter((t) => t !== type)
//         : [...prev.eventTypes, type],
//     }))
//   }

//   const addLocation = () => {
//     if (!locationInput.trim()) return
//     setPreferences((prev) => ({
//       ...prev,
//       locations: [...prev.locations, locationInput.trim()],
//     }))
//     setLocationInput("")
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setIsLoading(true)

//     try {
//       const userId = localStorage.getItem("userId")
//       if (!userId) throw new Error("User not logged in")

//       await apiFetch("/api/user/onboarding", {
//         method: "POST",
//         body: JSON.stringify({
//           userId,
//           preferences,
//         }),
//       })

//       navigate("/explore")
//     } catch (err) {
//       alert(err.message)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-background text-foreground flex">
//       {/* LEFT BRANDING (same as organiser) */}
//       <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center px-8 relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-background" />

//         <div className="relative z-10 max-w-md text-center">
//           <div className="mb-8">
//             <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
//               <CheckCircle className="w-8 h-8 text-accent" />
//             </div>
//           </div>

//           <h2 className="text-4xl font-light mb-4">Nexora</h2>
//           <p className="text-lg text-foreground/70">
//             Discover events tailored to your interests
//           </p>
//         </div>
//       </div>

//       {/* RIGHT FORM */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
//         <div className="w-full max-w-md">
//           {/* Badge */}
//           <div className="mb-8">
//             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-accent/10 border-accent/30 text-accent">
//               <CheckCircle className="w-4 h-4" />
//               <span className="text-sm font-medium">User Account</span>
//             </div>
//           </div>

//           {/* Header */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-light mb-2">Your Preferences</h1>
//             <p className="text-foreground/70">
//               Help us personalize your event discovery experience.
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Event Types */}
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Preferred Event Types
//               </label>
//               <div className="space-y-2">
//                 {eventTypes.map((type) => (
//                   <label
//                     key={type.value}
//                     className="flex items-center gap-3 cursor-pointer"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={preferences.eventTypes.includes(type.value)}
//                       onChange={() => toggleEventType(type.value)}
//                     />
//                     <Calendar className="w-4 h-4 text-accent" />
//                     <span>{type.label}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Locations */}
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Preferred Locations
//               </label>
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   value={locationInput}
//                   onChange={(e) => setLocationInput(e.target.value)}
//                   placeholder="e.g. Delhi, Bangalore"
//                   className="flex-1 px-4 py-2 border rounded-lg bg-card"
//                 />
//                 <button
//                   type="button"
//                   onClick={addLocation}
//                   className="px-4 py-2 border rounded-lg"
//                 >
//                   Add
//                 </button>
//               </div>

//               <div className="mt-2 flex flex-wrap gap-2">
//                 {preferences.locations.map((loc, i) => (
//                   <span
//                     key={i}
//                     className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
//                   >
//                     <MapPin className="inline w-3 h-3 mr-1" />
//                     {loc}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full py-3 bg-accent text-accent-foreground rounded-lg hover:shadow-lg disabled:opacity-50"
//             >
//               {isLoading ? "Saving Preferences..." : "Continue to Explore"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }




'use client'

import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { MapPin, CheckCircle, Loader, AlertCircle, ChevronRight } from 'lucide-react'

export default function UserOnboardingForm() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState(null)

  const [formData, setFormData] = useState({
    preferences: {
      eventTypes: [],
    },
    location: {
      lat: null,
      lon: null,
      city: '',
      state: '',
      country: '',
    },
    skills: [],
    skillInput: '',
    preferredRoles: [],
    roleInput: '',
    experienceLevel: '',
  })

  const eventTypes = [
    { value: 'hackathon', label: 'Hackathons', icon: '⚡' },
    { value: 'workshop', label: 'Workshops', icon: '🎓' },
    { value: 'event', label: 'Events & Meetups', icon: '🎉' },
  ]

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ]

  const commonSkills = ['JavaScript', 'Python', 'React', 'Node.js', 'UI/UX', 'Data Science', 'DevOps', 'Mobile Dev']
  const commonRoles = ['Developer', 'Designer', 'Product Manager', 'Data Analyst', 'Founder', 'Mentor', 'Sponsor']

  // Auto-detect location
  useEffect(() => {
    if (currentStep === 2 && !formData.location.city) {
      detectLocation()
    }
  }, [currentStep])

  const detectLocation = async () => {
    setLocationLoading(true)
    setLocationError(null)

    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            console.log('[v0] Location detected:', latitude, longitude)

            // Reverse geocoding using OpenStreetMap Nominatim API
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            )
            const data = await response.json()

            const address = data.address || {}
            setFormData((prev) => ({
              ...prev,
              location: {
                lat: latitude,
                lon: longitude,
                city: address.city || address.town || '',
                state: address.state || '',
                country: address.country || '',
              },
            }))
            setLocationLoading(false)
          },
          (error) => {
            console.error('[v0] Geolocation error:', error)
            setLocationError('Unable to detect location. Please enter manually.')
            setLocationLoading(false)
          }
        )
      } else {
        setLocationError('Geolocation not supported. Please enter manually.')
        setLocationLoading(false)
      }
    } catch (err) {
      console.error('[v0] Reverse geocoding error:', err)
      setLocationError('Could not fetch location details. Please enter manually.')
      setLocationLoading(false)
    }
  }

  const toggleEventType = (type) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        eventTypes: prev.preferences.eventTypes.includes(type)
          ? prev.preferences.eventTypes.filter((t) => t !== type)
          : [...prev.preferences.eventTypes, type],
      },
    }))
  }

  const addSkill = () => {
    if (formData.skillInput.trim() && !formData.skills.includes(formData.skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, prev.skillInput.trim()],
        skillInput: '',
      }))
    }
  }

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const addRole = () => {
    if (formData.roleInput.trim() && !formData.preferredRoles.includes(formData.roleInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        preferredRoles: [...prev.preferredRoles, prev.roleInput.trim()],
        roleInput: '',
      }))
    }
  }

  const removeRole = (role) => {
    setFormData((prev) => ({
      ...prev,
      preferredRoles: prev.preferredRoles.filter((r) => r !== role),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const userId = localStorage.getItem('userId')
      if (!userId) throw new Error('User not logged in')

      const payload = {
        userId,
        preferences: formData.preferences,
        location: formData.location,
        skills: formData.skills,
        preferredRoles: formData.preferredRoles,
        experienceLevel: formData.experienceLevel,
      }

      console.log('[v0] Submitting onboarding data:', payload)

      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Failed to save preferences')

      navigate('/explore')
    } catch (err) {
      console.error('[v0] Onboarding error:', err)
      alert(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* LEFT BRANDING */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-background" />

        <div className="relative z-10 max-w-md text-center">
          <div className="mb-8">
            <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-accent" />
            </div>
          </div>

          <h2 className="text-4xl font-light mb-4">Nexora</h2>
          <p className="text-lg text-foreground/70">
            Discover events tailored to your interests and location
          </p>

          {/* Progress indicator */}
          <div className="mt-12 space-y-3">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center gap-3 text-sm ${
                  step <= currentStep ? 'text-accent' : 'text-foreground/50'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                    step < currentStep ? 'bg-accent border-accent' : 'border-current'
                  }`}
                >
                  {step < currentStep ? <CheckCircle className="w-4 h-4 text-background" /> : step}
                </div>
                <span className="font-medium">
                  {['Event Preferences', 'Your Location', 'Skills & Roles', 'Experience'][step - 1]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Badge */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-accent/10 border-accent/30 text-accent">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">User Account</span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-light mb-2">Complete Your Profile</h1>
            <p className="text-foreground/70">
              {currentStep === 1 && 'What events interest you?'}
              {currentStep === 2 && 'Where are you located?'}
              {currentStep === 3 && 'What are your skills and roles?'}
              {currentStep === 4 && 'What\'s your experience level?'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* STEP 1: Event Preferences */}
            {currentStep === 1 && (
              <div>
                <label className="block text-sm font-medium mb-4">Which events interest you?</label>
                <div className="space-y-3">
                  {eventTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                        formData.preferences.eventTypes.includes(type.value)
                          ? 'border-accent bg-accent/10'
                          : 'border-foreground/10 hover:border-accent/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.preferences.eventTypes.includes(type.value)}
                        onChange={() => toggleEventType(type.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-xl">{type.icon}</span>
                      <span className="font-medium flex-1">{type.label}</span>
                      {formData.preferences.eventTypes.includes(type.value) && (
                        <CheckCircle className="w-5 h-5 text-accent" />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium">Your Location</label>
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={locationLoading}
                    className="text-xs text-accent hover:underline flex items-center gap-1"
                  >
                    {locationLoading ? <Loader className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
                    {locationLoading ? 'Detecting...' : 'Auto-detect'}
                  </button>
                </div>

                {locationError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-sm text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    {locationError}
                  </div>
                )}

                <input
                  type="text"
                  placeholder="City"
                  value={formData.location.city}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: { ...prev.location, city: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2 border border-foreground/10 rounded-lg bg-card placeholder-foreground/50 focus:outline-none focus:border-accent"
                  required
                />

                <input
                  type="text"
                  placeholder="State"
                  value={formData.location.state}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: { ...prev.location, state: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2 border border-foreground/10 rounded-lg bg-card placeholder-foreground/50 focus:outline-none focus:border-accent"
                  required
                />

                <input
                  type="text"
                  placeholder="Country"
                  value={formData.location.country}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: { ...prev.location, country: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2 border border-foreground/10 rounded-lg bg-card placeholder-foreground/50 focus:outline-none focus:border-accent"
                  required
                />

                {formData.location.lat && (
                  <div className="text-xs text-foreground/60 text-center">
                    📍 Coordinates: {formData.location.lat.toFixed(4)}, {formData.location.lon.toFixed(4)}
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Skills & Roles */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium mb-3">Skills</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={formData.skillInput}
                      onChange={(e) => setFormData((prev) => ({ ...prev, skillInput: e.target.value }))}
                      placeholder="e.g. JavaScript, Design"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="flex-1 px-4 py-2 border border-foreground/10 rounded-lg bg-card placeholder-foreground/50 focus:outline-none focus:border-accent text-sm"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-3 py-2 bg-accent/20 border border-accent/40 rounded-lg hover:bg-accent/30 transition text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/30 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-accent transition"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {commonSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => {
                          if (!formData.skills.includes(skill)) {
                            setFormData((prev) => ({
                              ...prev,
                              skills: [...prev.skills, skill],
                            }))
                          }
                        }}
                        className="text-xs px-2 py-1 bg-foreground/5 border border-foreground/10 rounded hover:border-accent hover:text-accent transition"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Roles */}
                <div>
                  <label className="block text-sm font-medium mb-3">Preferred Roles</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={formData.roleInput}
                      onChange={(e) => setFormData((prev) => ({ ...prev, roleInput: e.target.value }))}
                      placeholder="e.g. Developer, Designer"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
                      className="flex-1 px-4 py-2 border border-foreground/10 rounded-lg bg-card placeholder-foreground/50 focus:outline-none focus:border-accent text-sm"
                    />
                    <button
                      type="button"
                      onClick={addRole}
                      className="px-3 py-2 bg-accent/20 border border-accent/40 rounded-lg hover:bg-accent/30 transition text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.preferredRoles.map((role, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/30 rounded-full text-sm"
                      >
                        {role}
                        <button
                          type="button"
                          onClick={() => removeRole(role)}
                          className="hover:text-accent transition"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {commonRoles.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          if (!formData.preferredRoles.includes(role)) {
                            setFormData((prev) => ({
                              ...prev,
                              preferredRoles: [...prev.preferredRoles, role],
                            }))
                          }
                        }}
                        className="text-xs px-2 py-1 bg-foreground/5 border border-foreground/10 rounded hover:border-accent hover:text-accent transition"
                      >
                        + {role}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Experience Level */}
            {currentStep === 4 && (
              <div>
                <label className="block text-sm font-medium mb-4">Experience Level</label>
                <div className="space-y-3">
                  {experienceLevels.map((level) => (
                    <label
                      key={level.value}
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                        formData.experienceLevel === level.value
                          ? 'border-accent bg-accent/10'
                          : 'border-foreground/10 hover:border-accent/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="experience"
                        value={level.value}
                        checked={formData.experienceLevel === level.value}
                        onChange={(e) => setFormData((prev) => ({ ...prev, experienceLevel: e.target.value }))}
                        className="w-4 h-4"
                      />
                      <span className="font-medium flex-1">{level.label}</span>
                      {formData.experienceLevel === level.value && <CheckCircle className="w-5 h-5 text-accent" />}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-6 border-t border-foreground/10">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 py-3 border border-foreground/20 rounded-lg hover:bg-foreground/5 transition font-medium"
                >
                  Back
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={
                    (currentStep === 1 && formData.preferences.eventTypes.length === 0) ||
                    (currentStep === 2 && !formData.location.city) ||
                    (currentStep === 3 && formData.skills.length === 0 && formData.preferredRoles.length === 0)
                  }
                  className="flex-1 py-3 bg-accent text-accent-foreground rounded-lg hover:shadow-lg disabled:opacity-50 transition font-medium flex items-center justify-center gap-2"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || !formData.experienceLevel}
                  className="flex-1 py-3 bg-accent text-accent-foreground rounded-lg hover:shadow-lg disabled:opacity-50 transition font-medium"
                >
                  {isLoading ? 'Saving...' : 'Complete Profile'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

