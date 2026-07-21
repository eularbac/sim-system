import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import PageHeading from '../components/PageHeading'

const PAPEIS = ['Madrinha', 'Padrinho', 'Dama', 'Pajem']

export default function WeddingParty() {
  const { user } = useAuth()
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)
  const [nome, setNome] = useState('')
  const [papel, setPapel] = useState(PAPEIS[0])

  async function loadData() {
    const { data } = await supabase.from('wedding_party').select('*').eq('profile_id', user.id).order('created_at')
    setPeople(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (user) loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function addPerson(e) {
    e.preventDefault()
    if (!nome.trim()) return
    await supabase.from('wedding_party').insert({ profile_id: user.id, nome: nome.trim(), papel })
    setNome('')
    loadData()
  }

  async function updatePerson(id, patch) {
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
    await supabase.from('wedding_party').update(patch).eq('id', id)
  }

  async function removePerson(id) {
    setPeople((prev) => prev.filter((p) => p.id !== id))
    await supabase.from('wedding_party').delete().eq('id', id)
  }

  return (
    <div>
      <PageHeading
        eyebrow="Padrinhos e Madrinhas"
        title="Quem caminha ao seu lado"
        description="Madrinhas, padrinhos, damas e pajens — acompanhe quem já definiu o traje."
      />

      <form
        onSubmit={addPerson}
        className="bg-white/70 rounded-2xl border border-rose-200/60 p-5 mb-6 flex flex-wrap gap-3 items-end"
      >
        <label className="flex-1 min-w-[180px]">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Nome</span>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <label className="w-40">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Papel</span>
          <select
            value={papel}
            onChange={(e) => setPapel(e.target.value)}
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          >
            {PAPEIS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-body text-sm font-medium px-5 py-2.5 transition-all hover:scale-[1.03] active:scale-[0.97] hover:shadow-md hover:shadow-rose-300/40"
        >
          Adicionar
        </button>
      </form>

      {loading ? (
        <p className="font-body text-espresso-400">Carregando...</p>
      ) : people.length === 0 ? (
        <p className="font-body text-espresso-400 italic">Ninguém adicionado ainda.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {people.map((p) => (
            <div key={p.id} className="bg-white/70 rounded-xl border border-rose-200/60 p-4 flex items-center gap-3 card-hover">
              <button
                onClick={() => updatePerson(p.id, { traje_definido: !p.traje_definido })}
                aria-label={p.traje_definido ? 'Traje definido' : 'Marcar traje como definido'}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-150 hover:scale-110 active:scale-90 ${
                  p.traje_definido ? 'bg-sage-500 border-sage-500 text-white' : 'border-rose-300'
                }`}
              >
                {p.traje_definido && '✓'}
              </button>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-espresso-900">{p.nome}</p>
                <p className="font-body text-[11px] uppercase tracking-wide text-rose-500">{p.papel}</p>
              </div>
              <button
                onClick={() => removePerson(p.id)}
                aria-label={`Remover ${p.nome}`}
                className="text-espresso-300 hover:text-terracotta-600 transition-colors shrink-0"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      {people.length > 0 && (
        <p className="font-body text-xs text-espresso-400 mt-3">
          {people.filter((p) => p.traje_definido).length}/{people.length} com traje já definido
        </p>
      )}
    </div>
  )
}
