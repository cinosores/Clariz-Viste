import React from 'react';
import { FacturaElectronica } from '../../types';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Building,
  UserCheck,
} from 'lucide-react';

interface Props {
  factura: FacturaElectronica | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FacturaModal: React.FC<Props> = ({ factura, isOpen, onClose }) => {
  if (!isOpen || !factura) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white border-2 border-stone-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[94vh] flex flex-col text-stone-900 my-4 print:border-none print:shadow-none print:max-h-none print:max-w-none">
        
        {/* Modal Top Actions (Hidden in Print) */}
        <div className="px-6 py-3 border-b border-stone-200 flex items-center justify-between bg-stone-100 rounded-t-2xl print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Comprobante Fiscal Emitido Exitosamente
              </h3>
              <p className="text-[11px] text-stone-500">
                Autorizado electrónicamente por AFIP / ARCA · Vendedora: {factura.vendedora.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5" /> Imprimir Factura
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Body - Official AFIP Argentine Invoice Format */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 print:p-0 print:overflow-visible">
          
          {/* Main Invoice Box */}
          <div className="border-2 border-stone-800 rounded-xl p-5 bg-white relative">
            
            {/* Header: Company & Invoice Type Letter */}
            <div className="grid grid-cols-12 pb-4 border-b-2 border-stone-800 gap-4">
              
              {/* Left: Emisor */}
              <div className="col-span-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl font-black font-serif tracking-tight text-stone-950">
                    CLARIZ VISTE
                  </span>
                </div>
                <div className="text-xs text-stone-600 space-y-0.5 font-medium">
                  <p className="font-bold text-stone-800">Fábrica de Ropa & Retail Textil</p>
                  <p>Razón Social: Clariz Viste S.R.L.</p>
                  <p>CUIT: 30-71628901-3</p>
                  <p>Ingresos Brutos: 30-71628901-3</p>
                  <p>Inicio de Actividades: 01/03/2018</p>
                  <p>Condición IVA: IVA Responsable Inscripto</p>
                  <p>Dirección: Av. San Martín 2840, CABA</p>
                </div>
              </div>

              {/* Center: Letter Badge (A, B o C) */}
              <div className="col-span-2 flex flex-col items-center justify-start">
                <div className="w-14 h-14 bg-stone-900 text-amber-400 font-serif font-black text-3xl flex items-center justify-center rounded-lg border-2 border-stone-800 shadow-sm">
                  {factura.tipoComprobante.includes('A') ? 'A' : factura.tipoComprobante.includes('B') ? 'B' : 'C'}
                </div>
                <span className="text-[10px] font-mono font-bold text-stone-600 mt-1 uppercase">
                  COD. {factura.tipoComprobante.includes('A') ? '001' : '006'}
                </span>
              </div>

              {/* Right: Invoice Number & Date */}
              <div className="col-span-5 text-right">
                <h4 className="text-xl font-black uppercase text-stone-950 font-mono tracking-tight">
                  {factura.tipoComprobante}
                </h4>
                <div className="text-base font-mono font-bold text-stone-900 mt-0.5">
                  N° {factura.numeroComprobante}
                </div>
                <div className="text-xs text-stone-600 mt-2 space-y-0.5">
                  <p>
                    Fecha de Emisión: <strong>{factura.fechaEmision}</strong>
                  </p>
                  <p>Punto de Venta: 0001 - Mostrador Principal</p>
                  <p className="font-semibold text-stone-900">
                    Atendido por:{' '}
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                      {factura.vendedora.name} ({factura.vendedora.codigo})
                    </span>
                  </p>
                </div>
              </div>

            </div>

            {/* Receptor / Cliente */}
            <div className="py-3 border-b border-stone-300 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-0.5">
                  Datos del Cliente
                </span>
                <p className="text-sm font-bold text-stone-900">{factura.cliente.nombre}</p>
                <p className="text-stone-600">
                  {factura.cliente.tipoDocumento}: <strong>{factura.cliente.documento}</strong>
                </p>
                <p className="text-stone-600">
                  Condición Frente al IVA: <strong>{factura.cliente.condicionIva}</strong>
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-0.5">
                  Condición de Venta
                </span>
                <p className="text-sm font-bold text-stone-900">
                  {factura.metodoPago}
                </p>
                <p className="text-stone-600">Domicilio: {factura.cliente.direccion || 'CABA'}</p>
                <p className="text-stone-600">Tel: {factura.cliente.telefono || '-'}</p>
              </div>
            </div>

            {/* Table of Items */}
            <div className="py-3">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-100 border-b border-stone-300 font-bold uppercase text-[11px] text-stone-700">
                    <th className="py-2 px-2">Código</th>
                    <th className="py-2 px-2">Descripción Prenda</th>
                    <th className="py-2 px-2">Color / Talle</th>
                    <th className="py-2 px-2 text-center">Cant.</th>
                    <th className="py-2 px-2 text-right">P. Unitario</th>
                    <th className="py-2 px-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 font-medium">
                  {factura.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-50">
                      <td className="py-2 px-2 font-mono text-stone-500">{item.articuloCodigo}</td>
                      <td className="py-2 px-2 font-bold text-stone-900">{item.articuloNombre}</td>
                      <td className="py-2 px-2 text-stone-600">
                        {item.color} - Talle <strong>{item.talle}</strong>
                      </td>
                      <td className="py-2 px-2 text-center font-bold font-mono">{item.cantidad}</td>
                      <td className="py-2 px-2 text-right font-mono">
                        ${item.precioUnitario.toLocaleString('es-AR')}
                      </td>
                      <td className="py-2 px-2 text-right font-mono font-bold text-stone-900">
                        ${item.subtotal.toLocaleString('es-AR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="pt-3 border-t-2 border-stone-800 flex justify-end">
              <div className="w-64 space-y-1.5 text-xs font-medium">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal Bruto:</span>
                  <span className="font-mono">${factura.subtotal.toLocaleString('es-AR')}</span>
                </div>
                {factura.descuento > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Descuento aplicado:</span>
                    <span className="font-mono">-${factura.descuento.toLocaleString('es-AR')}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>IVA Débito Fiscal (21%):</span>
                  <span className="font-mono">${factura.iva.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between pt-2 border-t-2 border-stone-800 text-base font-black text-stone-950">
                  <span>TOTAL FINAL:</span>
                  <span className="font-mono text-lg text-emerald-900">
                    ${factura.total.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            </div>

            {/* AFIP / ARCA Electronic Authorization Footer */}
            <div className="mt-5 pt-4 border-t border-stone-300 flex items-center justify-between gap-4 bg-stone-50 p-3 rounded-lg">
              
              {/* QR Code Sim */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white border border-stone-300 rounded shadow-xs flex flex-col items-center">
                  <QrCode className="w-16 h-16 text-stone-900" />
                  <span className="text-[9px] font-bold text-stone-500 font-mono mt-0.5">AFIP ARCA</span>
                </div>
                <div className="text-[11px] text-stone-600 space-y-0.5">
                  <div className="flex items-center gap-1 font-bold text-stone-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Comprobante Electrónico Autorizado
                  </div>
                  <p>Régimen Especial de Emisión y Almacenamiento Electrónico</p>
                  <p className="font-mono">
                    CAE N°: <strong className="text-stone-900 font-bold">{factura.cae}</strong>
                  </p>
                  <p className="font-mono">
                    Fecha Vto. CAE: <strong>{factura.caeVencimiento}</strong>
                  </p>
                </div>
              </div>

              {/* Status and Signature */}
              <div className="text-right text-[11px] text-stone-500">
                <p className="font-bold text-stone-700">Original · Destinatario</p>
                <p>Comprobante generado por Clariz Viste POS</p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
