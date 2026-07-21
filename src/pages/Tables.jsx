import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import PageHeading from '../components/PageHeading'

export default function Tables() {
  const { user } = useAuth()
  const [tables, setTables] = useState([])
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [nome, setNome] = useState('')
  const [capacidade, setCapacidade] = useState(8)

  async function loadData() {
    const [{ data: t }, { data: g }] = await Promise.all([
      supabase.from('seating_tables').select('*').eq('profile_id', user.id).order('created_at'),
      supabase.from('guests').select('id, nome, table_id').eq('profile_id', user.id),
    ])
    setTables(t ?? [])
    setGuests(g ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (user) loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function addTable(e) {
    e.preventDefault()
    if (!nome.trim()) return
    await supabase.from('seating_tables').insert({
      profile_id: user.id,
      nome: nome.trim(),
      capacidade: Number(capacidade) || 8,
    })
    setNome('')
    setCapacidade(8)
    loadData()
  }

  async function removeTable(id) {
    setTables((prev) => prev.filter((t) => t.id !== id))
    await supabase.from('seating_tables').delete().eq('id', id)
    loadData()
  }

  async function unassignGuest(guestId) {
    setGuests((prev) => prev.map((g) => (g.id === guestId ? { ...g, table_id: null } : g)))
    await supabase.from('guests').update({ table_id: null }).eq('id', guestId)
  }

  return (
    <div>
      <PageHeading
        eyebrow="Organização das mesas"
        title="Cada pessoa no seu lugar"
        description="Nada aqui é definitivo até o dia do casamento — mova convidados entre mesas quando quiser."
      />

      <form
        onSubmit={addTable}
        className="bg-white/70 rounded-2xl border border-rose-200/60 p-5 mb-8 flex flex-wrap gap-3 items-end"
      >
        <label className="flex-1 min-w-[160px]">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Nome da mesa</span>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Mesa 1, Mesa dos padrinhos..."
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <label className="w-32">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Capacidade</span>
          <input
            type="number"
            value={capacidade}
            onChange={(e) => setCapacidade(e.target.value)}
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <button
          type="submit"
          className="rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-body text-sm font-medium px-5 py-2.5 transition-all hover:scale-[1.03] active:scale-[0.97] hover:shadow-md hover:shadow-rose-300/40"
        >
          Criar mesa
        </button>
      </form>

      {loading ? (
        <p className="font-body text-espresso-400">Carregando...</p>
      ) : tables.length === 0 ? (
        <p className="font-body text-espresso-400 italic">
          Nenhuma mesa ainda. Crie a primeira acima — depois é só ir cadastrando os convidados nela na página de
          Convidados.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((t) => {
            const ocupantes = guests.filter((g) => g.table_id === t.id)
            const cheia = ocupantes.length >= t.capacidade
            return (
              <div key={t.id} className="bg-white/70 rounded-2xl border border-rose-200/60 p-5 card-hover">
                <div className="flex justify-between items-start mb-3">
                  <p className="font-display text-lg text-espresso-900">{t.nome}</p>
                  <button
                    onClick={() => removeTable(t.id)}
                    aria-label={`Remover ${t.nome}`}
                    className="text-espresso-300 hover:text-terracotta-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <p
                  className={`font-ledger text-xs mb-3 ${cheia ? 'text-terracotta-600' : 'text-espresso-400'}`}
                >
                  {ocupantes.length}/{t.capacidade} assentos ocupados
                </p>
                {ocupantes.length === 0 ? (
                  <p className="font-body text-xs text-espresso-300 italic">
                    Ninguém aqui ainda — atribua convidados na página de Convidados.
                  </p>
                ) : (
                  <ul className="space-y-1.5">
                    {ocupantes.map((g) => (
                      <li
                        key={g.id}
                        className="flex items-center justify-between bg-blush-100 rounded-lg px-3 py-1.5"
                      >
                        <span className="font-body text-sm text-espresso-700">{g.nome}</span>
                        <button
                          onClick={() => unassignGuest(g.id)}
                          aria-label={`Remover ${g.nome} da mesa`}
                          className="text-espresso-300 hover:text-terracotta-600 text-xs transition-colors"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
