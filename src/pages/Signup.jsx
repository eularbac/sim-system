import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Ribbon from '../components/Ribbon'

export default function Signup() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome_noiva: nome } },
    })
    setLoading(false)
    if (error) {
      setError('Não foi possível criar sua conta. ' + error.message)
      return
    }
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-blush-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="font-display italic text-3xl text-rose-700">Sistema Sim</p>
          <Ribbon width={72} />
          <p className="font-body text-espresso-500 mt-4 text-sm">
            Crie sua conta e comece a organizar com leveza.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/70 rounded-2xl border border-rose-200/60 p-7 shadow-sm">
          <label className="block mb-4">
            <span className="font-body text-sm text-espresso-700 mb-1 block">Seu nome</span>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-xl border border-rose-200 bg-white px-4 py-2.5 font-body text-espresso-900 focus:border-rose-400 outline-none"
              placeholder="Como você quer ser chamada"
            />
          </label>

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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-rose-200 bg-white px-4 py-2.5 font-body text-espresso-900 focus:border-rose-400 outline-none"
              placeholder="mínimo 6 caracteres"
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
            className="w-full mt-5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white font-body font-medium py-2.5 transition-colors"
          >
            {loading ? 'Criando conta...' : 'Criar minha conta'}
          </button>
        </form>

        <p className="font-body text-sm text-espresso-500 text-center mt-6">
          Já tem conta?{' '}
          <Link to="/entrar" className="text-rose-600 font-medium hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
