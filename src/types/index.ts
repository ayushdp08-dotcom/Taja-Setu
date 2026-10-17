export type BusinessType = 'grocery' | 'cafe' | 'restaurant' | 'bakery';

export interface BusinessConfig {
  id: BusinessType;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  accentColor: string;
  categories: string[];
  units: string[];
  specialFeature: string;
}

export interface Batch {
  id: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string; // YYYY-MM-DD
  receivedDate: string;
  costPrice: number;
  initialQuantity: number;
  location?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  reorderLevel: number;
  safetyStock: number;
  costPrice: number; // in INR
  sellingPrice: number; // in INR
  supplierId: string;
  supplierName: string;
  leadTimeDays: number;
  shelfLifeDays: number;
  storageCondition: 'ambient' | 'refrigerated' | 'frozen' | 'dry_pantry';
  batches: Batch[];
  archived?: boolean;
  isPreparedDish?: boolean; // For Cafe / Restaurant / Bakery finished goods
  recipeId?: string;
}

export interface StockTransaction {
  id: string;
  productId: string;
  productName: string;
  type: 'stock_in' | 'stock_out' | 'sale_deduction' | 'waste' | 'audit_adjustment' | 'batch_production';
  quantity: number;
  unit: string;
  batchNumber?: string;
  date: string; // ISO
  reason: string;
  costValue: number;
  referenceId?: string; // PO number or Order ID
}

export interface RecipeIngredient {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  costPerPortion: number;
}

export interface Recipe {
  id: string;
  name: string;
  category: string;
  sellingPrice: number;
  costPrice: number;
  ingredients: RecipeIngredient[];
  preparationTimeMinutes: number;
  dailyDemandForecast: number;
  outputProductSku?: string; // For Bakery batch conversion
  batchOutputUnits?: number; // e.g. 1 batch yields 12 loaves
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  phone: string;
  email: string;
  leadTimeDays: number;
  minOrderValue: number;
  paymentTerms: string;
  address: string;
  reliabilityScore: number; // percentage
}

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
  items: PurchaseOrderItem[];
  totalAmount: number;
  createdAt: string;
  expectedDeliveryDate: string;
  receivedAt?: string;
  notes?: string;
}

export interface WasteRecord {
  id: string;
  productId: string;
  productName: string;
  category: string;
  batchNumber: string;
  quantity: number;
  unit: string;
  lossAmount: number;
  reason: 'expired' | 'damaged' | 'spoilage' | 'over_prep' | 'customer_return';
  date: string;
  loggedBy: string;
}

export interface DemandForecast {
  productId: string;
  productName: string;
  forecast1d: number;
  forecast7d: number;
  forecast30d: number;
  currentStock: number;
  stockoutRisk: 'low' | 'medium' | 'high';
  overstockRisk: 'low' | 'medium' | 'high';
  confidenceScore: number; // percentage
  weekdayPattern: string; // e.g. "Weekend surge +45%"
  historicalAvgDaily: number;
  seasonalFactor: number;
}

export interface FreshnessRecommendation {
  id: string;
  productId: string;
  productName: string;
  batchNumber: string;
  quantityAtRisk: number;
  unit: string;
  expiryDate: string;
  daysRemaining: number;
  predictedDemandBeforeExpiry: number;
  unconsumedRiskQuantity: number;
  estimatedAvoidableWasteCost: number;
  urgency: 'critical' | 'high' | 'moderate';
  suggestedAction: string;
  actionType: 'discount_promo' | 'batch_priority' | 'recipe_reallocation' | 'reduce_next_po' | 'production_batch';
  reason: string;
  confidence: number;
  applied?: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'expiry' | 'low_stock' | 'stockout' | 'purchase_order' | 'forecast' | 'system';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  timestamp: string;
  isRead: boolean;
  linkRoute?: string;
}

export interface UserBusinessProfile {
  businessType: BusinessType;
  businessName: string;
  ownerName: string;
  phone: string;
  location: string;
  timezone: string;
  currency: string;
  preferredUnits: string[];
  fefoEnforced: boolean;
  defaultSafetyDays: number;
  demoMode: boolean;
  onboardingCompleted: boolean;
}
