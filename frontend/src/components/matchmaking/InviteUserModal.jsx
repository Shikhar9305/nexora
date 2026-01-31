import { useState } from "react"

export default function InviteUserModal({ team, targetProfile, isOpen, onClose, onInvited }) {
  const [role, setRole] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const userId = localStorage.getItem("userId")

  if (!isOpen || !team || !targetProfile) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/teams/${team._id}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          toUserId: targetProfile.userId,
          role,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.message || "Failed to send invitation")
      }
      if (onInvited) onInvited()
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
        <h2 className="text-lg font-semibold text-white mb-1">Invite teammate</h2>
        <p className="text-xs text-slate-400 mb-4">
          You are inviting{" "}
          <span className="font-semibold">
            Participant #{String(targetProfile.userId).slice(-6)}
          </span>{" "}
          to join{" "}
          <span className="font-semibold">{team.teamName}</span>. They will see this in their
          invitations panel.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Role you&apos;re inviting them for (optional)
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Frontend, ML, Product, etc."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition text-sm"
            />
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
              {submitting ? "Sending..." : "Send invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

