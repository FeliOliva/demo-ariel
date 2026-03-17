import { useState } from 'react'
import {
  Table, Button, Modal, Form, Input, InputNumber,
  Select, Space, Tag, Popconfirm, message, Typography,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { storage } from '../data/storage'

const { Title } = Typography
const $ = (n) => `$${new Intl.NumberFormat('es-AR').format(Math.round(n || 0))}`

export default function Articulos() {
  const [articulos, setArticulos] = useState(() => storage.getArticulos().filter(a => a.estado !== 0))
  const lineas      = storage.getLineas()
  const proveedores = storage.getProveedores()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing,   setEditing]   = useState(null)
  const [form] = Form.useForm()

  const openAdd  = () => { setEditing(null); form.resetFields(); setModalOpen(true) }
  const openEdit = (r) => { setEditing(r); form.setFieldsValue(r); setModalOpen(true) }

  const reload = () => setArticulos(storage.getArticulos().filter(a => a.estado !== 0))

  const handleDelete = (id) => {
    const updated = storage.getArticulos().map(a => a.id === id ? { ...a, estado: 0 } : a)
    storage.saveArticulos(updated)
    reload()
    message.success('Artículo eliminado')
  }

  const handleSave = () => {
    form.validateFields().then(values => {
      const all = storage.getArticulos()
      let updated
      if (editing) {
        updated = all.map(a => a.id === editing.id ? { ...a, ...values } : a)
        message.success('Artículo actualizado')
      } else {
        updated = [...all, { id: storage.nextId('articulos'), ...values, stock: values.stock ?? 0, estado: 1 }]
        message.success('Artículo agregado')
      }
      storage.saveArticulos(updated)
      reload()
      setModalOpen(false)
    })
  }

  const columns = [
    { title: 'Código',      dataIndex: 'cod_articulo', width: 100 },
    { title: 'Nombre',      dataIndex: 'nombre',       ellipsis: true },
    {
      title: 'Línea',
      dataIndex: 'linea_id',
      render: id => lineas.find(l => l.id === id)?.nombre ?? '-',
      width: 160,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      width: 80,
      render: v => (
        <Tag color={v > 50 ? 'green' : v > 10 ? 'orange' : 'red'}>{v}</Tag>
      ),
    },
    { title: 'Costo',       dataIndex: 'costo',                  render: $, width: 120 },
    { title: 'Precio Venta',dataIndex: 'precio_monotributista',  render: $, width: 130 },
    {
      title: '',
      width: 90,
      render: (_, r) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(r)} />
          <Popconfirm
            title="¿Eliminar artículo?"
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Artículos ({articulos.length})</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
          Nuevo Artículo
        </Button>
      </div>

      <Table
        dataSource={articulos}
        columns={columns}
        rowKey="id"
        size="small"
        pagination={{ pageSize: 15, showSizeChanger: false }}
      />

      <Modal
        title={editing ? 'Editar Artículo' : 'Nuevo Artículo'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText="Guardar"
        cancelText="Cancelar"
        width={480}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <FlexRow gutter={12} style={{ display: 'flex' }}>
            <div style={{ flex: 1, padding: '0 6px' }}>
              <Form.Item name="cod_articulo" label="Código" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </div>
            <div style={{ flex: 3, padding: '0 6px' }}>
              <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </div>
          </FlexRow>
          <Form.Item name="linea_id" label="Línea">
            <Select
              options={lineas.map(l => ({ value: l.id, label: l.nombre }))}
              allowClear
              placeholder="Seleccionar línea"
            />
          </Form.Item>
          <Form.Item name="proveedor_id" label="Proveedor">
            <Select
              options={proveedores.map(p => ({ value: p.id, label: p.nombre }))}
              allowClear
              placeholder="Seleccionar proveedor"
            />
          </Form.Item>
          <Form.Item name="stock" label="Stock inicial">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="costo" label="Costo ($)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} prefix="$" />
          </Form.Item>
          <Form.Item name="precio_monotributista" label="Precio de Venta ($)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} prefix="$" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

const FlexRow = ({ gutter, style, children }) => (
  <div style={{ display: 'flex', gap: gutter?.[0] ?? 0, ...style }}>{children}</div>
)
