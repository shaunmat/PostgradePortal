import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './backend/authcontext.jsx'
import webdriver from 'selenium-webdriver'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AuthProvider>
          <ThemeProvider>
              <App />
          </ThemeProvider>
        </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
