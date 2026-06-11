import { createContext, useContext, useState, useEffect } from 'react'
import { api } from './api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('devscope_token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/api/user/profile')
      setUser(data)
    } catch {
      localStorage.removeItem('devscope_token')
      delete api.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || ''}`
  }

  const logout = async () => {
    try { await api.post('/auth/logout') } catch {}
    localStorage.removeItem('devscope_token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  const setToken = (token) => {
    localStorage.setItem('devscope_token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    fetchProfile()
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setToken, refetch: fetchProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
