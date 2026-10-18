import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { StoreProvider } from './store.jsx'
import { AuthProvider } from './auth.jsx'
import './index.css'

// En producción/local se usa la URL normal (/admin). La vista previa de una sola
// página (npm run build:preview) usa "#/admin" porque no hay servidor que redirija.
const Router = import.meta.env.VITE_HASH_ROUTER ? HashRouter : BrowserRouter

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
    <StoreProvider>
      <Router>
        <App />
      </Router>
    </StoreProvider>
    </AuthProvider>
  </React.StrictMode>,
)
