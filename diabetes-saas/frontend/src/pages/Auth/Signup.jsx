import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { authAPI } from '../services/api'
import { Eye, EyeOff } from 'lucide-react'

export default function Signup({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    try {
      const response = await authAPI.signup(data)
      if (response.data.success) {
        onLogin(response.data.token, response.data.user)
        toast.success('Account created successfully!')
        navigate('/dashboard')
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Signup failed')
    }
  }

  return (
    <div className="max-w-md w-full space-y-8 p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-slate-700/50">
      <div>
        <div className="mx-auto h-20 w-20 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mb-6">
          <span className="text-2xl font-bold text-white">DC</span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-slate-900 dark:text-white">
          Create account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          Get started with a free account
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Full Name
          </label>
          <input
            {...register('name', { required: 'Name is required', maxLength: {
              value: 50,
              message: 'Name cannot exceed 50 characters'
            } })}
            type="text"
            className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
              errors.name ? 'ring-2 ring-red-500' : ''
            }`}
            placeholder="Enter your full name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Email address
          </label>
          <input
            {...register('email', { required: 'Email is required', pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email address'
            } })}
            type="email"
            className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
              errors.email ? 'ring-2 ring-red-500' : ''
            }`}
            placeholder="Enter your email"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              {...register('password', { required: 'Password is required', minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              } })}
              type={showPassword ? 'text' : 'password'}
              className={`w-full px-4 py-3 pr-12 border border-slate-200 dark:border-slate-700 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                errors.password ? 'ring-2 ring-red-500' : ''
              }`}
              placeholder="Create a password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full gradient-btn text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <span>Create account</span>
          )}
        </button>
      </form>

      <div className="text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )
}

