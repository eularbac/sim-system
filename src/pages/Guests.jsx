import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import PageHeading from '../components/PageHeading'

const RSVP_OPTIONS = ['Aguardando', 'Confirmado', 'Recusado']
const FAIXA_OPTIONS = ['Adulto', 'Criança']

export default function Guests() {
  const { user } = useAuth()
  const [guests, setGuests] = useState([])
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [nome, setNome] = useState('')
  const [proximidade, setProximidade] = useState('')
  const [faixa, setFaixa] = useState('Adulto')
  const [filter, setFilter] = useState('Todos')

  async function loadData() {
    const [{ data: g }, { data: t }] = await Promise.all([
      supabase.from('guests').select('*').eq('profile_id', user.id).order('created_at'),
      supabase.from('seating_tables').select('*').eq('profile_id', user.id).order('created_at'),
    ])
    setGuests(g ?? [])
    setTables(t ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (user) loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function addGuest(e) {
    e.preventDefault()
    if (!nome.trim()) return
    await supabase.from('guests').insert({
      profile_id: user.id,
      nome: nome.trim(),
      proximidade: proximidade.trim() || null,
      faixa_etaria: faixa,
    })
    setNome('')
    setProximidade('')
    loadData()
  }

  async function updateGuest(id, patch) {
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)))
    await supabase.from('guests').update(patch).eq('id', id)
  }

  async function removeGuest(id) {
    setGuests((prev) => prev.filter((g) => g.id !== id))
    await supabase.from('guests').delete().eq('id', id)
  }

  const visibleGuests = guests.filter((g) => {
    if (filter === 'Todos') return true
    if (filter === 'Adultos') return g.faixa_etaria === 'Adulto'
    if (filter === 'Crianças') return g.faixa_etaria === 'Criança'
    return g.rsvp === filter
  })

  const confirmados = guests.filter((g) => g.rsvp === 'Confirmado').length

  return (
    <div>
      <PageHeading
        eyebrow="Convidados"
        title="Quem vai celebrar com vocês"
        description="Comece pelo nome — o resto você refina com calma. Essa lista alimenta as mesas e o orçamento."
      />

      <div className="flex flex-wrap gap-4 mb-6">
        <span className="font-body text-sm text-espresso-500">
          <strong className="font-ledger text-espresso-900">{guests.length}</strong> convidados no total
        </span>
        <span className="font-body text-sm text-espresso-500">
          <strong className="font-ledger text-sage-600">{confirmados}</strong> confirmados
        </span>
      </div>

      <form
        onSubmit={addGuest}
        className="bg-white/70 rounded-2xl border border-rose-200/60 p-5 mb-6 flex flex-wrap gap-3 items-end"
      >
        <label className="flex-1 min-w-[160px]">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Nome</span>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do convidado"
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <label className="flex-1 min-w-[160px]">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Proximidade</span>
          <input
            value={proximidade}
            onChange={(e) => setProximidade(e.target.value)}
            placeholder="Ex: Madrinha, amigo..."
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <label className="w-36">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Faixa etária</span>
          <select
            value={faixa}
            onChange={(e) => setFaixa(e.target.value)}
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          >
            {FAIXA_OPTIONS.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-body text-sm font-medium px-5 py-2.5 transition-colors"
        >
          Adicionar
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mb-4">
        {['Todos', 'Adultos', 'Crianças', ...RSVP_OPTIONS].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full font-body text-xs transition-colors ${
              filter === f ? 'bg-rose-500 text-white' : 'bg-blush-100 text-espresso-500 hover:bg-blush-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="font-body text-espresso-400">Carregando...</p>
      ) : visibleGuests.length === 0 ? (
        <p className="font-body text-espresso-400 italic">
          Nenhum convidado por aqui ainda. Adicione o primeiro nome acima.
        </p>
      ) : (
        <div className="bg-white/70 rounded-2xl border border-rose-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="text-left text-espresso-300 text-xs uppercase tracking-wide border-b border-rose-200/60">
                  <th className="px-4 py-3 font-medium">Nome</th>
                  <th className="px-4 py-3 font-medium">Proximidade</th>
                  <th className="px-4 py-3 font-medium">RSVP</th>
                  <th className="px-4 py-3 font-medium">Mesa</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {visibleGuests.map((g) => (
                  <tr key={g.id} className="border-b border-rose-100 last:border-0">
                    <td className="px-4 py-2.5 text-espresso-900">
                      {g.nome}
                      <span className="ml-2 text-xs text-espresso-300">{g.faixa_etaria}</span>
                    </td>
                    <td className="px-4 py-2.5 text-espresso-500">{g.proximidade || '—'}</td>
                    <td className="px-4 py-2.5">
                      <select
                        value={g.rsvp}
                        onChange={(e) => updateGuest(g.id, { rsvp: e.target.value })}
                        className={`rounded-lg px-2 py-1 text-xs border-0 outline-none ${
                          g.rsvp === 'Confirmado'
                            ? 'bg-sage-400/20 text-sage-600'
                            : g.rsvp === 'Recusado'
                              ? 'bg-terracotta-500/20 text-terracotta-600'
                              : 'bg-blush-200 text-espresso-500'
                        }`}
                      >
                        {RSVP_OPTIONS.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2.5">
                      <select
                        value={g.table_id ?? ''}
                        onChange={(e) => updateGuest(g.id, { table_id: e.target.value || null })}
                        className="rounded-lg px-2 py-1 text-xs bg-blush-100 text-espresso-700 border-0 outline-none"
                      >
                        <option value="">Sem mesa</option>
                        {tables.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.nome}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => removeGuest(g.id)}
                        aria-label={`Remover ${g.nome}`}
                        className="text-espresso-300 hover:text-terracotta-600 transition-colors"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
