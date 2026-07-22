import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import RequireAuth from './components/RequireAuth'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Guests from './pages/Guests'
import Budget from './pages/Budget'
import Tasks from './pages/Tasks'
import Tables from './pages/Tables'
import FoodDrink from './pages/FoodDrink'
import Gifts from './pages/Gifts'
import Decor from './pages/Decor'
import Music from './pages/Music'
import Documents from './pages/Documents'
import WeddingDay from './pages/WeddingDay'
import Honeymoon from './pages/Honeymoon'
import ChaBar from './pages/ChaBar'
import ChaPanela from './pages/ChaPanela'
import ChaLingerie from './pages/ChaLingerie'
import ChaCasaNova from './pages/ChaCasaNova'
import Vendors from './pages/Vendors'
import Attire from './pages/Attire'
import WeddingParty from './pages/WeddingParty'

// NOTA: as rotas "/entrar" e "/cadastro" (Login.jsx e Signup.jsx) foram
// removidas temporariamente enquanto o site está em modo "sem login" —
// veja o comentário no topo de src/lib/AuthContext.jsx para saber como
// reativá-las quando o produto estiver pronto para lançar de verdade.

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
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
            <Route path="/fornecedores" element={<Vendors />} />
            <Route path="/tarefas" element={<Tasks />} />
            <Route path="/comes-e-bebes" element={<FoodDrink />} />
            <Route path="/presentes" element={<Gifts />} />
            <Route path="/decoracao" element={<Decor />} />
            <Route path="/vestuario" element={<Attire />} />
            <Route path="/musicas" element={<Music />} />
            <Route path="/documentos" element={<Documents />} />
            <Route path="/dia-do-casamento" element={<WeddingDay />} />
            <Route path="/lua-de-mel" element={<Honeymoon />} />
            <Route path="/padrinhos-e-madrinhas" element={<WeddingParty />} />
            <Route path="/cha-bar" element={<ChaBar />} />
            <Route path="/cha-de-panela" element={<ChaPanela />} />
            <Route path="/cha-de-lingerie" element={<ChaLingerie />} />
            <Route path="/cha-de-casa-nova" element={<ChaCasaNova />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
