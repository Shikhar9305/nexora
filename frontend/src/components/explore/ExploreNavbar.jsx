"use client"
import { useNavigate } from "react-router-dom"

export default function ExploreNavbar() {
  const navigate = useNavigate()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="text-lg font-bold text-foreground">Nexora</span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <button className="text-accent font-semibold hover:opacity-80 transition">Explore</button>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-muted-foreground hover:text-foreground transition"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="text-muted-foreground hover:text-foreground transition"
          >
            Profile
          </button>
        </div>
      </div>
    </nav>
  )
}
