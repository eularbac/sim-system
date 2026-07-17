import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function RequireAuth({ children }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blush-50">
        <p className="font-display italic text-rose-600 text-lg">carregando...</p>
      </div>
    )
  }

  if (!session) return <Navigate to="/entrar" replace />

  return children
}
