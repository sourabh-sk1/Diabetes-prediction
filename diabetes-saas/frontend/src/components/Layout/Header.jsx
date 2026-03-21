import { Bell, Search, UserCircle, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Header({ user, onLogout, theme, toggleTheme }) {
  const handleLogout = () => {
    onLogout()
  }

  return (
    <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Search + Actions */}
          <div className="flex items-center space-x-4">
            <div className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Search className="w-5 h-5" />
            </div>
            
            <div className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">3</span>
            </div>
          </div>

          {/* Right: Theme + Profile */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {/* Profile dropdown */}
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              {!group.collapsed && (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

