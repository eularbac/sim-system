import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import PageHeading from '../components/PageHeading'

export default function Tasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [nome, setNome] = useState('')
  const [responsavel, setResponsavel] = useState('')

  async function loadData() {
    const { data } = await supabase.from('tasks').select('*').eq('profile_id', user.id).order('created_at')
    setTasks(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (user) loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function addTask(e) {
    e.preventDefault()
    if (!nome.trim()) return
    await supabase.from('tasks').insert({
      profile_id: user.id,
      nome: nome.trim(),
      responsavel: responsavel.trim() || null,
    })
    setNome('')
    setResponsavel('')
    loadData()
  }

  async function toggleTask(id, feito) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, feito: !feito } : t)))
    await supabase.from('tasks').update({ feito: !feito }).eq('id', id)
  }

  async function removeTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    await supabase.from('tasks').delete().eq('id', id)
  }

  const pendentes = tasks.filter((t) => !t.feito)
  const feitas = tasks.filter((t) => t.feito)
  const progresso = tasks.length ? Math.round((feitas.length / tasks.length) * 100) : 0

  return (
    <div>
      <PageHeading
        eyebrow="Lista de tarefas"
        title="Um passo de cada vez"
        description="Tem muita coisa pra fazer, né? Mas vai dar tudo certo. Delegue o que puder."
      />

      <div className="bg-white/70 rounded-2xl border border-rose-200/60 p-5 mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="font-body text-sm text-espresso-500">Progresso geral</p>
          <p className="font-ledger text-sm text-rose-600">{progresso}%</p>
        </div>
        <div className="h-2 bg-blush-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-rose-500 rounded-full transition-all"
            style={{ width: `${progresso}%` }}
          />
        </div>
      </div>

      <form
        onSubmit={addTask}
        className="bg-white/70 rounded-2xl border border-rose-200/60 p-5 mb-6 flex flex-wrap gap-3 items-end"
      >
        <label className="flex-1 min-w-[200px]">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Tarefa</span>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="O que precisa ser feito?"
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 font-body text-sm outline-none focus:border-rose-400"
          />
        </label>
        <label className="w-48">
          <span className="font-body text-xs text-espresso-500 mb-1 block">Responsável</span>
          <input
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
            placeholder="Quem vai fazer?"
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
      ) : tasks.length === 0 ? (
        <p className="font-body text-espresso-400 italic">Nenhuma tarefa ainda. Adicione a primeira acima.</p>
      ) : (
        <div className="space-y-2">
          {[...pendentes, ...feitas].map((t) => (
            <div
              key={t.id}
              className="bg-white/70 rounded-xl border border-rose-200/60 px-4 py-3 flex items-center gap-3"
            >
              <button
                onClick={() => toggleTask(t.id, t.feito)}
                aria-label={t.feito ? 'Marcar como não feita' : 'Marcar como feita'}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-150 hover:scale-110 active:scale-90 ${
                  t.feito ? 'bg-sage-500 border-sage-500 text-white' : 'border-rose-300'
                }`}
              >
                {t.feito && '✓'}
              </button>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-body text-sm ${
                    t.feito ? 'text-espresso-300 line-through' : 'text-espresso-900'
                  }`}
                >
                  {t.nome}
                </p>
                {t.responsavel && (
                  <p className="font-body text-xs text-espresso-400">Responsável: {t.responsavel}</p>
                )}
              </div>
              <button
                onClick={() => removeTask(t.id)}
                aria-label={`Remover ${t.nome}`}
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
