'use client';

import { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminNavbar from './AdminNavbar'

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} />
        <main className="flex-1 transition-all duration-300">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
