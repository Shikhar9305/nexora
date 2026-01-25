'use client';

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Loader, AlertCircle, CheckCircle, Users, MapPin, Zap } from "lucide-react"

export default function TeammatePoolPage() {
  const { id: eventId } = useParams()
  const navigate = useNavigate()
  const [poolStatus, setPoolStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [matching, setMatching] = useState(false)
  const [matches, setMatches] = useState([])
  const [selectedMatches, setSelectedMatches] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPoolStatus()
    const interval = setInterval(fetchPoolStatus, 5000) // Poll every 5s
    return () => clearInterval(interval)
  }, [eventId])

  const fetchPoolStatus = async () => {
    try {
      const response = await fetch(`/api/teammates/event/${eventId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })

      if (!response.ok) throw new Error("Failed to fetch pool status")

      const data = await response.json()
      setPoolStatus(data)

      // If user is matched, trigger matching algorithm
      if (data.currentUserStatus?.status === "matched" && !matching) {
        runMatching()
      }
    } catch (err) {
      console.error("[v0] Pool fetch error:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const runMatching = async () => {
    if (!poolStatus?.currentUserStatus) return

    setMatching(true)
    try {
      const response = await fetch("/api/teammates/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          eventId,
          poolEntryId: poolStatus.currentUserStatus._id,
        }),
      })

      if (!response.ok) throw new Error("Matching failed")

      const data = await response.json()
      console.log("[v0] Matches found:", data.matches)
      setMatches(data.matches)
    } catch (err) {
      console.error("[v0] Matching error:", err)
    } finally {
      setMatching(false)
    }
  }

  const handleFormTeam = async () => {
    if (selectedMatches.length === 0) {
      setError("Select at least one teammate")
      return
    }

    try {
      const response = await fetch("/api/teammates/confirm-team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          eventId,
          selectedUserIds: selectedMatches,
        }),
      })

      if (!response.ok) throw new Error("Failed to form team")

      const data = await response.json()
      console.log("[v0] Team formed:", data.teamId)
      navigate(`/event/${eventId}/register?teamId=${data.teamId}`)
    } catch (err) {
      console.error("[v0] Team formation error:", err)
      setError(err.message)
    }
  }

  const toggleMatch = (userId) => {
    setSelectedMatches((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
          <p>Finding teammates...</p>
        </div>
      </div>
    )
  }

  const currentUser = poolStatus?.currentUserStatus
  const otherUsers = poolStatus?.users?.filter((u) => u.userId._id !== currentUser?.userId) || []

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-foreground/10 p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-accent hover:text-accent/80 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-3xl font-light">Find Your Team</h1>
        <p className="text-foreground/70 mt-2">
          Join with {otherUsers.length} {otherUsers.length === 1 ? "person" : "people"} in the pool
        </p>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Your Profile */}
        {currentUser && (
          <div className="bg-card border border-accent/30 rounded-xl p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Your Profile
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-foreground/60">Role</p>
                <p className="font-medium">{currentUser.desiredRole}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/60">Skills</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentUser.skills?.slice(0, 2).map((s) => (
                    <span key={s} className="px-2 py-1 text-xs bg-accent/10 text-accent rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-foreground/60">Experience</p>
                <p className="font-medium capitalize">{currentUser.experienceLevel}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/60">Availability</p>
                <p className="font-medium capitalize">{currentUser.availability}</p>
              </div>
            </div>
          </div>
        )}

        {/* Matches Found */}
        {matches.length > 0 ? (
          <>
            <div className="bg-card border border-foreground/10 rounded-xl p-6 space-y-4">
              <h2 className="font-semibold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Perfect Matches Found ({matches.length})
              </h2>
              <p className="text-sm text-foreground/70">
                These teammates match your skills and preferences. Select who you want to team up with.
              </p>

              <div className="space-y-3">
                {matches.map((match) => (
                  <div
                    key={match.poolEntryId}
                    onClick={() => toggleMatch(match.user)}
                    className={`p-4 border rounded-lg cursor-pointer transition ${
                      selectedMatches.includes(match.user)
                        ? "bg-accent/10 border-accent"
                        : "border-foreground/10 hover:border-foreground/30"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{match.desiredRole}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {match.skills.map((skill) => (
                            <span key={skill} className="px-2 py-1 text-xs bg-foreground/10 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-foreground/60">
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Match Score: {match.score}%
                          </span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedMatches.includes(match.user)}
                        onChange={() => {}}
                        className="w-5 h-5 rounded border-foreground/30"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleFormTeam}
                disabled={selectedMatches.length === 0}
                className="w-full py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 mt-4"
              >
                Form Team with {selectedMatches.length} {selectedMatches.length === 1 ? "Person" : "People"}
              </button>
            </div>
          </>
        ) : matching ? (
          <div className="text-center py-12">
            <Loader className="w-8 h-8 text-accent animate-spin mx-auto mb-4" />
            <p className="text-foreground/70">Running matching algorithm...</p>
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-foreground/10 rounded-lg">
            <Users className="w-8 h-8 text-foreground/30 mx-auto mb-3" />
            <p className="text-foreground/70 mb-4">Waiting for matches...</p>
            <p className="text-xs text-foreground/50">
              We'll show matches as other teammates join the pool
            </p>
          </div>
        )}

        {/* All Pool Members */}
        {otherUsers.length > 0 && (
          <div className="bg-card border border-foreground/10 rounded-xl p-6">
            <h2 className="font-semibold mb-4">All Pool Members ({otherUsers.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {otherUsers.map((user) => (
                <div key={user._id} className="p-3 border border-foreground/10 rounded-lg text-sm">
                  <p className="font-medium">{user.desiredRole}</p>
                  <p className="text-xs text-foreground/60">{user.skills.slice(0, 2).join(", ")}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}



