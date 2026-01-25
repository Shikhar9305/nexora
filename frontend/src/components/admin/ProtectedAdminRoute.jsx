'use client';

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProtectedAdminRoute({ children }) {
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const role = localStorage.getItem('role')
    const token = localStorage.getItem('authToken')

    if (role === 'admin' && token) {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
      navigate('/explore')
    }
    setLoading(false)
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    )
  }

  return isAdmin ? children : null
}
