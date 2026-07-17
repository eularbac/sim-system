import { NavLink } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

const modules = [
  { to: '/', label: 'Painel', icon: '⌂', end: true },
  { to: '/convidados', label: 'Convidados', icon: '✉' },
  { to: '/mesas', label: 'Mesas', icon: '⚭' },
  { to: '/orcamento', label: 'Orçamento', icon: '⌘' },
  { to: '/tarefas', label: 'Tarefas', icon: '✓' },
  { to: '/comes-e-bebes', label: 'Comes e Bebes', icon: '❀' },
  { to: '/presentes', label: 'Lista de presentes', icon: '⚘' },
  { to: '/decoracao', label: 'Decoração', icon: '⚜' },
  { to: '/musicas', label: 'Músicas e ideias', icon: '♪' },
  { to: '/documentos', label: 'Documentos', icon: '⎙' },
  { to: '/dia-do-casamento', label: 'Dia do casamento', icon: '☀' },
  { to: '/lua-de-mel', label: 'Lua de mel', icon: '☾' },
]

const chaModules = [
  { to: '/cha-bar', label: 'Chá Bar', icon: '◇' },
  { to: '/cha-de-panela', label: 'Chá de Panela', icon: '◇' },
  { to: '/cha-de-lingerie', label: 'Chá de Lingerie', icon: '◇' },
  { to: '/cha-de-casa-nova', label: 'Chá de Casa Nova', icon: '◇' },
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
          {modules.map((m) => (
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
          Chás
        </p>
        <ul className="space-y-1">
          {chaModules.map((m) => (
            <li key={m.to}>
              <NavLink
                to={m.to}
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
