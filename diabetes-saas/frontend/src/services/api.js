import axios from 'axios'
import { useLocalStorage } from '../hooks/useLocalStorage'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const [, setToken] = useLocalStorage('token', null)
    const token = localStorage.getItem('token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const [, setToken] = useLocalStorage('token', null)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data)
}

export const predictionAPI = {
  create: (data) => api.post('/predictions', data),
  list: (params) => api.get('/predictions', { params }),
  stats: () => api.get('/predictions/stats'),
  delete: (id) => api.delete(`/predictions/${id}`)
}

export default api

