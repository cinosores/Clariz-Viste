import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Articulo } from '../../types';
import { ArticuloModal } from './ArticuloModal';
import {
  Boxes,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Scissors,
  Edit3,
  Trash2,
  DollarSign,
  TrendingUp,
  PackageCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const InventarioView: React.FC = () => {
  const { articulos, ajustarStock, deleteArticulo, setActiveTab, currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [expandedArticuloId, setExpandedArticuloId] = useState<string | null>(articulos[0]?.id || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [articuloAEditar, setArticuloAEditar] = useState<Articulo | null>(null);

  // Categories
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

  // Calculate article stock
  const getArticleStockTotal = (art: Articulo) => {
    let sum = 0;
    Object.values(art.stock).forEach((col) => {
      Object.values(col).forEach((q) => {
        sum += q;
      });
    });
    return sum;
  };

  // Global Inventory KPIs
  const totalPrendasInventario = articulos.reduce(
    (acc, art) => acc + getArticleStockTotal(art),
    0
  );

  const valorTotalInventarioVenta = articulos.reduce(
    (acc, art) => acc + getArticleStockTotal(art) * art.precioVenta,
    0
  );

  const costoTotalInventario = articulos.reduce(
    (acc, art) => acc + getArticleStockTotal(art) * art.costoFabricacion,
    0
  );

  const articulosStockBajo = articulos.filter(
    (art) => getArticleStockTotal(art) <= art.stockMinimoAlerta
  ).length;

  const handleOpenNew = () => {
    setArticuloAEditar(null);
    setIsModalOpen(true);
  };

  const handleEdit = (art: Articulo) => {
    setArticuloAEditar(art);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Title Banner */}
      <div className="bg-white border-2 border-stone-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-stone-900 text-amber-400 rounded-xl shadow-xs">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-stone-950 font-serif">
              Gestión de Inventario & Stock en Tiempo Real
            </h2>
            <p className="text-xs text-stone-600">
              Desglose matriz por color y talle, control de valorización, costos de fabricación y alertas de reposición.
            </p>
          </div>
        </div>

        {currentUser.role === 'admin' && (
          <button
            onClick={handleOpenNew}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-sm rounded-xl shadow-md transition active:scale-95 border border-stone-800"
          >
            <Plus className="w-4 h-4" /> + Nuevo Artículo
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-stone-300 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Prendas en Stock</span>
            <Boxes className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-2xl font-black font-mono text-stone-900">
            {totalPrendasInventario.toLocaleString('es-AR')} <span className="text-sm font-sans font-normal text-stone-500">u.</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1 font-sans">
            Unidades físicas en local y depósito
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-300 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Valorizado (Venta)</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-950">
            ${(valorTotalInventarioVenta / 1000000).toFixed(2)}M
          </div>
          <p className="text-[11px] text-stone-500 mt-1 font-sans">
            Potencial bruto a precio retail
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-300 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Costo Textil</span>
            <TrendingUp className="w-4 h-4 text-purple-700" />
          </div>
          <div className="text-2xl font-black font-mono text-stone-900">
            ${(costoTotalInventario / 1000000).toFixed(2)}M
          </div>
          <p className="text-[11px] text-stone-500 mt-1 font-sans">
            Inversión en corte, tela y armado
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-300 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Stock Crítico</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-950">
            {articulosStockBajo} <span className="text-sm font-sans font-normal text-stone-500">artículos</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1 font-sans">
            Por debajo del stock mínimo
          </p>
        </div>

      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-stone-300 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por artículo, código (MB-001) o tela..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto">
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

      {/* Articles Stock Cards */}
      <div className="space-y-4">
        {filteredArticulos.map((art) => {
          const totalStock = getArticleStockTotal(art);
          const isExpanded = expandedArticuloId === art.id;
          const margenPesos = art.precioVenta - art.costoFabricacion;
          const margenPorcentaje =
            art.precioVenta > 0 ? (margenPesos / art.precioVenta) * 100 : 0;
          const isLowStock = totalStock <= art.stockMinimoAlerta;

          return (
            <div
              key={art.id}
              className="bg-white rounded-xl border border-stone-300 shadow-xs overflow-hidden transition"
            >
              {/* Card Header Summary */}
              <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="flex items-center gap-4">
                  <img
                    src={art.imagen}
                    alt={art.nombre}
                    className="w-16 h-16 rounded-xl object-cover border border-stone-300 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 border border-stone-300 text-stone-700">
                        {art.codigo}
                      </span>
                      <span className="text-xs text-stone-500 font-semibold uppercase">
                        {art.categoria}
                      </span>
                      {isLowStock && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                          <AlertTriangle className="w-3 h-3" /> Stock Bajo
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-stone-900 mt-1">
                      {art.nombre}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Tela: <strong>{art.telaPrincipal}</strong> · Temporada: {art.temporada}
                    </p>
                  </div>
                </div>

                {/* Right Metrics & Actions */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  
                  {/* Financial Metrics */}
                  <div className="text-right">
                    <div className="text-xs text-stone-500">P. Venta:</div>
                    <div className="font-mono font-black text-stone-900 text-base">
                      ${art.precioVenta.toLocaleString('es-AR')}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Costo: ${art.costoFabricacion.toLocaleString('es-AR')} ·{' '}
                      <span className="font-bold text-emerald-800 font-mono">
                        {margenPorcentaje.toFixed(1)}% mrg.
                      </span>
                    </div>
                  </div>

                  {/* Stock Total */}
                  <div className="text-center px-4 py-2 rounded-xl bg-stone-50 border border-stone-200">
                    <div className="text-xs text-stone-500 uppercase font-semibold">Total Stock</div>
                    <div
                      className={`text-xl font-black font-mono ${
                        isLowStock ? 'text-rose-700' : 'text-stone-900'
                      }`}
                    >
                      {totalStock} <span className="text-xs font-sans font-normal text-stone-500">u.</span>
                    </div>
                  </div>

                  {/* Expand button */}
                  <button
                    onClick={() => setExpandedArticuloId(isExpanded ? null : art.id)}
                    className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs flex items-center gap-1.5 transition"
                  >
                    <span>{isExpanded ? 'Ocultar Matriz' : 'Ver Matriz Talles'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {/* Edit Article */}
                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => handleEdit(art)}
                      className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition"
                      title="Editar artículo y precios"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}

                </div>

              </div>

              {/* Expanded Size & Color Matrix */}
              {isExpanded && (
                <div className="border-t border-stone-200 bg-stone-50/80 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      Desglose en Vivo por Color y Talle (Modificá con +/- para ajustes físicos)
                    </h4>
                    <button
                      onClick={() => setActiveTab('corte')}
                      className="text-xs text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1"
                    >
                      <Scissors className="w-3.5 h-3.5" /> Ir a Cuaderno de Corte para reponer
                    </button>
                  </div>

                  <div className="bg-white rounded-xl border border-stone-300 overflow-x-auto shadow-xs">
                    <table className="w-full text-center text-xs">
                      <thead>
                        <tr className="bg-stone-100 border-b border-stone-300 text-[11px] font-bold uppercase text-stone-700">
                          <th className="py-2.5 px-4 text-left">Color</th>
                          {art.curvaDefecto.talles.map((t) => (
                            <th key={t} className="py-2.5 px-3">
                              Talle {t}
                            </th>
                          ))}
                          <th className="py-2.5 px-4 text-right">Subtotal Color</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200">
                        {art.coloresDisponibles.map((col) => {
                          let subtotalColor = 0;
                          return (
                            <tr key={col} className="hover:bg-stone-50/70">
                              <td className="py-2.5 px-4 text-left font-bold text-stone-900 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full border border-stone-400 bg-stone-300 inline-block" />
                                {col}
                              </td>
                              {art.curvaDefecto.talles.map((t) => {
                                const qty = art.stock[col]?.[t] || 0;
                                subtotalColor += qty;
                                return (
                                  <td key={t} className="py-2 px-2">
                                    <div className="inline-flex items-center gap-1 bg-stone-50 border border-stone-300 rounded px-1.5 py-0.5">
                                      <button
                                        onClick={() => ajustarStock(art.id, col, t, -1)}
                                        disabled={qty <= 0}
                                        className="text-stone-400 hover:text-stone-900 disabled:opacity-30 font-bold"
                                      >
                                        -
                                      </button>
                                      <span
                                        className={`font-mono font-bold w-6 text-center ${
                                          qty === 0 ? 'text-red-500' : 'text-stone-900'
                                        }`}
                                      >
                                        {qty}
                                      </span>
                                      <button
                                        onClick={() => ajustarStock(art.id, col, t, 1)}
                                        className="text-stone-400 hover:text-stone-900 font-bold"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </td>
                                );
                              })}
                              <td className="py-2.5 px-4 text-right font-mono font-bold text-stone-900">
                                {subtotalColor} u.
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="text-[11px] text-stone-500 flex items-center justify-between">
                    <span>
                      💡 Las ventas en el <strong>Punto de Venta</strong> descuentan stock inmediatamente.
                    </span>
                    <span>
                      Al confirmar el corte en el <strong>Cuaderno de Corte</strong>, las prendas se suman automáticamente.
                    </span>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Article Modal */}
      <ArticuloModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        articuloEditar={articuloAEditar}
      />

    </div>
  );
};
