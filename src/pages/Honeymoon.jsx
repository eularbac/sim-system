import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import PageHeading from '../components/PageHeading'
import SimpleChecklist from '../components/SimpleChecklist'

function Itinerary() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [dia, setDia] = useState('')
  const [atividade, setAtividade] = useState('')
  const [local, setLocal] = useState('')

  async function loadData() {
    const { data } = await supabase
      .from('honeymoon_itinerary')
      .select('*')
      .eq('profile_id', user.id)
      .order('dia')
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (user) loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function addItem(e) {
    e.preventDefault()
    if (!atividade.trim()) return
    await supabase.from('honeymoon_itinerary').insert({
      profile_id: user.id,
      dia: dia ? Number(dia) : null,
      atividade: atividade.trim(),
      local: local.trim() || null,
    })
    setDia('')
    setAtividade('')
    setLocal('')
    loadData()
  }

  async function removeItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id))
    await supabase.from('honeymoon_itinerary').delete().eq('id', id)
  }

  return (
    <div>
      <form
        onSubmit={addItem}
        className="bg-white/70 rounded-2xl border border-rose-200/60 p-5 mb-6 flex flex-wrap gap-3 items-end"
      >
        <label className="w-20">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Dia</span>
          <input
            type="number"
            min="1"
            value={dia}
            onChange={(e) => setDia(e.target.value)}
            placeholder="1"
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-ledger text-sm outline-none focus:border-rose-400"
          />
        </label>
        <label className="flex-1 min-w-[180px]">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Atividade</span>
          <input
            value={atividade}
            onChange={(e) => setAtividade(e.target.value)}
            placeholder="Ex: Passeio de barco"
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <label className="flex-1 min-w-[160px]">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Local</span>
          <input
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
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
      ) : items.length === 0 ? (
        <p className="font-body text-espresso-400 italic">Nenhuma atividade no roteiro ainda.</p>
      ) : (
        <div className="space-y-2">
          {items.map((i) => (
            <div
              key={i.id}
              className="bg-white/70 rounded-xl border border-rose-200/60 px-4 py-3 flex items-center gap-4"
            >
              <span className="font-ledger text-sm text-rose-600 w-16 shrink-0">
                {i.dia ? `Dia ${i.dia}` : '—'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-espresso-900">{i.atividade}</p>
                {i.local && <p className="font-body text-xs text-espresso-400">{i.local}</p>}
              </div>
              <button
                onClick={() => removeItem(i.id)}
                aria-label="Remover"
                className="text-espresso-300 hover:text-terracotta-600 transition-colors shrink-0"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Honeymoon() {
  const [tab, setTab] = useState('roteiro')

  return (
    <div>
      <PageHeading
        eyebrow="Lua de mel"
        title="O primeiro capítulo a dois"
        description="Depois da festa, vem o descanso — planeje com a mesma leveza."
      />

      <div className="flex gap-2 mb-6">
        {[
          { key: 'roteiro', label: 'Roteiro' },
          { key: 'checklist', label: 'Checklist pré-viagem' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full font-body text-sm transition-colors ${
              tab === t.key ? 'bg-rose-500 text-white' : 'bg-blush-100 text-espresso-500 hover:bg-blush-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'roteiro' ? (
        <Itinerary />
      ) : (
        <SimpleChecklist table="honeymoon_checklist" placeholder="Ex: Passaporte, câmbio, seguro viagem..." />
      )}
    </div>
  )
}
