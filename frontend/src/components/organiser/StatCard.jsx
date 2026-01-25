const colorMap = {
  cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400',
  blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400',
  purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400',
  amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400',
}

export default function StatCard({ icon: Icon, label, value, color = 'cyan' }) {
  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-lg p-6 backdrop-blur-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <Icon size={32} className={colorMap[color].split(' ')[3]} opacity={0.5} />
      </div>
    </div>
  )
}
