import { useState, useEffect } from 'react'
import { predictionAPI } from '../services/api'
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  Legend 
} from 'recharts'
import toast from 'react-hot-toast'

const COLORS = ['#10b981', '#f59e0b', '#ef4444']
const RISK_LEVELS = ['Low Risk', 'Moderate Risk', 'High Risk']

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await predictionAPI.stats()
      setStats(response.data.stats)
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="p-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 flex-1">
          <StatsCard 
            title="Total Predictions"
            value={stats?.totalPredictions || 0}
            icon="📊"
            gradient="from-blue-500 to-indigo-600"
          />
          <StatsCard 
            title="Risk Distribution"
            value={(stats?.riskDistribution?.reduce((sum, item) => sum + item.count, 0) || 0).toString()}
            icon="🎯"
            gradient="from-emerald-500 to-teal-600"
          />
          <StatsCard 
            title="Recent Activity"
            value={stats?.recent?.length || 0}
            icon="⚡"
            gradient="from-purple-500 to-pink-600"
          />
        </div>

        {/* Risk Distribution Chart */}
        <div className="lg:w-96 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-xl">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            Risk Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats?.riskDistribution || []}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="count"
                nameKey="name"
              >
                {stats?.riskDistribution?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent List */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Predictions</h3>
            <p className="text-sm text-slate-500 mt-1">Your last 5 predictions</p>
          </div>
          <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
            {stats?.recent?.map((prediction) => (
              <RecentPredictionItem key={prediction._id} prediction={prediction} />
            )) || (
              <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                No predictions yet. Make your first prediction!
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200/50 dark:border-emerald-800/50 rounded-3xl p-8">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-100 mb-2">Health Score</h4>
            <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400">85</div>
            <p className="text-emerald-700 dark:text-emerald-300">Excellent</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200/50 dark:border-blue-800/50 rounded-3xl p-8">
            <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Trend</h4>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">↓ 12%</div>
            <p className="text-blue-700 dark:text-blue-300">Risk decreasing</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatsCard({ title, value, icon, gradient }) {
  return (
    <div className="glass-card p-8 rounded-3xl hover:shadow-2xl transition-all group cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
          <span className="text-xl">{icon}</span>
        </div>
        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover:rotate-12 transition-transform">
          <span className="w-3 h-3 bg-emerald-500 rounded-full block animate-pulse"></span>
        </div>
      </div>
      <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{value}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm">{title}</p>
    </div>
  )
}

function RecentPredictionItem({ prediction }) {
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Low Risk': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'
      case 'Moderate Risk': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200'
      case 'High Risk': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
    }
  }

  return (
    <div className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-500">{new Date(prediction.createdAt).toLocaleDateString()}</span>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(prediction.riskLevel)}`}>
          {prediction.riskLevel}
        </span>
      </div>
      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{prediction.prediction}</h4>
      <p className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">
        {prediction.probability.toFixed(1)}%
      </p>
      <div className="flex items-center text-xs text-slate-500 space-x-4">
        <span>Glucose: {prediction.inputData.glucose}</span>
        <span>BMI: {prediction.inputData.bmi.toFixed(1)}</span>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card p-8 rounded-3xl animate-pulse">
            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-2xl mb-4"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl w-3/4 mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6 rounded-3xl animate-pulse h-96"></div>
        <div className="space-y-6">
          <div className="glass-card p-8 rounded-3xl h-48"></div>
          <div className="glass-card p-8 rounded-3xl h-48"></div>
        </div>
      </div>
    </div>
  )
}

