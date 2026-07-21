import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import PageHeading from '../components/PageHeading'

function Songs() {
  const { user } = useAuth()
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [momento, setMomento] = useState('')
  const [musica, setMusica] = useState('')
  const [link, setLink] = useState('')

  async function loadData() {
    const { data } = await supabase.from('songs').select('*').eq('profile_id', user.id).order('created_at')
    setSongs(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (user) loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function addSong(e) {
    e.preventDefault()
    if (!musica.trim()) return
    await supabase.from('songs').insert({
      profile_id: user.id,
      momento: momento.trim() || null,
      musica: musica.trim(),
      link: link.trim() || null,
    })
    setMomento('')
    setMusica('')
    setLink('')
    loadData()
  }

  async function toggleApproved(id, aprovado) {
    setSongs((prev) => prev.map((s) => (s.id === id ? { ...s, aprovado: !aprovado } : s)))
    await supabase.from('songs').update({ aprovado: !aprovado }).eq('id', id)
  }

  async function removeSong(id) {
    setSongs((prev) => prev.filter((s) => s.id !== id))
    await supabase.from('songs').delete().eq('id', id)
  }

  return (
    <div>
      <form
        onSubmit={addSong}
        className="bg-white/70 rounded-2xl border border-rose-200/60 p-5 mb-6 flex flex-wrap gap-3 items-end"
      >
        <label className="w-44">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Momento</span>
          <input
            value={momento}
            onChange={(e) => setMomento(e.target.value)}
            placeholder="Ex: 1ª dança"
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <label className="flex-1 min-w-[180px]">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Música</span>
          <input
            value={musica}
            onChange={(e) => setMusica(e.target.value)}
            placeholder="Nome da música e artista"
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <label className="flex-1 min-w-[160px]">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Link</span>
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Spotify, YouTube..."
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
      ) : songs.length === 0 ? (
        <p className="font-body text-espresso-400 italic">Nenhuma música ainda.</p>
      ) : (
        <div className="space-y-2">
          {songs.map((s) => (
            <div
              key={s.id}
              className="bg-white/70 rounded-xl border border-rose-200/60 px-4 py-3 flex items-center gap-3"
            >
              <button
                onClick={() => toggleApproved(s.id, s.aprovado)}
                aria-label={s.aprovado ? 'Aprovada' : 'Marcar como aprovada'}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-150 hover:scale-110 active:scale-90 ${
                  s.aprovado ? 'bg-sage-500 border-sage-500 text-white' : 'border-rose-300'
                }`}
              >
                {s.aprovado && '✓'}
              </button>
              <div className="flex-1 min-w-0">
                {s.momento && (
                  <p className="font-body text-[11px] uppercase tracking-wide text-rose-500">{s.momento}</p>
                )}
                <p className="font-body text-sm text-espresso-900">
                  {s.link ? (
                    <a href={s.link} target="_blank" rel="noreferrer" className="hover:underline">
                      {s.musica}
                    </a>
                  ) : (
                    s.musica
                  )}
                </p>
              </div>
              <button
                onClick={() => removeSong(s.id)}
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

const STATUS_OPTIONS = ['Só ideia', 'Por que não', 'Bora fazer']

function Activities() {
  const { user } = useAuth()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [nome, setNome] = useState('')
  const [custo, setCusto] = useState('')

  async function loadData() {
    const { data } = await supabase
      .from('activity_ideas')
      .select('*')
      .eq('profile_id', user.id)
      .order('created_at')
    setActivities(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (user) loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function addActivity(e) {
    e.preventDefault()
    if (!nome.trim()) return
    await supabase.from('activity_ideas').insert({
      profile_id: user.id,
      nome: nome.trim(),
      custo_estimado: custo ? Number(custo) : null,
    })
    setNome('')
    setCusto('')
    loadData()
  }

  async function updateActivity(id, patch) {
    setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)))
    await supabase.from('activity_ideas').update(patch).eq('id', id)
  }

  async function removeActivity(id) {
    setActivities((prev) => prev.filter((a) => a.id !== id))
    await supabase.from('activity_ideas').delete().eq('id', id)
  }

  return (
    <div>
      <form
        onSubmit={addActivity}
        className="bg-white/70 rounded-2xl border border-rose-200/60 p-5 mb-6 flex flex-wrap gap-3 items-end"
      >
        <label className="flex-1 min-w-[200px]">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Ideia</span>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Cabine de fotos, flash tattoo..."
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <label className="w-40">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Custo estimado (R$)</span>
          <input
            type="number"
            step="0.01"
            value={custo}
            onChange={(e) => setCusto(e.target.value)}
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
      ) : activities.length === 0 ? (
        <p className="font-body text-espresso-400 italic">Nenhuma ideia ainda.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {activities.map((a) => (
            <div key={a.id} className="bg-white/70 rounded-xl border border-rose-200/60 p-4 card-hover">
              <div className="flex justify-between items-start mb-2">
                <p className="font-body text-sm text-espresso-900">{a.nome}</p>
                <button
                  onClick={() => removeActivity(a.id)}
                  aria-label="Remover"
                  className="text-espresso-300 hover:text-terracotta-600 transition-colors"
                >
                  ✕
                </button>
              </div>
              {a.custo_estimado != null && (
                <p className="font-ledger text-xs text-espresso-400 mb-2">
                  {Number(a.custo_estimado).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              )}
              <select
                value={a.status}
                onChange={(e) => updateActivity(a.id, { status: e.target.value })}
                className={`rounded-lg px-2 py-1 text-xs border-0 outline-none ${
                  a.status === 'Bora fazer'
                    ? 'bg-sage-400/20 text-sage-600'
                    : a.status === 'Por que não'
                      ? 'bg-terracotta-500/20 text-terracotta-600'
                      : 'bg-blush-200 text-espresso-500'
                }`}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Music() {
  const [tab, setTab] = useState('musicas')

  return (
    <div>
      <PageHeading
        eyebrow="Músicas e novas ideias"
        title="A trilha sonora do seu dia"
        description="Escolha a música certa pra cada momento e guarde aquelas ideias extras que podem fazer a diferença."
      />

      <div className="flex gap-2 mb-6">
        {[
          { key: 'musicas', label: 'Músicas' },
          { key: 'ideias', label: 'Novas ideias' },
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

      {tab === 'musicas' ? <Songs /> : <Activities />}
    </div>
  )
}
