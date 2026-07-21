import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen flex bg-blush-50">
      {/* Desktop sidebar */}
      <div className="hidden md:block w-64 shrink-0">
        <div className="fixed h-screen w-64">
          <Sidebar />
        </div>
      </div>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between px-4 py-3 bg-blush-100 border-b border-rose-200/60">
        <p className="font-display italic text-xl text-rose-700">Sistema Sim</p>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu"
          className="w-9 h-9 flex items-center justify-center rounded-full text-espresso-700 hover:bg-blush-200"
        >
          ☰
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="w-72 h-full">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
          <button
            className="flex-1 bg-espresso-900/40"
            aria-label="Fechar menu"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      <main className="flex-1 min-w-0 px-5 md:px-12 py-10 md:py-12 mt-14 md:mt-0">
        <div key={location.pathname} className="max-w-5xl mx-auto animate-fade-in-up">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
