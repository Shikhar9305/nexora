'use client';

import { Menu, Bell } from 'lucide-react'

export default function AdminNavbar({ sidebarOpen, setSidebarOpen }) {
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-40">
      <div className="px-8 py-4 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-foreground/5 rounded-lg transition-all"
        >
          <Menu className="w-5 h-5 text-foreground/70" />
        </button>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-foreground/5 rounded-lg transition-all">
            <Bell className="w-5 h-5 text-foreground/70" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
              <span className="text-xs font-medium text-accent">A</span>
            </div>
            <span className="text-sm font-medium text-foreground/70">Admin</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
