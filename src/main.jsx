import "./main.css"
import { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Link, BrowserRouter, Routes, Route } from 'react-router-dom'

// Componentes

// Rutas
import { Menu } from './components/menu'

const root = document.getElementById("root")

function App() {
  //...

  let app = <BrowserRouter>
  <Routes>
    <Route path='/' element={<Menu />} />
  </Routes>
  </BrowserRouter>

  return app
}

createRoot(root).render(<App />)