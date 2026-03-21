import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Activity, 
  History, 
  User, 
  Settings,
  LogOut,
  Sun,
  Moon
} from 'lucide-react'

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/predict', icon: Activity, label: 'New Prediction' },
  { path: '/history', icon: History, label: 'History' },
  { path: '/profile', icon: User, label: 'Profile' },
]

export default function Sidebar({ user }) {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <div className={`bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 h-screen flex flex-col ${collapsed ? 'w-20' : 'w-64'} lg:w-64`}>
      {/* Logo */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <Link to="/dashboard" className={`flex items-center space-x-3 ${collapsed ? 'justify-center space-x-0' : ''}`}>
          <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">D</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-xl text-slate-900 dark:text-white">DiabetesCare</span>
              <span className="text-xs text-slate-500">AI Health Platform</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center space-x-3 p-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg shadow-primary-500/25'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900'
              } ${collapsed ? 'justify-center space-x-0 p-3' : ''}`}
            >
              <Icon className={`w-5 h-5 ${collapsed ? 'mx-auto' : ''}`} />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 space-y-3">
        <div className={`flex items-center space-x-3 p-3 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 transition-all cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 ${collapsed ? 'justify-center space-x-0 p-3' : ''}`} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? (
            <span className="w-5 h-5 text-slate-500">→</span>
          ) : (
            <>
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl flex items-center justify-center text-white text-sm font-bold">AI</div>
              <span className="text-sm text-slate-600 dark:text-slate-400">AI Powered</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

