import { useState } from 'react'
import { Layout, Menu, Button, Typography, Popconfirm, message, Tag } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  DollarOutlined,
  AccountBookOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { storage } from '../data/storage'
import { seedDemoData } from '../data/seedData'

const { Sider, Content, Header } = Layout
const { Text } = Typography

const menuItems = [
  { key: '/',              icon: <DashboardOutlined />,     label: 'Dashboard' },
  { key: '/articulos',     icon: <MedicineBoxOutlined />,   label: 'Artículos' },
  { key: '/clientes',      icon: <TeamOutlined />,          label: 'Clientes' },
  { key: '/ventas',        icon: <ShoppingCartOutlined />,  label: 'Ventas' },
  { key: '/compras',       icon: <ShopOutlined />,          label: 'Compras' },
  { key: '/gastos',        icon: <DollarOutlined />,        label: 'Gastos' },
  { key: '/resumen-cuenta',icon: <AccountBookOutlined />,   label: 'Cuenta Corriente' },
]

export default function MenuLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const selectedKey =
    menuItems.find(item =>
      location.pathname === item.key ||
      (item.key !== '/' && location.pathname.startsWith(item.key + '/'))
    )?.key ?? '/'

  const handleReset = () => {
    storage.resetAll()
    seedDemoData()
    message.success('Demo reiniciada con datos de ejemplo')
    navigate('/')
    window.location.reload()
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={220}
        style={{ background: '#001529', position: 'relative' }}
      >
        <div style={{
          padding: collapsed ? '20px 8px' : '20px 16px',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          marginBottom: 8,
        }}>
          {collapsed ? (
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>A</Text>
          ) : (
            <>
              <Text strong style={{ color: '#fff', fontSize: 20, display: 'block' }}>
                Ariel
              </Text>
              <Tag color="gold" style={{ marginTop: 4, fontSize: 10 }}>DEMO</Tag>
            </>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />

        {!collapsed && (
          <div style={{ position: 'absolute', bottom: 16, left: 8, right: 8 }}>
            <Popconfirm
              title="¿Resetear demo?"
              description="Se restaurarán los datos de ejemplo originales."
              onConfirm={handleReset}
              okText="Sí, resetear"
              cancelText="Cancelar"
            >
              <Button
                icon={<ReloadOutlined />}
                block
                size="small"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: 'none' }}
              >
                Resetear Demo
              </Button>
            </Popconfirm>
          </div>
        )}
      </Sider>

      <Layout>
        <Header style={{
          background: '#fff',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #f0f0f0',
          gap: 12,
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16, width: 40, height: 40 }}
          />
          <Text style={{ color: '#888', fontSize: 13 }}>
            Sistema de Gestión Comercial —{' '}
            <Text style={{ color: '#1677ff', fontSize: 13 }}>
              Modo Demo (datos guardados en memoria local del navegador)
            </Text>
          </Text>
        </Header>

        <Content style={{ padding: 24, background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
