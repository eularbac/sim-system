import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Ribbon from '../components/Ribbon'
import BouquetArt from '../components/BouquetArt'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError('E-mail ou senha incorretos. Confira e tente novamente.')
      return
    }
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-blush-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="text-center mb-6">
          <BouquetArt width={100} className="mx-auto animate-float" />
        </div>
        <div className="text-center mb-10">
          <p className="font-display italic text-3xl text-rose-700">Sistema Sim</p>
          <Ribbon width={72} />
          <p className="font-body text-espresso-500 mt-4 text-sm">
            Entre para continuar organizando o seu grande dia.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/70 rounded-2xl border border-rose-200/60 p-7 shadow-sm">
          <label className="block mb-4">
            <span className="font-body text-sm text-espresso-700 mb-1 block">E-mail</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-rose-200 bg-white px-4 py-2.5 font-body text-espresso-900 focus:border-rose-400 outline-none"
              placeholder="voce@email.com"
            />
          </label>

          <label className="block mb-2">
            <span className="font-body text-sm text-espresso-700 mb-1 block">Senha</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-rose-200 bg-white px-4 py-2.5 font-body text-espresso-900 focus:border-rose-400 outline-none"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p className="font-body text-sm text-terracotta-600 mt-3" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white font-body font-medium py-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-md hover:shadow-rose-300/40"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="font-body text-sm text-espresso-500 text-center mt-6">
          Ainda não tem conta?{' '}
          <Link to="/cadastro" className="text-rose-600 font-medium hover:underline">
            Criar minha conta
          </Link>
        </p>
      </div>
    </div>
  )
}
