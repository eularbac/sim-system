import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

const AuthContext = createContext(null)

// =========================================================
// MODO SEM LOGIN (temporário, enquanto o site está em construção)
// -----------------------------------------------------------------
// Em vez de mostrar uma tela de login, o app entra sozinho usando uma
// conta fixa definida em VITE_DEV_EMAIL / VITE_DEV_PASSWORD. Isso
// simplifica a edição/teste do site agora, mas significa que QUALQUER
// pessoa que abrir o site vai ver e editar os mesmos dados (a conta
// configurada aqui) — não há mais isolamento por noiva enquanto esse
// modo estiver ativo.
//
// PARA REATIVAR O LOGIN DE VERDADE MAIS TARDE:
// 1. Restaure as rotas "/entrar" e "/cadastro" em src/App.jsx (os
//    arquivos Login.jsx e Signup.jsx continuam em src/pages, intactos).
// 2. Troque o auto-login abaixo por um simples "aguarda sessão" (volte
//    para a versão anterior deste arquivo, disponível no histórico).
// 3. Remova VITE_DEV_EMAIL / VITE_DEV_PASSWORD do Netlify.
// =========================================================

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  async function loadProfile(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data ?? null)
  }

  useEffect(() => {
    async function init() {
      const {
        data: { session: existingSession },
      } = await supabase.auth.getSession()

      if (existingSession) {
        setSession(existingSession)
        await loadProfile(existingSession.user.id)
        setLoading(false)
        return
      }

      // Sem sessão ainda: tenta o login automático (modo sem tela de login)
      const devEmail = import.meta.env.VITE_DEV_EMAIL
      const devPassword = import.meta.env.VITE_DEV_PASSWORD

      if (!devEmail || !devPassword) {
        setAuthError(
          'Defina VITE_DEV_EMAIL e VITE_DEV_PASSWORD (no .env local e/ou nas Environment Variables do Netlify) para acessar o site sem tela de login.'
        )
        setLoading(false)
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: devEmail,
        password: devPassword,
      })

      if (error || !data.session) {
        setAuthError(
          'Não consegui entrar automaticamente com a conta configurada em VITE_DEV_EMAIL/VITE_DEV_PASSWORD. Confira se e-mail e senha estão corretos.'
        )
        setLoading(false)
        return
      }

      setSession(data.session)
      await loadProfile(data.session.user.id)
      setLoading(false)
    }

    init()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (newSession?.user) {
        loadProfile(newSession.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function refreshProfile() {
    if (session?.user) await loadProfile(session.user.id)
  }

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    authError,
    refreshProfile,
    signOut: () => supabase.auth.signOut(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
