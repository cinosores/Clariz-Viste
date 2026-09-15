import React, { useState, useEffect } from 'react';
import { Articulo } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Save, Image, Sparkles, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  articuloEditar?: Articulo | null;
}

export const ArticuloModal: React.FC<Props> = ({ isOpen, onClose, articuloEditar }) => {
  const { addArticulo, updateArticulo, articulos } = useApp();

  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('Buzos & Abrigo');
  const [temporada, setTemporada] = useState('Otoño - Invierno 2026');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState('');
  const [telaPrincipal, setTelaPrincipal] = useState('Frisa Invisible Peinada');
  const [curvaNombre, setCurvaNombre] = useState('Curva 10-16 (8 talles)');
  const [tallesStr, setTallesStr] = useState('4, 6, 8, 10, 12, 14, 16, 18');
  const [coloresStr, setColoresStr] = useState('Negro, Blanco, Lila Ceniza, Gris');
  const [costoFabricacion, setCostoFabricacion] = useState<number>(13500);
  const [precioVenta, setPrecioVenta] = useState<number>(28900);
  const [precioMayorista, setPrecioMayorista] = useState<number>(21900);
  const [stockMinimoAlerta, setStockMinimoAlerta] = useState<number>(15);

  useEffect(() => {
    if (articuloEditar) {
      setCodigo(articuloEditar.codigo);
      setNombre(articuloEditar.nombre);
      setCategoria(articuloEditar.categoria);
      setTemporada(articuloEditar.temporada);
      setDescripcion(articuloEditar.descripcion);
      setImagen(articuloEditar.imagen);
      setTelaPrincipal(articuloEditar.telaPrincipal);
      setCurvaNombre(articuloEditar.curvaDefecto.nombre);
      setTallesStr(articuloEditar.curvaDefecto.talles.join(', '));
      setColoresStr(articuloEditar.coloresDisponibles.join(', '));
      setCostoFabricacion(articuloEditar.costoFabricacion);
      setPrecioVenta(articuloEditar.precioVenta);
      setPrecioMayorista(articuloEditar.precioMayorista);
      setStockMinimoAlerta(articuloEditar.stockMinimoAlerta);
    } else {
      const nextId = articulos.length + 1;
      setCodigo(`ART-00${nextId}`);
      setNombre('');
      setDescripcion('');
      setImagen('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=80');
      setCostoFabricacion(12000);
      setPrecioVenta(25000);
      setPrecioMayorista(19000);
      setStockMinimoAlerta(12);
    }
  }, [articuloEditar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !codigo.trim()) return;

    const tallesArray = tallesStr.split(',').map((t) => t.trim()).filter(Boolean);
    const coloresArray = coloresStr.split(',').map((c) => c.trim()).filter(Boolean);

    // Initial stock setup if new article
    let newStock: Record<string, Record<string, number>> = {};
    if (articuloEditar) {
      newStock = { ...articuloEditar.stock };
      // Ensure all colors exist
      coloresArray.forEach((col) => {
        if (!newStock[col]) newStock[col] = {};
        tallesArray.forEach((t) => {
          if (newStock[col][t] === undefined) newStock[col][t] = 0;
        });
      });
    } else {
      coloresArray.forEach((col) => {
        newStock[col] = {};
        tallesArray.forEach((t) => {
          newStock[col][t] = 5; // default starting stock
        });
      });
    }

    const artData: Articulo = {
      id: articuloEditar ? articuloEditar.id : `art-${Date.now()}`,
      codigo: codigo.trim().toUpperCase(),
      nombre: nombre.trim(),
      categoria,
      temporada,
      descripcion,
      imagen: imagen || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=80',
      curvaDefecto: {
        nombre: curvaNombre,
        talles: tallesArray,
        factor: tallesArray.length,
      },
      coloresDisponibles: coloresArray,
      telaPrincipal,
      costoFabricacion: Number(costoFabricacion) || 0,
      precioVenta: Number(precioVenta) || 0,
      precioMayorista: Number(precioMayorista) || 0,
      stock: newStock,
      stockMinimoAlerta: Number(stockMinimoAlerta) || 10,
    };

    if (articuloEditar) {
      updateArticulo(artData);
    } else {
      addArticulo(artData);
    }

    onClose();
  };

  const margenPesos = precioVenta - costoFabricacion;
  const margenPorcentaje = precioVenta > 0 ? (margenPesos / precioVenta) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border-2 border-stone-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col text-stone-900 my-4">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50 rounded-t-2xl">
          <div>
            <h3 className="text-base font-black text-stone-900">
              {articuloEditar ? `Editar ${articuloEditar.nombre}` : 'Nuevo Artículo de Indumentaria'}
            </h3>
            <p className="text-xs text-stone-500">
              Definición de costos de fabricación, curvas de talles y precios de venta
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">
                Código / SKU *
              </label>
              <input
                type="text"
                required
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-mono font-bold text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 uppercase mb-1">
                Nombre de la Prenda *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Maxibuzo c/Capucha y Bolsillo Canguro"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">
                Categoría
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm"
              >
                <option value="Buzos & Abrigo">Buzos & Abrigo</option>
                <option value="Remeras & Tops">Remeras & Tops</option>
                <option value="Pantalones">Pantalones</option>
                <option value="Calzas & Bottoms">Calzas & Bottoms</option>
                <option value="Vestidos">Vestidos</option>
                <option value="Niños & Juvenil">Niños & Juvenil</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">
                Temporada
              </label>
              <input
                type="text"
                value={temporada}
                onChange={(e) => setTemporada(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">
                Tela Principal
              </label>
              <input
                type="text"
                value={telaPrincipal}
                onChange={(e) => setTelaPrincipal(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Curva & Colores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">
                Talles de la Curva (separados por coma)
              </label>
              <input
                type="text"
                value={tallesStr}
                onChange={(e) => setTallesStr(e.target.value)}
                placeholder="4, 6, 8, 10, 12, 14, 16, 18 o S, M, L, XL"
                className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">
                Colores Habilitados (separados por coma)
              </label>
              <input
                type="text"
                value={coloresStr}
                onChange={(e) => setColoresStr(e.target.value)}
                placeholder="Negro, Blanco, Gris Melange, Bordo"
                className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Financials & Margins */}
          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-300/80 space-y-3">
            <h4 className="font-bold uppercase text-stone-800 tracking-wider text-[11px] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" /> Costos, Precios & Margen de Ganancia
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Costo Fabricación (Corte + Tela + Confección)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-stone-500 font-mono">$</span>
                  <input
                    type="number"
                    required
                    value={costoFabricacion}
                    onChange={(e) => setCostoFabricacion(Number(e.target.value))}
                    className="w-full pl-6 pr-3 py-1.5 bg-white border border-stone-300 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Precio Venta Retail (Público)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-stone-500 font-mono">$</span>
                  <input
                    type="number"
                    required
                    value={precioVenta}
                    onChange={(e) => setPrecioVenta(Number(e.target.value))}
                    className="w-full pl-6 pr-3 py-1.5 bg-white border border-stone-300 rounded-lg font-mono font-bold text-emerald-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Precio Mayorista (x Curva)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-stone-500 font-mono">$</span>
                  <input
                    type="number"
                    value={precioMayorista}
                    onChange={(e) => setPrecioMayorista(Number(e.target.value))}
                    className="w-full pl-6 pr-3 py-1.5 bg-white border border-stone-300 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Calculated Margin Box */}
            <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-amber-200">
              <span className="font-semibold text-stone-700">
                Margen Bruto de Ganancia por Prenda:
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-emerald-900 text-sm">
                  +${margenPesos.toLocaleString('es-AR')}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black font-mono text-xs">
                  {margenPorcentaje.toFixed(1)}% ROI
                </span>
              </div>
            </div>
          </div>

          {/* Image URL & Stock alert */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 uppercase mb-1">
                URL de Imagen / Foto
              </label>
              <input
                type="url"
                value={imagen}
                onChange={(e) => setImagen(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">
                Stock Mínimo Alerta
              </label>
              <input
                type="number"
                value={stockMinimoAlerta}
                onChange={(e) => setStockMinimoAlerta(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 uppercase mb-1">
              Descripción de la Prenda
            </label>
            <textarea
              rows={2}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
            />
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-lg shadow-sm"
            >
              Guardar Artículo
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
