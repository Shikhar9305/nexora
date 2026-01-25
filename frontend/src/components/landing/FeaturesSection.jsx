

import { Globe2, Users, Zap, Rocket } from "lucide-react"

const features = [
  {
    icon: Globe2,
    title: "3D Globe-Based Discovery",
    description: "Visualize events and hackathons on an interactive 3D Earth. See opportunities worldwide at a glance.",
  },
  {
    icon: Zap,
    title: "Hackathons, Events & Workshops",
    description: "Access a curated collection of tech hackathons, professional workshops, and networking events.",
  },
  {
    icon: Users,
    title: "For Participants & Organisers",
    description: "Whether exploring or hosting, Nexora supports both event discoverers and creators equally.",
  },
  {
    icon: Rocket,
    title: "Modern, Real-Time Platform",
    description: "Built with cutting-edge technology for seamless exploration and event management.",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mb-4 text-balance">
            Why Choose Nexora
          </h2>
          <p className="text-foreground/60 text-base sm:text-lg max-w-2xl mx-auto text-balance">
            Experience the future of event discovery with our innovative platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group p-6 sm:p-8 rounded-xl bg-card border border-border/50 hover:border-accent/30 transition-all duration-300 glow-border hover:glow-border"
              >
                <div className="mb-4">
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-accent" />
                </div>
                <h3 className="text-lg sm:text-xl font-medium mb-3 text-foreground">{feature.title}</h3>
                <p className="text-foreground/60 text-sm sm:text-base leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
