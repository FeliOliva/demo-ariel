import { useState } from 'react'
import {
  Table, Button, Modal, Form, Input, InputNumber,
  DatePicker, Space, Popconfirm, message, Typography, Statistic, Card,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { storage } from '../data/storage'

const { Title } = Typography
const $ = (n) => `$${new Intl.NumberFormat('es-AR').format(Math.round(n || 0))}`

export default function Gastos() {
  const [gastos,   setGastos]   = useState(() => storage.getGastos().filter(g => g.estado !== 0))
  const [modalOpen, setModalOpen] = useState(false)
  const [editing,   setEditing]   = useState(null)
  const [form] = Form.useForm()

  const reload = () => setGastos(storage.getGastos().filter(g => g.estado !== 0))

  const openAdd  = () => { setEditing(null); form.resetFields(); setModalOpen(true) }
  const openEdit = (r) => {
    setEditing(r)
    form.setFieldsValue({ ...r, fecha: dayjs(r.fecha) })
    setModalOpen(true)
  }

  const handleDelete = (id) => {
    const updated = storage.getGastos().map(g => g.id === id ? { ...g, estado: 0 } : g)
    storage.saveGastos(updated)
    reload()
    message.success('Gasto eliminado')
  }

  const handleSave = () => {
    form.validateFields().then(values => {
      const formatted = {
        ...values,
        fecha: (values.fecha ?? dayjs()).format('YYYY-MM-DD'),
      }
      const all = storage.getGastos()
      let updated
      if (editing) {
        updated = all.map(g => g.id === editing.id ? { ...g, ...formatted } : g)
        message.success('Gasto actualizado')
      } else {
        updated = [...all, { id: storage.nextId('gastos'), ...formatted, estado: 1 }]
        message.success('Gasto agregado')
      }
      storage.saveGastos(updated)
      reload()
      setModalOpen(false)
    })
  }

  const total = gastos.reduce((s, g) => s + (g.monto || 0), 0)

  const columns = [
    { title: 'Motivo', dataIndex: 'nombre', ellipsis: true },
    { title: 'Monto',  dataIndex: 'monto',  render: $, width: 130 },
    { title: 'Fecha',  dataIndex: 'fecha',             width: 110 },
    {
      title: '',
      width: 90,
      render: (_, r) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(r)} />
          <Popconfirm
            title="¿Eliminar gasto?"
            onConfirm={() => handleDelete(r.id)}
            okText="Sí" cancelText="No"
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Gastos</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
          Nuevo Gasto
        </Button>
      </div>

      <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: '16px 24px' }}>
        <Statistic
          title="Total gastos registrados"
          value={total}
          formatter={$}
          valueStyle={{ color: '#ff4d4f' }}
        />
      </Card>

      <Table
        dataSource={gastos}
        columns={columns}
        rowKey="id"
        size="small"
        pagination={{ pageSize: 15, showSizeChanger: false }}
      />

      <Modal
        title={editing ? 'Editar Gasto' : 'Nuevo Gasto'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="nombre" label="Motivo / Descripción" rules={[{ required: true }]}>
            <Input placeholder="Ej: Combustible camioneta" />
          </Form.Item>
          <Form.Item name="monto" label="Monto ($)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} prefix="$" />
          </Form.Item>
          <Form.Item name="fecha" label="Fecha" initialValue={dayjs()}>
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
