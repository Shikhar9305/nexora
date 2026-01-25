'use client';

import SavedEventsTab from "./SavedEventsTab"
import RegisteredEventsTab from "./RegisteredEventsTab"
import RecommendationsTab from "./RecommendationsTab"

export default function DashboardTabs({
  activeTab,
  onTabChange,
  savedEvents,
  registeredEvents,
  recommendedEvents
}) {
  const tabs = [
    { id: "saved", label: "Saved Events", count: savedEvents.length },
    { id: "registered", label: "Registered Events", count: registeredEvents.length },
    { id: "recommended", label: "Recommended", count: recommendedEvents.length }
  ]

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-border flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? "border-accent text-accent bg-muted/30"
                : "border-transparent text-muted-foreground hover:text-foreground bg-transparent"
            }`}
          >
            {tab.label}
            <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 min-h-96">
        {activeTab === "saved" && <SavedEventsTab events={savedEvents} />}
        {activeTab === "registered" && <RegisteredEventsTab events={registeredEvents} />}
        {activeTab === "recommended" && <RecommendationsTab events={recommendedEvents} />}
      </div>
    </div>
  )
}
