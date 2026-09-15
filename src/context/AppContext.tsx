import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Role,
  Vendedora,
  Articulo,
  FichaCorte,
  Cliente,
  CartItem,
  FacturaElectronica,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_VENDEDORAS,
  INITIAL_ARTICULOS,
  INITIAL_FICHAS_CORTE,
  INITIAL_CLIENTES,
  INITIAL_FACTURAS,
} from '../data/initialData';

interface AppContextType {
  // Roles & Auth
  currentUser: User;
  users: User[];
  setCurrentUser: (user: User) => void;
  // Vendedoras
  vendedoras: Vendedora[];
  vendedoraActual: Vendedora;
  setVendedoraActual: (v: Vendedora) => void;
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  // Articulos / Inventario
  articulos: Articulo[];
  addArticulo: (art: Articulo) => void;
  updateArticulo: (art: Articulo) => void;
  deleteArticulo: (id: string) => void;
  ajustarStock: (articuloId: string, color: string, talle: string, cantidadDelta: number) => void;
  // Fichas de Corte
  fichasCorte: FichaCorte[];
  addFichaCorte: (ficha: FichaCorte) => void;
  updateFichaCorte: (ficha: FichaCorte) => void;
  deleteFichaCorte: (id: string) => void;
  ingresarStockDesdeFicha: (fichaId: string) => boolean;
  // Clientes
  clientes: Cliente[];
  addCliente: (cliente: Cliente) => Cliente;
  updateCliente: (cliente: Cliente) => void;
  // Carrito de Ventas (Retail POS)
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'subtotal'>) => void;
  updateCartQty: (articuloId: string, color: string, talle: string, qty: number) => void;
  removeFromCart: (articuloId: string, color: string, talle: string) => void;
  clearCart: () => void;
  // Facturación Electrónica
  facturas: FacturaElectronica[];
  emitirFactura: (datos: {
    cliente: Cliente;
    tipoComprobante: 'Factura B' | 'Factura A' | 'Factura C' | 'Ticket Fiscal';
    metodoPago: 'Efectivo' | 'Transferencia Bancaria' | 'Tarjeta de Débito' | 'Tarjeta de Crédito' | 'Mercado Pago';
    descuentoPorcentaje: number;
    notas?: string;
  }) => FacturaElectronica | null;
  anularFactura: (id: string) => void;
  // Toast notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'cv_app_users_v1',
  CURRENT_USER: 'cv_app_current_user_v1',
  VENDEDORAS: 'cv_app_vendedoras_v1',
  VENDEDORA_ACTUAL: 'cv_app_vendedora_actual_v1',
  ARTICULOS: 'cv_app_articulos_v1',
  FICHAS_CORTE: 'cv_app_fichas_corte_v1',
  CLIENTES: 'cv_app_clientes_v1',
  FACTURAS: 'cv_app_facturas_v1',
  CART: 'cv_app_cart_v1',
  TAB: 'cv_app_tab_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Users & Role
  const [users] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_USERS[0]; // Clara Méndez (admin)
  });

  // Vendedoras
  const [vendedoras] = useState<Vendedora[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VENDEDORAS);
    return saved ? JSON.parse(saved) : INITIAL_VENDEDORAS;
  });

  const [vendedoraActual, setVendedoraActual] = useState<Vendedora>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VENDEDORA_ACTUAL);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_VENDEDORAS[0]; // Sofía Morales
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.TAB) || 'pos';
  });

  // Artículos / Inventario
  const [articulos, setArticulos] = useState<Articulo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ARTICULOS);
    return saved ? JSON.parse(saved) : INITIAL_ARTICULOS;
  });

  // Fichas de Corte
  const [fichasCorte, setFichasCorte] = useState<FichaCorte[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FICHAS_CORTE);
    return saved ? JSON.parse(saved) : INITIAL_FICHAS_CORTE;
  });

  // Clientes
  const [clientes, setClientes] = useState<Cliente[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLIENTES);
    return saved ? JSON.parse(saved) : INITIAL_CLIENTES;
  });

  // Facturas Electrónicas
  const [facturas, setFacturas] = useState<FacturaElectronica[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FACTURAS);
    return saved ? JSON.parse(saved) : INITIAL_FACTURAS;
  });

  // Carrito POS
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VENDEDORA_ACTUAL, JSON.stringify(vendedoraActual));
  }, [vendedoraActual]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TAB, activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ARTICULOS, JSON.stringify(articulos));
  }, [articulos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FICHAS_CORTE, JSON.stringify(fichasCorte));
  }, [fichasCorte]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(clientes));
  }, [clientes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FACTURAS, JSON.stringify(facturas));
  }, [facturas]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  // Adjust role navigation if restricted
  useEffect(() => {
    if (currentUser.role === 'cortador' && activeTab !== 'corte') {
      setActiveTab('corte');
    }
  }, [currentUser.role]);

  // Articulo methods
  const addArticulo = (art: Articulo) => {
    setArticulos((prev) => [art, ...prev]);
    showToast(`Artículo "${art.nombre}" agregado con éxito`);
  };

  const updateArticulo = (art: Articulo) => {
    setArticulos((prev) => prev.map((a) => (a.id === art.id ? art : a)));
    showToast(`Artículo "${art.nombre}" actualizado`);
  };

  const deleteArticulo = (id: string) => {
    setArticulos((prev) => prev.filter((a) => a.id !== id));
    showToast('Artículo eliminado del catálogo');
  };

  const ajustarStock = (articuloId: string, color: string, talle: string, cantidadDelta: number) => {
    setArticulos((prev) =>
      prev.map((art) => {
        if (art.id !== articuloId) return art;
        const colorStock = { ...(art.stock[color] || {}) };
        const currentQty = colorStock[talle] || 0;
        colorStock[talle] = Math.max(0, currentQty + cantidadDelta);
        return {
          ...art,
          stock: {
            ...art.stock,
            [color]: colorStock,
          },
        };
      })
    );
  };

  // Ficha de Corte methods
  const addFichaCorte = (ficha: FichaCorte) => {
    setFichasCorte((prev) => [ficha, ...prev]);
    showToast(`Ficha de Corte N° ${ficha.numeroCorte} guardada`);
  };

  const updateFichaCorte = (ficha: FichaCorte) => {
    setFichasCorte((prev) => prev.map((f) => (f.id === ficha.id ? ficha : f)));
    showToast(`Ficha N° ${ficha.numeroCorte} actualizada`);
  };

  const deleteFichaCorte = (id: string) => {
    setFichasCorte((prev) => prev.filter((f) => f.id !== id));
    showToast('Ficha de corte eliminada');
  };

  // Ingresar prendas confeccionadas al stock real del local
  const ingresarStockDesdeFicha = (fichaId: string): boolean => {
    const ficha = fichasCorte.find((f) => f.id === fichaId);
    if (!ficha) return false;
    if (ficha.estado === 'ingresado_stock') {
      showToast('Esta ficha ya fue ingresada previamente al stock');
      return false;
    }

    const articulo = articulos.find((a) => a.id === ficha.articuloId);
    if (!articulo) {
      showToast('No se encontró el artículo correspondiente para ingresar stock');
      return false;
    }

    // Distribute the cut clothes into the article sizes
    // Group cut layers by color
    const colorPrendas: Record<string, number> = {};
    ficha.filasColor.forEach((fila) => {
      colorPrendas[fila.color] = (colorPrendas[fila.color] || 0) + fila.prendasCalculadas;
    });

    const talles = ficha.tallesNombres.length > 0 ? ficha.tallesNombres : articulo.curvaDefecto.talles;
    const tallesCount = talles.length || 1;

    setArticulos((prev) =>
      prev.map((art) => {
        if (art.id !== ficha.articuloId) return art;
        const newStock = { ...art.stock };

        Object.entries(colorPrendas).forEach(([color, totalPrendasColor]) => {
          if (!newStock[color]) {
            newStock[color] = {};
          }
          // Distribute uniformly per size in the curve
          const prendasPorTalle = Math.floor(totalPrendasColor / tallesCount);
          const resto = totalPrendasColor % tallesCount;

          talles.forEach((talle, idx) => {
            const actual = newStock[color][talle] || 0;
            const extra = idx < resto ? 1 : 0;
            newStock[color][talle] = actual + prendasPorTalle + extra;
          });
        });

        return {
          ...art,
          stock: newStock,
        };
      })
    );

    // Update ficha status
    setFichasCorte((prev) =>
      prev.map((f) =>
        f.id === fichaId
          ? {
              ...f,
              estado: 'ingresado_stock',
              fechaIngresoStock: new Date().toISOString().split('T')[0],
            }
          : f
      )
    );

    showToast(`¡${ficha.totalPrendas} prendas del Corte N° ${ficha.numeroCorte} ingresadas al stock en tiempo real!`);
    return true;
  };

  // Clientes
  const addCliente = (cliente: Cliente): Cliente => {
    setClientes((prev) => [cliente, ...prev]);
    showToast(`Cliente "${cliente.nombre}" registrado`);
    return cliente;
  };

  const updateCliente = (cliente: Cliente) => {
    setClientes((prev) => prev.map((c) => (c.id === cliente.id ? cliente : c)));
    showToast(`Datos de "${cliente.nombre}" actualizados`);
  };

  // Carrito de ventas (POS)
  const addToCart = (item: Omit<CartItem, 'subtotal'>) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.articuloId === item.articuloId && i.color === item.color && i.talle === item.talle
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        const newQty = Math.min(item.stockDisponible, updated[existingIdx].cantidad + item.cantidad);
        updated[existingIdx] = {
          ...updated[existingIdx],
          cantidad: newQty,
          subtotal: newQty * updated[existingIdx].precioUnitario,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            ...item,
            subtotal: item.cantidad * item.precioUnitario,
          },
        ];
      }
    });
    showToast(`Agregado: ${item.articuloNombre} (${item.color} - Talle ${item.talle})`);
  };

  const updateCartQty = (articuloId: string, color: string, talle: string, qty: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.articuloId === articuloId && item.color === color && item.talle === talle) {
            const validQty = Math.max(1, Math.min(item.stockDisponible, qty));
            return {
              ...item,
              cantidad: validQty,
              subtotal: validQty * item.precioUnitario,
            };
          }
          return item;
        })
        .filter((item) => item.cantidad > 0)
    );
  };

  const removeFromCart = (articuloId: string, color: string, talle: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.articuloId === articuloId && item.color === color && item.talle === talle)
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Emisión de Facturas Electrónicas
  const emitirFactura = (datos: {
    cliente: Cliente;
    tipoComprobante: 'Factura B' | 'Factura A' | 'Factura C' | 'Ticket Fiscal';
    metodoPago: 'Efectivo' | 'Transferencia Bancaria' | 'Tarjeta de Débito' | 'Tarjeta de Crédito' | 'Mercado Pago';
    descuentoPorcentaje: number;
    notas?: string;
  }): FacturaElectronica | null => {
    if (cart.length === 0) {
      showToast('El carrito está vacío. Agregá prendas para emitir la factura.');
      return null;
    }

    // Verify stock availability
    for (const item of cart) {
      const art = articulos.find((a) => a.id === item.articuloId);
      const stockActual = art?.stock[item.color]?.[item.talle] || 0;
      if (item.cantidad > stockActual) {
        showToast(`Stock insuficiente de ${item.articuloNombre} (${item.color} - Talle ${item.talle})`);
        return null;
      }
    }

    // Calculations
    const subtotalBruto = cart.reduce((acc, it) => acc + it.subtotal, 0);
    const descuentoMonto = Math.round(subtotalBruto * (datos.descuentoPorcentaje / 100));
    const subtotalConDescuento = subtotalBruto - descuentoMonto;
    
    // IVA calculation (21% for A and B)
    const ivaCalculado =
      datos.tipoComprobante === 'Factura A'
        ? Math.round(subtotalConDescuento * 0.21)
        : Math.round(subtotalConDescuento - subtotalConDescuento / 1.21);

    const total =
      datos.tipoComprobante === 'Factura A'
        ? subtotalConDescuento + ivaCalculado
        : subtotalConDescuento;

    const costoTotal = cart.reduce((acc, it) => acc + it.costoUnitario * it.cantidad, 0);
    const gananciaNeta = total - (datos.tipoComprobante === 'Factura A' ? ivaCalculado : 0) - costoTotal;
    const margenPorcentaje = total > 0 ? (gananciaNeta / total) * 100 : 0;

    // Sequential number
    const countType = facturas.filter((f) => f.tipoComprobante === datos.tipoComprobante).length + 1;
    const letra = datos.tipoComprobante === 'Factura A' ? 'A' : datos.tipoComprobante === 'Factura B' ? 'B' : 'C';
    const numeroComprobante = `${letra}-0001-${String(countType + 427).padStart(8, '0')}`;

    // Electronic Authorization (AFIP / ARCA CAE simulation)
    const randomCaeNum = Math.floor(10000000000000 + Math.random() * 90000000000000).toString();
    const vtoDate = new Date();
    vtoDate.setDate(vtoDate.getDate() + 10);
    const caeVencimiento = vtoDate.toISOString().split('T')[0];

    // QR AFIP official standard format
    const qrObj = {
      ver: 1,
      fecha: new Date().toISOString().split('T')[0],
      cuit: 30716289013,
      ptoVta: 1,
      tipoCmp: datos.tipoComprobante === 'Factura A' ? 1 : 6,
      nroCmp: countType + 427,
      importe: total,
      moneda: 'PES',
      ctz: 1,
      tipoDocRec: datos.cliente.tipoDocumento === 'CUIT' ? 80 : 96,
      nroDocRec: Number(datos.cliente.documento.replace(/\D/g, '')) || 0,
      tipoCodAut: 'E',
      codAut: Number(randomCaeNum),
    };
    const qrData = `https://www.afip.gob.ar/fe/qr/?p=${btoa(JSON.stringify(qrObj))}`;

    const nuevaFactura: FacturaElectronica = {
      id: `fac-${Date.now()}`,
      numeroComprobante,
      puntoVenta: 1,
      tipoComprobante: datos.tipoComprobante,
      fechaEmision: new Date().toLocaleString('es-AR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      cliente: datos.cliente,
      vendedora: vendedoraActual,
      items: [...cart],
      metodoPago: datos.metodoPago,
      subtotal: subtotalBruto,
      descuento: descuentoMonto,
      iva: ivaCalculado,
      total,
      costoTotal,
      gananciaNeta,
      margenPorcentaje: Math.round(margenPorcentaje * 100) / 100,
      cae: randomCaeNum,
      caeVencimiento,
      qrData,
      estado: 'emitida',
      notas: datos.notas,
    };

    // Deduct stock in real time!
    cart.forEach((it) => {
      ajustarStock(it.articuloId, it.color, it.talle, -it.cantidad);
    });

    // Update client purchase stats
    setClientes((prev) =>
      prev.map((c) =>
        c.id === datos.cliente.id
          ? {
              ...c,
              totalCompras: c.totalCompras + total,
              ultimaCompra: new Date().toISOString().split('T')[0],
            }
          : c
      )
    );

    // Save invoice
    setFacturas((prev) => [nuevaFactura, ...prev]);

    // Clear cart
    clearCart();

    showToast(`¡${datos.tipoComprobante} ${numeroComprobante} emitida con éxito por ${vendedoraActual.name}!`);
    return nuevaFactura;
  };

  const anularFactura = (id: string) => {
    const fac = facturas.find((f) => f.id === id);
    if (!fac) return;
    if (fac.estado === 'anulada') {
      showToast('Esta factura ya se encuentra anulada');
      return;
    }

    // Re-stock the items
    fac.items.forEach((it) => {
      ajustarStock(it.articuloId, it.color, it.talle, it.cantidad);
    });

    setFacturas((prev) =>
      prev.map((f) => (f.id === id ? { ...f, estado: 'anulada' } : f))
    );
    showToast(`Comprobante ${fac.numeroComprobante} anulado y stock devuelto.`);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        setCurrentUser,
        vendedoras,
        vendedoraActual,
        setVendedoraActual,
        activeTab,
        setActiveTab,
        articulos,
        addArticulo,
        updateArticulo,
        deleteArticulo,
        ajustarStock,
        fichasCorte,
        addFichaCorte,
        updateFichaCorte,
        deleteFichaCorte,
        ingresarStockDesdeFicha,
        clientes,
        addCliente,
        updateCliente,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        facturas,
        emitirFactura,
        anularFactura,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
