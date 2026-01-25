export default function OnboardingPageLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="space-y-6">
          <div className="h-8 bg-card rounded animate-pulse" />
          <div className="h-4 bg-card rounded w-3/4 animate-pulse" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-card rounded animate-pulse" />
            ))}
          </div>
          <div className="h-12 bg-accent/20 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
