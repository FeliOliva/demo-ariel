const P = 'ariel_demo_'

const KEYS = {
  articulos:      `${P}articulos`,
  clientes:       `${P}clientes`,
  ventas:         `${P}ventas`,
  detalleVentas:  `${P}detalle_ventas`,
  compras:        `${P}compras`,
  detalleCompras: `${P}detalle_compras`,
  gastos:         `${P}gastos`,
  zonas:          `${P}zonas`,
  lineas:         `${P}lineas`,
  sublineas:      `${P}sublineas`,
  proveedores:    `${P}proveedores`,
  pagos:          `${P}pagos`,
}

function load(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function nextId(entity) {
  const k = `${P}ctr_${entity}`
  const n = parseInt(localStorage.getItem(k) || '0', 10) + 1
  localStorage.setItem(k, String(n))
  return n
}

function setCounter(entity, n) {
  localStorage.setItem(`${P}ctr_${entity}`, String(n))
}

export const storage = {
  getArticulos:      () => load(KEYS.articulos),
  saveArticulos:     (d) => save(KEYS.articulos, d),

  getClientes:       () => load(KEYS.clientes),
  saveClientes:      (d) => save(KEYS.clientes, d),

  getVentas:         () => load(KEYS.ventas),
  saveVentas:        (d) => save(KEYS.ventas, d),

  getDetalleVentas:        () => load(KEYS.detalleVentas),
  getDetalleByVenta: (id) => load(KEYS.detalleVentas).filter(d => d.venta_id === id),
  saveDetalleVentas: (d) => save(KEYS.detalleVentas, d),

  getCompras:        () => load(KEYS.compras),
  saveCompras:       (d) => save(KEYS.compras, d),

  getDetalleCompras:        () => load(KEYS.detalleCompras),
  getDetalleByCompra: (id) => load(KEYS.detalleCompras).filter(d => d.compra_id === id),
  saveDetalleCompras: (d) => save(KEYS.detalleCompras, d),

  getGastos:    () => load(KEYS.gastos),
  saveGastos:   (d) => save(KEYS.gastos, d),

  getZonas:       () => load(KEYS.zonas),
  getLineas:      () => load(KEYS.lineas),
  getSublineas:   () => load(KEYS.sublineas),
  getProveedores: () => load(KEYS.proveedores),

  getPagos:    () => load(KEYS.pagos),
  savePagos:   (d) => save(KEYS.pagos, d),

  nextId,
  setCounter,

  isInitialized:  () => localStorage.getItem(`${P}init`) === '1',
  markInitialized: () => localStorage.setItem(`${P}init`, '1'),

  resetAll() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(P))
      .forEach(k => localStorage.removeItem(k))
  },

  setAll: (key, data) => save(KEYS[key], data),
}
