'use client';

import { useEffect, useState } from 'react'
import { Lock, Unlock } from 'lucide-react'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch users')
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      console.error('[v0] Users fetch error:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBlockUnblock = async (id, isBlocked) => {
    try {
      const token = localStorage.getItem('token')
      const endpoint = isBlocked ? 'unblock' : 'block'
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/users/${id}/${endpoint}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to update user')
      const updatedUsers = users.map(u => u._id === id ? { ...u, isBlocked: !isBlocked } : u)
      setUsers(updatedUsers)
      console.log(`[v0] User ${endpoint}ed`)
    } catch (err) {
      console.error(`[v0] ${endpoint} error:`, err.message)
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
        <h1 className="text-4xl font-light tracking-tight text-foreground mb-2">User Management</h1>
        <p className="text-foreground/60">All users on platform ({users.length})</p>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-foreground/5">
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-foreground/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground text-sm">{user.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-foreground/70 text-sm">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border capitalize ${
                      user.role === 'admin' ? 'bg-red-500/10 text-red-500 border-red-500/30' :
                      user.role === 'organiser' ? 'bg-purple-500/10 text-purple-500 border-purple-500/30' :
                      'bg-blue-500/10 text-blue-500 border-blue-500/30'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                      user.isBlocked
                        ? 'bg-red-500/10 text-red-500 border-red-500/30'
                        : 'bg-green-500/10 text-green-500 border-green-500/30'
                    }`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-foreground/70 text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleBlockUnblock(user._id, user.isBlocked)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                        user.isBlocked
                          ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/30'
                          : 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/30'
                      }`}
                    >
                      {user.isBlocked ? (
                        <>
                          <Unlock className="w-4 h-4" />
                          Unblock
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Block
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
