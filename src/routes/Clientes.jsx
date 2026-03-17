import { useState } from 'react'
import {
  Table, Button, Modal, Form, Input, Select,
  Space, Popconfirm, message, Typography,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { storage } from '../data/storage'

const { Title } = Typography

export default function Clientes() {
  const [clientes, setClientes] = useState(() => storage.getClientes().filter(c => c.estado !== 0))
  const zonas = storage.getZonas()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing,   setEditing]   = useState(null)
  const [form] = Form.useForm()

  const reload = () => setClientes(storage.getClientes().filter(c => c.estado !== 0))

  const openAdd  = () => { setEditing(null); form.resetFields(); setModalOpen(true) }
  const openEdit = (r)=> { setEditing(r); form.setFieldsValue(r); setModalOpen(true) }

  const handleDelete = (id) => {
    const updated = storage.getClientes().map(c => c.id === id ? { ...c, estado: 0 } : c)
    storage.saveClientes(updated)
    reload()
    message.success('Cliente eliminado')
  }

  const handleSave = () => {
    form.validateFields().then(values => {
      const all = storage.getClientes()
      let updated
      if (editing) {
        updated = all.map(c => c.id === editing.id ? { ...c, ...values } : c)
        message.success('Cliente actualizado')
      } else {
        updated = [...all, { id: storage.nextId('clientes'), ...values, estado: 1 }]
        message.success('Cliente agregado')
      }
      storage.saveClientes(updated)
      reload()
      setModalOpen(false)
    })
  }

  const columns = [
    { title: 'Farmacia',   dataIndex: 'farmacia',  ellipsis: true },
    { title: 'Responsable',render: (_, r) => `${r.nombre ?? ''} ${r.apellido ?? ''}`.trim() || '-' },
    { title: 'Localidad',  dataIndex: 'localidad' },
    { title: 'Dirección',  dataIndex: 'direccion', ellipsis: true },
    {
      title: 'Zona',
      dataIndex: 'zona_id',
      render: id => zonas.find(z => z.id === id)?.nombre ?? '-',
      width: 130,
    },
    {
      title: '',
      width: 90,
      render: (_, r) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(r)} />
          <Popconfirm
            title="¿Eliminar cliente?"
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
        <Title level={4} style={{ margin: 0 }}>Clientes ({clientes.length})</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
          Nuevo Cliente
        </Button>
      </div>

      <Table
        dataSource={clientes}
        columns={columns}
        rowKey="id"
        size="small"
        pagination={{ pageSize: 15, showSizeChanger: false }}
      />

      <Modal
        title={editing ? 'Editar Cliente' : 'Nuevo Cliente'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText="Guardar"
        cancelText="Cancelar"
        width={480}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="farmacia" label="Nombre de la Farmacia" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="nombre" label="Nombre del Responsable">
            <Input />
          </Form.Item>
          <Form.Item name="apellido" label="Apellido">
            <Input />
          </Form.Item>
          <Form.Item name="direccion" label="Dirección">
            <Input />
          </Form.Item>
          <Form.Item name="localidad" label="Localidad">
            <Input />
          </Form.Item>
          <Form.Item name="zona_id" label="Zona">
            <Select
              options={zonas.map(z => ({ value: z.id, label: z.nombre }))}
              allowClear
              placeholder="Seleccionar zona"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
