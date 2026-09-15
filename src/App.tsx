import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { CuadernoCorteView } from './components/CuadernoCorte/CuadernoCorteView';
import { PosView } from './components/POS/PosView';
import { InventarioView } from './components/Inventario/InventarioView';
import { FacturasListView } from './components/Facturas/FacturasListView';
import { ClientesView } from './components/Clientes/ClientesView';
import { ReportesView } from './components/Reportes/ReportesView';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans text-stone-900 antialiased selection:bg-amber-400 selection:text-stone-950">
      
      {/* Header */}
      <Header />

      {/* Navigation Sub-header with Tabs */}
      <Navigation />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'corte' && <CuadernoCorteView />}
        {activeTab === 'pos' && <PosView />}
        {activeTab === 'inventario' && <InventarioView />}
        {activeTab === 'facturas' && <FacturasListView />}
        {activeTab === 'clientes' && <ClientesView />}
        {activeTab === 'reportes' && <ReportesView />}
      </main>

      {/* System Footer */}
      <footer className="bg-stone-900 border-t border-stone-800 text-stone-400 py-6 text-xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-black text-amber-400 text-sm tracking-tight">
              CLARIZ VISTE
            </span>
            <span className="text-stone-600">|</span>
            <span className="text-stone-400">
              Sistema Integral de Fabricación & Retail Textil
            </span>
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Cuaderno de Corte Taller</span>
            <span>•</span>
            <span>Facturación AFIP / ARCA</span>
            <span>•</span>
            <span>2 Vendedoras en Mostrador</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
