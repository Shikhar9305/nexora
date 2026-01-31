'use client';

import { useEffect, useState } from 'react'
import { Users, Calendar, CheckCircle, AlertCircle } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Failed to fetch stats')
        const data = await res.json()
        setStats(data)
      } catch (err) {
        console.error('[v0] Stats fetch error:', err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

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

  const statCards = [
    {
      icon: Users,
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      icon: Users,
      label: 'Total Organisers',
      value: stats?.totalOrganisers || 0,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      icon: Calendar,
      label: 'Total Events',
      value: stats?.totalEvents || 0,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      icon: AlertCircle,
      label: 'Pending Approvals',
      value: stats?.pendingApprovals || 0,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-light tracking-tight text-foreground mb-2">Dashboard</h1>
        <p className="text-foreground/60">Platform overview and key metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <div key={idx} className="bg-card border border-border rounded-lg p-6">
              <div className={`w-12 h-12 rounded-lg ${card.bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <p className="text-foreground/70 text-sm mb-2">{card.label}</p>
              <p className="text-3xl font-light text-foreground">{card.value}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-medium text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/admin/organisers" className="p-4 bg-foreground/5 hover:bg-foreground/10 rounded-lg transition-all flex items-center gap-3 group">
            <CheckCircle className="w-5 h-5 text-green-500 group-hover:translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Review Pending Organisers</span>
          </a>
          <a href="/admin/events" className="p-4 bg-foreground/5 hover:bg-foreground/10 rounded-lg transition-all flex items-center gap-3 group">
            <Calendar className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Monitor Events</span>
          </a>
          <a href="/admin/users" className="p-4 bg-foreground/5 hover:bg-foreground/10 rounded-lg transition-all flex items-center gap-3 group">
            <Users className="w-5 h-5 text-purple-500 group-hover:translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Manage Users</span>
          </a>
        </div>
      </div>
    </div>
  )
}
