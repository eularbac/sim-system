import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import PageHeading from '../components/PageHeading'

function daysUntil(dateStr) {
  if (!dateStr) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr + 'T00:00:00')
  return Math.round((target - today) / (1000 * 60 * 60 * 24))
}

function StatCard({ label, value, accent = 'rose' }) {
  const accentMap = {
    rose: 'text-rose-600',
    terracotta: 'text-terracotta-500',
    sage: 'text-sage-600',
  }
  return (
    <div className="bg-white/70 rounded-2xl border border-rose-200/60 p-6">
      <p className="font-body text-xs tracking-[0.15em] uppercase text-espresso-300 mb-2">
        {label}
      </p>
      <p className={`font-display text-3xl ${accentMap[accent]}`}>{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const { user, profile, refreshProfile } = useAuth()
  const [stats, setStats] = useState({ guests: 0, confirmed: 0, tasksLeft: 0, saldo: 0 })
  const [editingDate, setEditingDate] = useState(false)
  const [dateValue, setDateValue] = useState(profile?.data_casamento ?? '')

  useEffect(() => {
    if (!user) return
    async function load() {
      const [{ count: guestCount }, { count: confirmedCount }, { count: tasksLeftCount }, { data: budget }] =
        await Promise.all([
          supabase.from('guests').select('*', { count: 'exact', head: true }).eq('profile_id', user.id),
          supabase
            .from('guests')
            .select('*', { count: 'exact', head: true })
            .eq('profile_id', user.id)
            .eq('rsvp', 'Confirmado'),
          supabase
            .from('tasks')
            .select('*', { count: 'exact', head: true })
            .eq('profile_id', user.id)
            .eq('feito', false),
          supabase.from('budget_items').select('orcamento, custo_real').eq('profile_id', user.id),
        ])

      const saldo = (budget ?? []).reduce(
        (acc, item) => acc + (Number(item.orcamento) || 0) - (Number(item.custo_real) || 0),
        0
      )

      setStats({
        guests: guestCount ?? 0,
        confirmed: confirmedCount ?? 0,
        tasksLeft: tasksLeftCount ?? 0,
        saldo,
      })
    }
    load()
  }, [user])

  async function saveDate() {
    await supabase.from('profiles').update({ data_casamento: dateValue || null }).eq('id', user.id)
    await refreshProfile()
    setEditingDate(false)
  }

  const dias = daysUntil(profile?.data_casamento)

  return (
    <div>
      <PageHeading
        eyebrow="Painel"
        title={`Que bom te ver, ${profile?.nome_noiva || 'noiva'} 💗`}
        description="Aqui é tudo interligado: convidados, mesas, orçamento e tarefas conversam entre si."
      />

      <div className="bg-rose-500 rounded-2xl px-7 py-6 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-body text-blush-100 text-xs tracking-[0.15em] uppercase mb-1">
            Meu grande dia
          </p>
          {editingDate ? (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                className="rounded-lg px-3 py-1.5 font-body text-espresso-900"
              />
              <button
                onClick={saveDate}
                className="bg-white text-rose-600 rounded-lg px-3 py-1.5 font-body text-sm font-medium"
              >
                Salvar
              </button>
            </div>
          ) : (
            <button onClick={() => setEditingDate(true)} className="text-left">
              <p className="font-display text-2xl text-white">
                {profile?.data_casamento
                  ? new Date(profile.data_casamento + 'T00:00:00').toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'Clique para definir a data'}
              </p>
            </button>
          )}
        </div>
        {dias !== null && dias >= 0 && (
          <div className="text-right">
            <p className="font-display text-4xl text-white">{dias}</p>
            <p className="font-body text-blush-100 text-xs">dias para o sim</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Convidados" value={stats.guests} accent="rose" />
        <StatCard label="RSVP confirmados" value={stats.confirmed} accent="sage" />
        <StatCard label="Tarefas pendentes" value={stats.tasksLeft} accent="terracotta" />
        <div className="bg-white/70 rounded-2xl border border-rose-200/60 p-6">
          <p className="font-body text-xs tracking-[0.15em] uppercase text-espresso-300 mb-2">
            Saldo do orçamento
          </p>
          <p
            className={`font-ledger text-2xl ${
              stats.saldo < 0 ? 'text-terracotta-600' : 'text-sage-600'
            }`}
          >
            {stats.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
      </div>
    </div>
  )
}
