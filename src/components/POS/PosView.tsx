import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Articulo, CartItem, Cliente, FacturaElectronica } from '../../types';
import { FacturaModal } from '../Facturas/FacturaModal';
import {
  ShoppingBag,
  Search,
  Plus,
  Minus,
  Trash2,
  UserCheck,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserPlus,
  ArrowRight,
  Boxes,
  Percent,
  X,
} from 'lucide-react';

export const PosView: React.FC = () => {
  const {
    articulos,
    vendedoras,
    vendedoraActual,
    setVendedoraActual,
    clientes,
    addCliente,
    cart,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    emitirFactura,
  } = useApp();

  // Search & Category
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // Item Selection Modal for Color & Talle
  const [selectedArticulo, setSelectedArticulo] = useState<Articulo | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedTalle, setSelectedTalle] = useState<string>('');
  const [selectedQty, setSelectedQty] = useState<number>(1);

  // Checkout State
  const [selectedClienteId, setSelectedClienteId] = useState<string>(
    clientes[0]?.id || 'cli-1'
  );
  const [tipoComprobante, setTipoComprobante] = useState<
    'Factura B' | 'Factura A' | 'Factura C' | 'Ticket Fiscal'
  >('Factura B');
  const [metodoPago, setMetodoPago] = useState<
    'Efectivo' | 'Transferencia Bancaria' | 'Tarjeta de Débito' | 'Tarjeta de Crédito' | 'Mercado Pago'
  >('Efectivo');
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState<number>(0);
  const [notas, setNotas] = useState('');

  // Quick Client Creation Modal
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [newClientNombre, setNewClientNombre] = useState('');
  const [newClientDoc, setNewClientDoc] = useState('');
  const [newClientTipoDoc, setNewClientTipoDoc] = useState<'DNI' | 'CUIT'>('DNI');
  const [newClientCondIva, setNewClientCondIva] = useState<
    'Consumidor Final' | 'Responsable Inscripto' | 'Monotributo' | 'Exento'
  >('Consumidor Final');
  const [newClientTel, setNewClientTel] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientDir, setNewClientDir] = useState('');

  // Invoice Success Modal
  const [emittedFactura, setEmittedFactura] = useState<FacturaElectronica | null>(null);
  const [showFacturaModal, setShowFacturaModal] = useState(false);

  // Categories list
  const categories = ['Todas', ...Array.from(new Set(articulos.map((a) => a.categoria)))];

  // Filtered Articles
  const filteredArticulos = articulos.filter((art) => {
    const matchesSearch =
      art.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.telaPrincipal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Todas' || art.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate total stock for an article
  const getArticleTotalStock = (art: Articulo) => {
    let total = 0;
    Object.values(art.stock).forEach((sizes) => {
      Object.values(sizes).forEach((q) => {
        total += q;
      });
    });
    return total;
  };

  // Open item picker
  const handleOpenItemPicker = (art: Articulo) => {
    setSelectedArticulo(art);
    const firstColor = art.coloresDisponibles[0] || 'Negro';
    setSelectedColor(firstColor);
    const firstTalle = art.curvaDefecto.talles[0] || '1';
    setSelectedTalle(firstTalle);
    setSelectedQty(1);
  };

  // Confirm Add to Cart
  const handleConfirmAddToCart = () => {
    if (!selectedArticulo || !selectedColor || !selectedTalle) return;

    const stockDisp = selectedArticulo.stock[selectedColor]?.[selectedTalle] || 0;
    if (stockDisp <= 0) {
      alert('No hay stock disponible para esta combinación de color y talle');
      return;
    }

    addToCart({
      articuloId: selectedArticulo.id,
      articuloCodigo: selectedArticulo.codigo,
      articuloNombre: selectedArticulo.nombre,
      categoria: selectedArticulo.categoria,
      color: selectedColor,
      talle: selectedTalle,
      cantidad: Math.min(selectedQty, stockDisp),
      precioUnitario: selectedArticulo.precioVenta,
      costoUnitario: selectedArticulo.costoFabricacion,
      stockDisponible: stockDisp,
      imagen: selectedArticulo.imagen,
    });

    setSelectedArticulo(null);
  };

  // Quick Client Save
  const handleSaveNewClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientNombre.trim()) return;

    const nuevo = addCliente({
      id: `cli-${Date.now()}`,
      nombre: newClientNombre.trim(),
      documento: newClientDoc.trim() || '99999999',
      tipoDocumento: newClientTipoDoc,
      condicionIva: newClientCondIva,
      telefono: newClientTel.trim() || '-',
      email: newClientEmail.trim() || '',
      direccion: newClientDir.trim() || '',
      ciudad: 'CABA',
      totalCompras: 0,
    });

    setSelectedClienteId(nuevo.id);
    if (nuevo.condicionIva === 'Responsable Inscripto') {
      setTipoComprobante('Factura A');
    } else {
      setTipoComprobante('Factura B');
    }

    setShowNewClientModal(false);
    // Reset form
    setNewClientNombre('');
    setNewClientDoc('');
    setNewClientTel('');
  };

  // Cart calculations
  const subtotalBruto = cart.reduce((acc, it) => acc + it.subtotal, 0);
  const descuentoMonto = Math.round(subtotalBruto * (descuentoPorcentaje / 100));
  const subtotalConDescuento = subtotalBruto - descuentoMonto;
  const ivaCalculado =
    tipoComprobante === 'Factura A'
      ? Math.round(subtotalConDescuento * 0.21)
      : Math.round(subtotalConDescuento - subtotalConDescuento / 1.21);
  const totalFinal =
    tipoComprobante === 'Factura A'
      ? subtotalConDescuento + ivaCalculado
      : subtotalConDescuento;

  // Selected client object
  const currentCliente =
    clientes.find((c) => c.id === selectedClienteId) || clientes[0];

  // Submit Invoice
  const handleEmitirFactura = () => {
    if (!currentCliente) return;

    const fac = emitirFactura({
      cliente: currentCliente,
      tipoComprobante,
      metodoPago,
      descuentoPorcentaje,
      notas,
    });

    if (fac) {
      setEmittedFactura(fac);
      setShowFacturaModal(true);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Vendedora Header Alert & Selector */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border-2 border-stone-800 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-4 text-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-stone-950 font-bold flex items-center justify-center shadow-md">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-serif tracking-tight text-white">
                Punto de Venta / Retail
              </h2>
              <span className="text-[11px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Stock en Vivo
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Control de caja, asignación de vendedora y facturación electrónica instantánea
            </p>
          </div>
        </div>

        {/* Vendedora Quick Switcher Pill (Required by User) */}
        <div className="bg-stone-800/90 border border-stone-700 p-1.5 rounded-xl flex items-center gap-1">
          <span className="text-xs text-stone-400 font-semibold px-2">
            Vendedora:
          </span>
          {vendedoras.map((v) => {
            const isSelected = v.id === vendedoraActual.id;
            return (
              <button
                key={v.id}
                onClick={() => setVendedoraActual(v)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'text-stone-300 hover:text-white hover:bg-stone-750'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    v.id === 'vend-1' ? 'bg-emerald-400' : 'bg-purple-400'
                  }`}
                />
                <span>{v.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Catalog (Left) + Cart & Checkout (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Catalog & Search (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Search & Category Pills */}
          <div className="bg-white p-4 rounded-xl border border-stone-300 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar prenda por nombre, código (MB-001) o tela..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-stone-900 text-amber-400 shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Garments Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredArticulos.map((art) => {
              const totalStock = getArticleTotalStock(art);
              const isLowStock = totalStock <= art.stockMinimoAlerta;

              return (
                <div
                  key={art.id}
                  className="bg-white rounded-xl border border-stone-300 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    {/* Image with Tag */}
                    <div className="relative h-40 bg-stone-100 overflow-hidden">
                      <img
                        src={art.imagen}
                        alt={art.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-stone-900/80 text-amber-400 text-[10px] font-mono font-bold backdrop-blur-xs">
                        {art.codigo}
                      </div>
                      <div className="absolute top-2 right-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            totalStock > 0
                              ? isLowStock
                                ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {totalStock > 0 ? `${totalStock} en stock` : 'Sin stock'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3.5">
                      <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                        {art.categoria}
                      </div>
                      <h3 className="text-sm font-bold text-stone-900 leading-snug mt-0.5">
                        {art.nombre}
                      </h3>
                      <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">
                        Tela: {art.telaPrincipal} · {art.curvaDefecto.nombre}
                      </p>

                      {/* Color swatches preview */}
                      <div className="flex items-center gap-1 mt-2">
                        {art.coloresDisponibles.slice(0, 4).map((c, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200"
                          >
                            {c}
                          </span>
                        ))}
                        {art.coloresDisponibles.length > 4 && (
                          <span className="text-[10px] text-stone-400">
                            +{art.coloresDisponibles.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="p-3.5 pt-0 border-t border-stone-100 flex items-center justify-between mt-2">
                    <div>
                      <span className="text-xs text-stone-500 block">Retail:</span>
                      <span className="text-base font-black text-stone-950 font-mono">
                        ${art.precioVenta.toLocaleString('es-AR')}
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenItemPicker(art)}
                      disabled={totalStock <= 0}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-white rounded-lg text-xs font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3.5 h-3.5" /> Seleccionar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right: Cart & Electronic Checkout (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border-2 border-stone-800 shadow-md p-5 sticky top-20 space-y-4">
            
            {/* Header Ticket */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-black text-stone-900">
                  Ticket de Venta
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 font-mono">
                  {cart.reduce((a, b) => a + b.cantidad, 0)} prendas
                </span>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-stone-400 hover:text-red-600"
                    title="Vaciar ticket"
                  >
                    Vaciar
                  </button>
                )}
              </div>
            </div>

            {/* Cart Items List */}
            <div className="max-h-56 overflow-y-auto space-y-2 pr-1 divide-y divide-stone-100">
              {cart.length > 0 ? (
                cart.map((item, idx) => (
                  <div key={`${item.articuloId}-${item.color}-${item.talle}`} className="pt-2 flex items-center justify-between text-xs gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-stone-900 truncate">
                        {item.articuloNombre}
                      </div>
                      <div className="text-stone-500 text-[11px]">
                        Color: <strong>{item.color}</strong> · Talle: <strong>{item.talle}</strong>
                      </div>
                      <div className="text-stone-700 font-mono font-semibold">
                        ${item.precioUnitario.toLocaleString('es-AR')} c/u
                      </div>
                    </div>

                    {/* Quantity Modifier */}
                    <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-lg border border-stone-200">
                      <button
                        onClick={() =>
                          updateCartQty(item.articuloId, item.color, item.talle, item.cantidad - 1)
                        }
                        className="w-5 h-5 rounded bg-white flex items-center justify-center text-stone-700 hover:bg-stone-200 font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-mono font-bold text-stone-900">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() =>
                          updateCartQty(item.articuloId, item.color, item.talle, item.cantidad + 1)
                        }
                        disabled={item.cantidad >= item.stockDisponible}
                        className="w-5 h-5 rounded bg-white flex items-center justify-center text-stone-700 hover:bg-stone-200 font-bold disabled:opacity-30"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Subtotal & Delete */}
                    <div className="text-right">
                      <div className="font-mono font-black text-stone-900">
                        ${item.subtotal.toLocaleString('es-AR')}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.articuloId, item.color, item.talle)}
                        className="text-[10px] text-stone-400 hover:text-red-500"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-stone-400">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">El ticket está vacío</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Hacé click en "Seleccionar" en cualquier prenda del catálogo.
                  </p>
                </div>
              )}
            </div>

            {/* Client & Fiscal Setup */}
            <div className="pt-3 border-t border-stone-200 space-y-3 text-xs">
              
              {/* Client Selector */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold uppercase tracking-wider text-stone-700">
                    Cliente / Receptor
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowNewClientModal(true)}
                    className="text-amber-700 hover:text-amber-900 font-bold flex items-center gap-0.5"
                  >
                    <UserPlus className="w-3 h-3" /> + Nuevo Cliente
                  </button>
                </div>
                <select
                  value={selectedClienteId}
                  onChange={(e) => {
                    setSelectedClienteId(e.target.value);
                    const cli = clientes.find((c) => c.id === e.target.value);
                    if (cli?.condicionIva === 'Responsable Inscripto') {
                      setTipoComprobante('Factura A');
                    } else {
                      setTipoComprobante('Factura B');
                    }
                  }}
                  className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-medium text-stone-800 outline-none"
                >
                  {clientes.map((cli) => (
                    <option key={cli.id} value={cli.id}>
                      {cli.nombre} ({cli.condicionIva} - {cli.documento})
                    </option>
                  ))}
                </select>
              </div>

              {/* Invoice Type & Payment Method */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Tipo de Factura
                  </label>
                  <select
                    value={tipoComprobante}
                    onChange={(e) => setTipoComprobante(e.target.value as any)}
                    className="w-full px-2 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-bold text-stone-800 outline-none"
                  >
                    <option value="Factura B">Factura B (Consumidor)</option>
                    <option value="Factura A">Factura A (Resp. Inscripto)</option>
                    <option value="Factura C">Factura C</option>
                    <option value="Ticket Fiscal">Ticket Fiscal</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Medio de Pago
                  </label>
                  <select
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value as any)}
                    className="w-full px-2 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-medium text-stone-800 outline-none"
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                    <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                    <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                    <option value="Mercado Pago">Mercado Pago</option>
                  </select>
                </div>
              </div>

              {/* Discount Selector */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold uppercase tracking-wider text-stone-700">
                    Descuento Promocional
                  </span>
                  <span className="font-mono text-stone-500">
                    {descuentoPorcentaje}% aplicado
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {[0, 5, 10, 15].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDescuentoPorcentaje(pct)}
                      className={`py-1 text-xs font-bold rounded border transition ${
                        descuentoPorcentaje === pct
                          ? 'bg-stone-900 text-amber-400 border-stone-900'
                          : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      {pct === 0 ? 'Sin desc.' : `${pct}% off`}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Calculations & Total */}
            <div className="pt-3 border-t-2 border-stone-800 space-y-1.5 text-xs font-medium">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span className="font-mono font-bold text-stone-800">
                  ${subtotalBruto.toLocaleString('es-AR')}
                </span>
              </div>
              {descuentoMonto > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Descuento ({descuentoPorcentaje}%):</span>
                  <span className="font-mono">-${descuentoMonto.toLocaleString('es-AR')}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-500 text-[11px]">
                <span>IVA (21%):</span>
                <span className="font-mono">${ivaCalculado.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between text-base font-black text-stone-950 pt-2 border-t border-stone-200">
                <span>TOTAL A COBRAR:</span>
                <span className="text-xl font-mono text-emerald-900 font-black">
                  ${totalFinal.toLocaleString('es-AR')}
                </span>
              </div>
            </div>

            {/* Electronic Invoicing Button */}
            <button
              onClick={handleEmitirFactura}
              disabled={cart.length === 0}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-sm rounded-xl shadow-md transition active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-stone-800"
            >
              <FileText className="w-4 h-4" />
              Emitir {tipoComprobante} & Cobrar
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[10px] text-center text-stone-500 font-medium">
              ⚡ Descuenta inventario automáticamente y genera CAE AFIP / ARCA oficial.
            </div>

          </div>
        </div>

      </div>

      {/* Color & Size Selector Modal */}
      {selectedArticulo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white border-2 border-stone-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-amber-600">
                  {selectedArticulo.codigo} · {selectedArticulo.categoria}
                </span>
                <h3 className="text-lg font-black text-stone-900">
                  {selectedArticulo.nombre}
                </h3>
              </div>
              <button
                onClick={() => setSelectedArticulo(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Color Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                1. Elegí el Color:
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedArticulo.coloresDisponibles.map((col) => {
                  const isSelected = selectedColor === col;
                  // Stock for this color
                  const colorStockTotal = Object.values(selectedArticulo.stock[col] || {}).reduce(
                    (a: number, b: number) => a + Number(b),
                    0
                  );
                  return (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-stone-900 text-amber-400 border-stone-900 shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-stone-400 bg-stone-300" />
                      {col} ({colorStockTotal})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Talle Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                2. Elegí el Talle ({selectedColor}):
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {selectedArticulo.curvaDefecto.talles.map((t) => {
                  const stockTalle = selectedArticulo.stock[selectedColor]?.[t] || 0;
                  const isSelected = selectedTalle === t;
                  const isAvailable = stockTalle > 0;

                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedTalle(t)}
                      className={`p-2 rounded-xl text-center border transition flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-amber-500 text-stone-950 font-black border-amber-600 shadow-xs'
                          : isAvailable
                          ? 'bg-stone-50 text-stone-800 border-stone-300 hover:bg-stone-100'
                          : 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <span className="text-sm font-bold">Talle {t}</span>
                      <span className="text-[10px] font-mono mt-0.5">
                        {stockTalle > 0 ? `${stockTalle} disp.` : 'Agotado'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Quantity & Live Price */}
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 block">Precio Unitario:</span>
                <span className="text-xl font-black text-stone-950 font-mono">
                  ${selectedArticulo.precioVenta.toLocaleString('es-AR')}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl border border-stone-300">
                  <button
                    onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                    className="w-7 h-7 bg-white rounded-lg flex items-center justify-center font-bold text-stone-800 hover:bg-stone-200"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-bold font-mono text-base">
                    {selectedQty}
                  </span>
                  <button
                    onClick={() => setSelectedQty(selectedQty + 1)}
                    className="w-7 h-7 bg-white rounded-lg flex items-center justify-center font-bold text-stone-800 hover:bg-stone-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleConfirmAddToCart}
                  className="px-5 py-2.5 bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-white rounded-xl text-sm font-bold transition shadow"
                >
                  Agregar al Ticket
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Quick New Client Modal */}
      {showNewClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white border-2 border-stone-800 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-amber-600" /> Registrar Nuevo Cliente
              </h3>
              <button
                onClick={() => setShowNewClientModal(false)}
                className="text-stone-400 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewClient} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Nombre Completo / Razón Social *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Boutique San Isidro / Camila López"
                  value={newClientNombre}
                  onChange={(e) => setNewClientNombre(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Tipo Doc
                  </label>
                  <select
                    value={newClientTipoDoc}
                    onChange={(e) => setNewClientTipoDoc(e.target.value as any)}
                    className="w-full px-2 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm"
                  >
                    <option value="DNI">DNI</option>
                    <option value="CUIT">CUIT</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Número Doc *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sin puntos ni guiones"
                    value={newClientDoc}
                    onChange={(e) => setNewClientDoc(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Condición Fiscal IVA
                </label>
                <select
                  value={newClientCondIva}
                  onChange={(e) => setNewClientCondIva(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm"
                >
                  <option value="Consumidor Final">Consumidor Final</option>
                  <option value="Responsable Inscripto">Responsable Inscripto (Factura A)</option>
                  <option value="Monotributo">Monotributo</option>
                  <option value="Exento">Exento</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="11 2345-6789"
                    value={newClientTel}
                    onChange={(e) => setNewClientTel(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="cliente@correo.com"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewClientModal(false)}
                  className="px-3 py-1.5 border border-stone-300 rounded-lg text-stone-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-lg"
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Generated Success Modal */}
      <FacturaModal
        factura={emittedFactura}
        isOpen={showFacturaModal}
        onClose={() => setShowFacturaModal(false)}
      />

    </div>
  );
};
