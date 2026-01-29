import { useState } from "react"

// Basic multi-select checkbox group for skills/roles
const SKILLS = [
  "React",
  "Node.js",
  "Python",
  "Machine Learning",
  "UI/UX",
  "Figma",
  "MongoDB",
  "Solidity",
  "Data Analysis",
  "Pitching",
  "Video Editing",
]

const ROLES = [
  "Frontend",
  "Backend",
  "Fullstack",
  "Designer",
  "ML / AI",
  "DevOps",
  "Product / Pitch",
]

const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
]

export default function MatchmakingProfileForm({ eventId, onCompleted }) {
  const [skills, setSkills] = useState([])
  const [desiredRoles, setDesiredRoles] = useState([])
  const [experienceLevel, setExperienceLevel] = useState("beginner")
  const [location, setLocation] = useState("")
  const [preferences, setPreferences] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const userId = localStorage.getItem("userId")

  const toggleInArray = (value, current, setter) => {
    if (current.includes(value)) {
      setter(current.filter((v) => v !== value))
    } else {
      setter([...current, value])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/matchmaking/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          eventId,
          skills,
          desiredRoles,
          experienceLevel,
          lookingForTeam: true,
          location,
          // preferences is not stored in schema but may be useful later
          preferences,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || "Failed to save matchmaking profile")
      }

      const storageKey = `matchmaking_profile_${eventId}`
      localStorage.setItem(storageKey, "completed")

      if (onCompleted) onCompleted()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Tell us how you work best</h2>
        <p className="text-sm text-slate-400">
          We use this once to build your matchmaking profile for this hackathon. You can&apos;t
          spam or see everyone – only curated, relevant teammates.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Skills you bring
        </label>
        <p className="text-xs text-slate-400 mb-2">
          Select all that apply. We prioritise complementary skills over pure overlap.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SKILLS.map((skill) => {
            const checked = skills.includes(skill)
            return (
              <label
                key={skill}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer text-sm transition ${
                  checked
                    ? "border-cyan-500 bg-cyan-500/10 text-white"
                    : "border-slate-700 bg-slate-800 hover:border-slate-500 text-slate-200"
                }`}
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-cyan-500"
                  checked={checked}
                  onChange={() => toggleInArray(skill, skills, setSkills)}
                />
                <span>{skill}</span>
              </label>
            )
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Roles you&apos;d like to play
        </label>
        <p className="text-xs text-slate-400 mb-2">
          Choose roles you are comfortable owning in a team. We use this for role-balance rather
          than just matching identical profiles.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ROLES.map((role) => {
            const checked = desiredRoles.includes(role)
            return (
              <label
                key={role}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer text-sm transition ${
                  checked
                    ? "border-cyan-500 bg-cyan-500/10 text-white"
                    : "border-slate-700 bg-slate-800 hover:border-slate-500 text-slate-200"
                }`}
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-cyan-500"
                  checked={checked}
                  onChange={() => toggleInArray(role, desiredRoles, setDesiredRoles)}
                />
                <span>{role}</span>
              </label>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Experience level
          </label>
          <div className="space-y-2">
            {EXPERIENCE_LEVELS.map((lvl) => (
              <label
                key={lvl.value}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer text-sm transition ${
                  experienceLevel === lvl.value
                    ? "border-cyan-500 bg-cyan-500/10 text-white"
                    : "border-slate-700 bg-slate-800 hover:border-slate-500 text-slate-200"
                }`}
              >
                <input
                  type="radio"
                  className="w-4 h-4 accent-cyan-500"
                  name="experienceLevel"
                  value={lvl.value}
                  checked={experienceLevel === lvl.value}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                />
                <span>{lvl.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Mumbai, India (optional)"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
          <p className="text-xs text-slate-400 mt-1">
            We add a soft bonus for people in the same city – remote matches still work.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Preferences (optional)
        </label>
        <textarea
          rows={3}
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          placeholder="Briefly describe what kind of team and collaboration style you prefer."
          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition resize-none"
        />
      </div>

      {error && (
        <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 mt-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
      >
        {submitting ? "Saving profile..." : "Save & enter matchmaking pool"}
      </button>
    </form>
  )
}

