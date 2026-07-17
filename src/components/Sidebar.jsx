import { NavLink } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

const activeModules = [
  { to: '/', label: 'Painel', icon: '⌂', end: true },
  { to: '/convidados', label: 'Convidados', icon: '✉' },
  { to: '/mesas', label: 'Mesas', icon: '⚭' },
  { to: '/orcamento', label: 'Orçamento', icon: '⌘' },
  { to: '/tarefas', label: 'Tarefas', icon: '✓' },
]

const upcomingModules = [
  'Comes e Bebes',
  'Lista de presentes',
  'Decoração',
  'Músicas e ideias',
  'Documentos',
  'Dia do casamento',
  'Lua de mel',
]

export default function Sidebar({ onNavigate }) {
  const { profile, signOut } = useAuth()

  return (
    <aside className="h-full w-full bg-blush-100 flex flex-col border-r border-rose-200/60">
      <div className="px-6 pt-8 pb-6">
        <p className="font-display italic text-2xl text-rose-700">Sistema Sim</p>
        <p className="font-body text-xs text-espresso-500 mt-1">
          {profile?.nome_noiva ? `Casamento de ${profile.nome_noiva}` : 'Seu casamento, organizado'}
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3">
        <ul className="space-y-1">
          {activeModules.map((m) => (
            <li key={m.to}>
              <NavLink
                to={m.to}
                end={m.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm transition-colors ${
                    isActive
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-espresso-700 hover:bg-blush-200'
                  }`
                }
              >
                <span aria-hidden="true" className="w-5 text-center">{m.icon}</span>
                {m.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <p className="font-body text-[11px] tracking-[0.15em] uppercase text-espresso-300 mt-6 mb-2 px-3">
          Em breve
        </p>
        <ul className="space-y-1">
          {upcomingModules.map((label) => (
            <li key={label}>
              <span className="flex items-center gap-3 px-3 py-2 rounded-xl font-body text-sm text-espresso-300 cursor-default">
                <span className="w-5 text-center">·</span>
                {label}
              </span>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-3 pb-6 pt-2 border-t border-rose-200/60">
        <button
          onClick={signOut}
          className="w-full text-left px-3 py-2.5 rounded-xl font-body text-sm text-espresso-500 hover:bg-blush-200 transition-colors"
        >
          Sair da conta
        </button>
      </div>
    </aside>
  )
}
