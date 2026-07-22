import { useAuth } from '../lib/AuthContext'

export default function RequireAuth({ children }) {
  const { session, loading, authError } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blush-50">
        <p className="font-display italic text-rose-600 text-lg">carregando...</p>
      </div>
    )
  }

  if (authError || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blush-50 px-6">
        <div className="max-w-md text-center bg-white/70 rounded-2xl border border-rose-200/60 p-8">
          <p className="font-display text-xl text-rose-700 mb-3">Configuração pendente</p>
          <p className="font-body text-sm text-espresso-500 leading-relaxed">
            {authError ||
              'Não foi possível entrar automaticamente. Confira as variáveis VITE_DEV_EMAIL e VITE_DEV_PASSWORD.'}
          </p>
        </div>
      </div>
    )
  }

  return children
}
