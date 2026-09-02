import "./main.css"
import { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Link, BrowserRouter, Routes, Route } from 'react-router-dom'

// Componentes
import { Menu } from './components/menu'
// Rutas
import { Principal } from "./components/principal"


const root = document.getElementById("root")

function App() {
  let app = <BrowserRouter>
  <Menu />
  <Routes>
    <Route path='/' element={<Principal />} />
  </Routes>
  </BrowserRouter>

  return app
}

createRoot(root).render(<App />)