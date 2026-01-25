import { useNavigate } from "react-router-dom"
import CesiumHero from "./CesiumHero"

export default function HeroSection() {
  const navigate = useNavigate()

  const handleExplore = () => {
    navigate("/signup?role=user")
  }

  const handleOrganise = () => {
    navigate("/signup?role=organiser")
  }

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <CesiumHero />

      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pointer-events-none">
        <div className="text-center max-w-3xl mx-auto pointer-events-auto">
          {/* Subtitle */}
          <div className="mb-6 inline-block">
            <span className="text-sm sm:text-base font-light tracking-widest uppercase text-accent/80 border border-accent/20 px-4 py-2 rounded-full">
              Global Discovery Platform
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light tracking-tight mb-6 fade-in-up text-balance">
            Discover Hackathons & Events Across the Globe
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-foreground/70 mb-12 max-w-2xl mx-auto text-balance">
            Explore opportunities, workshops, and innovation — visualised on a 3D Earth. Connect with global
            opportunities and showcase your ideas.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleExplore}
              className="px-8 py-3 sm:py-4 bg-accent text-accent-foreground font-medium rounded-full hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 glow-button pointer-events-auto"
            >
              Explore Events
            </button>

            <button
              onClick={handleOrganise}
              className="px-8 py-3 sm:py-4 bg-transparent border border-accent/50 text-accent font-medium rounded-full hover:bg-accent/10 hover:border-accent transition-all duration-300 pointer-events-auto"
            >
              Organise an Event
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
