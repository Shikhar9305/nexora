'use client';

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Users, AlertCircle, CheckCircle } from "lucide-react"

export default function EventRegistrationPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    teamName: "",
    teamSize: 1,
    members: [],
  })

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${id}`)
        if (!response.ok) throw new Error("Event not found")
        const data = await response.json()
        setEvent(data)
      } catch (error) {
        console.error("[v0] Error fetching event:", error)
        setError("Failed to load event details")
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
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Event not found</h1>
          <button
            onClick={() => navigate("/explore")}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg"
          >
            Back to Explore
          </button>
        </div>
      </div>
    )
  }

  const isHackathon = event.type === "hackathon"
  const remainingSlots =
    event.maxParticipants && event.maxParticipants > 0
      ? event.maxParticipants - event.currentParticipants
      : null

  const isTeamSizeValid =
    !remainingSlots || formData.teamSize <= remainingSlots

  // Handle team size change with validation
  const handleTeamSizeChange = (size) => {
    setFormData({
      ...formData,
      teamSize: size,
      members: Array(size)
        .fill(null)
        .map((_, idx) => formData.members[idx] || { name: "", email: "" }),
    })
    setError(null)
  }

  // Update team member
  const updateMember = (index, field, value) => {
    const updatedMembers = [...formData.members]
    updatedMembers[index] = { ...updatedMembers[index], [field]: value }
    setFormData({ ...formData, members: updatedMembers })
  }

  // Handle registration submission
  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      setError(null)

      // Client-side validation
      if (isHackathon && !formData.teamName.trim()) {
        setError("Team name is required")
        setSubmitting(false)
        return
      }

      if (
        isHackathon &&
        formData.members.some((m) => !m.name.trim())
      ) {
        setError("All team member names are required")
        setSubmitting(false)
        return
      }

      // Prepare registration data
      const registrationData = isHackathon
        ? {
            eventId: id,
            teamName: formData.teamName,
            teamSize: formData.teamSize,
            members: formData.members.map((m) => ({
              name: m.name.trim(),
              email: m.email.trim() || `member${formData.members.indexOf(m) + 1}@event.local`,
            })),
            registeredBy: localStorage.getItem("userId"),
          }
        : {
            eventId: id,
            teamName: `${event.title} - Individual`,
            teamSize: 1,
            members: [
              {
                name: "Participant", // This would come from logged-in user in real app
                email: "participant@event.local",
              },
            ],
          }

      // Submit to backend
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.message ||
            "Registration failed. Please try again."
        )
      }

      setSuccess(true)
      setTimeout(() => {
        navigate("/dashboard")
      }, 2000)
    } catch (error) {
      console.error("[v0] Registration error:", error)
      setError(error.message || "Registration failed")
    } finally {
      setSubmitting(false)
    }
  }

  // Step 1: Team Details (Hackathon) or Confirmation (Others)
  const Step1 = () =>
    isHackathon ? (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Team Name</label>
          <input
            type="text"
            value={formData.teamName}
            onChange={(e) =>
              setFormData({ ...formData, teamName: e.target.value })
            }
            placeholder="e.g., Code Crusaders"
            className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-3">
            Team Size: <span className="text-accent">{formData.teamSize}</span>
          </label>
          <div className="flex gap-2">
            {Array.from({ length: Math.min(10, remainingSlots || 10) }).map(
              (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handleTeamSizeChange(i + 1)}
                  className={`w-10 h-10 rounded-lg font-semibold transition ${
                    formData.teamSize === i + 1
                      ? "bg-accent text-accent-foreground"
                      : "bg-input border border-border hover:border-accent"
                  }`}
                >
                  {i + 1}
                </button>
              ),
            )}
          </div>

          {!isTeamSizeValid && (
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-400">
                  Only {remainingSlots} slots remaining
                </p>
                <p className="text-xs text-red-300">
                  Reduce team size to register
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setCurrentStep(2)}
          disabled={!isTeamSizeValid || !formData.teamName.trim()}
          className="w-full py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Continue to Team Members
        </button>
      </div>
    ) : (
      // Individual Registration Confirmation
      <div className="space-y-4">
        <div className="p-4 bg-input rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">
            Event Registration Type
          </p>
          <p className="font-semibold">Individual Registration</p>
        </div>

        <div className="p-4 bg-input rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Number of Seats</p>
          <p className="text-2xl font-bold">1</p>
        </div>

        {remainingSlots !== null && (
          <div className="p-4 bg-input rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              Remaining Slots
            </p>
            <p className="text-2xl font-bold text-green-400">
              {Math.max(0, remainingSlots)}
            </p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition"
        >
          {submitting ? "Registering..." : "Confirm Registration"}
        </button>
      </div>
    )

  // Step 2: Team Members (Hackathon only)
  const Step2 = () => (
    <div className="space-y-4">
      <div className="p-4 bg-input rounded-lg mb-4">
        <p className="text-sm text-muted-foreground">Team members</p>
        <p className="text-lg font-semibold">
          {formData.teamSize} members in total
        </p>
      </div>

      {formData.members.map((member, idx) => (
        <div key={idx} className="p-4 bg-input rounded-lg space-y-3">
          <h4 className="font-semibold">Member {idx + 1}</h4>
          <input
            type="text"
            value={member?.name || ""}
            onChange={(e) => updateMember(idx, "name", e.target.value)}
            placeholder="Full Name"
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            type="email"
            value={member?.email || ""}
            onChange={(e) => updateMember(idx, "email", e.target.value)}
            placeholder="Email (optional)"
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      ))}

      <div className="flex gap-2 pt-4">
        <button
          onClick={() => setCurrentStep(1)}
          className="flex-1 py-2 border border-border rounded-lg font-semibold hover:bg-input transition"
        >
          Back
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          disabled={formData.members.some((m) => !m?.name.trim())}
          className="flex-1 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition"
        >
          Review & Confirm
        </button>
      </div>
    </div>
  )

  // Step 3: Confirmation (Hackathon only)
  const Step3 = () => {
    const slotsAfterRegistration = remainingSlots
      ? remainingSlots - formData.teamSize
      : null
    return (
      <div className="space-y-4">
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
          <h3 className="font-semibold text-accent mb-2">Registration Summary</h3>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Team Name:</span>{" "}
              <span className="font-semibold">{formData.teamName}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Team Size:</span>{" "}
              <span className="font-semibold">{formData.teamSize}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Members:</span>
            </p>
            <ul className="ml-4 space-y-1">
              {formData.members.map((m, idx) => (
                <li key={idx} className="text-xs">
                  {idx + 1}. {m?.name} {m?.email && `(${m.email})`}
                </li>
              ))}
            </ul>
            {slotsAfterRegistration !== null && (
              <p className="pt-2 border-t border-accent/20">
                <span className="text-muted-foreground">
                  Remaining slots after registration:
                </span>{" "}
                <span className="font-semibold text-accent">
                  {Math.max(0, slotsAfterRegistration)}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentStep(2)}
            className="flex-1 py-2 border border-border rounded-lg font-semibold hover:bg-input transition"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition"
          >
            {submitting ? "Registering..." : "Confirm & Register"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(`/event/${id}`)}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold">Register for Event</h1>
            <p className="text-sm text-muted-foreground">{event.title}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Success State */}
        {success && (
          <div className="space-y-4 text-center py-12">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">Registration Successful!</h2>
            <p className="text-muted-foreground">
              You will be redirected to your dashboard shortly.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-400">Registration Error</h3>
              <p className="text-sm text-red-300">{error}</p>
            </div>
          </div>
        )}

        {!success && (
          <>
            {/* Progress Indicator */}
            {isHackathon && (
              <div className="mb-8">
                <div className="flex gap-2">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`flex-1 h-1 rounded-full transition ${
                        step <= currentStep
                          ? "bg-accent"
                          : "bg-input"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Team Details</span>
                  <span>Members</span>
                  <span>Confirmation</span>
                </div>
              </div>
            )}

            {/* Form Content */}
            <div className="bg-card border border-border rounded-xl p-6">
              {currentStep === 1 && <Step1 />}
              {currentStep === 2 && isHackathon && <Step2 />}
              {currentStep === 3 && isHackathon && <Step3 />}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
