import { Calendar, Users, Zap, TrendingUp } from 'lucide-react'
import StatCard from '../../components/organiser/StatCard'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const chartData = [
  { name: 'Approved', value: 8, fill: '#06b6d4' },
  { name: 'Pending', value: 2, fill: '#f59e0b' },
  { name: 'Rejected', value: 1, fill: '#ef4444' },
]

const eventActivityData = [
  { month: 'Jan', events: 2, participants: 45 },
  { month: 'Feb', events: 3, participants: 78 },
  { month: 'Mar', events: 5, participants: 156 },
  { month: 'Apr', events: 4, participants: 132 },
  { month: 'May', events: 6, participants: 234 },
  { month: 'Jun', events: 8, participants: 312 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Welcome back, Tech Innovations</h1>
        <p className="text-slate-400 mt-2">Here's your event management overview</p>
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">Organisation Approved</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Calendar}
          label="Total Events"
          value="11"
          color="cyan"
        />
        <StatCard
          icon={TrendingUp}
          label="Upcoming Events"
          value="3"
          color="blue"
        />
        <StatCard
          icon={Users}
          label="Total Participants"
          value="1,234"
          color="purple"
        />
        <StatCard
          icon={Zap}
          label="Live Events"
          value="2"
          color="amber"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Status Distribution */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Event Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value})`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Event Activity Over Time */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Event Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
              <Legend />
              <Bar dataKey="events" stackId="a" fill="#06b6d4" />
              <Bar dataKey="participants" stackId="b" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition font-medium">
            Create New Event
          </button>
          <button className="px-6 py-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/20 transition font-medium">
            View Analytics
          </button>
          <button className="px-6 py-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/20 transition font-medium">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  )
}
