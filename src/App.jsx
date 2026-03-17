import { Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import esES from 'antd/locale/es_ES'
import MenuLayout from './components/MenuLayout'
import Inicio from './routes/Inicio'
import Articulos from './routes/Articulos'
import Clientes from './routes/Clientes'
import Ventas from './routes/Ventas'
import VentaDetalles from './routes/VentaDetalles'
import Compras from './routes/Compras'
import CompraDetalles from './routes/CompraDetalles'
import Gastos from './routes/Gastos'
import ResumenCuenta from './routes/ResumenCuenta'

export default function App() {
  return (
    <ConfigProvider locale={esES}>
      <MenuLayout>
        <Routes>
          <Route path="/"                element={<Inicio />} />
          <Route path="/articulos"       element={<Articulos />} />
          <Route path="/clientes"        element={<Clientes />} />
          <Route path="/ventas"          element={<Ventas />} />
          <Route path="/ventas/:id"      element={<VentaDetalles />} />
          <Route path="/compras"         element={<Compras />} />
          <Route path="/compras/:id"     element={<CompraDetalles />} />
          <Route path="/gastos"          element={<Gastos />} />
          <Route path="/resumen-cuenta"  element={<ResumenCuenta />} />
          <Route path="*"               element={<Navigate to="/" replace />} />
        </Routes>
      </MenuLayout>
    </ConfigProvider>
  )
}
