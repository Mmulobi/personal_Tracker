import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Optional Vercel Analytics import
try {
  const { Analytics } = require('@vercel/analytics/react');
  
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
      <Analytics />
    </React.StrictMode>,
  )
} catch (error) {
  // If Vercel Analytics is not available, render without it
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
