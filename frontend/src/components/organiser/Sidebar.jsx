'use client';

import { LayoutDashboard, Calendar, Plus, Settings, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/organiser/dashboard' },
  { icon: Calendar, label: 'My Events', path: '/organiser/dashboard/events' },
  { icon: Plus, label: 'Create Event', path: '/organiser/dashboard/events/new' },
  { icon: Settings, label: 'Settings', path: '/organiser/dashboard/settings' },
]


  return (
    <>
      {/* Sidebar */}
      <aside className={`fixed left-0 top-20 bottom-0 w-64 bg-slate-800 border-r border-slate-700 transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-6 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border-l-2 border-cyan-500'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </aside>

      {/* Close button for mobile */}
      {isOpen && (
        <button 
          onClick={onClose}
          className="fixed right-6 top-24 md:hidden text-slate-400 hover:text-white z-50"
        >
          <X size={24} />
        </button>
      )}
    
    </>
  )
}
