import { Bookmark, Calendar, Sparkles } from "lucide-react"

export default function DashboardSummary({ data }) {
  const summaryCards = [
    {
      icon: Bookmark,
      label: "Saved Events",
      value: data.savedCount,
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Calendar,
      label: "Registered Events",
      value: data.registeredCount,
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Sparkles,
      label: "Top Interest",
      value: data.topInterest.charAt(0).toUpperCase() + data.topInterest.slice(1),
      color: "from-amber-500 to-orange-500"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {summaryCards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div
            key={idx}
            className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`bg-gradient-to-br ${card.color} p-3 rounded-lg`}>
                <Icon size={24} className="text-white" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-1">{card.label}</p>
            <p className="text-3xl font-bold text-foreground">{card.value}</p>
          </div>
        )
      })}
    </div>
  )
}
