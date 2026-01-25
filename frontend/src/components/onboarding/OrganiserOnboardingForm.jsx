"use client"

import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { Building2, Globe, Mail, AlertCircle, CheckCircle } from "lucide-react"
import { apiFetch } from "@/utils/api"

export default function OnboardingPageContent() {
const navigate = useNavigate()

  const [formData, setFormData] = useState({
    organisationName: "",
    organisationType: "",
    contactEmail: "",
    website: "",
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

 

  const organisationTypes = [
    { value: "college", label: "College / University" },
    { value: "company", label: "Company" },
    { value: "community", label: "Community / Club" },
    { value: "startup", label: "Startup" },
    { value: "other", label: "Other" },
  ]

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

    if (!formData.organisationName.trim()) {
      newErrors.organisationName = "Organisation name is required"
    }

    if (!formData.organisationType) {
      newErrors.organisationType = "Organisation type is required"
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = "Invalid URL format"
    }

    if (formData.contactEmail && !isValidEmail(formData.contactEmail)) {
      newErrors.contactEmail = "Invalid email format"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isValidUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  if (!validateForm()) return

  setIsLoading(true)

  try {
    const userId = localStorage.getItem("userId")
    if (!userId) throw new Error("User not logged in")

    const payload = {
      userId,
      organisationName: formData.organisationName,
      organisationType: formData.organisationType,
      contactEmail: formData.contactEmail || undefined,
      website: formData.website || undefined,
    }

    await apiFetch("/api/organiser/onboarding", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    navigate("/organiser/pending-approval")
  } catch (err) {
    alert(err.message)
  } finally {
    setIsLoading(false)
  }
}


  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Left side - Branding (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-background pointer-events-none" />

        <div className="relative z-10 max-w-md text-center">
          <div className="mb-8">
            <div className="inline-block">
              <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-background" />
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-4xl lg:text-5xl font-light tracking-tight mb-4 text-balance">Nexora</h2>

          <p className="text-lg text-foreground/70 mb-6 leading-relaxed">
            Create and manage hackathons, workshops, and events worldwide
          </p>

          <div className="space-y-4 text-sm text-foreground/60">
            <div className="flex items-center gap-3">
              <div className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />
              <span>Reach thousands of participants</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />
              <span>Streamlined event management</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />
              <span>Verified organiser network</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Onboarding Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Brand */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-light tracking-tight text-foreground mb-2">Nexora</h1>
            <p className="text-foreground/60 text-sm">Organiser Dashboard</p>
          </div>

          {/* Role Badge */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-purple-500/10 border-purple-500/30 text-purple-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Organiser Account</span>
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight mb-2 text-foreground">
              Organisation Details
            </h1>
            <p className="text-foreground/70 text-sm sm:text-base">
              Tell us about the organisation you represent. This helps us verify and approve organiser accounts.
            </p>
          </div>

          {/* Onboarding Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Organisation Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/80">
                Organisation Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40 pointer-events-none" />
                <input
                  type="text"
                  name="organisationName"
                  value={formData.organisationName}
                  onChange={handleChange}
                  placeholder="e.g. ABC Engineering College"
                  className={`w-full pl-10 pr-4 py-3 bg-card border rounded-lg text-foreground placeholder:text-foreground/40 outline-none transition-all ${
                    errors.organisationName
                      ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-border hover:border-border/80 focus:border-accent focus:ring-2 focus:ring-accent/20"
                  }`}
                />
              </div>
              {errors.organisationName && (
                <div className="flex items-center gap-1 text-xs text-red-500/80">
                  <AlertCircle className="w-3 h-3" />
                  {errors.organisationName}
                </div>
              )}
            </div>

            {/* Organisation Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/80">
                Organisation Type
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                name="organisationType"
                value={formData.organisationType}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-card border rounded-lg text-foreground outline-none transition-all ${
                  errors.organisationType
                    ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-border hover:border-border/80 focus:border-accent focus:ring-2 focus:ring-accent/20"
                }`}
              >
                <option value="">Select organisation type</option>
                {organisationTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.organisationType && (
                <div className="flex items-center gap-1 text-xs text-red-500/80">
                  <AlertCircle className="w-3 h-3" />
                  {errors.organisationType}
                </div>
              )}
              <p className="text-xs text-foreground/50 mt-1">Help us understand your organisation better</p>
            </div>

            {/* Official Contact Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/80">Official Contact Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40 pointer-events-none" />
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="events@organisation.com"
                  className={`w-full pl-10 pr-4 py-3 bg-card border rounded-lg text-foreground placeholder:text-foreground/40 outline-none transition-all ${
                    errors.contactEmail
                      ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-border hover:border-border/80 focus:border-accent focus:ring-2 focus:ring-accent/20"
                  }`}
                />
              </div>
              {errors.contactEmail && (
                <div className="flex items-center gap-1 text-xs text-red-500/80">
                  <AlertCircle className="w-3 h-3" />
                  {errors.contactEmail}
                </div>
              )}
              <p className="text-xs text-foreground/50 mt-1">We'll use this for verification purposes</p>
            </div>

            {/* Organisation Website */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/80">Organisation Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40 pointer-events-none" />
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://…"
                  className={`w-full pl-10 pr-4 py-3 bg-card border rounded-lg text-foreground placeholder:text-foreground/40 outline-none transition-all ${
                    errors.website
                      ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-border hover:border-border/80 focus:border-accent focus:ring-2 focus:ring-accent/20"
                  }`}
                />
              </div>
              {errors.website && (
                <div className="flex items-center gap-1 text-xs text-red-500/80">
                  <AlertCircle className="w-3 h-3" />
                  {errors.website}
                </div>
              )}
              <p className="text-xs text-foreground/50 mt-1">Include https:// or http:// in your URL</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-accent text-accent-foreground font-medium rounded-lg hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              {isLoading ? "Submitting for Approval..." : "Submit for Approval"}
            </button>

            {/* Helper Text */}
            <p className="text-xs text-foreground/60 text-center">
              Your organiser account will be reviewed before you can create events.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
