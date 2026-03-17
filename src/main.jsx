import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import App from './App'
import { seedDemoData } from './data/seedData'
import './index.css'

dayjs.locale('es')
seedDemoData()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
