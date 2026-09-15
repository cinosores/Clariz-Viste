import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Cliente } from '../../types';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Edit3,
  UserCheck,
  Building,
  X,
  CheckCircle2,
} from 'lucide-react';

export const ClientesView: React.FC = () => {
  const { clientes, addCliente, updateCliente } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondicion, setFilterCondicion] = useState('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);

  // Form State
  const [nombre, setNombre] = useState('');
  const [documento, setDocumento] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState<'DNI' | 'CUIT'>('DNI');
  const [condicionIva, setCondicionIva] = useState<
    'Consumidor Final' | 'Responsable Inscripto' | 'Monotributo' | 'Exento'
  >('Consumidor Final');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('CABA');

  const filteredClientes = clientes.filter((c) => {
    const matchesSearch =
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.documento.includes(searchTerm) ||
      c.telefono.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCond =
      filterCondicion === 'todas' || c.condicionIva === filterCondicion;

    return matchesSearch && matchesCond;
  });

  const handleOpenNew = () => {
    setEditingClient(null);
    setNombre('');
    setDocumento('');
    setTipoDocumento('DNI');
    setCondicionIva('Consumidor Final');
    setTelefono('');
    setEmail('');
    setDireccion('');
    setCiudad('CABA');
    setIsModalOpen(true);
  };

  const handleEdit = (cli: Cliente) => {
    setEditingClient(cli);
    setNombre(cli.nombre);
    setDocumento(cli.documento);
    setTipoDocumento(cli.tipoDocumento);
    setCondicionIva(cli.condicionIva);
    setTelefono(cli.telefono);
    setEmail(cli.email);
    setDireccion(cli.direccion);
    setCiudad(cli.ciudad || 'CABA');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    if (editingClient) {
      updateCliente({
        ...editingClient,
        nombre: nombre.trim(),
        documento: documento.trim(),
        tipoDocumento,
        condicionIva,
        telefono: telefono.trim(),
        email: email.trim(),
        direccion: direccion.trim(),
        ciudad: ciudad.trim(),
      });
    } else {
      addCliente({
        id: `cli-${Date.now()}`,
        nombre: nombre.trim(),
        documento: documento.trim() || '99999999',
        tipoDocumento,
        condicionIva,
        telefono: telefono.trim() || '-',
        email: email.trim() || '',
        direccion: direccion.trim() || '',
        ciudad: ciudad.trim() || 'CABA',
        totalCompras: 0,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Banner */}
      <div className="bg-white border-2 border-stone-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-stone-900 text-amber-400 rounded-xl shadow-xs">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-stone-950 font-serif">
              Registro & Cartera de Clientes
            </h2>
            <p className="text-xs text-stone-600">
              Datos fiscales para emisión de Factura A y B, historial de compras y contactos.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-sm rounded-xl shadow-md transition active:scale-95 border border-stone-800"
        >
          <Plus className="w-4 h-4" /> + Registrar Cliente
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-xl border border-stone-300 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, DNI, CUIT, teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-stone-600 uppercase">Condición Fiscal:</span>
          <select
            value={filterCondicion}
            onChange={(e) => setFilterCondicion(e.target.value)}
            className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-medium outline-none"
          >
            <option value="todas">Todas</option>
            <option value="Consumidor Final">Consumidor Final</option>
            <option value="Responsable Inscripto">Responsable Inscripto (Factura A)</option>
            <option value="Monotributo">Monotributo</option>
            <option value="Exento">Exento</option>
          </select>
        </div>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClientes.map((cli) => (
          <div
            key={cli.id}
            className="bg-white rounded-xl border border-stone-300 shadow-xs p-5 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    cli.condicionIva === 'Responsable Inscripto'
                      ? 'bg-blue-100 text-blue-900 border border-blue-300'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {cli.condicionIva}
                </span>
                <button
                  onClick={() => handleEdit(cli)}
                  className="p-1 text-stone-400 hover:text-stone-900 rounded"
                  title="Editar cliente"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-base font-bold text-stone-950 mb-1">
                {cli.nombre}
              </h3>

              <div className="text-xs text-stone-600 space-y-1.5 mt-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                    {cli.tipoDocumento}: {cli.documento}
                  </span>
                </div>
                {cli.telefono && cli.telefono !== '-' && (
                  <div className="flex items-center gap-2 text-stone-600">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span>{cli.telefono}</span>
                  </div>
                )}
                {cli.email && (
                  <div className="flex items-center gap-2 text-stone-600">
                    <Mail className="w-3.5 h-3.5 text-stone-400" />
                    <span className="truncate">{cli.email}</span>
                  </div>
                )}
                {cli.direccion && (
                  <div className="flex items-center gap-2 text-stone-600">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span className="truncate">{cli.direccion}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Purchases Stats Footer */}
            <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-stone-500 block text-[11px]">Total Compras:</span>
                <span className="font-mono font-bold text-stone-950 text-sm">
                  ${cli.totalCompras.toLocaleString('es-AR')}
                </span>
              </div>
              {cli.ultimaCompra && (
                <div className="text-right">
                  <span className="text-stone-500 block text-[11px]">Última Compra:</span>
                  <span className="text-stone-700 font-medium">{cli.ultimaCompra}</span>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white border-2 border-stone-800 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900">
                {editingClient ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Nombre Completo / Razón Social *
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Tipo Doc
                  </label>
                  <select
                    value={tipoDocumento}
                    onChange={(e) => setTipoDocumento(e.target.value as any)}
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
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Condición Frente al IVA
                </label>
                <select
                  value={condicionIva}
                  onChange={(e) => setCondicionIva(e.target.value as any)}
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
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-stone-300 rounded-lg text-stone-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-lg"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
