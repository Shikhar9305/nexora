'use client';

import { Menu, Bell, LogOutIcon as LogoIcon } from 'lucide-react'

export default function Navbar({ onMenuClick, onNotificationClick, onProfileClick, unreadCount }) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-slate-900 border-b border-slate-700 z-50 h-20 flex items-center px-6">
      <div className="flex items-center justify-between w-full">
        {/* Left: Logo & Menu */}
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="md:hidden text-slate-400 hover:text-white transition">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-white font-bold text-lg hidden sm:block">Nexora</span>
          </div>
        </div>

        {/* Center: Organisation Name */}
        <div className="hidden lg:block text-slate-300 text-sm font-medium">
          Tech Innovations Inc.
        </div>

        {/* Right: Notifications & Profile */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button 
            onClick={onNotificationClick}
            className="relative text-slate-400 hover:text-white transition"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profile Avatar */}
          <button 
            onClick={onProfileClick}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold hover:opacity-80 transition"
          >
            A
          </button>
        </div>
      </div>
    </nav>
  )
}
