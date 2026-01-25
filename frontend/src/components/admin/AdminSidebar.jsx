'use client';

import { Link, useLocation } from 'react-router-dom'
import { BarChart3, Users, Calendar, Settings, LogOut } from 'lucide-react'

export default function AdminSidebar({ isOpen }) {
  const location = useLocation()

  const navItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Users, label: 'Organisers', href: '/admin/organisers' },
    { icon: Calendar, label: 'Events', href: '/admin/events' },
    { icon: Users, label: 'Users', href: '/admin/users' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
    window.location.href = '/explore'
  }

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-card border-r border-border overflow-hidden h-screen sticky top-0`}>
      <div className="p-6 space-y-8">
        {/* Logo */}
        <div className="text-2xl font-light tracking-tight text-accent">
          Admin
        </div>

        {/* Nav Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon
            return (
              <Link key={item.href} to={item.href}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-accent/10 text-accent border border-accent/30'
                      : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500/70 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}
