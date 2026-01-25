export default function EventCard({ event }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition group">
      <div className={`h-32 ${event.banner}`}></div>
      <div className="p-6">
        <h3 className="text-white font-bold text-lg group-hover:text-cyan-400 transition">{event.title}</h3>
      </div>
    </div>
  )
}
