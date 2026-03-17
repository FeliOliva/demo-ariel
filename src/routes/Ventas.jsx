import { useState } from 'react'
import {
  Table, Button, Modal, Form, Select, DatePicker,
  Space, Tag, Popconfirm, message, Typography,
} from 'antd'
import { PlusOutlined, EyeOutlined, StopOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { storage } from '../data/storage'

const { Title } = Typography
const $ = (n) => `$${new Intl.NumberFormat('es-AR').format(Math.round(n || 0))}`

export default function Ventas() {
  const [ventas,  setVentas]  = useState(() => storage.getVentas())
  const clientes = storage.getClientes().filter(c => c.estado !== 0)

  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const reload = () => setVentas(storage.getVentas())

  const handleAnular = (id) => {
    const updated = storage.getVentas().map(v => v.id === id ? { ...v, estado: 0 } : v)
    storage.saveVentas(updated)
    reload()
    message.success('Venta anulada')
  }

  const handleCreate = () => {
    form.validateFields().then(values => {
      const all   = storage.getVentas()
      const num   = all.length + 1
      const newV  = {
        id:                  storage.nextId('ventas'),
        nroVenta:            `V${String(num).padStart(5, '0')}`,
        cliente_id:          values.cliente_id,
        zona_id:             clientes.find(c => c.id === values.cliente_id)?.zona_id ?? null,
        fecha_venta:         (values.fecha_venta ?? dayjs()).format('YYYY-MM-DD'),
        total:               0,
        total_con_descuento: 0,
        descuento:           0,
        tipoDescuento:       0,
        estado:              1,
      }
      storage.saveVentas([...all, newV])
      reload()
      message.success(`Venta ${newV.nroVenta} creada`)
      setModalOpen(false)
      navigate(`/ventas/${newV.id}`)
    })
  }

  const columns = [
    { title: 'Nro',     dataIndex: 'nroVenta',            width: 100 },
    {
      title: 'Cliente',
      dataIndex: 'cliente_id',
      render: id => clientes.find(c => c.id === id)?.farmacia ?? '-',
    },
    { title: 'Fecha',   dataIndex: 'fecha_venta',         width: 110 },
    { title: 'Total',   dataIndex: 'total_con_descuento', render: $, width: 130 },
    {
      title: 'Estado',
      dataIndex: 'estado',
      width: 90,
      render: v => v !== 0
        ? <Tag color="green">Activa</Tag>
        : <Tag color="red">Anulada</Tag>,
    },
    {
      title: '',
      width: 110,
      render: (_, r) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => navigate(`/ventas/${r.id}`)}
          >
            Ver
          </Button>
          {r.estado !== 0 && (
            <Popconfirm
              title="¿Anular esta venta?"
              onConfirm={() => handleAnular(r.id)}
              okText="Sí" cancelText="No"
            >
              <Button icon={<StopOutlined />} size="small" danger />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Ventas</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => { form.resetFields(); setModalOpen(true) }}
        >
          Nueva Venta
        </Button>
      </div>

      <Table
        dataSource={ventas}
        columns={columns}
        rowKey="id"
        size="small"
        pagination={{ pageSize: 15, showSizeChanger: false }}
        rowClassName={r => r.estado === 0 ? 'row-anulada' : ''}
      />

      <Modal
        title="Nueva Venta"
        open={modalOpen}
        onOk={handleCreate}
        onCancel={() => setModalOpen(false)}
        okText="Crear"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="cliente_id"
            label="Cliente"
            rules={[{ required: true, message: 'Seleccioná un cliente' }]}
          >
            <Select
              showSearch
              placeholder="Buscar cliente..."
              options={clientes.map(c => ({
                value: c.id,
                label: `${c.farmacia} — ${c.nombre ?? ''} ${c.apellido ?? ''}`.trim(),
              }))}
              filterOption={(input, opt) =>
                opt.label.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item name="fecha_venta" label="Fecha" initialValue={dayjs()}>
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
