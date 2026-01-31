"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, Lock, User, CheckCircle } from "lucide-react"
import { apiFetch } from "@/utils/api"

export default function SignupForm({ role = "user" }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const isParticipant = role === "user"
  const isOrganiser = role === "organiser"

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }



const handleSubmit = async (e) => {
  e.preventDefault()
  if (!validateForm()) return

  setIsLoading(true)

  try {
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role,
    }

    const res = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, {
      method: "POST",
      body: JSON.stringify(payload),
    })

    // 🔑 store userId for onboarding
    localStorage.setItem("userId", res.userId)
    localStorage.setItem("role", res.role)

    if (role === "organiser") {
      navigate("/organiser/onboarding")
    } else {
      navigate("/user/onboarding") // later: user dashboard
    }
  } catch (err) {
    alert(err.message)
  } finally {
    setIsLoading(false)
  }
}


  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Left side - Brand (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center px-8 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-background pointer-events-none" />

        <div className="relative z-10 max-w-md text-center">
          <div className="mb-8">
            <div className="inline-block">
              <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center">
                  <span className="text-2xl font-light text-background">N</span>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-4xl lg:text-5xl font-light tracking-tight mb-4 text-balance">Nexora</h2>

          <p className="text-lg text-foreground/70 mb-6 leading-relaxed">
            Discover hackathons, workshops, and events across the globe
          </p>

          <div className="space-y-4 text-sm text-foreground/60">
            <div className="flex items-center gap-3">
              <div className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />
              <span>Global event discovery platform</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />
              <span>Connect with innovators worldwide</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />
              <span>Explore or host your next big event</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup Card */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Brand */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-light tracking-tight text-foreground mb-2">Nexora</h1>
            <p className="text-foreground/60 text-sm">Global events discovery</p>
          </div>

          {/* Role Badge */}
          <div className="mb-8">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${
                isParticipant
                  ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                  : "bg-purple-500/10 border-purple-500/30 text-purple-400"
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{isParticipant ? "Participant Account" : "Organiser Account"}</span>
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight mb-2 text-foreground">Create Account</h1>
            <p className="text-foreground/70 text-sm sm:text-base">
              {isParticipant
                ? "Discover and join global events, hackathons & workshops"
                : "Create and manage hackathons, workshops & events"}
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/80">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40 pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-3 bg-card border rounded-lg text-foreground placeholder:text-foreground/40 outline-none transition-all ${
                    errors.name
                      ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-border hover:border-border/80 focus:border-accent focus:ring-2 focus:ring-accent/20"
                  }`}
                />
              </div>
              {errors.name && <p className="text-xs text-red-500/80">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/80">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={`w-full pl-10 pr-4 py-3 bg-card border rounded-lg text-foreground placeholder:text-foreground/40 outline-none transition-all ${
                    errors.email
                      ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-border hover:border-border/80 focus:border-accent focus:ring-2 focus:ring-accent/20"
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500/80">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/80">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40 pointer-events-none" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-3 bg-card border rounded-lg text-foreground placeholder:text-foreground/40 outline-none transition-all ${
                    errors.password
                      ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-border hover:border-border/80 focus:border-accent focus:ring-2 focus:ring-accent/20"
                  }`}
                />
              </div>
              {errors.password && <p className="text-xs text-red-500/80">{errors.password}</p>}
            </div>

            {/* Hidden role field */}
            <input type="hidden" name="role" value={role} />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-accent text-accent-foreground font-medium rounded-lg hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-foreground/60 text-sm">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-accent hover:underline font-medium transition-colors"
              >
                Login here
              </button>
            </p>
          </div>

          {/* Divider */}
          <div className="mt-8 pt-8 border-t border-border/30 text-center text-xs text-foreground/50">
            <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    </div>
  )
}
