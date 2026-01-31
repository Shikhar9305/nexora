import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function CreateTeamModal({ eventId, isOpen, onClose, onCreated }) {
  const [teamName, setTeamName] = useState("")
  const [maxSize, setMaxSize] = useState(4)
  const [role, setRole] = useState("Leader")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const userId = localStorage.getItem("userId")
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          eventId,
          teamName,
          maxSize,
          role,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.message || "Failed to create team")
      }
      if (onCreated) onCreated(data.team)
      onClose()

    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-1">Create a team</h2>
        <p className="text-xs text-slate-400 mb-4">
          You&apos;ll be set as the team leader. You can invite up to{" "}
          <span className="font-semibold">5</span> people at a time while your team is forming.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Team name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g., Midnight Builders"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Max team size
              </label>
              <input
                type="number"
                min={2}
                max={10}
                value={maxSize}
                onChange={(e) => setMaxSize(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-2">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-slate-200 hover:border-slate-500 transition text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition text-xs font-semibold disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}