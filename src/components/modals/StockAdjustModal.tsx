import React, { useState } from 'react';
import { X, ArrowDown, ArrowUp, RefreshCw, AlertTriangle } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { Product } from '../../types';

interface StockAdjustModalProps {
  product: Product | null;
  onClose: () => void;
}

export const StockAdjustModal: React.FC<StockAdjustModalProps> = ({ product, onClose }) => {
  const { adjustStock } = useInventory();
  const [mode, setMode] = useState<'stock_in' | 'stock_out' | 'audit_adjustment'>('stock_in');
  const [quantity, setQuantity] = useState<number>(5);
  const [reason, setReason] = useState<string>('Standard supplier replenishment');
  const [selectedBatch, setSelectedBatch] = useState<string>(product?.batches[0]?.batchNumber || '');

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qtyChange = mode === 'stock_out' ? -Math.abs(quantity) : Math.abs(quantity);
    adjustStock(product.id, qtyChange, mode, reason, selectedBatch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-zinc-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h2 className="text-sm font-bold text-zinc-900">Adjust Stock & Log Audit</h2>
            <p className="text-xs text-zinc-500">{product.name} ({product.sku})</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Current Stock Banner */}
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-500 font-medium">CURRENT ON-HAND</span>
              <div className="text-base font-extrabold text-zinc-900">
                {product.currentStock} {product.unit}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-zinc-500 font-medium">REORDER POINT</span>
              <div className="text-sm font-semibold text-zinc-700">
                {product.reorderLevel} {product.unit}
              </div>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setMode('stock_in');
                setReason('Supplier replenishment arrival');
              }}
              className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                mode === 'stock_in'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-400 ring-1 ring-emerald-400/30'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              <ArrowUp className="w-4 h-4 text-emerald-600" />
              <span>Stock In (+)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('stock_out');
                setReason('Manual inventory deduction');
              }}
              className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                mode === 'stock_out'
                  ? 'bg-rose-50 text-rose-800 border-rose-400 ring-1 ring-rose-400/30'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              <ArrowDown className="w-4 h-4 text-rose-600" />
              <span>Stock Out (-)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('audit_adjustment');
                setReason('Physical audit discrepancy adjustment');
              }}
              className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                mode === 'audit_adjustment'
                  ? 'bg-amber-50 text-amber-800 border-amber-400 ring-1 ring-amber-400/30'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              <RefreshCw className="w-4 h-4 text-amber-600" />
              <span>Physical Audit</span>
            </button>
          </div>

          {/* Quantity Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-700">Quantity ({product.unit})</label>
            <input
              type="number"
              min="0.01"
              step="any"
              required
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden font-mono"
            />
          </div>

          {/* Batch target */}
          {product.batches.length > 0 && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700">Batch</label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-white"
              >
                {product.batches.map((b) => (
                  <option key={b.id} value={b.batchNumber}>
                    #{b.batchNumber} ({b.quantity} {product.unit} • exp: {b.expiryDate})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-700">Audit Trail Reason *</label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-xs font-semibold text-white rounded-lg shadow-xs transition-colors ${
                mode === 'stock_out'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              Confirm Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
