import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Scissors,
  FileText,
  Boxes,
  Users,
  BarChart3,
  AlertTriangle,
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, cart, articulos, fichasCorte, currentUser } = useApp();

  // Low stock counter
  const lowStockCount = articulos.reduce((count, art) => {
    let artTotal = 0;
    Object.values(art.stock).forEach((sizes) => {
      Object.values(sizes).forEach((qty) => {
        artTotal += qty;
      });
    });
    return artTotal <= art.stockMinimoAlerta ? count + 1 : count;
  }, 0);

  // Active cuts in progress
  const cortesEnProceso = fichasCorte.filter((f) => f.estado !== 'ingresado_stock').length;

  const tabs = [
    {
      id: 'pos',
      label: 'Punto de Venta / Retail',
      shortLabel: 'POS Ventas',
      icon: ShoppingBag,
      badge: cart.length > 0 ? `${cart.reduce((a, b) => a + b.cantidad, 0)} prendas` : undefined,
      badgeColor: 'bg-amber-500 text-stone-950 font-bold',
      roles: ['admin', 'vendedora'],
    },
    {
      id: 'corte',
      label: 'Cuaderno de Corte',
      shortLabel: 'Corte',
      icon: Scissors,
      badge: cortesEnProceso > 0 ? `${cortesEnProceso} cortes` : undefined,
      badgeColor: 'bg-blue-600 text-white font-medium',
      roles: ['admin', 'cortador'],
    },
    {
      id: 'facturas',
      label: 'Facturas Electrónicas',
      shortLabel: 'Facturas',
      icon: FileText,
      roles: ['admin', 'vendedora'],
    },
    {
      id: 'inventario',
      label: 'Inventario & Stock',
      shortLabel: 'Inventario',
      icon: Boxes,
      badge: lowStockCount > 0 ? `${lowStockCount} alertas` : undefined,
      badgeColor: 'bg-rose-500 text-white font-semibold',
      roles: ['admin', 'vendedora', 'cortador'],
    },
    {
      id: 'clientes',
      label: 'Clientes',
      shortLabel: 'Clientes',
      icon: Users,
      roles: ['admin', 'vendedora'],
    },
    {
      id: 'reportes',
      label: 'Analíticas & Rentabilidad',
      shortLabel: 'Reportes',
      icon: BarChart3,
      roles: ['admin'],
    },
  ];

  return (
    <nav className="bg-stone-900 border-b border-stone-800 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isAuthorized = tab.roles.includes(currentUser.role);

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150 relative ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-stone-950' : 'text-stone-400'}`} />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="inline md:hidden">{tab.shortLabel}</span>

                {tab.badge && (
                  <span
                    className={`ml-1 text-[11px] px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-stone-950 text-amber-400 font-black' : tab.badgeColor
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}

                {!isAuthorized && (
                  <span
                    className="ml-1 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-stone-800 text-stone-400 border border-stone-700"
                    title={`Vista diseñada para perfil: ${tab.roles.join(', ')}`}
                  >
                    {tab.roles[0]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
