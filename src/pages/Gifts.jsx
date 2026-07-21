import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import PageHeading from '../components/PageHeading'

export default function Gifts() {
  const { user } = useAuth()
  const [gifts, setGifts] = useState([])
  const [loading, setLoading] = useState(true)
  const [nome, setNome] = useState('')
  const [categoria, setCategoria] = useState('')
  const [link, setLink] = useState('')
  const [faixa, setFaixa] = useState('')

  async function loadData() {
    const { data } = await supabase.from('gifts').select('*').eq('profile_id', user.id).order('created_at')
    setGifts(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (user) loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function addGift(e) {
    e.preventDefault()
    if (!nome.trim()) return
    await supabase.from('gifts').insert({
      profile_id: user.id,
      nome: nome.trim(),
      categoria: categoria.trim() || null,
      link: link.trim() || null,
      faixa_preco: faixa.trim() || null,
    })
    setNome('')
    setCategoria('')
    setLink('')
    setFaixa('')
    loadData()
  }

  async function updateGift(id, patch) {
    setGifts((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)))
    await supabase.from('gifts').update(patch).eq('id', id)
  }

  async function removeGift(id) {
    setGifts((prev) => prev.filter((g) => g.id !== id))
    await supabase.from('gifts').delete().eq('id', id)
  }

  return (
    <div>
      <PageHeading
        eyebrow="Lista de presentes"
        title="O que vai ajudar a começar essa nova fase"
        description="Varie os valores — do simbólico ao mais especial — pra caber no bolso de todo mundo."
      />

      <form
        onSubmit={addGift}
        className="bg-white/70 rounded-2xl border border-rose-200/60 p-5 mb-6 flex flex-wrap gap-3 items-end"
      >
        <label className="flex-1 min-w-[160px]">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Item</span>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Jogo de panelas"
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <label className="w-36">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Categoria</span>
          <input
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            placeholder="Cozinha..."
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <label className="w-32">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Faixa de preço</span>
          <input
            value={faixa}
            onChange={(e) => setFaixa(e.target.value)}
            placeholder="R$50-100"
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <label className="flex-1 min-w-[160px]">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Link da loja</span>
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
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
      ) : gifts.length === 0 ? (
        <p className="font-body text-espresso-400 italic">Nenhum presente na lista ainda.</p>
      ) : (
        <div className="bg-white/70 rounded-2xl border border-rose-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="text-left text-espresso-300 text-xs uppercase tracking-wide border-b border-rose-200/60">
                  <th className="px-4 py-3 font-medium">Item</th>
                  <th className="px-4 py-3 font-medium">Faixa</th>
                  <th className="px-4 py-3 font-medium">Comprado por</th>
                  <th className="px-4 py-3 font-medium">Recebido</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {gifts.map((g) => (
                  <tr key={g.id} className="border-b border-rose-100 last:border-0">
                    <td className="px-4 py-2.5 text-espresso-900">
                      {g.link ? (
                        <a href={g.link} target="_blank" rel="noreferrer" className="hover:underline">
                          {g.nome}
                        </a>
                      ) : (
                        g.nome
                      )}
                      {g.categoria && <span className="ml-2 text-xs text-espresso-300">{g.categoria}</span>}
                    </td>
                    <td className="px-4 py-2.5 text-espresso-500 font-ledger text-xs">{g.faixa_preco || '—'}</td>
                    <td className="px-4 py-2.5">
                      <input
                        defaultValue={g.comprado_por ?? ''}
                        onBlur={(e) => updateGift(g.id, { comprado_por: e.target.value || null })}
                        placeholder="—"
                        className="w-32 font-body text-sm bg-transparent border-b border-transparent hover:border-rose-200 focus:border-rose-400 outline-none"
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={() => updateGift(g.id, { recebido: !g.recebido })}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-90 ${
                          g.recebido ? 'bg-sage-500 border-sage-500 text-white' : 'border-rose-300'
                        }`}
                      >
                        {g.recebido && '✓'}
                      </button>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => removeGift(g.id)}
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
