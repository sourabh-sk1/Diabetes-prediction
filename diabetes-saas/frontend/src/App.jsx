import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useLocalStorage } from './hooks/useLocalStorage'

import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import Dashboard from './pages/Dashboard'
import Prediction from './pages/Prediction'
import History from './pages/History'
import Profile from './pages/Profile'
import toast from 'react-hot-toast'
import api from './services/api'

function AppContent() {
  const [user, setUser] = useLocalStorage('user', null)
  const [token, setToken] = useLocalStorage('token', null)
  const [theme, setTheme] = useState('light')
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    // Check if token is valid
    if (token) {
      api.get('/predictions/stats')
        .then(response => {
          setUser(response.data.user || user)
          setLoading(false)
        })
        .catch(() => {
          setToken(null)
          setUser(null)
          toast.error('Session expired. Please login again.')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const handleLogin = (newToken, newUser) => {
    setToken(newToken)
    setUser(newUser)
  }

  const handleLogout = () => {
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <Toaster position="top-right" />
          
          {!user ? (
            <div className="min-h-screen flex items-center justify-center p-8">
              <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
                <Route path="*" element={<Navigate to="/login" replace state={{ from: location }} />} />
              </Routes>
            </div>
          ) : (
            <div className="flex h-screen">
              {/* Sidebar */}
              <Sidebar user={user} />
              
              <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
                {/* Header */}
                <Header user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
                
                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white/50 dark:bg-slate-900/50 backdrop-blur">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/predict" element={<Prediction />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </main>
              </div>
            </div>
          )}
        </div>
      </Router>
    </div>
  )
}

function App() {
  return <AppContent />
}

export default App

