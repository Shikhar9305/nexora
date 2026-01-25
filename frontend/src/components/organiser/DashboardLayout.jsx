'use client';

import { useState } from 'react'
import { Bell, LogOut, Settings, User, Menu, X } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const mockNotifications = [
    { id: 1, title: 'New Registration', description: 'John registered for TechHack 2025', timestamp: '2 hours ago', read: false },
    { id: 2, title: 'System Update', description: 'Dashboard maintenance scheduled tonight', timestamp: '5 hours ago', read: false },
    { id: 3, title: 'Event Alert', description: 'InnovateCon 2025 starts in 3 days', timestamp: '1 day ago', read: true },
  ]

  const [notifications, setNotifications] = useState(mockNotifications)
  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onNotificationClick={() => setNotificationsOpen(!notificationsOpen)}
        onProfileClick={() => setProfileOpen(!profileOpen)}
        unreadCount={unreadCount}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 ml-0 md:ml-64 pt-20">
          <div className="p-6">
            <Outlet />
          </div>
        </main>

        {/* Notifications Dropdown */}
        {notificationsOpen && (
          <div className="fixed right-6 top-20 w-96 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-40 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-white font-semibold">Notifications</h3>
            </div>
            <div className="divide-y divide-slate-700">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400">No notifications</div>
              ) : (
                notifications.map(notif => (
                  <div 
                    key={notif.id} 
                    onClick={() => handleMarkAsRead(notif.id)}
                    className={`p-4 cursor-pointer transition ${notif.read ? 'bg-slate-800' : 'bg-slate-750 border-l-4 border-cyan-500'}`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{notif.title}</p>
                        <p className="text-slate-400 text-xs mt-1">{notif.description}</p>
                        <p className="text-slate-500 text-xs mt-2">{notif.timestamp}</p>
                      </div>
                      {!notif.read && <div className="w-2 h-2 bg-cyan-500 rounded-full mt-1"></div>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Profile Dropdown */}
        {profileOpen && (
          <div className="fixed right-6 top-20 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-40">
            <div className="p-4 space-y-3">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700 transition text-slate-300 text-sm">
                <User size={16} />
                Profile
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700 transition text-slate-300 text-sm">
                <Settings size={16} />
                Settings
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-900/20 transition text-red-400 text-sm">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
      
    </div>
    
  )
}
