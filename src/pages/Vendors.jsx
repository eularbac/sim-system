import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import PageHeading from '../components/PageHeading'

const STATUS_OPTIONS = ['Não contatado', 'Em contato', 'Orçamento recebido', 'Contratado', 'Recusado']

const statusColor = {
  'Não contatado': 'bg-blush-200 text-espresso-500',
  'Em contato': 'bg-gold-400/20 text-gold-500',
  'Orçamento recebido': 'bg-terracotta-500/20 text-terracotta-600',
  Contratado: 'bg-sage-400/20 text-sage-600',
  Recusado: 'bg-espresso-300/20 text-espresso-400',
}

export default function Vendors() {
  const { user } = useAuth()
  const [vendors, setVendors] = useState([])
  const [budgetItems, setBudgetItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [nome, setNome] = useState('')
  const [servico, setServico] = useState('')
  const [telefone, setTelefone] = useState('')

  async function loadData() {
    const [{ data: v }, { data: b }] = await Promise.all([
      supabase.from('vendors').select('*').eq('profile_id', user.id).order('created_at'),
      supabase.from('budget_items').select('id, nome').eq('profile_id', user.id).order('created_at'),
    ])
    setVendors(v ?? [])
    setBudgetItems(b ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (user) loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function addVendor(e) {
    e.preventDefault()
    if (!nome.trim()) return
    await supabase.from('vendors').insert({
      profile_id: user.id,
      nome: nome.trim(),
      servico: servico.trim() || null,
      telefone: telefone.trim() || null,
    })
    setNome('')
    setServico('')
    setTelefone('')
    loadData()
  }

  async function updateVendor(id, patch) {
    setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)))
    await supabase.from('vendors').update(patch).eq('id', id)
  }

  async function removeVendor(id) {
    setVendors((prev) => prev.filter((v) => v.id !== id))
    await supabase.from('vendors').delete().eq('id', id)
  }

  return (
    <div>
      <PageHeading
        eyebrow="Fornecedores"
        title="Quem vai fazer esse dia acontecer"
        description="Vincule cada fornecedor ao item de orçamento correspondente — assim tudo fica conectado."
      />

      <form
        onSubmit={addVendor}
        className="bg-white/70 rounded-2xl border border-rose-200/60 p-5 mb-6 flex flex-wrap gap-3 items-end"
      >
        <label className="flex-1 min-w-[180px]">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Fornecedor</span>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome da empresa/pessoa"
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <label className="w-44">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Serviço</span>
          <input
            value={servico}
            onChange={(e) => setServico(e.target.value)}
            placeholder="Ex: Buffet, DJ..."
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <label className="w-40">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Telefone</span>
          <input
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(00) 00000-0000"
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
      ) : vendors.length === 0 ? (
        <p className="font-body text-espresso-400 italic">Nenhum fornecedor ainda.</p>
      ) : (
        <div className="space-y-3">
          {vendors.map((v) => (
            <div key={v.id} className="bg-white/70 rounded-2xl border border-rose-200/60 p-5 card-hover">
              <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                <div>
                  <p className="font-display text-lg text-espresso-900">{v.nome}</p>
                  {v.servico && <p className="font-body text-xs text-espresso-400">{v.servico}</p>}
                </div>
                <button
                  onClick={() => removeVendor(v.id)}
                  aria-label={`Remover ${v.nome}`}
                  className="text-espresso-300 hover:text-terracotta-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <select
                  value={v.status}
                  onChange={(e) => updateVendor(v.id, { status: e.target.value })}
                  className={`rounded-lg px-2 py-1 text-xs border-0 outline-none ${statusColor[v.status] || 'bg-blush-200 text-espresso-500'}`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>

                <input
                  defaultValue={v.telefone ?? ''}
                  onBlur={(e) => updateVendor(v.id, { telefone: e.target.value || null })}
                  placeholder="Telefone"
                  className="w-36 font-body text-sm bg-transparent border-b border-transparent hover:border-rose-200 focus:border-rose-400 outline-none"
                />

                <input
                  defaultValue={v.email ?? ''}
                  onBlur={(e) => updateVendor(v.id, { email: e.target.value || null })}
                  placeholder="E-mail"
                  className="flex-1 min-w-[140px] font-body text-sm bg-transparent border-b border-transparent hover:border-rose-200 focus:border-rose-400 outline-none"
                />

                <select
                  value={v.budget_item_id ?? ''}
                  onChange={(e) => updateVendor(v.id, { budget_item_id: e.target.value || null })}
                  className="rounded-lg px-2 py-1 text-xs bg-blush-100 text-espresso-700 border-0 outline-none"
                >
                  <option value="">Vincular ao orçamento...</option>
                  {budgetItems.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
