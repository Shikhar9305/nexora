'use client';

import { useState } from "react"
import { X, Users, AlertCircle, CheckCircle, Loader } from "lucide-react"

export default function FindTeammatesModal({ eventId, onClose, onJoin }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    desiredRole: "",
    availability: "full-time",
  })
  const userId = localStorage.getItem("userId")
  const roles = ["Developer", "Designer", "Product Manager", "Data Analyst", "Founder", "Mentor", "Sponsor"]
  const availabilityOptions = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "weekends-only", label: "Weekends Only" },
  ]

  const handleJoinPool = async () => {
    if (!formData.desiredRole) {
       
      setError("Please select a role")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/teammates/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          eventId,
          desiredRole: formData.desiredRole,
          availability: formData.availability,
        }),
      })

      if (!response.ok) throw new Error("Failed to join pool")

      const data = await response.json()
      console.log("[v0] Joined teammate pool:", data.poolEntry._id)

      onJoin?.(data.poolEntry)
      setStep(2)
    } catch (err) {
      console.error("[v0] Join error:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-foreground/10 rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-foreground/10">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            Find Teammates
          </h2>
          <button onClick={onClose} className="text-foreground/50 hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {step === 1 && (
            <>
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">What role do you want to play?</label>
                <div className="space-y-2">
                  {roles.map((role) => (
                    <label
                      key={role}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
                        formData.desiredRole === role
                          ? "bg-accent/10 border-accent"
                          : "border-foreground/10 hover:border-foreground/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={formData.desiredRole === role}
                        onChange={(e) => {
                          setFormData({ ...formData, desiredRole: e.target.value })
                          setError(null)
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium mb-3">Your availability</label>
                <div className="space-y-2">
                  {availabilityOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
                        formData.availability === option.value
                          ? "bg-accent/10 border-accent"
                          : "border-foreground/10 hover:border-foreground/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="availability"
                        value={option.value}
                        checked={formData.availability === option.value}
                        onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-sm text-red-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* CTA */}
              <button
                onClick={handleJoinPool}
                disabled={loading}
                className="w-full py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                {loading ? "Joining Pool..." : "Join Teammate Pool"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">You're in the pool!</h3>
                <p className="text-sm text-foreground/70 mb-4">
                  You'll be matched with teammates based on your skills, experience, and preferences.
                </p>
                <p className="text-xs text-foreground/50">
                  Matching happens continuously as more people join.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90"
              >
                Got it!
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}


