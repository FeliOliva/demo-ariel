import { useState, useMemo } from 'react'
import {
  Select, Card, Table, Typography, Space, Tag, Button,
  Modal, Form, InputNumber, DatePicker, message, Row, Col, Statistic, Alert,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { storage } from '../data/storage'

const { Title, Text } = Typography
const $ = (n) => `$${new Intl.NumberFormat('es-AR').format(Math.round(n || 0))}`

export default function ResumenCuenta() {
  const clientes = storage.getClientes().filter(c => c.estado !== 0)
  const [clienteId,  setClienteId]  = useState(null)
  const [pagos,      setPagos]      = useState(() => storage.getPagos())
  const [modalOpen,  setModalOpen]  = useState(false)
  const [form] = Form.useForm()

  const ventas = storage.getVentas()

  const { movimientos, totalVentas, totalPagos, saldo } = useMemo(() => {
    if (!clienteId) return { movimientos: [], totalVentas: 0, totalPagos: 0, saldo: 0 }

    const cv = ventas.filter(v => v.cliente_id === clienteId && v.estado !== 0)
    const cp = pagos.filter(p  => p.cliente_id === clienteId && p.estado !== 0)

    const movimientos = [
      ...cv.map(v => ({
        key:         `v-${v.id}`,
        tipo:        'Venta',
        descripcion: v.nroVenta,
        debe:        v.total_con_descuento || v.total,
        haber:       0,
        fecha:       v.fecha_venta,
      })),
      ...cp.map(p => ({
        key:         `p-${p.id}`,
        tipo:        'Pago',
        descripcion: p.metodo_pago ?? 'Pago',
        debe:        0,
        haber:       p.monto,
        fecha:       p.fecha_pago,
      })),
    ].sort((a, b) => new Date(a.fecha) - new Date(b.fecha))

    const totalVentas = cv.reduce((s, v) => s + (v.total_con_descuento || v.total || 0), 0)
    const totalPagos  = cp.reduce((s, p) => s + (p.monto || 0), 0)

    return { movimientos, totalVentas, totalPagos, saldo: totalVentas - totalPagos }
  }, [clienteId, pagos, ventas])

  const handleAddPago = () => {
    form.validateFields().then(values => {
      const newPago = {
        id:          storage.nextId('pagos'),
        cliente_id:  clienteId,
        monto:       values.monto,
        fecha_pago:  (values.fecha_pago ?? dayjs()).format('YYYY-MM-DD'),
        metodo_pago: values.metodo_pago ?? 'Efectivo',
        estado:      1,
      }
      const updated = [...storage.getPagos(), newPago]
      storage.savePagos(updated)
      setPagos(updated)
      message.success('Pago registrado')
      setModalOpen(false)
    })
  }

  const columns = [
    { title: 'Fecha', dataIndex: 'fecha', width: 110 },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      render: v => <Tag color={v === 'Venta' ? 'blue' : 'green'}>{v}</Tag>,
      width: 90,
    },
    { title: 'Referencia', dataIndex: 'descripcion' },
    {
      title: 'Debe',
      dataIndex: 'debe',
      render: v => v > 0 ? <Text type="danger">{$(v)}</Text> : <Text type="secondary">—</Text>,
      width: 130,
    },
    {
      title: 'Haber',
      dataIndex: 'haber',
      render: v => v > 0 ? <Text type="success">{$(v)}</Text> : <Text type="secondary">—</Text>,
      width: 130,
    },
  ]

  const cliente = clientes.find(c => c.id === clienteId)

  return (
    <div>
      <Title level={4}>Cuenta Corriente</Title>

      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text strong>Seleccioná un cliente:</Text>
          <Select
            showSearch
            style={{ width: '100%', maxWidth: 440 }}
            placeholder="Buscar cliente..."
            value={clienteId}
            onChange={setClienteId}
            options={clientes.map(c => ({
              value: c.id,
              label: `${c.farmacia} — ${c.nombre ?? ''} ${c.apellido ?? ''}`.trim(),
            }))}
            filterOption={(input, opt) =>
              opt.label.toLowerCase().includes(input.toLowerCase())
            }
          />
        </Space>
      </Card>

      {clienteId && (
        <>
          {cliente && (
            <Alert
              message={`${cliente.farmacia} · ${cliente.localidad ?? ''}`}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total Ventas"
                  value={totalVentas}
                  formatter={$}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total Cobrado"
                  value={totalPagos}
                  formatter={$}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Saldo Pendiente"
                  value={saldo}
                  formatter={$}
                  valueStyle={{ color: saldo > 0 ? '#ff4d4f' : '#52c41a' }}
                />
              </Card>
            </Col>
          </Row>

          <Card
            title="Movimientos"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => { form.resetFields(); setModalOpen(true) }}
              >
                Registrar Pago
              </Button>
            }
          >
            <Table
              dataSource={movimientos}
              columns={columns}
              rowKey="key"
              size="small"
              pagination={{ pageSize: 20, showSizeChanger: false }}
              locale={{ emptyText: 'Sin movimientos registrados' }}
            />
          </Card>
        </>
      )}

      <Modal
        title="Registrar Pago"
        open={modalOpen}
        onOk={handleAddPago}
        onCancel={() => setModalOpen(false)}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="monto" label="Monto ($)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} prefix="$" />
          </Form.Item>
          <Form.Item name="metodo_pago" label="Método de Pago" initialValue="Efectivo">
            <Select
              options={[
                { value: 'Efectivo',      label: 'Efectivo' },
                { value: 'Transferencia', label: 'Transferencia' },
                { value: 'Cheque',        label: 'Cheque' },
                { value: 'Tarjeta',       label: 'Tarjeta' },
              ]}
            />
          </Form.Item>
          <Form.Item name="fecha_pago" label="Fecha" initialValue={dayjs()}>
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
