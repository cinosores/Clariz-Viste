import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FichaCorte, FilaCorteColor, ComplementarioCorte, AdelantoPago } from '../../types';
import {
  X,
  Plus,
  Trash2,
  Scissors,
  Layers,
  Scale,
  DollarSign,
  Save,
  Sparkles,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  fichaEditar?: FichaCorte | null;
}

export const FichaCorteModal: React.FC<Props> = ({ isOpen, onClose, fichaEditar }) => {
  const { articulos, addFichaCorte, updateFichaCorte, fichasCorte } = useApp();

  // Next automatic corte number
  const nextNum =
    fichasCorte.length > 0
      ? Math.max(...fichasCorte.map((f) => f.numeroCorte)) + 1
      : 325;

  const [numeroCorte, setNumeroCorte] = useState<number>(nextNum);
  const [articuloId, setArticuloId] = useState<string>('');
  const [articuloNombre, setArticuloNombre] = useState<string>('');
  const [modeloCodigo, setModeloCodigo] = useState<string>('B-14');
  const [curvaNombre, setCurvaNombre] = useState<string>('Curva 10-16');
  const [curvaFactor, setCurvaFactor] = useState<number>(8);
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split('T')[0]);
  const [telaPrincipal, setTelaPrincipal] = useState<string>('Frisa Invisible Peinada');
  const [anchoTela, setAnchoTela] = useState<string>('1.60 m');
  const [cortadorNombre, setCortadorNombre] = useState<string>('Marcelo Ruiz');
  const [observaciones, setObservaciones] = useState<string>('');

  // Filas de color / capas
  const [filasColor, setFilasColor] = useState<FilaCorteColor[]>([
    { id: 'f-1', color: 'Negro', capas: 5, curvaFactor: 8, prendasCalculadas: 40, kilos: 18.5 },
    { id: 'f-2', color: 'Blanco', capas: 5, curvaFactor: 8, prendasCalculadas: 40, kilos: 16.2 },
    { id: 'f-3', color: 'Lila Ceniza', capas: 5, curvaFactor: 8, prendasCalculadas: 40, kilos: 17.0 },
  ]);

  // Complementarios
  const [complementarios, setComplementarios] = useState<ComplementarioCorte[]>([
    { id: 'c-1', tipo: 'Morley puño y cintura', color: 'Negro', capas: 10, factor: 16 },
  ]);

  // Adelantos
  const [adelantos, setAdelantos] = useState<AdelantoPago[]>([
    { id: 'a-1', concepto: 'Adelanto x marcado y corte', monto: 150000, fecha: new Date().toISOString().split('T')[0] },
  ]);

  useEffect(() => {
    if (fichaEditar) {
      setNumeroCorte(fichaEditar.numeroCorte);
      setArticuloId(fichaEditar.articuloId);
      setArticuloNombre(fichaEditar.articuloNombre);
      setModeloCodigo(fichaEditar.modeloCodigo || '');
      setCurvaNombre(fichaEditar.curvaNombre);
      setCurvaFactor(fichaEditar.curvaFactor);
      setFecha(fichaEditar.fecha);
      setTelaPrincipal(fichaEditar.telaPrincipal);
      setAnchoTela(fichaEditar.anchoTela);
      setCortadorNombre(fichaEditar.cortadorNombre);
      setObservaciones(fichaEditar.observaciones || '');
      setFilasColor(fichaEditar.filasColor);
      setComplementarios(fichaEditar.complementarios);
      setAdelantos(fichaEditar.adelantos || []);
    } else {
      setNumeroCorte(nextNum);
      if (articulos.length > 0) {
        handleSelectArticulo(articulos[0].id);
      }
    }
  }, [fichaEditar, isOpen]);

  const handleSelectArticulo = (id: string) => {
    setArticuloId(id);
    const art = articulos.find((a) => a.id === id);
    if (art) {
      setArticuloNombre(art.nombre);
      setCurvaNombre(art.curvaDefecto.nombre);
      setCurvaFactor(art.curvaDefecto.factor);
      setTelaPrincipal(art.telaPrincipal);
      
      // Update curvaFactor in color rows
      setFilasColor((prev) =>
        prev.map((f) => ({
          ...f,
          curvaFactor: art.curvaDefecto.factor,
          prendasCalculadas: f.capas * art.curvaDefecto.factor,
        }))
      );
    }
  };

  // Row operations
  const handleFilaChange = (id: string, field: keyof FilaCorteColor, value: any) => {
    setFilasColor((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        const updated = { ...f, [field]: value };
        if (field === 'capas' || field === 'curvaFactor') {
          const cap = field === 'capas' ? Number(value) : f.capas;
          const fac = field === 'curvaFactor' ? Number(value) : f.curvaFactor;
          updated.prendasCalculadas = (cap || 0) * (fac || 0);
        }
        return updated;
      })
    );
  };

  const addFila = () => {
    const art = articulos.find((a) => a.id === articuloId);
    const defaultColor = art && art.coloresDisponibles.length > 0 ? art.coloresDisponibles[0] : 'Negro';
    setFilasColor((prev) => [
      ...prev,
      {
        id: `f-${Date.now()}-${Math.random()}`,
        color: defaultColor,
        capas: 5,
        curvaFactor: curvaFactor,
        prendasCalculadas: 5 * curvaFactor,
        kilos: 18.0,
      },
    ]);
  };

  const removeFila = (id: string) => {
    if (filasColor.length <= 1) return;
    setFilasColor((prev) => prev.filter((f) => f.id !== id));
  };

  // Complementarios operations
  const addComplementario = () => {
    setComplementarios((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        tipo: 'Morley puño y cintura',
        color: 'Negro',
        capas: 5,
        factor: 8,
      },
    ]);
  };

  const removeComplementario = (id: string) => {
    setComplementarios((prev) => prev.filter((c) => c.id !== id));
  };

  // Adelanto operations
  const addAdelanto = () => {
    setAdelantos((prev) => [
      ...prev,
      {
        id: `a-${Date.now()}`,
        concepto: 'Adelanto cortador',
        monto: 100000,
        fecha: new Date().toISOString().split('T')[0],
      },
    ]);
  };

  const removeAdelanto = (id: string) => {
    setAdelantos((prev) => prev.filter((a) => a.id !== id));
  };

  // Live calculations
  const totalCapas = filasColor.reduce((acc, f) => acc + (Number(f.capas) || 0), 0);
  const totalPrendas = filasColor.reduce((acc, f) => acc + (Number(f.prendasCalculadas) || 0), 0);
  const totalKilos = filasColor.reduce((acc, f) => acc + (Number(f.kilos) || 0), 0);
  const rendimientoKgPrenda = totalPrendas > 0 ? totalKilos / totalPrendas : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articuloNombre.trim()) return;

    const art = articulos.find((a) => a.id === articuloId);
    const talles = art ? art.curvaDefecto.talles : ['S', 'M', 'L', 'XL'];

    const fichaData: FichaCorte = {
      id: fichaEditar ? fichaEditar.id : `corte-${Date.now()}`,
      numeroCorte,
      articuloId,
      articuloNombre,
      modeloCodigo,
      curvaNombre,
      curvaFactor,
      tallesNombres: talles,
      fecha,
      telaPrincipal,
      anchoTela,
      cortadorNombre,
      filasColor,
      complementarios,
      totalCapas,
      totalPrendas,
      totalKilos: Math.round(totalKilos * 100) / 100,
      rendimientoKgPrenda: Math.round(rendimientoKgPrenda * 1000) / 1000,
      adelantos,
      estado: fichaEditar ? fichaEditar.estado : 'cortado',
      observaciones,
    };

    if (fichaEditar) {
      updateFichaCorte(fichaData);
    } else {
      addFichaCorte(fichaData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FAF8F2] border-2 border-stone-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col text-stone-900 my-4">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b-2 border-stone-800 flex items-center justify-between bg-stone-100 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-900 text-white">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-stone-900">
                {fichaEditar ? `Editar Ficha de Corte N° ${numeroCorte}` : 'Nueva Ficha en Cuaderno de Corte'}
              </h3>
              <p className="text-xs text-stone-600">
                Registro fiel a la operatoria física de marcado y encimado con cálculo automático
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Header Row: N° Corte, Articulo, Curva, Fecha */}
          <div className="bg-white p-4 rounded-xl border border-stone-300 shadow-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                N° de Corte *
              </label>
              <input
                type="number"
                required
                value={numeroCorte}
                onChange={(e) => setNumeroCorte(Number(e.target.value))}
                className="w-full px-3 py-2 text-base font-mono font-bold bg-stone-50 border border-stone-400 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Artículo / Prenda *
              </label>
              <select
                value={articuloId}
                onChange={(e) => handleSelectArticulo(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-400 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none font-medium"
              >
                {articulos.map((art) => (
                  <option key={art.id} value={art.id}>
                    {art.nombre} ({art.codigo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Código Modelo
              </label>
              <input
                type="text"
                placeholder="Ej. B-14"
                value={modeloCodigo}
                onChange={(e) => setModeloCodigo(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono bg-stone-50 border border-stone-400 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Fecha del Corte
              </label>
              <input
                type="date"
                required
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-400 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            {/* Sub-row */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Nombre de Curva
              </label>
              <input
                type="text"
                value={curvaNombre}
                onChange={(e) => setCurvaNombre(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-400 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Factor Curva (Prendas/capa)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={curvaFactor}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCurvaFactor(val);
                  setFilasColor((prev) =>
                    prev.map((f) => ({
                      ...f,
                      curvaFactor: val,
                      prendasCalculadas: f.capas * val,
                    }))
                  );
                }}
                className="w-full px-3 py-2 text-sm font-bold bg-stone-50 border border-stone-400 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Tela Principal
              </label>
              <input
                type="text"
                value={telaPrincipal}
                onChange={(e) => setTelaPrincipal(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-400 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Cortador a Cargo
              </label>
              <input
                type="text"
                value={cortadorNombre}
                onChange={(e) => setCortadorNombre(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-400 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

          </div>

          {/* Notebook Grid: Filas de Color y Capas */}
          <div className="bg-white p-4 rounded-xl border border-stone-300 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-stone-800">
                  Hojas de Encimado (Color, Capas y Kilos de rollo)
                </h4>
              </div>
              <button
                type="button"
                onClick={addFila}
                className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-lg transition"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Tirada de Color
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-stone-100 border-b border-stone-300 text-[11px] uppercase font-bold text-stone-600">
                    <th className="py-2 px-2">#</th>
                    <th className="py-2 px-3">Color de Tela</th>
                    <th className="py-2 px-3 w-28">Capas</th>
                    <th className="py-2 px-3 w-28">Factor Curva</th>
                    <th className="py-2 px-3 w-32">Prendas Calc.</th>
                    <th className="py-2 px-3 w-32">Kilos (Kg)</th>
                    <th className="py-2 px-2 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {filasColor.map((f, idx) => (
                    <tr key={f.id} className="hover:bg-amber-50/40">
                      <td className="py-2 px-2 text-stone-400 font-mono text-xs">{idx + 1}</td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          required
                          value={f.color}
                          onChange={(e) => handleFilaChange(f.id, 'color', e.target.value)}
                          placeholder="Ej. Negro, Blanco, Lila"
                          className="w-full px-2.5 py-1.5 text-sm bg-stone-50 border border-stone-300 rounded font-medium focus:ring-1 focus:ring-amber-500 outline-none"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          min="1"
                          required
                          value={f.capas}
                          onChange={(e) => handleFilaChange(f.id, 'capas', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-sm font-mono font-bold text-blue-900 bg-stone-50 border border-stone-300 rounded text-center focus:ring-1 focus:ring-amber-500 outline-none"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          min="1"
                          value={f.curvaFactor}
                          onChange={(e) => handleFilaChange(f.id, 'curvaFactor', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-sm font-mono bg-stone-50 border border-stone-300 rounded text-center focus:ring-1 focus:ring-amber-500 outline-none"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <div className="w-full px-2.5 py-1.5 text-sm font-mono font-bold bg-amber-50 text-stone-900 rounded border border-amber-200 text-center">
                          {f.prendasCalculadas}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          value={f.kilos}
                          onChange={(e) => handleFilaChange(f.id, 'kilos', Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 text-sm font-mono bg-stone-50 border border-stone-300 rounded text-right focus:ring-1 focus:ring-amber-500 outline-none"
                        />
                      </td>
                      <td className="py-2 px-2 text-right">
                        {filasColor.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFila(f.id)}
                            className="p-1 text-stone-400 hover:text-red-600 rounded transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}

                  {/* Summary row */}
                  <tr className="bg-amber-100/90 font-bold border-t-2 border-stone-800">
                    <td colSpan={2} className="py-2.5 px-3 uppercase text-xs">
                      Totales del Corte
                    </td>
                    <td className="py-2.5 px-3 text-center text-blue-950 font-mono text-base">
                      {totalCapas}
                    </td>
                    <td className="py-2.5 px-3 text-center text-stone-600 font-mono">
                      x {curvaFactor}
                    </td>
                    <td className="py-2.5 px-3 text-center text-stone-950 font-mono text-base">
                      {totalPrendas} prendas
                    </td>
                    <td className="py-2.5 px-3 text-right text-stone-950 font-mono text-base">
                      {totalKilos.toFixed(2)} kg
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center justify-between p-3 bg-stone-100 rounded-lg text-xs">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-800" />
                <span className="font-bold text-stone-800">Rendimiento Estimado:</span>
                <span className="font-mono font-bold text-blue-900 bg-white px-2 py-0.5 rounded border border-stone-300">
                  {rendimientoKgPrenda.toFixed(3)} kg por prenda cortada
                </span>
              </div>
              <div className="text-stone-600">
                Total estimado a confeccionar: <strong>{totalPrendas} unidades</strong>
              </div>
            </div>

          </div>

          {/* Bottom Grid: Complementarios & Adelantos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Complementarios (Morley / Rib) */}
            <div className="bg-white p-4 rounded-xl border border-stone-300 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5" /> Complementarios (Morley puños, cintura)
                </h4>
                <button
                  type="button"
                  onClick={addComplementario}
                  className="text-xs text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Agregar
                </button>
              </div>

              <div className="space-y-2">
                {complementarios.map((comp) => (
                  <div key={comp.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Tipo (ej. Morley puño y cintura)"
                      value={comp.tipo}
                      onChange={(e) => {
                        setComplementarios((prev) =>
                          prev.map((c) => (c.id === comp.id ? { ...c, tipo: e.target.value } : c))
                        );
                      }}
                      className="flex-1 px-2.5 py-1 text-xs bg-stone-50 border border-stone-300 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Color"
                      value={comp.color}
                      onChange={(e) => {
                        setComplementarios((prev) =>
                          prev.map((c) => (c.id === comp.id ? { ...c, color: e.target.value } : c))
                        );
                      }}
                      className="w-24 px-2.5 py-1 text-xs bg-stone-50 border border-stone-300 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Capas"
                      value={comp.capas}
                      onChange={(e) => {
                        setComplementarios((prev) =>
                          prev.map((c) =>
                            c.id === comp.id ? { ...c, capas: Number(e.target.value) } : c
                          )
                        );
                      }}
                      className="w-16 px-2 py-1 text-xs font-mono bg-stone-50 border border-stone-300 rounded text-center"
                    />
                    <button
                      type="button"
                      onClick={() => removeComplementario(comp.id)}
                      className="p-1 text-stone-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Adelantos a cortador o marcado */}
            <div className="bg-white p-4 rounded-xl border border-stone-300 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" /> Adelantos / Pagos por marcado o corte
                </h4>
                <button
                  type="button"
                  onClick={addAdelanto}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Agregar Pago
                </button>
              </div>

              <div className="space-y-2">
                {adelantos.map((ad) => (
                  <div key={ad.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Concepto (ej. Adelanto x marcado)"
                      value={ad.concepto}
                      onChange={(e) => {
                        setAdelantos((prev) =>
                          prev.map((a) => (a.id === ad.id ? { ...a, concepto: e.target.value } : a))
                        );
                      }}
                      className="flex-1 px-2.5 py-1 text-xs bg-stone-50 border border-stone-300 rounded"
                    />
                    <div className="relative w-28">
                      <span className="absolute left-2 top-1 text-xs text-stone-500">$</span>
                      <input
                        type="number"
                        placeholder="Monto"
                        value={ad.monto}
                        onChange={(e) => {
                          setAdelantos((prev) =>
                            prev.map((a) =>
                              a.id === ad.id ? { ...a, monto: Number(e.target.value) } : a
                            )
                          );
                        }}
                        className="w-full pl-5 pr-2 py-1 text-xs font-mono font-bold bg-stone-50 border border-stone-300 rounded"
                      />
                    </div>
                    <input
                      type="date"
                      value={ad.fecha}
                      onChange={(e) => {
                        setAdelantos((prev) =>
                          prev.map((a) => (a.id === ad.id ? { ...a, fecha: e.target.value } : a))
                        );
                      }}
                      className="w-28 px-1.5 py-1 text-xs bg-stone-50 border border-stone-300 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdelanto(ad.id)}
                      className="p-1 text-stone-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Observaciones del Taller de Corte
            </label>
            <textarea
              rows={2}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Anotaciones sobre la caída de la tela, elasticidad, partidas de color o detalles de confección..."
              className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t-2 border-stone-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-400 hover:bg-stone-200 text-stone-800 text-sm font-semibold rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-sm rounded-lg shadow-md transition active:scale-95"
            >
              <Save className="w-4 h-4" />
              Guardar Ficha de Corte
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
