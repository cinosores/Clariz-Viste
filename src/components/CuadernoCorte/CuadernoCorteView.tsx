import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FichaNotebookCard } from './FichaNotebookCard';
import { FichaCorteModal } from './FichaCorteModal';
import { FichaCorte } from '../../types';
import {
  Scissors,
  Plus,
  Search,
  Filter,
  Layers,
  Scale,
  Sparkles,
  BookOpen,
  Boxes,
  CheckCircle2,
} from 'lucide-react';

export const CuadernoCorteView: React.FC = () => {
  const { fichasCorte, currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fichaAEditar, setFichaAEditar] = useState<FichaCorte | null>(null);

  // Filter logic
  const filteredFichas = fichasCorte.filter((f) => {
    const matchesSearch =
      String(f.numeroCorte).includes(searchTerm) ||
      f.articuloNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.modeloCodigo && f.modeloCodigo.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesEstado =
      filterEstado === 'todos' || f.estado === filterEstado;

    return matchesSearch && matchesEstado;
  });

  // Global KPIs from all cutting sheets
  const totalCortes = fichasCorte.length;
  const totalPrendasCortadas = fichasCorte.reduce((acc, f) => acc + f.totalPrendas, 0);
  const totalKilosTela = fichasCorte.reduce((acc, f) => acc + f.totalKilos, 0);
  const promedioKgPrenda = totalPrendasCortadas > 0 ? totalKilosTela / totalPrendasCortadas : 0;
  const cortesPendientesStock = fichasCorte.filter((f) => f.estado !== 'ingresado_stock').length;

  const handleOpenNew = () => {
    setFichaAEditar(null);
    setIsModalOpen(true);
  };

  const handleEdit = (ficha: FichaCorte) => {
    setFichaAEditar(ficha);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Title */}
      <div className="bg-[#FAF8F2] border-2 border-stone-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-900 text-white shadow-xs">
              <Scissors className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-2xl font-black text-stone-950 font-serif">
                Cuaderno de Corte Digitalizado
              </h2>
              <p className="text-xs text-stone-600">
                Basado fielmente en el formato de anotación en cuaderno cuadriculado de taller, con cálculo automático de prendas y rendimiento.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-sm rounded-xl shadow-md transition active:scale-95 border border-stone-800"
          >
            <Plus className="w-5 h-5" />
            + Nueva Ficha de Corte
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-stone-300 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Cortes Registrados</span>
            <BookOpen className="w-4 h-4 text-blue-800" />
          </div>
          <div className="text-2xl font-black font-mono text-stone-900">
            {totalCortes}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {cortesPendientesStock > 0 ? (
              <span className="text-amber-700 font-bold font-sans">
                {cortesPendientesStock} pendientes de ingresar a stock
              </span>
            ) : (
              <span className="text-emerald-700 font-medium">Todos en stock</span>
            )}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-300 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Prendas Cortadas</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black font-mono text-stone-900">
            {totalPrendasCortadas.toLocaleString('es-AR')}
          </div>
          <p className="text-[11px] text-stone-500 mt-1 font-sans">
            Unidades físicas confeccionadas
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-300 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Tela Consumida</span>
            <Scale className="w-4 h-4 text-purple-700" />
          </div>
          <div className="text-2xl font-black font-mono text-stone-900">
            {totalKilosTela.toFixed(1)} <span className="text-base font-sans font-medium text-stone-500">kg</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1 font-sans">
            Total en rollos de frisa y punto
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-300 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Rendimiento Promedio</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-950">
            {promedioKgPrenda.toFixed(3)}{' '}
            <span className="text-sm font-sans font-medium text-stone-600">kg/u</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1 font-sans">
            Eficiencia óptima de tizada
          </p>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-300 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por N° de corte (ej. 322), prenda (Maxibuzo) o modelo (B-14)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-500" />
          <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
            Estado:
          </span>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="todos">Todos los estados</option>
            <option value="cortado">Cortados (en taller)</option>
            <option value="ingresado_stock">Ingresados a Stock Retail</option>
            <option value="borrador">Borradores</option>
          </select>
        </div>

      </div>

      {/* Notebook Cards List */}
      <div className="space-y-6">
        {filteredFichas.length > 0 ? (
          filteredFichas.map((ficha) => (
            <FichaNotebookCard key={ficha.id} ficha={ficha} onEdit={handleEdit} />
          ))
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border-2 border-dashed border-stone-300">
            <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800">
              No se encontraron fichas de corte con los filtros aplicados
            </h3>
            <p className="text-sm text-stone-500 mt-1">
              Probá limpiando el buscador o agregá una nueva ficha al cuaderno digital.
            </p>
            <button
              onClick={handleOpenNew}
              className="mt-4 px-4 py-2 bg-amber-500 text-stone-950 font-bold rounded-lg text-sm inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Crear Ficha de Corte
            </button>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <FichaCorteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fichaEditar={fichaAEditar}
      />

    </div>
  );
};
