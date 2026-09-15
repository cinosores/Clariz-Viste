import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Scissors,
  ShoppingBag,
  UserCheck,
  Shield,
  ChevronDown,
  Sparkles,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { User, Vendedora } from '../types';

export const Header: React.FC = () => {
  const {
    currentUser,
    users,
    setCurrentUser,
    vendedoras,
    vendedoraActual,
    setVendedoraActual,
    cart,
    setActiveTab,
  } = useApp();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showVendedoraDropdown, setShowVendedoraDropdown] = useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            <Shield className="w-3 h-3 text-amber-700" /> Admin / Dueña
          </span>
        );
      case 'cortador':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-900 border border-blue-300">
            <Scissors className="w-3 h-3 text-blue-700" /> Cortador
          </span>
        );
      case 'vendedora':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <UserCheck className="w-3 h-3 text-emerald-700" /> Vendedora
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="bg-stone-900 text-stone-100 border-b border-stone-800 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-black shadow-md border border-amber-400/40">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-stone-50 font-serif">
                  CLARIZ VISTE
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Fábrica & Retail
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">
                Sistema Integral Textil · Cuaderno de Corte & Punto de Venta
              </p>
            </div>
          </div>

          {/* Center / Right controls: Vendedora selector & User role switcher */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Quick selector de Vendedora (Sofía / Valentina) */}
            <div className="relative">
              <div className="flex flex-col text-right mr-1 hidden sm:block">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                  Vendedora en Turno
                </span>
              </div>
              <button
                onClick={() => {
                  setShowVendedoraDropdown(!showVendedoraDropdown);
                  setShowUserDropdown(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 transition text-sm font-medium text-stone-200"
                title="Cambiar vendedora activa para las ventas y facturas"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${vendedoraActual.id === 'vend-1' ? 'bg-emerald-400' : 'bg-purple-400'} animate-pulse`} />
                <span className="font-semibold text-stone-100">{vendedoraActual.name}</span>
                <ChevronDown className="w-4 h-4 text-stone-400" />
              </button>

              {/* Vendedora Dropdown */}
              {showVendedoraDropdown && (
                <div className="absolute right-0 mt-2 w-60 rounded-xl bg-stone-850 bg-stone-900 border border-stone-700 shadow-2xl p-2 z-50 text-stone-200">
                  <div className="px-3 py-2 border-b border-stone-800 text-xs font-semibold text-stone-400">
                    Seleccionar Vendedora Activa (2 Vendedoras)
                  </div>
                  <div className="py-1 space-y-1">
                    {vendedoras.map((v) => {
                      const isSelected = v.id === vendedoraActual.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => {
                            setVendedoraActual(v);
                            setShowVendedoraDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition ${
                            isSelected
                              ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                              : 'hover:bg-stone-800 text-stone-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                v.id === 'vend-1' ? 'bg-emerald-400' : 'bg-purple-400'
                              }`}
                            />
                            <span>{v.name}</span>
                          </div>
                          <span className="text-xs text-stone-400 font-mono">
                            {v.codigo}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="px-3 py-1.5 bg-stone-950/60 rounded text-[11px] text-stone-400 border border-stone-800/80 mt-1">
                    💡 Las facturas y reportes de comisión se asignan a esta vendedora.
                  </div>
                </div>
              )}
            </div>

            {/* Quick Cart Trigger */}
            <button
              onClick={() => setActiveTab('pos')}
              className="relative p-2 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 hover:text-amber-400 transition"
              title="Ir al Carrito de Ventas"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-stone-950 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {cart.reduce((a, b) => a + b.cantidad, 0)}
                </span>
              )}
            </button>

            {/* User Profile & Role Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserDropdown(!showUserDropdown);
                  setShowVendedoraDropdown(false);
                }}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-800 border border-stone-700/80 transition"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-amber-500/40"
                />
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-stone-200 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] text-stone-400">
                    {currentUser.roleLabel}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-stone-400" />
              </button>

              {/* User Switcher Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-stone-900 border border-stone-700 shadow-2xl p-2 z-50 text-stone-200">
                  <div className="px-3 py-2 border-b border-stone-800">
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                      Cambiar Usuario / Rol
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Probar la interfaz desde cada perspectiva de trabajo
                    </p>
                  </div>
                  <div className="py-1 space-y-1">
                    {users.map((u) => {
                      const isSelected = u.id === currentUser.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            setCurrentUser(u);
                            setShowUserDropdown(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition ${
                            isSelected
                              ? 'bg-amber-500/20 border border-amber-500/30 text-amber-200 font-semibold'
                              : 'hover:bg-stone-800 text-stone-300'
                          }`}
                        >
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover border border-stone-600"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm truncate font-medium text-stone-100">
                              {u.name}
                            </div>
                            <div className="text-xs text-stone-400 flex items-center gap-1.5 mt-0.5">
                              {getRoleBadge(u.role)}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="px-3 py-2 bg-stone-950/80 rounded-lg text-[11px] text-stone-400 border border-stone-800 mt-2 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Roles:</strong> El <em>Admin</em> ve costos y márgenes; el <em>Cortador</em> opera el cuaderno de corte; la <em>Vendedora</em> emite ventas y facturas.
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
