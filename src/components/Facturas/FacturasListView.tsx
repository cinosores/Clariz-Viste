import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FacturaElectronica } from '../../types';
import { FacturaModal } from './FacturaModal';
import {
  FileText,
  Search,
  Filter,
  Eye,
  Printer,
  Ban,
  Calendar,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  UserCheck,
} from 'lucide-react';

export const FacturasListView: React.FC = () => {
  const { facturas, anularFactura, currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [filterVendedora, setFilterVendedora] = useState('todas');
  const [selectedFactura, setSelectedFactura] = useState<FacturaElectronica | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter invoices
  const filteredFacturas = facturas.filter((fac) => {
    const matchesSearch =
      fac.numeroComprobante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.cliente.documento.includes(searchTerm);

    const matchesTipo = filterTipo === 'todos' || fac.tipoComprobante === filterTipo;
    const matchesVendedora =
      filterVendedora === 'todas' || fac.vendedora.id === filterVendedora;

    return matchesSearch && matchesTipo && matchesVendedora;
  });

  // Analytics summary for the invoice list
  const totalFacturado = facturas
    .filter((f) => f.estado === 'emitida')
    .reduce((a, b) => a + b.total, 0);

  const totalIvaRecaudado = facturas
    .filter((f) => f.estado === 'emitida')
    .reduce((a, b) => a + b.iva, 0);

  const totalPrendasFacturadas = facturas
    .filter((f) => f.estado === 'emitida')
    .reduce((a, b) => a + b.items.reduce((sum, it) => sum + it.cantidad, 0), 0);

  const handleOpenFactura = (fac: FacturaElectronica) => {
    setSelectedFactura(fac);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Banner */}
      <div className="bg-white border-2 border-stone-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-stone-900 text-amber-400 rounded-xl shadow-xs">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-stone-950 font-serif">
              Facturación Electrónica (AFIP / ARCA)
            </h2>
            <p className="text-xs text-stone-600">
              Libro de comprobantes fiscales emitidos con CAE, desglose de IVA y vendedor asignado.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-300 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Facturado</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-950">
            ${totalFacturado.toLocaleString('es-AR')}
          </div>
          <p className="text-[11px] text-stone-500 mt-1 font-sans">
            Comprobantes activos emitidos
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-300 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">IVA Débito Fiscal</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black font-mono text-blue-950">
            ${totalIvaRecaudado.toLocaleString('es-AR')}
          </div>
          <p className="text-[11px] text-stone-500 mt-1 font-sans">
            Alícuota 21% acumulada
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-300 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Prendas Vendidas</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black font-mono text-stone-900">
            {totalPrendasFacturadas} <span className="text-sm font-sans font-medium text-stone-500">u.</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1 font-sans">
            Salidas de stock por caja retail
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-xl border border-stone-300 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por N° factura (ej. B-0001-00000425), cliente o DNI/CUIT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-stone-600 uppercase">Tipo:</span>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-medium outline-none"
            >
              <option value="todos">Todos</option>
              <option value="Factura B">Factura B</option>
              <option value="Factura A">Factura A</option>
              <option value="Factura C">Factura C</option>
              <option value="Ticket Fiscal">Ticket Fiscal</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-stone-600 uppercase">Vendedora:</span>
            <select
              value={filterVendedora}
              onChange={(e) => setFilterVendedora(e.target.value)}
              className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-medium outline-none"
            >
              <option value="todas">Todas las vendedoras</option>
              <option value="vend-1">Sofía Morales</option>
              <option value="vend-2">Valentina Rossi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-stone-300 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-stone-100 border-b border-stone-300 text-[11px] font-bold uppercase text-stone-600">
                <th className="py-3 px-4">Comprobante</th>
                <th className="py-3 px-4">Fecha & Hora</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Vendedora</th>
                <th className="py-3 px-4">Prendas</th>
                <th className="py-3 px-4">Medio de Pago</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredFacturas.map((fac) => {
                const isAnulada = fac.estado === 'anulada';
                return (
                  <tr key={fac.id} className={`hover:bg-stone-50 ${isAnulada ? 'opacity-60 bg-stone-50/70' : ''}`}>
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">
                      {fac.numeroComprobante}
                    </td>
                    <td className="py-3 px-4 text-xs text-stone-600 whitespace-nowrap">
                      {fac.fechaEmision}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-stone-900 text-xs">{fac.cliente.nombre}</div>
                      <div className="text-[11px] text-stone-500">
                        {fac.cliente.tipoDocumento}: {fac.cliente.documento}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          fac.vendedora.id === 'vend-1'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        <UserCheck className="w-3 h-3" />
                        {fac.vendedora.name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-stone-700">
                      {fac.items.reduce((s, i) => s + i.cantidad, 0)} unidades
                    </td>
                    <td className="py-3 px-4 text-xs text-stone-600">
                      {fac.metodoPago}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-stone-950 text-base">
                      ${fac.total.toLocaleString('es-AR')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          isAnulada
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isAnulada ? 'Anulada' : 'Emitida (CAE)'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenFactura(fac)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1 transition"
                          title="Ver e Imprimir Factura Electrónica"
                        >
                          <Eye className="w-3.5 h-3.5" /> Ver
                        </button>
                        {!isAnulada && currentUser.role === 'admin' && (
                          <button
                            onClick={() => {
                              if (confirm(`¿Anular ${fac.numeroComprobante} y reintegrar stock al inventario?`)) {
                                anularFactura(fac.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Anular Factura y devolver stock"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal View for Invoice */}
      <FacturaModal
        factura={selectedFactura}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
};
