import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/authContext'

export default function AuthCallback() {
  const [searchParams] = useSearchParams()
  const { setToken } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    const error = searchParams.get('error')

    if (error) {
      navigate('/?error=auth_failed')
      return
    }

    if (token) {
      setToken(token)
      navigate('/dashboard')
    } else {
      navigate('/')
    }
  }, [])

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#080b14'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 48, height: 48,
          border: '3px solid rgba(99,102,241,0.2)',
          borderTopColor: '#6366f1', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
        }} />
        <p style={{ color: '#f0f4ff', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Authenticating with GitHub...</p>
        <p style={{ color: '#8b9cc8', fontSize: 14 }}>Setting up your DevScope account</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
