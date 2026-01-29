'use client';

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

export default function AdminOrganisers() {
  const [organisers, setOrganisers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [rejectionReason, setRejectionReason] = useState({})
  const [showRejectionForm, setShowRejectionForm] = useState({})

  useEffect(() => {
    fetchOrganisers()
  }, [])

  const fetchOrganisers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/admin/organisers/pending', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch organisers')
      const data = await res.json()
      setOrganisers(data)
    } catch (err) {
      console.error('[v0] Organisers fetch error:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/admin/organiser/approve/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to approve')
      setOrganisers(organisers.filter(o => o._id !== id))
      console.log('[v0] Organiser approved')
    } catch (err) {
      console.error('[v0] Approval error:', err.message)
      alert(err.message)
    }
  }

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/admin/organisers/${id}/reject`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectionReason[id] || 'Not provided' }),
      })
      if (!res.ok) throw new Error('Failed to reject')
      setOrganisers(organisers.filter(o => o._id !== id))
      setShowRejectionForm({ ...showRejectionForm, [id]: false })
      console.log('[v0] Organiser rejected')
    } catch (err) {
      console.error('[v0] Rejection error:', err.message)
      alert(err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-light tracking-tight text-foreground mb-2">Organiser Approvals</h1>
        <p className="text-foreground/60">Pending organiser registrations ({organisers.length})</p>
      </div>

      {organisers.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <p className="text-foreground/70">All pending organisers have been reviewed</p>
        </div>
      ) : (
        <div className="space-y-4">
          {organisers.map((org) => (
            <div key={org._id} className="bg-card border border-border rounded-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-foreground mb-2">{org.organisationName}</h3>
                  <div className="space-y-1 text-sm text-foreground/60">
                    <p>Type: <span className="capitalize">{org.organisationType}</span></p>
                    <p>Email: {org.contactEmail}</p>
                    <p>Submitted: {new Date(org.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(org._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/30 rounded-lg transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Approve</span>
                  </button>

                  <button
                    onClick={() => setShowRejectionForm({ ...showRejectionForm, [org._id]: !showRejectionForm[org._id] })}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Reject</span>
                  </button>
                </div>
              </div>

              {showRejectionForm[org._id] && (
                <div className="mt-4 p-4 bg-foreground/5 rounded-lg border border-foreground/10">
                  <p className="text-sm text-foreground/70 mb-3">Rejection Reason (optional):</p>
                  <textarea
                    value={rejectionReason[org._id] || ''}
                    onChange={(e) => setRejectionReason({ ...rejectionReason, [org._id]: e.target.value })}
                    placeholder="Enter reason for rejection..."
                    className="w-full p-3 bg-card border border-border rounded-lg text-foreground text-sm placeholder:text-foreground/40 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    rows="3"
                  />
                  <button
                    onClick={() => handleReject(org._id)}
                    className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all"
                  >
                    Confirm Rejection
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
