import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


const root = document.getElementById("root")

function App() {
  let app = <>
  <h1>Hola Mundo</h1>
  </>

  return app
}

createRoot(root).render(<App />)