import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import PageHeading from '../components/PageHeading'

const STATUS_OPTIONS = ['Ideia', 'Encomendado', 'Comprado', 'Alugado']

function currency(n) {
  return (Number(n) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function Attire() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [item, setItem] = useState('')
  const [categoria, setCategoria] = useState('')
  const [paraQuem, setParaQuem] = useState('')
  const [preco, setPreco] = useState('')

  async function loadData() {
    const { data } = await supabase.from('attire').select('*').eq('profile_id', user.id).order('created_at')
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (user) loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function addItem(e) {
    e.preventDefault()
    if (!item.trim()) return
    await supabase.from('attire').insert({
      profile_id: user.id,
      item: item.trim(),
      categoria: categoria.trim() || null,
      para_quem: paraQuem.trim() || null,
      preco: preco ? Number(preco) : null,
    })
    setItem('')
    setCategoria('')
    setParaQuem('')
    setPreco('')
    loadData()
  }

  async function updateItem(id, patch) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
    await supabase.from('attire').update(patch).eq('id', id)
  }

  async function removeItem(id) {
    setItems((prev) => prev.filter((it) => it.id !== id))
    await supabase.from('attire').delete().eq('id', id)
  }

  const total = items.reduce((acc, it) => acc + (Number(it.preco) || 0), 0)

  return (
    <div>
      <PageHeading
        eyebrow="Vestuário"
        title="O que cada um vai vestir"
        description="Do vestido dos sonhos aos trajes de quem está ao seu lado."
      />

      <div className="bg-white/70 rounded-2xl border border-rose-200/60 p-5 mb-6 inline-block">
        <p className="font-body text-xs uppercase tracking-wide text-espresso-300 mb-1">Total investido</p>
        <p className="font-ledger text-xl text-espresso-900">{currency(total)}</p>
      </div>

      <form
        onSubmit={addItem}
        className="bg-white/70 rounded-2xl border border-rose-200/60 p-5 mb-6 flex flex-wrap gap-3 items-end"
      >
        <label className="flex-1 min-w-[160px]">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Item</span>
          <input
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="Ex: Vestido de noiva"
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <label className="w-36">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Categoria</span>
          <input
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            placeholder="Ex: Noiva"
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <label className="w-36">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Para quem</span>
          <input
            value={paraQuem}
            onChange={(e) => setParaQuem(e.target.value)}
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <label className="w-32">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Preço (R$)</span>
          <input
            type="number"
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-ledger text-sm outline-none focus:border-rose-400"
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
        <p className="font-body text-espresso-400 italic">Nenhum item ainda.</p>
      ) : (
        <div className="bg-white/70 rounded-2xl border border-rose-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="text-left text-espresso-300 text-xs uppercase tracking-wide border-b border-rose-200/60">
                  <th className="px-4 py-3 font-medium">Item</th>
                  <th className="px-4 py-3 font-medium">Para quem</th>
                  <th className="px-4 py-3 font-medium">Preço</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} className="border-b border-rose-100 last:border-0">
                    <td className="px-4 py-2.5 text-espresso-900">
                      {it.item}
                      {it.categoria && <span className="ml-2 text-xs text-espresso-300">{it.categoria}</span>}
                    </td>
                    <td className="px-4 py-2.5 text-espresso-500">{it.para_quem || '—'}</td>
                    <td className="px-4 py-2.5 font-ledger">{it.preco != null ? currency(it.preco) : '—'}</td>
                    <td className="px-4 py-2.5">
                      <select
                        value={it.status}
                        onChange={(e) => updateItem(it.id, { status: e.target.value })}
                        className="rounded-lg px-2 py-1 text-xs bg-blush-100 text-espresso-700 border-0 outline-none"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => removeItem(it.id)}
                        aria-label={`Remover ${it.item}`}
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
