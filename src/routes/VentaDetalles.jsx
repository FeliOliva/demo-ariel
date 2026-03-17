import { useState, useMemo } from 'react'
import {
  Card, Table, Button, Select, InputNumber, Space,
  Typography, Divider, Tag, Popconfirm, message,
  Row, Col, Statistic, Checkbox,
} from 'antd'
import { ArrowLeftOutlined, PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import { storage } from '../data/storage'

const { Title, Text } = Typography
const $ = (n) => `$${new Intl.NumberFormat('es-AR').format(Math.round(n || 0))}`

const EMPTY_ITEM = { articulo_id: null, cantidad: 1, precio: 0, costo: 0, isGift: false }

export default function VentaDetalles() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const ventaId   = parseInt(id, 10)

  const [venta,   setVenta]   = useState(() => storage.getVentas().find(v => v.id === ventaId))
  const [items,   setItems]   = useState(() => storage.getDetalleByVenta(ventaId))
  const [newItem, setNewItem] = useState(EMPTY_ITEM)
  const [descuento,      setDescuento]      = useState(() => storage.getVentas().find(v => v.id === ventaId)?.descuento ?? 0)
  const [tipoDescuento,  setTipoDescuento]  = useState(() => storage.getVentas().find(v => v.id === ventaId)?.tipoDescuento ?? 0)

  const articulos = storage.getArticulos().filter(a => a.estado !== 0)
  const clientes  = storage.getClientes().filter(c => c.estado !== 0)
  const cliente   = clientes.find(c => c.id === venta?.cliente_id)

  const subtotal = useMemo(
    () => items.filter(i => !i.isGift).reduce((s, i) => s + (i.sub_total || 0), 0),
    [items]
  )

  const totalFinal = useMemo(() => {
    if (!descuento) return subtotal
    return tipoDescuento === 0
      ? subtotal * (1 - descuento / 100)
      : subtotal * (1 + descuento / 100)
  }, [subtotal, descuento, tipoDescuento])

  const persistVentaTotal = (itemsList, desc, tipo) => {
    const sub = itemsList.filter(i => !i.isGift).reduce((s, i) => s + (i.sub_total || 0), 0)
    const tot = desc
      ? tipo === 0 ? sub * (1 - desc / 100) : sub * (1 + desc / 100)
      : sub
    const updated = storage.getVentas().map(v =>
      v.id === ventaId ? { ...v, total: sub, total_con_descuento: tot, descuento: desc, tipoDescuento: tipo } : v
    )
    storage.saveVentas(updated)
    setVenta(prev => ({ ...prev, total: sub, total_con_descuento: tot, descuento: desc, tipoDescuento: tipo }))
  }

  const handleArticuloSelect = (artId) => {
    const art = articulos.find(a => a.id === artId)
    if (art) {
      setNewItem(prev => ({ ...prev, articulo_id: artId, precio: art.precio_monotributista, costo: art.costo }))
    }
  }

  const handleAddItem = () => {
    if (!newItem.articulo_id) { message.warning('Seleccioná un artículo'); return }
    const item = {
      id:                    storage.nextId('detalleVentas'),
      venta_id:              ventaId,
      articulo_id:           newItem.articulo_id,
      cantidad:              newItem.isGift ? 1 : (newItem.cantidad || 1),
      precio_monotributista: newItem.precio,
      costo:                 newItem.costo,
      sub_total:             newItem.isGift ? 0 : (newItem.precio * (newItem.cantidad || 1)),
      isGift:                newItem.isGift ? 1 : 0,
    }
    const newItems = [...items, item]
    storage.saveDetalleVentas([...storage.getDetalleVentas(), item])
    setItems(newItems)
    setNewItem(EMPTY_ITEM)
    persistVentaTotal(newItems, descuento, tipoDescuento)
    message.success('Artículo agregado')
  }

  const handleDeleteItem = (itemId) => {
    const newItems = items.filter(i => i.id !== itemId)
    storage.saveDetalleVentas(storage.getDetalleVentas().filter(d => d.id !== itemId))
    setItems(newItems)
    persistVentaTotal(newItems, descuento, tipoDescuento)
    message.success('Artículo eliminado')
  }

  const handleSaveDescuento = () => {
    persistVentaTotal(items, descuento, tipoDescuento)
    message.success('Descuento guardado')
  }

  const columns = [
    {
      title: 'Artículo',
      dataIndex: 'articulo_id',
      render: id => articulos.find(a => a.id === id)?.nombre ?? '-',
    },
    {
      title: 'Código',
      dataIndex: 'articulo_id',
      render: id => articulos.find(a => a.id === id)?.cod_articulo ?? '-',
      width: 90,
    },
    { title: 'Precio',    dataIndex: 'precio_monotributista', render: $, width: 110 },
    { title: 'Cant.',     dataIndex: 'cantidad',                             width: 70  },
    {
      title: 'Subtotal',
      dataIndex: 'sub_total',
      render: (v, r) => r.isGift ? <Tag color="blue">REGALO</Tag> : $(v),
      width: 120,
    },
    {
      title: '',
      width: 56,
      render: (_, r) => (
        <Popconfirm
          title="¿Eliminar este artículo?"
          onConfirm={() => handleDeleteItem(r.id)}
          okText="Sí" cancelText="No"
        >
          <Button icon={<DeleteOutlined />} size="small" danger />
        </Popconfirm>
      ),
    },
  ]

  if (!venta) return <div>Venta no encontrada</div>

  return (
    <div>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/ventas')}
        style={{ marginBottom: 16 }}
      >
        Volver a Ventas
      </Button>

      <Card
        title={
          <Space>
            <Title level={4} style={{ margin: 0 }}>{venta.nroVenta}</Title>
            <Tag color={venta.estado !== 0 ? 'green' : 'red'}>
              {venta.estado !== 0 ? 'Activa' : 'Anulada'}
            </Tag>
          </Space>
        }
        extra={<Text type="secondary">{venta.fecha_venta}</Text>}
        style={{ marginBottom: 16 }}
      >
        <Row gutter={24}>
          <Col span={8}>
            <Text type="secondary">Cliente</Text>
            <div><Text strong>{cliente?.farmacia ?? '-'}</Text></div>
            <div><Text type="secondary">{cliente ? `${cliente.nombre ?? ''} ${cliente.apellido ?? ''}`.trim() : ''}</Text></div>
          </Col>
          <Col span={8}>
            <Text type="secondary">Localidad</Text>
            <div><Text>{cliente?.localidad ?? '-'}</Text></div>
            <Text type="secondary">Zona</Text>
            <div><Text>{storage.getZonas().find(z => z.id === cliente?.zona_id)?.nombre ?? '-'}</Text></div>
          </Col>
          <Col span={8}>
            <Statistic title="Total" value={venta.total_con_descuento} formatter={$} />
          </Col>
        </Row>
      </Card>

      <Card
        title="Artículos de la venta"
        extra={
          venta.estado !== 0 && (
            <Space wrap>
              <Text type="secondary">Descuento / Aumento:</Text>
              <Select
                value={tipoDescuento}
                onChange={setTipoDescuento}
                options={[{ value: 0, label: 'Descuento' }, { value: 1, label: 'Aumento' }]}
                style={{ width: 120 }}
              />
              <InputNumber
                min={0} max={100}
                value={descuento}
                onChange={setDescuento}
                addonAfter="%"
                style={{ width: 110 }}
              />
              <Button icon={<SaveOutlined />} onClick={handleSaveDescuento}>
                Guardar
              </Button>
            </Space>
          )
        }
      >
        <Table
          dataSource={items}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={false}
          summary={() => (
            <Table.Summary>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={4} align="right">
                  <Text strong>Subtotal:</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text strong>{$(subtotal)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell />
              </Table.Summary.Row>
              {descuento > 0 && (
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={4} align="right">
                    <Text type={tipoDescuento === 0 ? 'success' : 'danger'}>
                      {tipoDescuento === 0 ? `Descuento ${descuento}%:` : `Aumento ${descuento}%:`}
                    </Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text type={tipoDescuento === 0 ? 'success' : 'danger'}>
                      {tipoDescuento === 0
                        ? `-${$(subtotal * descuento / 100)}`
                        : `+${$(subtotal * descuento / 100)}`
                      }
                    </Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell />
                </Table.Summary.Row>
              )}
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={4} align="right">
                  <Text strong style={{ fontSize: 16 }}>TOTAL:</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text strong style={{ fontSize: 16, color: '#1677ff' }}>{$(totalFinal)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell />
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />

        {venta.estado !== 0 && (
          <>
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
                <div style={{ marginBottom: 4, fontSize: 12, color: '#888' }}>Precio ($)</div>
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
                  disabled={newItem.isGift}
                  style={{ width: 80 }}
                />
              </div>
              <div>
                <div style={{ marginBottom: 4, fontSize: 12, color: '#888' }}>Regalo</div>
                <Checkbox
                  checked={newItem.isGift}
                  onChange={e => setNewItem(p => ({ ...p, isGift: e.target.checked }))}
                >
                  Sí
                </Checkbox>
              </div>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddItem}>
                Agregar
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
