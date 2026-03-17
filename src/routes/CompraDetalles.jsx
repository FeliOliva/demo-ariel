import { useState, useMemo } from 'react'
import {
  Card, Table, Button, Select, InputNumber, Space,
  Typography, Divider, Popconfirm, message, Row, Col, Statistic,
} from 'antd'
import { ArrowLeftOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import { storage } from '../data/storage'

const { Title, Text } = Typography
const $ = (n) => `$${new Intl.NumberFormat('es-AR').format(Math.round(n || 0))}`

const EMPTY = { articulo_id: null, cantidad: 1, costo: 0, precio: 0 }

export default function CompraDetalles() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const compraId = parseInt(id, 10)

  const [compra,  setCompra]  = useState(() => storage.getCompras().find(c => c.id === compraId))
  const [items,   setItems]   = useState(() => storage.getDetalleByCompra(compraId))
  const [newItem, setNewItem] = useState(EMPTY)

  const articulos = storage.getArticulos().filter(a => a.estado !== 0)

  const total = useMemo(
    () => items.reduce((s, i) => s + (i.costo * i.cantidad || 0), 0),
    [items]
  )

  const persistCompraTotal = (itemsList) => {
    const t = itemsList.reduce((s, i) => s + (i.costo * i.cantidad || 0), 0)
    const updated = storage.getCompras().map(c => c.id === compraId ? { ...c, total: t } : c)
    storage.saveCompras(updated)
    setCompra(prev => ({ ...prev, total: t }))
  }

  const handleArticuloSelect = (artId) => {
    const art = articulos.find(a => a.id === artId)
    if (art) {
      setNewItem(prev => ({ ...prev, articulo_id: artId, costo: art.costo, precio: art.precio_monotributista }))
    }
  }

  const handleAddItem = () => {
    if (!newItem.articulo_id) { message.warning('Seleccioná un artículo'); return }
    const item = {
      id:                    storage.nextId('detalleCompras'),
      compra_id:             compraId,
      articulo_id:           newItem.articulo_id,
      cantidad:              newItem.cantidad || 1,
      costo:                 newItem.costo,
      precio_monotributista: newItem.precio,
    }
    const newItems = [...items, item]
    storage.saveDetalleCompras([...storage.getDetalleCompras(), item])
    setItems(newItems)
    setNewItem(EMPTY)
    persistCompraTotal(newItems)
    message.success('Artículo agregado')
  }

  const handleDeleteItem = (itemId) => {
    const newItems = items.filter(i => i.id !== itemId)
    storage.saveDetalleCompras(storage.getDetalleCompras().filter(d => d.id !== itemId))
    setItems(newItems)
    persistCompraTotal(newItems)
    message.success('Artículo eliminado')
  }

  const columns = [
    { title: 'Artículo',    dataIndex: 'articulo_id', render: id => articulos.find(a => a.id === id)?.nombre ?? '-' },
    { title: 'Costo',       dataIndex: 'costo',       render: $, width: 110 },
    { title: 'Precio Venta',dataIndex: 'precio_monotributista', render: $, width: 130 },
    { title: 'Cant.',       dataIndex: 'cantidad',              width: 70  },
    { title: 'Total Costo', render: (_, r) => $(r.costo * r.cantidad), width: 120 },
    {
      title: '',
      width: 56,
      render: (_, r) => (
        <Popconfirm
          title="¿Eliminar?"
          onConfirm={() => handleDeleteItem(r.id)}
          okText="Sí" cancelText="No"
        >
          <Button icon={<DeleteOutlined />} size="small" danger />
        </Popconfirm>
      ),
    },
  ]

  if (!compra) return <div>Compra no encontrada</div>

  return (
    <div>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/compras')}
        style={{ marginBottom: 16 }}
      >
        Volver a Compras
      </Button>

      <Card
        title={<Title level={4} style={{ margin: 0 }}>{compra.nro_compra}</Title>}
        extra={<Text type="secondary">{compra.fecha_compra}</Text>}
        style={{ marginBottom: 16 }}
      >
        <Row gutter={24}>
          <Col span={8}>
            <Statistic title="Total Compra" value={compra.total} formatter={$} valueStyle={{ color: '#fa8c16' }} />
          </Col>
          <Col span={8}>
            <Statistic title="Artículos distintos" value={items.length} />
          </Col>
          <Col span={8}>
            <Statistic
              title="Unidades totales"
              value={items.reduce((s, i) => s + (i.cantidad || 0), 0)}
            />
          </Col>
        </Row>
      </Card>

      <Card title="Artículos de la compra">
        <Table
          dataSource={items}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={false}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={4} align="right">
                <Text strong>TOTAL:</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Text strong style={{ color: '#fa8c16' }}>{$(total)}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell />
            </Table.Summary.Row>
          )}
        />

        <Divider orientation="left">Agregar artículo</Divider>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <div style={{ marginBottom: 4, fontSize: 12, color: '#888' }}>Artículo</div>
            <Select
              showSearch
              style={{ width: 300 }}
              placeholder="Buscar artículo..."
              value={newItem.articulo_id}
              onChange={handleArticuloSelect}
              options={articulos.map(a => ({
                value: a.id,
                label: `${a.cod_articulo} — ${a.nombre}`,
              }))}
              filterOption={(input, opt) =>
                opt.label.toLowerCase().includes(input.toLowerCase())
              }
            />
          </div>
          <div>
            <div style={{ marginBottom: 4, fontSize: 12, color: '#888' }}>Costo ($)</div>
            <InputNumber
              value={newItem.costo}
              onChange={v => setNewItem(p => ({ ...p, costo: v }))}
              style={{ width: 120 }}
              min={0}
            />
          </div>
          <div>
            <div style={{ marginBottom: 4, fontSize: 12, color: '#888' }}>Precio Venta ($)</div>
            <InputNumber
              value={newItem.precio}
              onChange={v => setNewItem(p => ({ ...p, precio: v }))}
              style={{ width: 120 }}
              min={0}
            />
          </div>
          <div>
            <div style={{ marginBottom: 4, fontSize: 12, color: '#888' }}>Cantidad</div>
            <InputNumber
              min={1}
              value={newItem.cantidad}
              onChange={v => setNewItem(p => ({ ...p, cantidad: v }))}
              style={{ width: 80 }}
            />
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddItem}>
            Agregar
          </Button>
        </div>
      </Card>
    </div>
  )
}
