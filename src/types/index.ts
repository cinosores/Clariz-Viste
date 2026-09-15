export type Role = 'admin' | 'cortador' | 'vendedora';

export interface User {
  id: string;
  name: string;
  role: Role;
  roleLabel: string;
  avatar: string;
  email: string;
}

export interface Vendedora {
  id: string;
  name: string;
  codigo: string;
  activa: boolean;
  colorBadge: string;
}

export interface Articulo {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  temporada: string;
  descripcion: string;
  imagen: string;
  curvaDefecto: {
    nombre: string;
    talles: string[];
    factor: number; // e.g. 8 prendas por curva
  };
  coloresDisponibles: string[];
  telaPrincipal: string;
  costoFabricacion: number; // Costo unitario (corte, confección, avíos)
  precioVenta: number;      // Precio de venta al público / retail
  precioMayorista: number;  // Precio de venta por curva / mayorista
  stock: Record<string, Record<string, number>>; // color -> { talle: cantidad }
  stockMinimoAlerta: number;
}

export interface FilaCorteColor {
  id: string;
  color: string;
  capas: number;
  curvaFactor: number; // multiplicador de talles (ej. 8)
  prendasCalculadas: number; // capas * curvaFactor
  kilos: number; // peso del rollo usado en kg
}

export interface ComplementarioCorte {
  id: string;
  tipo: string; // ej. "Morley puño y cintura", "Rib", "Forro capucha"
  color: string;
  capas: number;
  factor: number;
}

export interface AdelantoPago {
  id: string;
  concepto: string; // ej: "Adelanto x marcado", "Pago cortador"
  monto: number;
  fecha: string;
}

export interface FichaCorte {
  id: string;
  numeroCorte: number;
  articuloId: string;
  articuloNombre: string;
  modeloCodigo: string; // ej. B-14
  curvaNombre: string;  // ej. "Curva 10-16"
  curvaFactor: number;  // ej. 8 talles
  tallesNombres: string[]; // ej. ["10", "12", "14", "16"]
  fecha: string;
  telaPrincipal: string; // ej. "Frisa Peinada"
  anchoTela: string;     // ej. "1.60 m"
  cortadorNombre: string;
  filasColor: FilaCorteColor[];
  complementarios: ComplementarioCorte[];
  totalCapas: number;
  totalPrendas: number;
  totalKilos: number;
  rendimientoKgPrenda: number; // kilos / prendas
  adelantos: AdelantoPago[];
  estado: 'borrador' | 'cortado' | 'enviado_taller' | 'ingresado_stock';
  fechaIngresoStock?: string;
  observaciones: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  documento: string; // DNI o CUIT
  tipoDocumento: 'DNI' | 'CUIT';
  condicionIva: 'Consumidor Final' | 'Responsable Inscripto' | 'Monotributo' | 'Exento';
  telefono: string;
  email: string;
  direccion: string;
  ciudad: string;
  totalCompras: number;
  ultimaCompra?: string;
}

export interface CartItem {
  articuloId: string;
  articuloCodigo: string;
  articuloNombre: string;
  categoria: string;
  color: string;
  talle: string;
  cantidad: number;
  precioUnitario: number;
  costoUnitario: number;
  subtotal: number;
  stockDisponible: number;
  imagen: string;
}

export interface FacturaElectronica {
  id: string;
  numeroComprobante: string; // ej. B-0001-00000428
  puntoVenta: number;
  tipoComprobante: 'Factura B' | 'Factura A' | 'Factura C' | 'Ticket Fiscal';
  fechaEmision: string;
  cliente: Cliente;
  vendedora: Vendedora;
  items: CartItem[];
  metodoPago: 'Efectivo' | 'Transferencia Bancaria' | 'Tarjeta de Débito' | 'Tarjeta de Crédito' | 'Mercado Pago';
  subtotal: number;
  descuento: number;
  iva: number; // 21% para A/B
  total: number;
  costoTotal: number;
  gananciaNeta: number;
  margenPorcentaje: number;
  cae: string; // Código de Autorización Electrónica AFIP
  caeVencimiento: string;
  qrData: string;
  estado: 'emitida' | 'anulada';
  notas?: string;
}
