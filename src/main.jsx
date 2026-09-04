import "./main.css"
import { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Link, BrowserRouter, Routes, Route } from 'react-router-dom'

// Componentes
import { Menu } from './components/menu'
import { Footer } from "./components/footer"
import { ScrollToTop } from "./components/scrolltop"
// Rutas
import { Principal } from "./components/principal"
import { Recurso } from "./components/recursos"


const root = document.getElementById("root")

function App() {
  let app = <BrowserRouter>
  <ScrollToTop />
  <Menu />
  <Routes>
    <Route path='/' element={<Principal />} />
    <Route path="/resource/:slug" element={<Recurso />} />
  </Routes>
  <Footer />
  </BrowserRouter>

  return app
}

createRoot(root).render(<App />)