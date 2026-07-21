import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import PageHeading from '../components/PageHeading'
import SimpleChecklist from '../components/SimpleChecklist'

function InspirationBoard() {
  const { user } = useAuth()
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState('')
  const [nota, setNota] = useState('')

  async function loadData() {
    const { data } = await supabase
      .from('decor_inspiration')
      .select('*')
      .eq('profile_id', user.id)
      .order('created_at', { ascending: false })
    setImages(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (user) loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function addImage(e) {
    e.preventDefault()
    if (!url.trim()) return
    await supabase.from('decor_inspiration').insert({
      profile_id: user.id,
      image_url: url.trim(),
      nota: nota.trim() || null,
    })
    setUrl('')
    setNota('')
    loadData()
  }

  async function removeImage(id) {
    setImages((prev) => prev.filter((i) => i.id !== id))
    await supabase.from('decor_inspiration').delete().eq('id', id)
  }

  return (
    <div>
      <form
        onSubmit={addImage}
        className="bg-white/70 rounded-2xl border border-rose-200/60 p-5 mb-6 flex flex-wrap gap-3 items-end"
      >
        <label className="flex-1 min-w-[220px]">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Link da imagem</span>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Cole o link de uma foto de referência"
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <label className="flex-1 min-w-[160px]">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Nota (opcional)</span>
          <input
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="O que você gosta nisso?"
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <button
          type="submit"
          className="rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-body text-sm font-medium px-5 py-2.5 transition-all hover:scale-[1.03] active:scale-[0.97] hover:shadow-md hover:shadow-rose-300/40"
        >
          Salvar
        </button>
      </form>

      {loading ? (
        <p className="font-body text-espresso-400">Carregando...</p>
      ) : images.length === 0 ? (
        <p className="font-body text-espresso-400 italic">
          Nenhuma imagem ainda. Cole o link de fotos que te inspiram acima.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.id} className="bg-white/70 rounded-2xl border border-rose-200/60 overflow-hidden group relative card-hover">
              <img
                src={img.image_url}
                alt={img.nota || 'Inspiração de decoração'}
                className="w-full h-36 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              {img.nota && <p className="font-body text-xs text-espresso-500 px-3 py-2">{img.nota}</p>}
              <button
                onClick={() => removeImage(img.id)}
                aria-label="Remover imagem"
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-espresso-900/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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

export default function Decor() {
  const [tab, setTab] = useState('checklist')

  return (
    <div>
      <PageHeading
        eyebrow="Decoração"
        title="A atmosfera do seu grande dia"
        description="Junte referências e vá riscando o que já está definido."
      />

      <div className="flex gap-2 mb-6">
        {[
          { key: 'checklist', label: 'Checklist' },
          { key: 'mural', label: 'Mural de inspiração' },
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

      {tab === 'checklist' ? (
        <SimpleChecklist table="decor_checklist" placeholder="Ex: Arco de flores, toalhas de mesa..." />
      ) : (
        <InspirationBoard />
      )}
    </div>
  )
}
