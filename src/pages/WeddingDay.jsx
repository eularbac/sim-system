import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import PageHeading from '../components/PageHeading'

const ETAPAS = ['Antes da cerimônia', 'Cerimônia', 'Recepção']

export default function WeddingDay() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [horario, setHorario] = useState('')
  const [oQue, setOQue] = useState('')
  const [responsavel, setResponsavel] = useState('')
  const [etapa, setEtapa] = useState(ETAPAS[0])

  async function loadData() {
    const { data } = await supabase
      .from('wedding_day_schedule')
      .select('*')
      .eq('profile_id', user.id)
      .order('horario')
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (user) loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function addItem(e) {
    e.preventDefault()
    if (!oQue.trim()) return
    await supabase.from('wedding_day_schedule').insert({
      profile_id: user.id,
      horario: horario.trim() || null,
      o_que: oQue.trim(),
      responsavel: responsavel.trim() || null,
      etapa,
    })
    setHorario('')
    setOQue('')
    setResponsavel('')
    loadData()
  }

  async function removeItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id))
    await supabase.from('wedding_day_schedule').delete().eq('id', id)
  }

  return (
    <div>
      <PageHeading
        eyebrow="Dia do casamento"
        title="Minuto a minuto do seu grande dia"
        description="Um cronograma claro é o presente que você dá pra sua equipe e pra você mesma."
      />

      <form
        onSubmit={addItem}
        className="bg-white/70 rounded-2xl border border-rose-200/60 p-5 mb-6 flex flex-wrap gap-3 items-end"
      >
        <label className="w-28">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Horário</span>
          <input
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            placeholder="15:00"
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-ledger text-sm outline-none focus:border-rose-400"
          />
        </label>
        <label className="flex-1 min-w-[180px]">
          <span className="font-body text-xs text-espresso-500 mb-1 block">O que acontece</span>
          <input
            value={oQue}
            onChange={(e) => setOQue(e.target.value)}
            placeholder="Ex: Entrada da noiva"
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <label className="w-40">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Responsável</span>
          <input
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
            placeholder="Cerimonialista..."
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <label className="w-44">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Etapa</span>
          <select
            value={etapa}
            onChange={(e) => setEtapa(e.target.value)}
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          >
            {ETAPAS.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
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
        <p className="font-body text-espresso-400 italic">Nenhum item no cronograma ainda.</p>
      ) : (
        ETAPAS.map((etapaAtual) => {
          const doEtapa = items.filter((i) => i.etapa === etapaAtual)
          if (doEtapa.length === 0) return null
          return (
            <div key={etapaAtual} className="mb-6">
              <p className="font-display text-lg text-rose-600 mb-3">{etapaAtual}</p>
              <div className="space-y-2">
                {doEtapa.map((i) => (
                  <div
                    key={i.id}
                    className="bg-white/70 rounded-xl border border-rose-200/60 px-4 py-3 flex items-center gap-4"
                  >
                    <span className="font-ledger text-sm text-rose-600 w-14 shrink-0">{i.horario || '—'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-espresso-900">{i.o_que}</p>
                      {i.responsavel && (
                        <p className="font-body text-xs text-espresso-400">Responsável: {i.responsavel}</p>
                      )}
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
            </div>
          )
        })
      )}
    </div>
  )
}
