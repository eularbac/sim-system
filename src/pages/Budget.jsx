import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import PageHeading from '../components/PageHeading'

const STATUS_OPTIONS = ['Não pago', 'Entrada', 'Segunda parcela', 'Pago']

function currency(n) {
  return (Number(n) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function Budget() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState('')
  const [orcamento, setOrcamento] = useState('')

  async function loadData() {
    const { data } = await supabase
      .from('budget_items')
      .select('*')
      .eq('profile_id', user.id)
      .order('created_at')
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (user) loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function addItem(e) {
    e.preventDefault()
    if (!nome.trim()) return
    await supabase.from('budget_items').insert({
      profile_id: user.id,
      nome: nome.trim(),
      tipo_servico: tipo.trim() || null,
      orcamento: orcamento ? Number(orcamento) : 0,
    })
    setNome('')
    setTipo('')
    setOrcamento('')
    loadData()
  }

  async function updateItem(id, patch) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
    await supabase.from('budget_items').update(patch).eq('id', id)
  }

  async function removeItem(id) {
    setItems((prev) => prev.filter((it) => it.id !== id))
    await supabase.from('budget_items').delete().eq('id', id)
  }

  const totalOrcado = items.reduce((acc, it) => acc + (Number(it.orcamento) || 0), 0)
  const totalReal = items.reduce((acc, it) => acc + (Number(it.custo_real) || 0), 0)
  const saldo = totalOrcado - totalReal

  return (
    <div>
      <PageHeading
        eyebrow="Orçamento"
        title="O norte que protege seus sonhos"
        description="Defina o orçamento planejado de cada item primeiro. O saldo se ajusta sozinho conforme você registra os custos reais."
      />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white/70 rounded-2xl border border-rose-200/60 p-5">
          <p className="font-body text-xs uppercase tracking-wide text-espresso-300 mb-1">Orçado</p>
          <p className="font-ledger text-xl text-espresso-900">{currency(totalOrcado)}</p>
        </div>
        <div className="bg-white/70 rounded-2xl border border-rose-200/60 p-5">
          <p className="font-body text-xs uppercase tracking-wide text-espresso-300 mb-1">Gasto real</p>
          <p className="font-ledger text-xl text-espresso-900">{currency(totalReal)}</p>
        </div>
        <div
          className={`rounded-2xl p-5 ${saldo < 0 ? 'bg-terracotta-500' : 'bg-sage-500'}`}
        >
          <p className="font-body text-xs uppercase tracking-wide text-white/80 mb-1">Saldo</p>
          <p className="font-ledger text-xl text-white">{currency(saldo)}</p>
        </div>
      </div>

      <form
        onSubmit={addItem}
        className="bg-white/70 rounded-2xl border border-rose-200/60 p-5 mb-6 flex flex-wrap gap-3 items-end"
      >
        <label className="flex-1 min-w-[160px]">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Item</span>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Buffet, Fotografia..."
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <label className="flex-1 min-w-[140px]">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Tipo de serviço</span>
          <input
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            placeholder="Ex: Decoração"
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <label className="w-40">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Orçamento (R$)</span>
          <input
            type="number"
            step="0.01"
            value={orcamento}
            onChange={(e) => setOrcamento(e.target.value)}
            placeholder="0,00"
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
        <p className="font-body text-espresso-400 italic">
          Nenhum item ainda. Comece colocando um teto para cada parte do casamento.
        </p>
      ) : (
        <div className="bg-white/70 rounded-2xl border border-rose-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="text-left text-espresso-300 text-xs uppercase tracking-wide border-b border-rose-200/60">
                  <th className="px-4 py-3 font-medium">Item</th>
                  <th className="px-4 py-3 font-medium">Orçado</th>
                  <th className="px-4 py-3 font-medium">Custo real</th>
                  <th className="px-4 py-3 font-medium">Saldo</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => {
                  const itemSaldo = (Number(it.orcamento) || 0) - (Number(it.custo_real) || 0)
                  return (
                    <tr key={it.id} className="border-b border-rose-100 last:border-0">
                      <td className="px-4 py-2.5 text-espresso-900">
                        {it.nome}
                        {it.tipo_servico && (
                          <span className="ml-2 text-xs text-espresso-300">{it.tipo_servico}</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <input
                          type="number"
                          step="0.01"
                          defaultValue={it.orcamento ?? 0}
                          onBlur={(e) => updateItem(it.id, { orcamento: Number(e.target.value) || 0 })}
                          className="w-24 font-ledger text-sm bg-transparent border-b border-transparent hover:border-rose-200 focus:border-rose-400 outline-none"
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        <input
                          type="number"
                          step="0.01"
                          defaultValue={it.custo_real ?? 0}
                          onBlur={(e) => updateItem(it.id, { custo_real: Number(e.target.value) || 0 })}
                          className="w-24 font-ledger text-sm bg-transparent border-b border-transparent hover:border-rose-200 focus:border-rose-400 outline-none"
                        />
                      </td>
                      <td
                        className={`px-4 py-2.5 font-ledger ${
                          itemSaldo < 0 ? 'text-terracotta-600' : 'text-sage-600'
                        }`}
                      >
                        {currency(itemSaldo)}
                      </td>
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
                          aria-label={`Remover ${it.nome}`}
                          className="text-espresso-300 hover:text-terracotta-600 transition-colors"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
