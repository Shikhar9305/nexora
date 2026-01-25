"use client"

import { useSearchParams, useNavigate } from "react-router-dom"
import SignupForm from "@/components/auth/SignupForm"

export default function SignupPageContent() {
const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const role = searchParams.get("role") || "user"

  if (!["user", "organiser"].includes(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-light text-foreground mb-4">Invalid Role</h1>
          <button onClick={() => navigate("/")} className="text-accent hover:underline">
            Back to home
          </button>
        </div>
      </div>
    )
  }

  return <SignupForm role={role} />
}
