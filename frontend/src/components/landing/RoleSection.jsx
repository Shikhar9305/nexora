import { useNavigate } from "react-router-dom"
import { Users, Briefcase, ArrowRight } from "lucide-react"

export default function RoleSection() {
  const navigate = useNavigate()

  const roles = [
    {
      icon: Users,
      title: "For Participants",
      features: [
        "Discover events worldwide",
        "Save and track opportunities",
        "Connect with like-minded innovators",
        "Showcase your skills",
      ],
      action: "Explore Events",
      onClick: () => navigate("/signup?role=user"),
    },
    {
      icon: Briefcase,
      title: "For Organisers",
      features: [
        "Create and manage events",
        "Reach targeted audiences",
        "Track registrations and analytics",
        "Grow your community",
      ],
      action: "Organise an Event",
      onClick: () => navigate("/signup?role=organiser"),
    },
  ]

  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mb-4 text-balance">
            Two Powerful Roles
          </h2>
          <p className="text-foreground/60 text-base sm:text-lg max-w-2xl mx-auto text-balance">
            Whether discovering or hosting, Nexora has you covered
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {roles.map((role, index) => {
            const Icon = role.icon
            return (
              <div
                key={index}
                className="p-8 sm:p-10 rounded-2xl border border-border/50 hover:border-accent/30 transition-all duration-300 glow-border hover:glow-border bg-card/50 backdrop-blur"
              >
                <div className="mb-6">
                  <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-accent" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-medium mb-6 text-foreground">
                  {role.title}
                </h3>

                <ul className="space-y-4 mb-8">
                  {role.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span className="text-foreground/80 text-sm sm:text-base">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={role.onClick}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-accent/10 border border-accent/30 text-accent font-medium rounded-lg hover:bg-accent/20 hover:border-accent/50 transition-all duration-300"
                >
                  {role.action}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
