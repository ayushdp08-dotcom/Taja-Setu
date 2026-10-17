import React, { useState } from 'react';
import { X, Plus, Calendar, Boxes, DollarSign, Layers, Tag } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { BUSINESS_CONFIGS } from '../../data/mockData';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const { businessType, suppliers, addProduct, profile } = useInventory();
  const config = BUSINESS_CONFIGS[businessType] || BUSINESS_CONFIGS.grocery;

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState(config.categories[0] || 'General');
  const [unit, setUnit] = useState(config.units[0] || 'pcs');
  const [currentStock, setCurrentStock] = useState<number>(20);
  const [reorderLevel, setReorderLevel] = useState<number>(15);
  const [safetyStock, setSafetyStock] = useState<number>(8);
  const [costPrice, setCostPrice] = useState<number>(50);
  const [sellingPrice, setSellingPrice] = useState<number>(75);
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || 'sup_1');
  const [shelfLifeDays, setShelfLifeDays] = useState<number>(7);
  const [storageCondition, setStorageCondition] = useState<'ambient' | 'refrigerated' | 'frozen' | 'dry_pantry'>('ambient');
  const [batchNumber, setBatchNumber] = useState(`BAT-${Math.floor(100 + Math.random() * 900)}`);
  const [expiryDate, setExpiryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [location, setLocation] = useState('Main Shelf');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const supplier = suppliers.find((s) => s.id === supplierId);

    addProduct({
      name: name.trim(),
      sku: sku.trim() || `SKU-${Date.now().toString().slice(-6)}`,
      category,
      unit,
      currentStock: Number(currentStock),
      reorderLevel: Number(reorderLevel),
      safetyStock: Number(safetyStock),
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      supplierId: supplier?.id || 'sup_default',
      supplierName: supplier?.name || 'Local Supplier',
      leadTimeDays: supplier?.leadTimeDays || 2,
      shelfLifeDays: Number(shelfLifeDays),
      storageCondition,
      initialBatch: {
        batchNumber,
        expiryDate,
        location,
      },
    });

    onClose();
    // Reset form
    setName('');
    setSku('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-zinc-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h2 className="text-base font-bold text-zinc-900">Add New Inventory Item</h2>
            <p className="text-xs text-zinc-500">
              Categorized for {config.name} with batch & expiry tracking
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-zinc-700">Product / Ingredient Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Fresh Organic Milk 1L or Robusta Arabica Blend"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700">SKU / Item Code</label>
              <input
                type="text"
                placeholder="Auto-generated if empty"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden bg-white"
              >
                {config.categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700">Measurement Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden bg-white"
              >
                {config.units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700">Storage Condition</label>
              <select
                value={storageCondition}
                onChange={(e) => setStorageCondition(e.target.value as any)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden bg-white"
              >
                <option value="ambient">Ambient / Shelf</option>
                <option value="refrigerated">Refrigerated (2°C - 6°C)</option>
                <option value="frozen">Deep Freezer (-18°C)</option>
                <option value="dry_pantry">Dry Pantry / Silo</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700">Initial Opening Stock</label>
              <input
                type="number"
                min="0"
                step="any"
                value={currentStock}
                onChange={(e) => setCurrentStock(parseFloat(e.target.value) || 0)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700">Reorder Threshold Point</label>
              <input
                type="number"
                min="0"
                step="any"
                value={reorderLevel}
                onChange={(e) => setReorderLevel(parseFloat(e.target.value) || 0)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700">Cost Price ({profile.currency})</label>
              <input
                type="number"
                min="0"
                step="any"
                value={costPrice}
                onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700">Selling Price ({profile.currency})</label>
              <input
                type="number"
                min="0"
                step="any"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-zinc-700">Primary Supplier</label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden bg-white"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category} — {s.leadTimeDays}d lead time)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* First Batch / Expiry Section */}
          <div className="pt-3 border-t border-zinc-100 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Initial Batch & Freshness Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-zinc-600">Batch Code</label>
                <input
                  type="text"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-zinc-600">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-zinc-600">Storage Bay / Rack</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Fridge 1 / Shelf A"
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
            >
              Register Product & Batch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
