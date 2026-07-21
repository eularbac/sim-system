import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import PageHeading from '../components/PageHeading'

export default function Documents() {
  const { user } = useAuth()
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [nome, setNome] = useState('')
  const [categoria, setCategoria] = useState('')
  const [link, setLink] = useState('')

  async function loadData() {
    const { data } = await supabase.from('documents').select('*').eq('profile_id', user.id).order('created_at')
    setDocs(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (user) loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function addDoc(e) {
    e.preventDefault()
    if (!nome.trim()) return
    await supabase.from('documents').insert({
      profile_id: user.id,
      nome: nome.trim(),
      categoria: categoria.trim() || null,
      link: link.trim() || null,
    })
    setNome('')
    setCategoria('')
    setLink('')
    loadData()
  }

  async function removeDoc(id) {
    setDocs((prev) => prev.filter((d) => d.id !== id))
    await supabase.from('documents').delete().eq('id', id)
  }

  return (
    <div>
      <PageHeading
        eyebrow="Documentos"
        title="Tudo num só lugar"
        description="Orçamentos recebidos, portfólios em análise, contratos — guarde os links aqui pra não se perder."
      />

      <form
        onSubmit={addDoc}
        className="bg-white/70 rounded-2xl border border-rose-200/60 p-5 mb-6 flex flex-wrap gap-3 items-end"
      >
        <label className="flex-1 min-w-[180px]">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Nome</span>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Orçamento Buffet XYZ"
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <label className="w-44">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Categoria</span>
          <input
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            placeholder="Contrato, orçamento..."
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <label className="flex-1 min-w-[160px]">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Link</span>
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Google Drive, PDF..."
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
      ) : docs.length === 0 ? (
        <p className="font-body text-espresso-400 italic">Nenhum documento ainda.</p>
      ) : (
        <div className="space-y-2">
          {docs.map((d) => (
            <div
              key={d.id}
              className="bg-white/70 rounded-xl border border-rose-200/60 px-4 py-3 flex items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-espresso-900">
                  {d.link ? (
                    <a href={d.link} target="_blank" rel="noreferrer" className="hover:underline">
                      {d.nome}
                    </a>
                  ) : (
                    d.nome
                  )}
                </p>
                {d.categoria && <p className="font-body text-xs text-espresso-400">{d.categoria}</p>}
              </div>
              <button
                onClick={() => removeDoc(d.id)}
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
