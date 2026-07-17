import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import RequireAuth from './components/RequireAuth'
import Layout from './components/Layout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Guests from './pages/Guests'
import Budget from './pages/Budget'
import Tasks from './pages/Tasks'
import Tables from './pages/Tables'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/entrar" element={<Login />} />
          <Route path="/cadastro" element={<Signup />} />
          <Route
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/convidados" element={<Guests />} />
            <Route path="/mesas" element={<Tables />} />
            <Route path="/orcamento" element={<Budget />} />
            <Route path="/tarefas" element={<Tasks />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
