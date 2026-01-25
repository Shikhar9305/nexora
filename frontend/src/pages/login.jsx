import { Suspense } from "react"
import LoginPageContent from "@/components/auth/LoginPageContent"

function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-foreground/60">Loading login...</p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <LoginPageContent />
}

