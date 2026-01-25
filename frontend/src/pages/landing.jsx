import HeroSection from "@/components/landing/HeroSection"
import FeaturesSection from "@/components/landing/FeaturesSection"
import HowItWorksSection from "@/components/landing/HowItWorksSection"
import RoleSection from "@/components/landing/RoleSection"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <RoleSection />
    </main>
  )
}
