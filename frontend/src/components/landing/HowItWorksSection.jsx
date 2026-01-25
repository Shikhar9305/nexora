

const steps = [
  {
    number: "1",
    title: "Sign Up",
    description: "Create your account as a participant or organiser in seconds.",
  },
  {
    number: "2",
    title: "Explore or Organise",
    description: "Browse global events or create your own hackathon or workshop.",
  },
  {
    number: "3",
    title: "Participate or Host",
    description: "Join amazing opportunities or manage your events effortlessly.",
  },
]

export default function HowItWorksSection() {
  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mb-4 text-balance">How It Works</h2>
          <p className="text-foreground/60 text-base sm:text-lg max-w-2xl mx-auto text-balance">
            Three simple steps to unlock a world of opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step indicator */}
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 border border-accent/40">
                    <span className="text-lg font-light text-accent">{step.number}</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl sm:text-2xl font-medium mb-2 text-foreground">{step.title}</h3>
                  <p className="text-foreground/60 text-sm sm:text-base leading-relaxed">{step.description}</p>
                </div>
              </div>

              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-6 w-0.5 h-24 lg:h-32 bg-gradient-to-b from-accent/30 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
