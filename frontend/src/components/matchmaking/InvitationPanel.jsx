import { useEffect, useState } from "react"

export default function InvitationPanel({ eventId, onChanged }) {
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const userId = localStorage.getItem("userId")

  const loadInvitations = async () => {
    if (!userId) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/teams/invitations/event/${eventId}?userId=${userId}`)
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || "Failed to fetch invitations")
      }
      const data = await res.json()
      setInvitations(data.invitations || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInvitations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId])

  const handleAction = async (inviteId, action) => {
    try {
      const endpoint =
        action === "accept"
          ? `/api/teams/invitations/${inviteId}/accept`
          : `/api/teams/invitations/${inviteId}/reject`
      const res = await fetch(`${endpoint}?userId=${userId}`, { method: "POST" })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || "Failed to update invitation")
      }
      await loadInvitations()
      if (onChanged) onChanged()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Invitations</h3>
          <p className="text-xs text-slate-400">
            Accept the ones that feel like a good fit. Invitations auto-expire after 24 hours.
          </p>
        </div>
      </div>

      {error && (
        <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-2 mb-2">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-xs text-slate-400">Loading invitations...</p>
      ) : invitations.length === 0 ? (
        <p className="text-xs text-slate-500 mt-2">No invitations yet. You&apos;ll see them here.</p>
      ) : (
        <div className="mt-2 space-y-3 overflow-y-auto">
          {invitations.map((inv) => {
            const team = inv.team
            const isPending = inv.status === "pending"
            return (
              <div
                key={inv._id}
                className="border border-slate-700 rounded-lg p-3 bg-slate-950/60 text-xs space-y-1"
              >
                <p className="text-slate-200 font-medium">
                  Team: {team?.teamName || "Unknown team"}
                </p>
                <p className="text-slate-400">
                  Size: {team?.members?.length || 1}/{team?.maxSize || "?"} • Status:{" "}
                  {team?.status || "forming"}
                </p>
                <p className="text-slate-500">
                  Invited at {new Date(inv.createdAt).toLocaleString()}
                </p>
                <p className="text-slate-500">
                  Expires at {new Date(inv.expiresAt).toLocaleString()}
                </p>

                {isPending ? (
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => handleAction(inv._id, "accept")}
                      className="flex-1 py-1.5 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction(inv._id, "reject")}
                      className="flex-1 py-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-600 hover:border-slate-500 transition"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <p className="mt-2 text-slate-500">
                    You already {inv.status} this invitation.
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

