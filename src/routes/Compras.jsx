import { useState } from 'react'
import {
  Table, Button, Modal, Form, DatePicker,
  Space, Popconfirm, message, Typography,
} from 'antd'
import { PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { storage } from '../data/storage'

const { Title } = Typography
const $ = (n) => `$${new Intl.NumberFormat('es-AR').format(Math.round(n || 0))}`

export default function Compras() {
  const [compras, setCompras] = useState(() => storage.getCompras())
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const reload = () => setCompras(storage.getCompras())

  const handleDelete = (id) => {
    storage.saveCompras(storage.getCompras().filter(c => c.id !== id))
    storage.saveDetalleCompras(storage.getDetalleCompras().filter(d => d.compra_id !== id))
    reload()
    message.success('Compra eliminada')
  }

  const handleCreate = () => {
    form.validateFields().then(values => {
      const all = storage.getCompras()
      const num = all.length + 1
      const newC = {
        id:           storage.nextId('compras'),
        nro_compra:   `C${String(num).padStart(3, '0')}`,
        fecha_compra: (values.fecha_compra ?? dayjs()).format('YYYY-MM-DD'),
        total:        0,
        estado:       1,
      }
      storage.saveCompras([...all, newC])
      reload()
      message.success(`Compra ${newC.nro_compra} creada`)
      setModalOpen(false)
      navigate(`/compras/${newC.id}`)
    })
  }

  const columns = [
    { title: 'Nro',    dataIndex: 'nro_compra',   width: 100 },
    { title: 'Fecha',  dataIndex: 'fecha_compra', width: 120 },
    { title: 'Total',  dataIndex: 'total',        render: $,  width: 140 },
    { title: 'Artículos', render: (_, r) => storage.getDetalleByCompra(r.id).length, width: 100 },
    {
      title: '',
      width: 110,
      render: (_, r) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => navigate(`/compras/${r.id}`)}
          >
            Ver
          </Button>
          <Popconfirm
            title="¿Eliminar esta compra?"
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
        <Title level={4} style={{ margin: 0 }}>Compras</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => { form.resetFields(); setModalOpen(true) }}
        >
          Nueva Compra
        </Button>
      </div>

      <Table
        dataSource={compras}
        columns={columns}
        rowKey="id"
        size="small"
        pagination={{ pageSize: 15, showSizeChanger: false }}
      />

      <Modal
        title="Nueva Compra"
        open={modalOpen}
        onOk={handleCreate}
        onCancel={() => setModalOpen(false)}
        okText="Crear"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="fecha_compra" label="Fecha de la compra" initialValue={dayjs()}>
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
