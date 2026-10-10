import "./main.css"
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useSession } from "./auth/Hooks/checksession"

// Componentes
import { ScrollToTop } from "./components/ui/scrolltop"
import { LoadingPage } from "./components/ui/loading"
import { Contrasena } from "./components/ui/modales/contrasena"
// Rutas
import { Layout } from "./components/routes/layout"
import { Principal } from "./components/routes/principal"
import { Recurso } from "./components/routes/recursos"
import { InicioSesion } from "./components/routes/iniciosesion"
import { Registro } from "./components/routes/registro"
import { Usuarios } from "./components/routes/usuarios"
import { Contribuir } from "./components/routes/contribuir"

const root = document.getElementById("root")

function App() {
  const { loading } = useSession()

  let app = <BrowserRouter>
    <ScrollToTop />
    <Routes>
      <Route element={<Layout loading={loading} />} >
        <Route path='/' element={loading ? <LoadingPage /> : <Principal />} />
        <Route path="/recurso/:slug" element={loading ? <LoadingPage /> : <Recurso />} />
        <Route path="/usuario/:slug" element={loading ? <LoadingPage /> : <Usuarios />} />
        <Route path="/contribuir" element={loading ? <LoadingPage /> : <Contribuir />} />
      </Route>
      
      <Route path="/inicio-sesion" element={loading ? <LoadingPage /> : <InicioSesion />} />
      <Route path="/registro" element={loading ? <LoadingPage /> : <Registro />} />
      <Route path="/change-password" element={loading ? <LoadingPage /> : <div className="cont-container"><Contrasena /></div>} />
    </Routes>
  </BrowserRouter>

  return app
}

createRoot(root).render(<App />)