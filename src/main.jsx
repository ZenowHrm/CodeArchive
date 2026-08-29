import { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Link, BrowserRouter, Routes, Route } from 'react-router-dom'

// Componentes

// Rutas

const root = document.getElementById("root")

function App() {
  //...

  let app = <BrowserRouter>
  <Routes>
    <Route path='/' element={<h1>Hola Mundo</h1>} />
  </Routes>
  </BrowserRouter>

  return app
}

createRoot(root).render(<App />)