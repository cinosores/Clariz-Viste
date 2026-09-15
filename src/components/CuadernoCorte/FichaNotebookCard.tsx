import React, { useState } from 'react';
import { FichaCorte } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Scissors,
  CheckCircle2,
  Boxes,
  Calendar,
  Layers,
  Scale,
  DollarSign,
  Printer,
  Edit3,
  Trash2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface Props {
  ficha: FichaCorte;
  onEdit: (ficha: FichaCorte) => void;
}

export const FichaNotebookCard: React.FC<Props> = ({ ficha, onEdit }) => {
  const { ingresarStockDesdeFicha, deleteFichaCorte, currentUser } = useApp();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const getStatusBadge = () => {
    switch (ficha.estado) {
      case 'ingresado_stock':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ingresado al Stock ({ficha.fechaIngresoStock || 'Listo'})
          </span>
        );
      case 'enviado_taller':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
            En Taller de Confección
          </span>
        );
      case 'cortado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Scissors className="w-3.5 h-3.5 text-amber-600" /> Cortado - Listo para Confección
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-200 text-stone-700">
            Borrador
          </span>
        );
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#FAF8F2] border-2 border-stone-800 shadow-md rounded-xl overflow-hidden text-stone-900 font-sans relative transition hover:shadow-lg">
      
      {/* Notebook Binder Margin Simulation */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#F0ECE1] border-r-2 border-dashed border-stone-400 flex flex-col justify-around items-center py-6 pointer-events-none z-10">
        <div className="w-3.5 h-3.5 rounded-full bg-stone-700 shadow-inner border border-stone-400" />
        <div className="w-3.5 h-3.5 rounded-full bg-stone-700 shadow-inner border border-stone-400" />
        <div className="w-3.5 h-3.5 rounded-full bg-stone-700 shadow-inner border border-stone-400" />
        <div className="w-3.5 h-3.5 rounded-full bg-stone-700 shadow-inner border border-stone-400" />
        <div className="w-3.5 h-3.5 rounded-full bg-stone-700 shadow-inner border border-stone-400" />
      </div>

      <div className="pl-11 pr-5 py-5">
        
        {/* Header notebook style with hand-written font feel */}
        <div className="border-b-2 border-stone-800 pb-4 mb-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-blue-900 font-mono">
                  CORTE {ficha.numeroCorte}
                </span>
                <span className="text-lg sm:text-xl font-bold text-stone-900">
                  {ficha.articuloNombre}
                </span>
                {ficha.modeloCodigo && (
                  <span className="px-2 py-0.5 text-xs font-mono font-bold bg-stone-200 text-stone-800 rounded border border-stone-400">
                    Mod: {ficha.modeloCodigo}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-stone-700">
                <span className="flex items-center gap-1 font-semibold text-stone-800">
                  <Calendar className="w-3.5 h-3.5 text-stone-500" /> Fecha: {ficha.fecha}
                </span>
                <span className="font-semibold text-blue-800">
                  Curva: {ficha.curvaNombre} (Factor: {ficha.curvaFactor} prendas/capa)
                </span>
                {ficha.telaPrincipal && (
                  <span className="text-stone-600">
                    Tela: <strong>{ficha.telaPrincipal}</strong> ({ficha.anchoTela || 'Ancho 1.60m'})
                  </span>
                )}
                {ficha.cortadorNombre && (
                  <span className="text-stone-600">
                    Cortador: <strong>{ficha.cortadorNombre}</strong>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {getStatusBadge()}
            </div>
          </div>
        </div>

        {/* Notebook Grid Layout - Exact look of the photo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
          
          {/* Main Table: Encimado por Colores */}
          <div className="lg:col-span-8 bg-white border border-stone-300 rounded-lg p-3 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600" /> Registro de Capas de Tela (Frisa / Principal)
              </h4>
              <span className="text-[11px] text-stone-500 font-mono">
                {ficha.filasColor.length} tiradas de corte
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-stone-100 border-b border-stone-300 text-[11px] uppercase font-bold text-stone-600">
                    <th className="py-1.5 px-2">#</th>
                    <th className="py-1.5 px-3">Color</th>
                    <th className="py-1.5 px-3 text-center">Capas</th>
                    <th className="py-1.5 px-3 text-center">Factor</th>
                    <th className="py-1.5 px-3 text-right">Prendas</th>
                    <th className="py-1.5 px-3 text-right">Peso (Kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 font-mono text-[13px]">
                  {ficha.filasColor.map((row, idx) => (
                    <tr key={row.id || idx} className="hover:bg-amber-50/50 transition">
                      <td className="py-1.5 px-2 text-stone-400 text-xs">{idx + 1}</td>
                      <td className="py-1.5 px-3 font-semibold font-sans text-stone-900 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full border border-stone-400 bg-stone-300 inline-block" />
                        {row.color}
                      </td>
                      <td className="py-1.5 px-3 text-center font-bold text-blue-900">
                        {row.capas}
                      </td>
                      <td className="py-1.5 px-3 text-center text-stone-500">
                        x {row.curvaFactor} =
                      </td>
                      <td className="py-1.5 px-3 text-right font-bold text-stone-950">
                        {row.prendasCalculadas}
                      </td>
                      <td className="py-1.5 px-3 text-right text-stone-800">
                        {row.kilos.toFixed(2)} kg
                      </td>
                    </tr>
                  ))}
                  
                  {/* Totals Row */}
                  <tr className="bg-amber-100/80 border-t-2 border-stone-800 font-bold text-sm">
                    <td colSpan={2} className="py-2.5 px-3 font-sans uppercase tracking-wider text-xs text-stone-900">
                      TOTALES CORTE
                    </td>
                    <td className="py-2.5 px-3 text-center text-blue-950 text-base">
                      {ficha.totalCapas} capas
                    </td>
                    <td className="py-2.5 px-3 text-center text-stone-700">
                      x {ficha.curvaFactor} =
                    </td>
                    <td className="py-2.5 px-3 text-right text-base text-stone-950">
                      {ficha.totalPrendas} prendas
                    </td>
                    <td className="py-2.5 px-3 text-right text-base text-stone-950">
                      {ficha.totalKilos.toFixed(2)} kg
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Performance KPI */}
            <div className="mt-3 pt-2 border-t border-stone-200 flex flex-wrap items-center justify-between text-xs text-stone-600 bg-stone-50 p-2 rounded">
              <div>
                <span className="font-semibold text-stone-800">Rendimiento Calculado:</span>{' '}
                <span className="font-bold text-blue-900 font-mono text-sm">
                  {ficha.rendimientoKgPrenda > 0
                    ? `${ficha.rendimientoKgPrenda.toFixed(3)} kg / prenda`
                    : `${(ficha.totalKilos / (ficha.totalPrendas || 1)).toFixed(3)} kg / prenda`}
                </span>
              </div>
              <div className="text-stone-500 text-[11px]">
                (Total kg dividido por prendas cortadas)
              </div>
            </div>
          </div>

          {/* Right Column: Complementarios & Adelantos/Pagos */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Complementarios (Morley puño y cintura) */}
            <div className="bg-white border border-stone-300 rounded-lg p-3 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2 flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-purple-600" /> Complementarios (Morley / Cuellos)
              </h4>
              {ficha.complementarios.length > 0 ? (
                <div className="space-y-1.5">
                  {ficha.complementarios.map((comp, idx) => (
                    <div
                      key={comp.id || idx}
                      className="flex items-center justify-between p-2 rounded bg-purple-50/60 border border-purple-200/60 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-purple-950">{comp.tipo}</div>
                        <div className="text-stone-500">Color: {comp.color}</div>
                      </div>
                      <div className="text-right font-mono font-bold text-purple-900">
                        {comp.capas} capas {comp.factor > 1 && `(x${comp.factor})`}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-stone-400 italic py-2 text-center">
                  Sin complementarios registrados
                </div>
              )}
            </div>

            {/* Adelantos & Pagos (como en la foto: $150.000 / $300.000 x marcado) */}
            <div className="bg-white border border-stone-300 rounded-lg p-3 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Registro de Adelantos / Marcado
              </h4>
              {ficha.adelantos && ficha.adelantos.length > 0 ? (
                <div className="space-y-1.5">
                  {ficha.adelantos.map((ad, idx) => (
                    <div
                      key={ad.id || idx}
                      className="flex items-center justify-between p-2 rounded bg-emerald-50/60 border border-emerald-200/60 text-xs"
                    >
                      <div>
                        <div className="font-medium text-stone-900">{ad.concepto}</div>
                        <div className="text-[11px] text-stone-500">{ad.fecha}</div>
                      </div>
                      <div className="font-mono font-bold text-emerald-900 text-sm">
                        ${ad.monto.toLocaleString('es-AR')}
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-stone-200 flex justify-between text-xs font-bold text-stone-900">
                    <span>Total Pagos/Adelantos:</span>
                    <span className="font-mono text-emerald-950">
                      $
                      {ficha.adelantos
                        .reduce((a, b) => a + b.monto, 0)
                        .toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-stone-400 italic py-2 text-center">
                  Sin pagos o adelantos registrados
                </div>
              )}
            </div>

            {/* Observaciones */}
            {ficha.observaciones && (
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-700">
                <strong className="text-stone-900 block mb-0.5">Notas de Taller:</strong>
                {ficha.observaciones}
              </div>
            )}

          </div>

        </div>

        {/* Action Bar Footer */}
        <div className="pt-3 border-t-2 border-stone-800 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            {/* Quick stock induction */}
            {ficha.estado !== 'ingresado_stock' ? (
              <button
                onClick={() => ingresarStockDesdeFicha(ficha.id)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition active:scale-95"
              >
                <Boxes className="w-4 h-4" />
                Ingresar {ficha.totalPrendas} prendas al Stock Retail
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Stock cargado e impactado en tienda
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(ficha)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-400 text-stone-800 text-xs font-semibold transition"
            >
              <Edit3 className="w-3.5 h-3.5" /> Modificar
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-400 text-stone-800 text-xs font-semibold transition"
              title="Imprimir Ficha de Corte para taller"
            >
              <Printer className="w-3.5 h-3.5" /> Imprimir
            </button>

            {currentUser.role === 'admin' && (
              <>
                {confirmDelete ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => deleteFichaCorte(ficha.id)}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="px-2 py-1 bg-stone-200 text-stone-700 text-xs rounded"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition"
                    title="Eliminar ficha"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
