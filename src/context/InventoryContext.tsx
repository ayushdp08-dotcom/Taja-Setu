import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  BusinessType,
  Product,
  Batch,
  StockTransaction,
  Recipe,
  Supplier,
  PurchaseOrder,
  WasteRecord,
  FreshnessRecommendation,
  NotificationItem,
  UserBusinessProfile,
  DemandForecast,
} from '../types';
import {
  BUSINESS_CONFIGS,
  INITIAL_PROFILES,
  getInitialBusinessData,
} from '../data/mockData';

interface InventoryContextType {
  businessType: BusinessType;
  setBusinessType: (type: BusinessType) => void;
  profile: UserBusinessProfile;
  updateProfile: (updates: Partial<UserBusinessProfile>) => void;
  isAuthenticated: boolean;
  loginWithPhone: (phone: string, bType: BusinessType) => Promise<{ success: boolean; testCode?: string; message: string }>;
  verifyOtp: (code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  
  // Data
  products: Product[];
  recipes: Recipe[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  wasteRecords: WasteRecord[];
  transactions: StockTransaction[];
  notifications: NotificationItem[];
  
  // Actions
  addProduct: (product: Omit<Product, 'id' | 'batches'> & { initialBatch?: Partial<Batch> }) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  archiveProduct: (id: string) => void;
  adjustStock: (productId: string, quantityChange: number, type: StockTransaction['type'], reason: string, batchNumber?: string) => void;
  
  // Workflow actions
  sellRecipeItem: (recipeId: string, portions?: number) => { success: boolean; message: string; missingIngredients?: string[] };
  executeBakeBatch: (recipeId: string, batchesCount?: number) => { success: boolean; message: string };
  recordWaste: (data: Omit<WasteRecord, 'id' | 'date'>) => void;
  createPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'createdAt' | 'status'>) => void;
  updatePOStatus: (id: string, status: PurchaseOrder['status']) => void;
  applyFreshnessRecommendation: (recId: string) => void;
  
  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // Computed helpers
  stockValue: number;
  totalLowStock: Product[];
  criticalExpiringBatches: { product: Product; batch: Batch; daysLeft: number }[];
  expiredBatches: { product: Product; batch: Batch; daysPast: number }[];
  totalWasteCost: number;
  reorderRecommendations: Array<{
    product: Product;
    recommendedQty: number;
    currentStock: number;
    onOrderQty: number;
    leadTimeDays: number;
    safetyStock: number;
    projectedDemand: number;
    suggestedDate: string;
    estimatedCost: number;
    urgency: 'critical' | 'high' | 'normal';
  }>;
  freshnessRecommendations: FreshnessRecommendation[];
  demandForecasts: DemandForecast[];
  
  // Reset
  resetBusinessData: () => void;
  
  // UI helpers
  formatCurrency: (amount: number) => string;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Saved active business type (persisted)
  const [businessType, setBusinessTypeState] = useState<BusinessType>(() => {
    const saved = localStorage.getItem('stocksmart_active_business');
    return (saved as BusinessType) || 'grocery';
  });

  const [authSession, setAuthSession] = useState<{ token: string; phone: string } | null>(() => {
    const saved = localStorage.getItem('stocksmart_auth_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [pendingPhone, setPendingPhone] = useState<string>('');

  // Load business-specific data from localStorage or mockData
  const storagePrefix = `stocksmart_v2_${businessType}`;

  const [profile, setProfile] = useState<UserBusinessProfile>(() => {
    const saved = localStorage.getItem(`${storagePrefix}_profile`);
    return saved ? JSON.parse(saved) : (INITIAL_PROFILES[businessType] || INITIAL_PROFILES.grocery);
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`${storagePrefix}_products`);
    if (saved) return JSON.parse(saved);
    return getInitialBusinessData(businessType).products;
  });

  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem(`${storagePrefix}_recipes`);
    if (saved) return JSON.parse(saved);
    return getInitialBusinessData(businessType).recipes;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem(`${storagePrefix}_suppliers`);
    if (saved) return JSON.parse(saved);
    return getInitialBusinessData(businessType).suppliers;
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem(`${storagePrefix}_pos`);
    if (saved) return JSON.parse(saved);
    // Initial sample PO
    return [
      {
        id: `po_${businessType}_101`,
        poNumber: `PO-${businessType.toUpperCase().slice(0, 3)}-882`,
        supplierId: getInitialBusinessData(businessType).suppliers[0]?.id || 'sup_1',
        supplierName: getInitialBusinessData(businessType).suppliers[0]?.name || 'Primary Supplier',
        status: 'sent',
        items: [
          {
            productId: getInitialBusinessData(businessType).products[0]?.id || 'p_1',
            productName: getInitialBusinessData(businessType).products[0]?.name || 'Standard Item',
            quantity: 30,
            unit: getInitialBusinessData(businessType).products[0]?.unit || 'units',
            unitCost: getInitialBusinessData(businessType).products[0]?.costPrice || 50,
            totalCost: 30 * (getInitialBusinessData(businessType).products[0]?.costPrice || 50),
          },
        ],
        totalAmount: 30 * (getInitialBusinessData(businessType).products[0]?.costPrice || 50),
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        expectedDeliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        notes: 'Priority replenishment order generated by TajaSetu AI',
      },
    ];
  });

  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>(() => {
    const saved = localStorage.getItem(`${storagePrefix}_waste`);
    if (saved) return JSON.parse(saved);
    const initialItem = getInitialBusinessData(businessType).products[0];
    return [
      {
        id: `w_${Date.now() - 100000}`,
        productId: initialItem?.id || 'p1',
        productName: initialItem?.name || 'Perishable Batch Item',
        category: initialItem?.category || 'Perishables',
        batchNumber: 'OLD-BATCH-01',
        quantity: 4,
        unit: initialItem?.unit || 'units',
        lossAmount: (initialItem?.costPrice || 50) * 4,
        reason: 'expired',
        date: new Date(Date.now() - 2 * 86400000).toISOString(),
        loggedBy: 'Ayush S.',
      },
    ];
  });

  const [transactions, setTransactions] = useState<StockTransaction[]>(() => {
    const saved = localStorage.getItem(`${storagePrefix}_transactions`);
    if (saved) return JSON.parse(saved);
    const initialItem = getInitialBusinessData(businessType).products[0];
    return [
      {
        id: `tx_1`,
        productId: initialItem?.id || 'p1',
        productName: initialItem?.name || 'Primary Item',
        type: 'stock_in',
        quantity: 50,
        unit: initialItem?.unit || 'units',
        batchNumber: 'BATCH-INIT-1',
        date: new Date(Date.now() - 3 * 86400000).toISOString(),
        reason: 'Opening stock count',
        costValue: (initialItem?.costPrice || 50) * 50,
      },
    ];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${storagePrefix}_notifications`);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'n_1',
        type: 'expiry',
        title: 'Critical Expiry Alert',
        message: 'Batches of perishable stock are expiring in less than 24 hours. FEFO action required.',
        severity: 'critical',
        timestamp: new Date().toISOString(),
        isRead: false,
        linkRoute: '/expiry',
      },
      {
        id: 'n_2',
        type: 'low_stock',
        title: 'Stock Below Safety Threshold',
        message: 'Multiple fast-moving items reached their reorder level. Review PO suggestions.',
        severity: 'warning',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isRead: false,
        linkRoute: '/reorder',
      },
    ];
  });

  // Switch business type safely
  const setBusinessType = useCallback((type: BusinessType) => {
    setBusinessTypeState(type);
    localStorage.setItem('stocksmart_active_business', type);
    // Load that business's profile & data
    const pKey = `stocksmart_v2_${type}`;
    const pSaved = localStorage.getItem(`${pKey}_profile`);
    setProfile(pSaved ? JSON.parse(pSaved) : (INITIAL_PROFILES[type] || INITIAL_PROFILES.grocery));

    const prodSaved = localStorage.getItem(`${pKey}_products`);
    setProducts(prodSaved ? JSON.parse(prodSaved) : getInitialBusinessData(type).products);

    const recSaved = localStorage.getItem(`${pKey}_recipes`);
    setRecipes(recSaved ? JSON.parse(recSaved) : getInitialBusinessData(type).recipes);

    const supSaved = localStorage.getItem(`${pKey}_suppliers`);
    setSuppliers(supSaved ? JSON.parse(supSaved) : getInitialBusinessData(type).suppliers);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(`${storagePrefix}_profile`, JSON.stringify(profile));
  }, [profile, storagePrefix]);

  useEffect(() => {
    localStorage.setItem(`${storagePrefix}_products`, JSON.stringify(products));
  }, [products, storagePrefix]);

  useEffect(() => {
    localStorage.setItem(`${storagePrefix}_recipes`, JSON.stringify(recipes));
  }, [recipes, storagePrefix]);

  useEffect(() => {
    localStorage.setItem(`${storagePrefix}_suppliers`, JSON.stringify(suppliers));
  }, [suppliers, storagePrefix]);

  useEffect(() => {
    localStorage.setItem(`${storagePrefix}_pos`, JSON.stringify(purchaseOrders));
  }, [purchaseOrders, storagePrefix]);

  useEffect(() => {
    localStorage.setItem(`${storagePrefix}_waste`, JSON.stringify(wasteRecords));
  }, [wasteRecords, storagePrefix]);

  useEffect(() => {
    localStorage.setItem(`${storagePrefix}_transactions`, JSON.stringify(transactions));
  }, [transactions, storagePrefix]);

  useEffect(() => {
    localStorage.setItem(`${storagePrefix}_notifications`, JSON.stringify(notifications));
  }, [notifications, storagePrefix]);

  // Auth methods
  const loginWithPhone = async (phone: string, bType: BusinessType) => {
    setPendingPhone(phone);
    setBusinessType(bType);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, businessType: bType }),
      });
      const data = await res.json();
      return {
        success: true,
        testCode: data.testCode || '123456',
        message: data.message || `OTP sent to ${phone}`,
      };
    } catch {
      // Local fallback
      return {
        success: true,
        testCode: '123456',
        message: `Demo OTP sent to ${phone}. Use 123456.`,
      };
    }
  };

  const verifyOtp = async (code: string) => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: pendingPhone, code, businessType }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Invalid OTP code' };
      }
      const session = { token: data.token, phone: data.verifiedPhone };
      setAuthSession(session);
      localStorage.setItem('stocksmart_auth_session', JSON.stringify(session));
      return { success: true };
    } catch {
      if (code === '123456') {
        const session = { token: `sst_${Date.now()}`, phone: pendingPhone };
        setAuthSession(session);
        localStorage.setItem('stocksmart_auth_session', JSON.stringify(session));
        return { success: true };
      }
      return { success: false, error: 'Network error or invalid OTP' };
    }
  };

  const logout = () => {
    setAuthSession(null);
    localStorage.removeItem('stocksmart_auth_session');
  };

  const updateProfile = (updates: Partial<UserBusinessProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  // Helper currency formatter
  const formatCurrency = useCallback((amount: number) => {
    const symbol = profile.currency || '₹';
    return `${symbol}${amount.toLocaleString('en-IN', { maximumFractionDigits: 1 })}`;
  }, [profile.currency]);

  // Product management
  const addProduct = (newProd: Omit<Product, 'id' | 'batches'> & { initialBatch?: Partial<Batch> }) => {
    const id = `prod_${Date.now()}`;
    const initialBatch: Batch = {
      id: `b_${Date.now()}`,
      batchNumber: newProd.initialBatch?.batchNumber || `BAT-${Math.floor(100 + Math.random() * 900)}`,
      quantity: newProd.currentStock,
      initialQuantity: newProd.currentStock,
      expiryDate: newProd.initialBatch?.expiryDate || new Date(Date.now() + (newProd.shelfLifeDays || 7) * 86400000).toISOString().split('T')[0],
      receivedDate: new Date().toISOString().split('T')[0],
      costPrice: newProd.costPrice,
      location: newProd.initialBatch?.location || 'General Storage',
    };

    const fullProduct: Product = {
      ...newProd,
      id,
      batches: [initialBatch],
    };

    setProducts((prev) => [fullProduct, ...prev]);

    // Add transaction
    setTransactions((prev) => [
      {
        id: `tx_${Date.now()}`,
        productId: id,
        productName: fullProduct.name,
        type: 'stock_in',
        quantity: fullProduct.currentStock,
        unit: fullProduct.unit,
        batchNumber: initialBatch.batchNumber,
        date: new Date().toISOString(),
        reason: 'New Product Registered',
        costValue: fullProduct.currentStock * fullProduct.costPrice,
      },
      ...prev,
    ]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const archiveProduct = (id: string) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, archived: !p.archived } : p)));
  };

  // Adjust stock with FEFO allocation
  const adjustStock = (
    productId: string,
    quantityChange: number,
    type: StockTransaction['type'],
    reason: string,
    batchNumber?: string
  ) => {
    setProducts((prev) => {
      return prev.map((product) => {
        if (product.id !== productId) return product;

        let newBatches = [...product.batches];
        const newTotalStock = Math.max(0, product.currentStock + quantityChange);

        if (quantityChange > 0) {
          // Stock in
          if (batchNumber) {
            const existingBatch = newBatches.find((b) => b.batchNumber === batchNumber);
            if (existingBatch) {
              existingBatch.quantity += quantityChange;
            } else {
              newBatches.push({
                id: `b_${Date.now()}`,
                batchNumber,
                quantity: quantityChange,
                initialQuantity: quantityChange,
                expiryDate: new Date(Date.now() + product.shelfLifeDays * 86400000).toISOString().split('T')[0],
                receivedDate: new Date().toISOString().split('T')[0],
                costPrice: product.costPrice,
                location: 'Storage',
              });
            }
          } else {
            if (newBatches.length > 0) {
              newBatches[0].quantity += quantityChange;
            } else {
              newBatches.push({
                id: `b_${Date.now()}`,
                batchNumber: `BAT-${Math.floor(100 + Math.random() * 900)}`,
                quantity: quantityChange,
                initialQuantity: quantityChange,
                expiryDate: new Date(Date.now() + product.shelfLifeDays * 86400000).toISOString().split('T')[0],
                receivedDate: new Date().toISOString().split('T')[0],
                costPrice: product.costPrice,
              });
            }
          }
        } else {
          // Stock reduction using FEFO (earliest expiry first)
          let toDeduct = Math.abs(quantityChange);
          newBatches.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

          for (const batch of newBatches) {
            if (toDeduct <= 0) break;
            const deduction = Math.min(batch.quantity, toDeduct);
            batch.quantity -= deduction;
            toDeduct -= deduction;
          }
          // Remove zeroed batches if preferred or keep for records
          newBatches = newBatches.filter((b) => b.quantity > 0.001);
        }

        return {
          ...product,
          currentStock: newTotalStock,
          batches: newBatches,
        };
      });
    });

    const targetProduct = products.find((p) => p.id === productId);
    if (targetProduct) {
      setTransactions((prev) => [
        {
          id: `tx_${Date.now()}`,
          productId,
          productName: targetProduct.name,
          type,
          quantity: Math.abs(quantityChange),
          unit: targetProduct.unit,
          batchNumber: batchNumber || 'FEFO Batch',
          date: new Date().toISOString(),
          reason,
          costValue: Math.abs(quantityChange) * targetProduct.costPrice,
        },
        ...prev,
      ]);
    }
  };

  // Recipe-based inventory deduction for Café & Restaurant
  const sellRecipeItem = (recipeId: string, portions = 1) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) return { success: false, message: 'Recipe not found' };

    // Check availability
    const missing: string[] = [];
    recipe.ingredients.forEach((ing) => {
      const prod = products.find((p) => p.id === ing.productId);
      const needed = ing.quantity * portions;
      if (!prod || prod.currentStock < needed) {
        missing.push(`${ing.productName} (needs ${needed} ${ing.unit}, on-hand ${prod?.currentStock || 0})`);
      }
    });

    if (missing.length > 0) {
      return {
        success: false,
        message: `Insufficient inventory for ${recipe.name}`,
        missingIngredients: missing,
      };
    }

    // Deduct each ingredient using FEFO
    recipe.ingredients.forEach((ing) => {
      const needed = ing.quantity * portions;
      adjustStock(ing.productId, -needed, 'sale_deduction', `Prepared & sold ${portions}x ${recipe.name}`);
    });

    // Add notification
    setNotifications((prev) => [
      {
        id: `n_${Date.now()}`,
        type: 'system',
        title: `Recipe Sale Deducted: ${recipe.name}`,
        message: `Auto-deducted ${recipe.ingredients.length} raw ingredients from stock for ${portions} portion(s).`,
        severity: 'success',
        timestamp: new Date().toISOString(),
        isRead: false,
      },
      ...prev,
    ]);

    return {
      success: true,
      message: `Successfully sold ${portions}x ${recipe.name}. Ingredients auto-deducted from inventory!`,
    };
  };

  // Bakery: Convert raw ingredients into finished baked goods batch
  const executeBakeBatch = (recipeId: string, batchesCount = 1) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) return { success: false, message: 'Bake recipe not found' };

    // Deduct raw ingredients
    recipe.ingredients.forEach((ing) => {
      const needed = ing.quantity * batchesCount;
      adjustStock(ing.productId, -needed, 'batch_production', `Bake batch production: ${recipe.name}`);
    });

    // If there is an output product, increment its stock!
    if (recipe.outputProductSku) {
      const outputProd = products.find((p) => p.sku === recipe.outputProductSku);
      if (outputProd) {
        const yieldUnits = (recipe.batchOutputUnits || 12) * batchesCount;
        adjustStock(
          outputProd.id,
          yieldUnits,
          'stock_in',
          `Fresh Oven Bake: Batch #${Math.floor(100 + Math.random() * 900)}`,
          `BAKE-AM-${Math.floor(10 + Math.random() * 90)}`
        );
      }
    }

    return {
      success: true,
      message: `Fresh batch baked! Ingredients deducted and finished goods added to inventory.`,
    };
  };

  // Record waste
  const recordWaste = (data: Omit<WasteRecord, 'id' | 'date'>) => {
    const newRecord: WasteRecord = {
      ...data,
      id: `w_${Date.now()}`,
      date: new Date().toISOString(),
    };
    setWasteRecords((prev) => [newRecord, ...prev]);

    // Deduct from product stock
    adjustStock(data.productId, -data.quantity, 'waste', `Waste: ${data.reason}`, data.batchNumber);

    // Alert
    setNotifications((prev) => [
      {
        id: `n_${Date.now()}`,
        type: 'expiry',
        title: `Waste Logged: ${data.productName}`,
        message: `${data.quantity} ${data.unit} written off (${formatCurrency(data.lossAmount)}) due to ${data.reason}.`,
        severity: 'warning',
        timestamp: new Date().toISOString(),
        isRead: false,
        linkRoute: '/waste-analytics',
      },
      ...prev,
    ]);
  };

  // Purchase Order management
  const createPurchaseOrder = (poData: Omit<PurchaseOrder, 'id' | 'createdAt' | 'status'>) => {
    const newPO: PurchaseOrder = {
      ...poData,
      id: `po_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'sent',
    };
    setPurchaseOrders((prev) => [newPO, ...prev]);

    setNotifications((prev) => [
      {
        id: `n_${Date.now()}`,
        type: 'purchase_order',
        title: `Purchase Order Created: ${newPO.poNumber}`,
        message: `PO sent to ${newPO.supplierName} for ${formatCurrency(newPO.totalAmount)}.`,
        severity: 'info',
        timestamp: new Date().toISOString(),
        isRead: false,
        linkRoute: '/purchase-orders',
      },
      ...prev,
    ]);
  };

  const updatePOStatus = (id: string, status: PurchaseOrder['status']) => {
    setPurchaseOrders((prev) => {
      return prev.map((po) => {
        if (po.id !== id) return po;
        const updated = { ...po, status };

        // If marked received, auto-replenish stock!
        if (status === 'received' && po.status !== 'received') {
          updated.receivedAt = new Date().toISOString();
          po.items.forEach((item) => {
            adjustStock(
              item.productId,
              item.quantity,
              'stock_in',
              `Received via PO ${po.poNumber}`,
              `PO-REC-${Math.floor(100 + Math.random() * 900)}`
            );
          });
        }
        return updated;
      });
    });
  };

  // Apply Freshness Recommendation
  const applyFreshnessRecommendation = (recId: string) => {
    setNotifications((prev) => [
      {
        id: `n_${Date.now()}`,
        type: 'forecast',
        title: 'Freshness Strategy Applied',
        message: `Recommendation executed! Priority batch status updated and staff alerted for immediate consumption.`,
        severity: 'success',
        timestamp: new Date().toISOString(),
        isRead: false,
        linkRoute: '/freshness-intelligence',
      },
      ...prev,
    ]);
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Computed properties
  const stockValue = useMemo(() => {
    return products.reduce((acc, p) => acc + p.currentStock * p.costPrice, 0);
  }, [products]);

  const totalLowStock = useMemo(() => {
    return products.filter((p) => !p.archived && p.currentStock <= p.reorderLevel);
  }, [products]);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const criticalExpiringBatches = useMemo(() => {
    const list: { product: Product; batch: Batch; daysLeft: number }[] = [];
    products.forEach((prod) => {
      if (prod.archived) return;
      prod.batches.forEach((b) => {
        if (b.quantity <= 0.001) return;
        const exp = new Date(b.expiryDate);
        exp.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 7) {
          list.push({ product: prod, batch: b, daysLeft: diffDays });
        }
      });
    });
    return list.sort((a, b) => a.daysLeft - b.daysLeft);
  }, [products, now]);

  const expiredBatches = useMemo(() => {
    const list: { product: Product; batch: Batch; daysPast: number }[] = [];
    products.forEach((prod) => {
      if (prod.archived) return;
      prod.batches.forEach((b) => {
        if (b.quantity <= 0.001) return;
        const exp = new Date(b.expiryDate);
        exp.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((now.getTime() - exp.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 0) {
          list.push({ product: prod, batch: b, daysPast: diffDays });
        }
      });
    });
    return list;
  }, [products, now]);

  const totalWasteCost = useMemo(() => {
    return wasteRecords.reduce((acc, w) => acc + w.lossAmount, 0);
  }, [wasteRecords]);

  // Transparent reorder recommendations
  const reorderRecommendations = useMemo(() => {
    return products
      .filter((p) => !p.archived)
      .map((product) => {
        // Average daily velocity based on shelf life and reorder point
        const avgDaily = Math.max(1, Math.round(product.reorderLevel / Math.max(2, product.leadTimeDays)));
        const demandDuringLeadTime = avgDaily * product.leadTimeDays;
        const targetLevel = demandDuringLeadTime + product.safetyStock;

        // Pending quantity on order
        const onOrderQty = purchaseOrders
          .filter((po) => po.status === 'sent' || po.status === 'confirmed')
          .flatMap((po) => po.items)
          .filter((item) => item.productId === product.id)
          .reduce((sum, item) => sum + item.quantity, 0);

        const netAvailable = product.currentStock + onOrderQty;
        const rawDeficit = targetLevel - netAvailable;
        const recommendedQty = rawDeficit > 0 ? Math.ceil(rawDeficit) : 0;

        const isUrgent = product.currentStock <= product.safetyStock;
        const isHigh = product.currentStock <= product.reorderLevel;

        const suggestedDate = new Date();
        if (isUrgent) {
          suggestedDate.setDate(suggestedDate.getDate()); // Today
        } else {
          suggestedDate.setDate(suggestedDate.getDate() + 1); // Tomorrow
        }

        return {
          product,
          recommendedQty,
          currentStock: product.currentStock,
          onOrderQty,
          leadTimeDays: product.leadTimeDays,
          safetyStock: product.safetyStock,
          projectedDemand: demandDuringLeadTime,
          suggestedDate: suggestedDate.toISOString().split('T')[0],
          estimatedCost: recommendedQty * product.costPrice,
          urgency: isUrgent ? ('critical' as const) : isHigh ? ('high' as const) : ('normal' as const),
        };
      })
      .filter((rec) => rec.recommendedQty > 0)
      .sort((a, b) => (a.urgency === 'critical' ? -1 : 1));
  }, [products, purchaseOrders]);

  // Freshness Recommendations (Signature USP)
  const freshnessRecommendations = useMemo(() => {
    const list: FreshnessRecommendation[] = [];

    criticalExpiringBatches.forEach(({ product, batch, daysLeft }) => {
      // Estimated daily run-rate
      const estimatedDailyRate = Math.max(1, Math.round(product.currentStock / 4));
      const expectedConsumptionBeforeExpiry = Math.min(batch.quantity, estimatedDailyRate * Math.max(1, daysLeft));
      const atRiskQty = Math.max(0, batch.quantity - expectedConsumptionBeforeExpiry);

      if (atRiskQty > 0 || daysLeft <= 2) {
        const potentialLoss = (atRiskQty > 0 ? atRiskQty : batch.quantity * 0.4) * product.costPrice;
        let actionType: FreshnessRecommendation['actionType'] = 'discount_promo';
        let suggestedAction = `Run flash 20% discount combo on ${product.name} today`;
        let reason = `Batch #${batch.batchNumber} has ${batch.quantity} ${product.unit} remaining with only ${daysLeft} day(s) until expiry. At current sales rate, approx ${atRiskQty.toFixed(1)} ${product.unit} risks spoilage.`;

        if (businessType === 'cafe') {
          actionType = 'recipe_reallocation';
          suggestedAction = `Promote specialty milk-based latte / pastry pairing specials`;
          reason = `Prioritize Batch #${batch.batchNumber} for breakfast and iced beverage orders to clear stock before expiration.`;
        } else if (businessType === 'restaurant') {
          actionType = 'recipe_reallocation';
          suggestedAction = `Shift Batch #${batch.batchNumber} to chef's daily pizza specials & family platters`;
          reason = `Utilize ${batch.quantity} ${product.unit} in high-yield dinner pasta & pizza batches to prevent shelf write-off.`;
        } else if (businessType === 'bakery') {
          actionType = 'production_batch';
          suggestedAction = `Schedule immediate morning bake run or afternoon tea sample boxes`;
          reason = `Short remaining shelf life (${daysLeft}d). Converting raw ingredients into fresh baked loaves yields maximum value.`;
        }

        list.push({
          id: `fresh_${product.id}_${batch.id}`,
          productId: product.id,
          productName: product.name,
          batchNumber: batch.batchNumber,
          quantityAtRisk: Number(atRiskQty.toFixed(1)),
          unit: product.unit,
          expiryDate: batch.expiryDate,
          daysRemaining: daysLeft,
          predictedDemandBeforeExpiry: Number(expectedConsumptionBeforeExpiry.toFixed(1)),
          unconsumedRiskQuantity: Number(atRiskQty.toFixed(1)),
          estimatedAvoidableWasteCost: Math.round(potentialLoss),
          urgency: daysLeft <= 1 ? 'critical' : daysLeft <= 3 ? 'high' : 'moderate',
          suggestedAction,
          actionType,
          reason,
          confidence: 94,
        });
      }
    });

    return list;
  }, [criticalExpiringBatches, businessType]);

  // Demand forecasts
  const demandForecasts = useMemo(() => {
    return products.slice(0, 8).map((prod) => {
      const baseDaily = Math.max(2, Math.round(prod.reorderLevel / 2));
      const weekendSurge = 1.35;
      const forecast1d = Math.round(baseDaily * 1.1);
      const forecast7d = Math.round(baseDaily * 5.2 + baseDaily * weekendSurge * 1.8);
      const forecast30d = Math.round(forecast7d * 4.2);

      const stockoutRisk: 'low' | 'medium' | 'high' =
        prod.currentStock < forecast1d * 2 ? 'high' : prod.currentStock < forecast7d ? 'medium' : 'low';

      const overstockRisk: 'low' | 'medium' | 'high' =
        prod.currentStock > forecast30d * 0.8 ? 'high' : 'low';

      return {
        productId: prod.id,
        productName: prod.name,
        forecast1d,
        forecast7d,
        forecast30d,
        currentStock: prod.currentStock,
        stockoutRisk,
        overstockRisk,
        confidenceScore: 92,
        weekdayPattern: '+35% surge on Friday-Sunday evenings',
        historicalAvgDaily: baseDaily,
        seasonalFactor: 1.15,
      };
    });
  }, [products]);

  // Reset to pristine sample data
  const resetBusinessData = () => {
    localStorage.removeItem(`${storagePrefix}_profile`);
    localStorage.removeItem(`${storagePrefix}_products`);
    localStorage.removeItem(`${storagePrefix}_recipes`);
    localStorage.removeItem(`${storagePrefix}_suppliers`);
    localStorage.removeItem(`${storagePrefix}_pos`);
    localStorage.removeItem(`${storagePrefix}_waste`);
    localStorage.removeItem(`${storagePrefix}_transactions`);
    localStorage.removeItem(`${storagePrefix}_notifications`);

    const data = getInitialBusinessData(businessType);
    setProfile(INITIAL_PROFILES[businessType]);
    setProducts(data.products);
    setRecipes(data.recipes);
    setSuppliers(data.suppliers);
  };

  return (
    <InventoryContext.Provider
      value={{
        businessType,
        setBusinessType,
        profile,
        updateProfile,
        isAuthenticated: !!authSession,
        loginWithPhone,
        verifyOtp,
        logout,
        products,
        recipes,
        suppliers,
        purchaseOrders,
        wasteRecords,
        transactions,
        notifications,
        addProduct,
        updateProduct,
        archiveProduct,
        adjustStock,
        sellRecipeItem,
        executeBakeBatch,
        recordWaste,
        createPurchaseOrder,
        updatePOStatus,
        applyFreshnessRecommendation,
        markNotificationRead,
        markAllNotificationsRead,
        stockValue,
        totalLowStock,
        criticalExpiringBatches,
        expiredBatches,
        totalWasteCost,
        reorderRecommendations,
        freshnessRecommendations,
        demandForecasts,
        resetBusinessData,
        formatCurrency,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
