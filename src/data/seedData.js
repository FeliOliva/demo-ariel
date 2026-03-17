import { storage } from './storage'

const d = (n) => {
  const dt = new Date()
  dt.setDate(dt.getDate() - n)
  return dt.toISOString().split('T')[0]
}

export function seedDemoData() {
  if (storage.isInitialized()) return

  storage.setAll('zonas', [
    { id: 1, nombre: 'Zona Norte' },
    { id: 2, nombre: 'Zona Sur' },
    { id: 3, nombre: 'Zona Centro' },
    { id: 4, nombre: 'Zona Este' },
    { id: 5, nombre: 'Zona Oeste' },
  ])

  storage.setAll('lineas', [
    { id: 1, nombre: 'Analgésicos' },
    { id: 2, nombre: 'Antibióticos' },
    { id: 3, nombre: 'Vitaminas y Suplementos' },
    { id: 4, nombre: 'Dermatología' },
    { id: 5, nombre: 'Cardiovascular' },
  ])

  storage.setAll('sublineas', [
    { id: 1, nombre: 'Ibuprofeno',        linea_id: 1 },
    { id: 2, nombre: 'Paracetamol',       linea_id: 1 },
    { id: 3, nombre: 'Penicilinas',       linea_id: 2 },
    { id: 4, nombre: 'Cefalosporinas',    linea_id: 2 },
    { id: 5, nombre: 'Vitamina C',        linea_id: 3 },
    { id: 6, nombre: 'Complejo B',        linea_id: 3 },
    { id: 7, nombre: 'Cremas',            linea_id: 4 },
    { id: 8, nombre: 'Ungüentos',         linea_id: 4 },
    { id: 9, nombre: 'Antihipertensivos', linea_id: 5 },
    { id: 10, nombre: 'Estatinas',        linea_id: 5 },
  ])

  storage.setAll('proveedores', [
    { id: 1, nombre: 'Laboratorios Roemmers' },
    { id: 2, nombre: 'Laboratorios Bagó' },
    { id: 3, nombre: 'Elea Phoenix' },
  ])

  storage.setAll('articulos', [
    { id: 1,  nombre: 'Ibuprofeno 400mg x 20 comp',       cod_articulo: 'A001', stock: 150, costo: 1800, precio_monotributista: 2800, linea_id: 1, sublinea_id: 1,  proveedor_id: 1, estado: 1 },
    { id: 2,  nombre: 'Ibuprofeno 600mg x 20 comp',       cod_articulo: 'A002', stock: 120, costo: 2200, precio_monotributista: 3500, linea_id: 1, sublinea_id: 1,  proveedor_id: 1, estado: 1 },
    { id: 3,  nombre: 'Paracetamol 500mg x 24 comp',      cod_articulo: 'A003', stock: 200, costo: 900,  precio_monotributista: 1600, linea_id: 1, sublinea_id: 2,  proveedor_id: 2, estado: 1 },
    { id: 4,  nombre: 'Amoxicilina 500mg x 12 cap',       cod_articulo: 'A004', stock: 80,  costo: 3500, precio_monotributista: 5200, linea_id: 2, sublinea_id: 3,  proveedor_id: 1, estado: 1 },
    { id: 5,  nombre: 'Amoxicilina 875mg x 10 comp',      cod_articulo: 'A005', stock: 60,  costo: 4800, precio_monotributista: 7200, linea_id: 2, sublinea_id: 3,  proveedor_id: 1, estado: 1 },
    { id: 6,  nombre: 'Cefalexina 500mg x 12 cap',        cod_articulo: 'A006', stock: 70,  costo: 4200, precio_monotributista: 6500, linea_id: 2, sublinea_id: 4,  proveedor_id: 2, estado: 1 },
    { id: 7,  nombre: 'Vitamina C 1g x 30 comp eferv',    cod_articulo: 'A007', stock: 250, costo: 1200, precio_monotributista: 2000, linea_id: 3, sublinea_id: 5,  proveedor_id: 3, estado: 1 },
    { id: 8,  nombre: 'Complejo B x 60 comp',             cod_articulo: 'A008', stock: 180, costo: 2800, precio_monotributista: 4500, linea_id: 3, sublinea_id: 6,  proveedor_id: 3, estado: 1 },
    { id: 9,  nombre: 'Vitamina D3 2000UI x 30 comp',     cod_articulo: 'A009', stock: 130, costo: 3200, precio_monotributista: 5000, linea_id: 3, sublinea_id: 5,  proveedor_id: 3, estado: 1 },
    { id: 10, nombre: 'Crema Hidratante 50g',             cod_articulo: 'A010', stock: 90,  costo: 2500, precio_monotributista: 4000, linea_id: 4, sublinea_id: 7,  proveedor_id: 2, estado: 1 },
    { id: 11, nombre: 'Betametasona Crema 30g',           cod_articulo: 'A011', stock: 55,  costo: 4500, precio_monotributista: 7000, linea_id: 4, sublinea_id: 7,  proveedor_id: 1, estado: 1 },
    { id: 12, nombre: 'Enalapril 10mg x 30 comp',         cod_articulo: 'A012', stock: 100, costo: 1800, precio_monotributista: 3000, linea_id: 5, sublinea_id: 9,  proveedor_id: 2, estado: 1 },
    { id: 13, nombre: 'Losartán 50mg x 30 comp',          cod_articulo: 'A013', stock: 95,  costo: 2100, precio_monotributista: 3500, linea_id: 5, sublinea_id: 9,  proveedor_id: 2, estado: 1 },
    { id: 14, nombre: 'Atorvastatina 20mg x 30 comp',     cod_articulo: 'A014', stock: 75,  costo: 3800, precio_monotributista: 6000, linea_id: 5, sublinea_id: 10, proveedor_id: 3, estado: 1 },
    { id: 15, nombre: 'Paracetamol 750mg x 20 comp',      cod_articulo: 'A015', stock: 160, costo: 1100, precio_monotributista: 1900, linea_id: 1, sublinea_id: 2,  proveedor_id: 2, estado: 1 },
    { id: 16, nombre: 'Metformina 500mg x 30 comp',       cod_articulo: 'A016', stock: 110, costo: 1600, precio_monotributista: 2800, linea_id: 5, sublinea_id: 9,  proveedor_id: 1, estado: 1 },
    { id: 17, nombre: 'Omeprazol 20mg x 14 cap',          cod_articulo: 'A017', stock: 140, costo: 2200, precio_monotributista: 3800, linea_id: 3, sublinea_id: 6,  proveedor_id: 3, estado: 1 },
    { id: 18, nombre: 'Loratadina 10mg x 10 comp',        cod_articulo: 'A018', stock: 120, costo: 1400, precio_monotributista: 2400, linea_id: 3, sublinea_id: 6,  proveedor_id: 2, estado: 1 },
    { id: 19, nombre: 'Diclofenac 50mg x 20 comp',        cod_articulo: 'A019', stock: 85,  costo: 2000, precio_monotributista: 3200, linea_id: 1, sublinea_id: 1,  proveedor_id: 1, estado: 1 },
    { id: 20, nombre: 'Azitromicina 500mg x 3 comp',      cod_articulo: 'A020', stock: 45,  costo: 5500, precio_monotributista: 8500, linea_id: 2, sublinea_id: 3,  proveedor_id: 1, estado: 1 },
  ])

  storage.setAll('clientes', [
    { id: 1,  nombre: 'María',    apellido: 'González', farmacia: 'Farmacia San Martín',    direccion: 'Av. San Martín 1234',       localidad: 'Buenos Aires', zona_id: 1, estado: 1 },
    { id: 2,  nombre: 'Carlos',   apellido: 'Rodríguez',farmacia: 'Farmacia Central',        direccion: 'Belgrano 456',              localidad: 'Rosario',      zona_id: 2, estado: 1 },
    { id: 3,  nombre: 'Ana',      apellido: 'López',    farmacia: 'Farmacia del Pueblo',     direccion: 'Rivadavia 789',             localidad: 'Córdoba',      zona_id: 3, estado: 1 },
    { id: 4,  nombre: 'Roberto',  apellido: 'Martínez', farmacia: 'Farmacia Norte',          direccion: 'Mitre 321',                 localidad: 'Tucumán',      zona_id: 4, estado: 1 },
    { id: 5,  nombre: 'Laura',    apellido: 'García',   farmacia: 'Farmacia Vita',           direccion: 'Sarmiento 654',             localidad: 'Mendoza',      zona_id: 5, estado: 1 },
    { id: 6,  nombre: 'Jorge',    apellido: 'Fernández',farmacia: 'Farmacia Sol',            direccion: 'Corrientes 987',            localidad: 'La Plata',     zona_id: 1, estado: 1 },
    { id: 7,  nombre: 'Patricia', apellido: 'Díaz',     farmacia: 'Farmacia Salud Total',    direccion: 'Libertad 147',              localidad: 'Mar del Plata',zona_id: 2, estado: 1 },
    { id: 8,  nombre: 'Miguel',   apellido: 'Torres',   farmacia: 'Farmacia Bienestar',      direccion: 'Colón 258',                 localidad: 'Salta',        zona_id: 4, estado: 1 },
    { id: 9,  nombre: 'Silvia',   apellido: 'Romero',   farmacia: 'Farmacia La Esperanza',   direccion: 'H. Yrigoyen 369',           localidad: 'Santa Fe',     zona_id: 3, estado: 1 },
    { id: 10, nombre: 'Diego',    apellido: 'Herrera',  farmacia: 'Farmacia Nueva Era',      direccion: 'Moreno 741',                localidad: 'Neuquén',      zona_id: 5, estado: 1 },
  ])

  storage.setAll('ventas', [
    { id: 1,  nroVenta: 'V00001', cliente_id: 1,  zona_id: 1, fecha_venta: d(90), total: 44800,  total_con_descuento: 44800,  descuento: 0, tipoDescuento: 0, estado: 1 },
    { id: 2,  nroVenta: 'V00002', cliente_id: 2,  zona_id: 2, fecha_venta: d(85), total: 32000,  total_con_descuento: 31040,  descuento: 3, tipoDescuento: 0, estado: 1 },
    { id: 3,  nroVenta: 'V00003', cliente_id: 3,  zona_id: 3, fecha_venta: d(78), total: 65800,  total_con_descuento: 65800,  descuento: 0, tipoDescuento: 0, estado: 1 },
    { id: 4,  nroVenta: 'V00004', cliente_id: 4,  zona_id: 4, fecha_venta: d(65), total: 29000,  total_con_descuento: 29000,  descuento: 0, tipoDescuento: 0, estado: 1 },
    { id: 5,  nroVenta: 'V00005', cliente_id: 5,  zona_id: 5, fecha_venta: d(55), total: 51600,  total_con_descuento: 49020,  descuento: 5, tipoDescuento: 0, estado: 1 },
    { id: 6,  nroVenta: 'V00006', cliente_id: 1,  zona_id: 1, fecha_venta: d(45), total: 38800,  total_con_descuento: 38800,  descuento: 0, tipoDescuento: 0, estado: 1 },
    { id: 7,  nroVenta: 'V00007', cliente_id: 6,  zona_id: 1, fecha_venta: d(38), total: 69500,  total_con_descuento: 69500,  descuento: 0, tipoDescuento: 0, estado: 1 },
    { id: 8,  nroVenta: 'V00008', cliente_id: 7,  zona_id: 2, fecha_venta: d(28), total: 39800,  total_con_descuento: 38606,  descuento: 3, tipoDescuento: 0, estado: 1 },
    { id: 9,  nroVenta: 'V00009', cliente_id: 2,  zona_id: 2, fecha_venta: d(18), total: 54600,  total_con_descuento: 54600,  descuento: 0, tipoDescuento: 0, estado: 1 },
    { id: 10, nroVenta: 'V00010', cliente_id: 8,  zona_id: 4, fecha_venta: d(10), total: 33000,  total_con_descuento: 33000,  descuento: 0, tipoDescuento: 0, estado: 1 },
    { id: 11, nroVenta: 'V00011', cliente_id: 3,  zona_id: 3, fecha_venta: d(5),  total: 47700,  total_con_descuento: 47700,  descuento: 0, tipoDescuento: 0, estado: 1 },
    { id: 12, nroVenta: 'V00012', cliente_id: 9,  zona_id: 3, fecha_venta: d(2),  total: 27200,  total_con_descuento: 27200,  descuento: 0, tipoDescuento: 0, estado: 1 },
  ])

  storage.setAll('detalleVentas', [
    // V1
    { id: 1,  venta_id: 1,  articulo_id: 1,  cantidad: 10, precio_monotributista: 2800, costo: 1800, sub_total: 28000, isGift: 0 },
    { id: 2,  venta_id: 1,  articulo_id: 3,  cantidad: 8,  precio_monotributista: 1600, costo: 900,  sub_total: 12800, isGift: 0 },
    { id: 3,  venta_id: 1,  articulo_id: 7,  cantidad: 2,  precio_monotributista: 2000, costo: 1200, sub_total: 4000,  isGift: 0 },
    { id: 4,  venta_id: 1,  articulo_id: 19, cantidad: 1,  precio_monotributista: 3200, costo: 2000, sub_total: 0,     isGift: 1 },
    // V2
    { id: 5,  venta_id: 2,  articulo_id: 4,  cantidad: 5,  precio_monotributista: 5200, costo: 3500, sub_total: 26000, isGift: 0 },
    { id: 6,  venta_id: 2,  articulo_id: 12, cantidad: 2,  precio_monotributista: 3000, costo: 1800, sub_total: 6000,  isGift: 0 },
    { id: 7,  venta_id: 2,  articulo_id: 3,  cantidad: 1,  precio_monotributista: 1600, costo: 900,  sub_total: 0,     isGift: 1 },
    // V3
    { id: 8,  venta_id: 3,  articulo_id: 2,  cantidad: 8,  precio_monotributista: 3500, costo: 2200, sub_total: 28000, isGift: 0 },
    { id: 9,  venta_id: 3,  articulo_id: 5,  cantidad: 4,  precio_monotributista: 7200, costo: 4800, sub_total: 28800, isGift: 0 },
    { id: 10, venta_id: 3,  articulo_id: 8,  cantidad: 2,  precio_monotributista: 4500, costo: 2800, sub_total: 9000,  isGift: 0 },
    // V4
    { id: 11, venta_id: 4,  articulo_id: 12, cantidad: 5,  precio_monotributista: 3000, costo: 1800, sub_total: 15000, isGift: 0 },
    { id: 12, venta_id: 4,  articulo_id: 13, cantidad: 4,  precio_monotributista: 3500, costo: 2100, sub_total: 14000, isGift: 0 },
    // V5
    { id: 13, venta_id: 5,  articulo_id: 14, cantidad: 5,  precio_monotributista: 6000, costo: 3800, sub_total: 30000, isGift: 0 },
    { id: 14, venta_id: 5,  articulo_id: 16, cantidad: 5,  precio_monotributista: 2800, costo: 1600, sub_total: 14000, isGift: 0 },
    { id: 15, venta_id: 5,  articulo_id: 17, cantidad: 2,  precio_monotributista: 3800, costo: 2200, sub_total: 7600,  isGift: 0 },
    // V6
    { id: 16, venta_id: 6,  articulo_id: 1,  cantidad: 6,  precio_monotributista: 2800, costo: 1800, sub_total: 16800, isGift: 0 },
    { id: 17, venta_id: 6,  articulo_id: 10, cantidad: 4,  precio_monotributista: 4000, costo: 2500, sub_total: 16000, isGift: 0 },
    { id: 18, venta_id: 6,  articulo_id: 7,  cantidad: 3,  precio_monotributista: 2000, costo: 1200, sub_total: 6000,  isGift: 0 },
    // V7
    { id: 19, venta_id: 7,  articulo_id: 6,  cantidad: 6,  precio_monotributista: 6500, costo: 4200, sub_total: 39000, isGift: 0 },
    { id: 20, venta_id: 7,  articulo_id: 20, cantidad: 3,  precio_monotributista: 8500, costo: 5500, sub_total: 25500, isGift: 0 },
    { id: 21, venta_id: 7,  articulo_id: 9,  cantidad: 1,  precio_monotributista: 5000, costo: 3200, sub_total: 5000,  isGift: 0 },
    // V8
    { id: 22, venta_id: 8,  articulo_id: 3,  cantidad: 10, precio_monotributista: 1600, costo: 900,  sub_total: 16000, isGift: 0 },
    { id: 23, venta_id: 8,  articulo_id: 15, cantidad: 10, precio_monotributista: 1900, costo: 1100, sub_total: 19000, isGift: 0 },
    { id: 24, venta_id: 8,  articulo_id: 18, cantidad: 2,  precio_monotributista: 2400, costo: 1400, sub_total: 4800,  isGift: 0 },
    // V9
    { id: 25, venta_id: 9,  articulo_id: 4,  cantidad: 6,  precio_monotributista: 5200, costo: 3500, sub_total: 31200, isGift: 0 },
    { id: 26, venta_id: 9,  articulo_id: 5,  cantidad: 2,  precio_monotributista: 7200, costo: 4800, sub_total: 14400, isGift: 0 },
    { id: 27, venta_id: 9,  articulo_id: 8,  cantidad: 2,  precio_monotributista: 4500, costo: 2800, sub_total: 9000,  isGift: 0 },
    // V10
    { id: 28, venta_id: 10, articulo_id: 11, cantidad: 3,  precio_monotributista: 7000, costo: 4500, sub_total: 21000, isGift: 0 },
    { id: 29, venta_id: 10, articulo_id: 10, cantidad: 3,  precio_monotributista: 4000, costo: 2500, sub_total: 12000, isGift: 0 },
    // V11
    { id: 30, venta_id: 11, articulo_id: 2,  cantidad: 6,  precio_monotributista: 3500, costo: 2200, sub_total: 21000, isGift: 0 },
    { id: 31, venta_id: 11, articulo_id: 6,  cantidad: 3,  precio_monotributista: 6500, costo: 4200, sub_total: 19500, isGift: 0 },
    { id: 32, venta_id: 11, articulo_id: 18, cantidad: 3,  precio_monotributista: 2400, costo: 1400, sub_total: 7200,  isGift: 0 },
    // V12
    { id: 33, venta_id: 12, articulo_id: 17, cantidad: 4,  precio_monotributista: 3800, costo: 2200, sub_total: 15200, isGift: 0 },
    { id: 34, venta_id: 12, articulo_id: 18, cantidad: 5,  precio_monotributista: 2400, costo: 1400, sub_total: 12000, isGift: 0 },
    { id: 35, venta_id: 12, articulo_id: 7,  cantidad: 1,  precio_monotributista: 2000, costo: 1200, sub_total: 0,     isGift: 1 },
  ])

  storage.setAll('compras', [
    { id: 1, nro_compra: 'C001', fecha_compra: d(95), total: 199000, estado: 1 },
    { id: 2, nro_compra: 'C002', fecha_compra: d(60), total: 156000, estado: 1 },
    { id: 3, nro_compra: 'C003', fecha_compra: d(30), total: 218000, estado: 1 },
  ])

  storage.setAll('detalleCompras', [
    { id: 1,  compra_id: 1, articulo_id: 1,  cantidad: 50,  costo: 1600, precio_monotributista: 2600 },
    { id: 2,  compra_id: 1, articulo_id: 3,  cantidad: 100, costo: 800,  precio_monotributista: 1450 },
    { id: 3,  compra_id: 1, articulo_id: 7,  cantidad: 80,  costo: 1100, precio_monotributista: 1800 },
    { id: 4,  compra_id: 1, articulo_id: 12, cantidad: 50,  costo: 1600, precio_monotributista: 2700 },
    { id: 5,  compra_id: 2, articulo_id: 4,  cantidad: 30,  costo: 3200, precio_monotributista: 4900 },
    { id: 6,  compra_id: 2, articulo_id: 5,  cantidad: 25,  costo: 4400, precio_monotributista: 6800 },
    { id: 7,  compra_id: 2, articulo_id: 6,  cantidad: 30,  costo: 3800, precio_monotributista: 5900 },
    { id: 8,  compra_id: 3, articulo_id: 14, cantidad: 40,  costo: 3500, precio_monotributista: 5500 },
    { id: 9,  compra_id: 3, articulo_id: 16, cantidad: 60,  costo: 1400, precio_monotributista: 2500 },
    { id: 10, compra_id: 3, articulo_id: 20, cantidad: 25,  costo: 5000, precio_monotributista: 7800 },
  ])

  storage.setAll('gastos', [
    { id: 1,  nombre: 'Combustible camioneta',      monto: 25000, fecha: d(88), estado: 1 },
    { id: 2,  nombre: 'Mantenimiento vehículo',     monto: 45000, fecha: d(75), estado: 1 },
    { id: 3,  nombre: 'Papelería y útiles',          monto: 8500,  fecha: d(62), estado: 1 },
    { id: 4,  nombre: 'Combustible camioneta',      monto: 27000, fecha: d(55), estado: 1 },
    { id: 5,  nombre: 'Internet y telefonía',        monto: 12000, fecha: d(45), estado: 1 },
    { id: 6,  nombre: 'Alquiler depósito',           monto: 80000, fecha: d(35), estado: 1 },
    { id: 7,  nombre: 'Combustible camioneta',      monto: 26000, fecha: d(25), estado: 1 },
    { id: 8,  nombre: 'Reparación refrigerador',    monto: 35000, fecha: d(18), estado: 1 },
    { id: 9,  nombre: 'Seguro vehículo',             monto: 42000, fecha: d(10), estado: 1 },
    { id: 10, nombre: 'Combustible camioneta',      monto: 28000, fecha: d(3),  estado: 1 },
  ])

  storage.setAll('pagos', [
    { id: 1,  cliente_id: 1, monto: 40000, fecha_pago: d(80), metodo_pago: 'Efectivo',      estado: 1 },
    { id: 2,  cliente_id: 2, monto: 30000, fecha_pago: d(70), metodo_pago: 'Transferencia', estado: 1 },
    { id: 3,  cliente_id: 3, monto: 65000, fecha_pago: d(60), metodo_pago: 'Cheque',        estado: 1 },
    { id: 4,  cliente_id: 1, monto: 38800, fecha_pago: d(50), metodo_pago: 'Efectivo',      estado: 1 },
    { id: 5,  cliente_id: 4, monto: 25000, fecha_pago: d(45), metodo_pago: 'Transferencia', estado: 1 },
    { id: 6,  cliente_id: 5, monto: 50000, fecha_pago: d(35), metodo_pago: 'Efectivo',      estado: 1 },
    { id: 7,  cliente_id: 6, monto: 70000, fecha_pago: d(28), metodo_pago: 'Transferencia', estado: 1 },
    { id: 8,  cliente_id: 7, monto: 38606, fecha_pago: d(20), metodo_pago: 'Cheque',        estado: 1 },
    { id: 9,  cliente_id: 2, monto: 55000, fecha_pago: d(12), metodo_pago: 'Transferencia', estado: 1 },
    { id: 10, cliente_id: 8, monto: 30000, fecha_pago: d(5),  metodo_pago: 'Efectivo',      estado: 1 },
  ])

  storage.setCounter('articulos',      20)
  storage.setCounter('clientes',       10)
  storage.setCounter('ventas',         12)
  storage.setCounter('detalleVentas',  35)
  storage.setCounter('compras',         3)
  storage.setCounter('detalleCompras', 10)
  storage.setCounter('gastos',         10)
  storage.setCounter('pagos',          10)

  storage.markInitialized()
}
