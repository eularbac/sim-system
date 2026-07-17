import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'

/**
 * Generic checklist backed by a Supabase table with columns:
 * id, profile_id, item (text), feito (boolean), created_at
 */
export default function SimpleChecklist({ table, placeholder = 'Adicionar item...' }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [novo, setNovo] = useState('')

  async function loadData() {
    const { data } = await supabase.from(table).select('*').eq('profile_id', user.id).order('created_at')
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (user) loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, table])

  async function addItem(e) {
    e.preventDefault()
    if (!novo.trim()) return
    await supabase.from(table).insert({ profile_id: user.id, item: novo.trim() })
    setNovo('')
    loadData()
  }

  async function toggle(id, feito) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, feito: !feito } : it)))
    await supabase.from(table).update({ feito: !feito }).eq('id', id)
  }

  async function remove(id) {
    setItems((prev) => prev.filter((it) => it.id !== id))
    await supabase.from(table).delete().eq('id', id)
  }

  const feitos = items.filter((i) => i.feito).length
  const progresso = items.length ? Math.round((feitos / items.length) * 100) : 0

  return (
    <div>
      {items.length > 0 && (
        <div className="bg-white/70 rounded-2xl border border-rose-200/60 p-5 mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="font-body text-sm text-espresso-500">Progresso</p>
            <p className="font-ledger text-sm text-rose-600">{progresso}%</p>
          </div>
          <div className="h-2 bg-blush-200 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500 rounded-full transition-all" style={{ width: `${progresso}%` }} />
          </div>
        </div>
      )}

      <form
        onSubmit={addItem}
        className="bg-white/70 rounded-2xl border border-rose-200/60 p-5 mb-6 flex flex-wrap gap-3 items-end"
      >
        <label className="flex-1 min-w-[200px]">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Item</span>
          <input
            value={novo}
            onChange={(e) => setNovo(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <button
          type="submit"
          className="rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-body text-sm font-medium px-5 py-2.5 transition-colors"
        >
          Adicionar
        </button>
      </form>

      {loading ? (
        <p className="font-body text-espresso-400">Carregando...</p>
      ) : items.length === 0 ? (
        <p className="font-body text-espresso-400 italic">Nenhum item ainda. Adicione o primeiro acima.</p>
      ) : (
        <div className="space-y-2">
          {items.map((it) => (
            <div
              key={it.id}
              className="bg-white/70 rounded-xl border border-rose-200/60 px-4 py-3 flex items-center gap-3"
            >
              <button
                onClick={() => toggle(it.id, it.feito)}
                aria-label={it.feito ? 'Marcar como não feito' : 'Marcar como feito'}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  it.feito ? 'bg-sage-500 border-sage-500 text-white' : 'border-rose-300'
                }`}
              >
                {it.feito && '✓'}
              </button>
              <p
                className={`flex-1 min-w-0 font-body text-sm ${
                  it.feito ? 'text-espresso-300 line-through' : 'text-espresso-900'
                }`}
              >
                {it.item}
              </p>
              <button
                onClick={() => remove(it.id)}
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
