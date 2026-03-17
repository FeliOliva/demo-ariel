import { useState, useMemo } from 'react'
import { Card, Row, Col, DatePicker, Typography, Statistic, Divider } from 'antd'
import {
  ShoppingCartOutlined,
  DollarOutlined,
  RiseOutlined,
  ShopOutlined,
  TeamOutlined,
  FallOutlined,
} from '@ant-design/icons'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import dayjs from 'dayjs'
import { storage } from '../data/storage'

const { RangePicker } = DatePicker
const { Title } = Typography

const $ = (n) => `$${new Intl.NumberFormat('es-AR').format(Math.round(n || 0))}`

export default function Inicio() {
  const [range, setRange] = useState([
    dayjs().subtract(90, 'day'),
    dayjs(),
  ])
  const [start, end] = range ?? []

  const stats = useMemo(() => {
    const ventas        = storage.getVentas()
    const pagos         = storage.getPagos()
    const gastos        = storage.getGastos()
    const compras       = storage.getCompras()
    const clientes      = storage.getClientes().filter(c => c.estado !== 0)
    const detalleVentas = storage.getDetalleVentas()

    const inRange = (dateStr) => {
      if (!start || !end) return true
      const dt = dayjs(dateStr)
      return !dt.isBefore(start.startOf('day')) && !dt.isAfter(end.endOf('day'))
    }

    const fv = ventas.filter(v  => v.estado !== 0 && inRange(v.fecha_venta))
    const fp = pagos.filter(p   => p.estado !== 0 && inRange(p.fecha_pago))
    const fg = gastos.filter(g  => g.estado !== 0 && inRange(g.fecha))
    const fc = compras.filter(c => inRange(c.fecha_compra))

    const totalVentas  = fv.reduce((s, v) => s + (v.total_con_descuento || v.total || 0), 0)
    const totalPagos   = fp.reduce((s, p) => s + (p.monto || 0), 0)
    const totalGastos  = fg.reduce((s, g) => s + (g.monto || 0), 0)
    const totalCompras = fc.reduce((s, c) => s + (c.total || 0), 0)

    const ventaIds = new Set(fv.map(v => v.id))
    let ganancia = 0
    detalleVentas.forEach(d => {
      if (ventaIds.has(d.venta_id) && !d.isGift) {
        ganancia += (d.precio_monotributista - d.costo) * d.cantidad
      }
    })

    // Gráfico: últimas 8 semanas
    const chartData = []
    for (let i = 7; i >= 0; i--) {
      const wStart = dayjs().subtract(i, 'week').startOf('week')
      const wEnd   = dayjs().subtract(i, 'week').endOf('week')
      const label  = wStart.format('DD/MM')

      const wVentas = ventas.filter(v => {
        const dt = dayjs(v.fecha_venta)
        return v.estado !== 0 && !dt.isBefore(wStart) && !dt.isAfter(wEnd)
      })
      const wTotal = wVentas.reduce((s, v) => s + (v.total_con_descuento || v.total || 0), 0)
      const wIds   = new Set(wVentas.map(v => v.id))
      let wGanancia = 0
      detalleVentas.forEach(d => {
        if (wIds.has(d.venta_id) && !d.isGift) {
          wGanancia += (d.precio_monotributista - d.costo) * d.cantidad
        }
      })
      chartData.push({ semana: label, Ventas: Math.round(wTotal), Ganancia: Math.round(wGanancia) })
    }

    return { totalVentas, totalPagos, totalGastos, totalCompras, ganancia, cantClientes: clientes.length, chartData }
  }, [start, end])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>Dashboard</Title>
        <RangePicker
          value={range}
          onChange={v => setRange(v ?? [dayjs().subtract(90, 'day'), dayjs()])}
          format="DD/MM/YYYY"
          allowClear={false}
        />
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={8}>
          <Card>
            <Statistic
              title="Total Ventas"
              value={stats.totalVentas}
              formatter={$}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={8}>
          <Card>
            <Statistic
              title="Total Cobrado"
              value={stats.totalPagos}
              formatter={$}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={8}>
          <Card>
            <Statistic
              title="Ganancia Bruta"
              value={stats.ganancia}
              formatter={$}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={8}>
          <Card>
            <Statistic
              title="Total Compras"
              value={stats.totalCompras}
              formatter={$}
              prefix={<ShopOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={8}>
          <Card>
            <Statistic
              title="Total Gastos"
              value={stats.totalGastos}
              formatter={$}
              prefix={<FallOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={8}>
          <Card>
            <Statistic
              title="Clientes Activos"
              value={stats.cantClientes}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Card title="Ventas y Ganancia — últimas 8 semanas">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="semana" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
            <Tooltip formatter={v => $(v)} />
            <Legend />
            <Bar dataKey="Ventas"   fill="#1677ff" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Ganancia" fill="#722ed1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
