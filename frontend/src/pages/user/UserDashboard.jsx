'use client';

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Bookmark, Calendar, Sparkles, Home, LogOut } from "lucide-react"
import DashboardSummary from "../../components/user/DashboardSummary"
import DashboardTabs from "../../components/user/DashboardTabs"



export default function UserDashboard() {
const navigate = useNavigate()
const [activeTab, setActiveTab] = useState("saved")
const [savedEvents, setSavedEvents] = useState([])
const [registeredEvents, setRegisteredEvents] = useState([])
const [recommendedEvents] = useState([]) // optional later


 const summaryData = {
  savedCount: savedEvents.length,
  registeredCount: registeredEvents.length,
  topInterest: "hackathon",
}

useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) return

      const res = await fetch(`/api/user-profile/dashboard/${userId}`)
      const data = await res.json()

      setSavedEvents(data.savedEvents || [])
      setRegisteredEvents(data.registeredEvents || [])
    } catch (err) {
      console.error("Failed to load dashboard", err)
    }
  }

  fetchDashboard()
}, [])



  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-lg font-bold text-foreground">Nexora</span>
          </div>

          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate("/explore")}
              className="text-muted-foreground hover:text-foreground transition"
            >
              Explore
            </button>
            <button className="text-accent font-semibold">Dashboard</button>
            <button
              onClick={() => navigate("/profile")}
              className="text-muted-foreground hover:text-foreground transition"
            >
              Profile
            </button>
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-lg hover:bg-muted transition"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Your Dashboard</h1>
            <p className="text-muted-foreground">Track your saved events, registrations, and recommendations</p>
          </div>

          {/* Summary Cards */}
          <DashboardSummary data={summaryData} />

          {/* Tabs Content */}
        <DashboardTabs
  activeTab={activeTab}
  onTabChange={setActiveTab}
  savedEvents={savedEvents}
  registeredEvents={registeredEvents}
  recommendedEvents={recommendedEvents}
/>

        </div>
      </main>
    </div>
  )
}
