"use client"

import { useNavigate } from "react-router-dom"
import { Clock } from "lucide-react"

export default function PendingApprovalPage() {
 const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
            <Clock className="w-8 h-8 text-accent" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl sm:text-4xl font-light tracking-tight mb-4 text-foreground">
          Application Under Review
        </h1>

        <p className="text-foreground/70 text-base sm:text-lg mb-8 leading-relaxed">
          Thank you for submitting your organisation details. Our team is reviewing your application and will notify you
          via email once approved.
        </p>

        {/* Timeline */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8 text-left">
          <h3 className="text-sm font-medium text-foreground mb-4">What Happens Next</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-accent">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Verification (24-48 hours)</p>
                <p className="text-xs text-foreground/60">We verify your organisation details</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-accent">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Approval</p>
                <p className="text-xs text-foreground/60">Account status updated after review</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-accent">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Launch Events</p>
                <p className="text-xs text-foreground/60">Create your first hackathon or workshop</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action */}
        <button
       onClick={() => navigate("/")}
          className="w-full py-3 bg-accent text-accent-foreground font-medium rounded-lg hover:shadow-lg hover:shadow-accent/50 transition-all duration-300"
        >
          Return to Home
        </button>

        <p className="text-xs text-foreground/50 mt-6">
          Check your email for updates. You'll receive a confirmation once your account is approved.
        </p>
      </div>
    </div>
  )
}
