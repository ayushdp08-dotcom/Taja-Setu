import React from 'react';
import {
  ArrowLeft,
  Calendar,
  Layers,
  Truck,
  ArrowUpDown,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Boxes,
  DollarSign,
  Plus,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { Product } from '../types';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onAdjustStock: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack,
  onAdjustStock,
}) => {
  const { formatCurrency, transactions } = useInventory();

  // Find all stock transactions for this specific product
  const productTransactions = transactions.filter((t) => t.productId === product.id);

  return (
    <div className="space-y-6">
      {/* Back button & top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Inventory List</span>
        </button>

        <button
          onClick={() => onAdjustStock(product)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>Adjust Stock / Audit</span>
        </button>
      </div>

      {/* Main Product Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-semibold border border-zinc-200">
              {product.sku}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {product.category}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
            {product.name}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Supplied by <strong className="text-zinc-700">{product.supplierName}</strong> • {product.leadTimeDays}d lead time
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/70 text-right min-w-[130px]">
            <span className="text-[10px] text-zinc-400 font-semibold uppercase">TOTAL ON-HAND</span>
            <div className="text-2xl font-black font-mono text-zinc-900 mt-0.5">
              {product.currentStock} <span className="text-xs font-normal text-zinc-500">{product.unit}</span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">
              Valuation: {formatCurrency(product.currentStock * product.costPrice)}
            </div>
          </div>
        </div>
      </div>

      {/* Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-zinc-200/80">
          <span className="text-[10px] text-zinc-400 font-semibold uppercase">UNIT COST PRICE</span>
          <div className="text-lg font-bold font-mono text-zinc-900 mt-1">
            {formatCurrency(product.costPrice)}
          </div>
          <div className="text-[10px] text-zinc-500">per {product.unit}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-zinc-200/80">
          <span className="text-[10px] text-zinc-400 font-semibold uppercase">SELLING PRICE</span>
          <div className="text-lg font-bold font-mono text-emerald-700 mt-1">
            {product.sellingPrice > 0 ? formatCurrency(product.sellingPrice) : 'Raw Ingredient'}
          </div>
          <div className="text-[10px] text-zinc-500">retail / menu</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-zinc-200/80">
          <span className="text-[10px] text-zinc-400 font-semibold uppercase">REORDER POINT</span>
          <div className="text-lg font-bold font-mono text-zinc-900 mt-1">
            {product.reorderLevel} {product.unit}
          </div>
          <div className="text-[10px] text-zinc-500">Safety stock: {product.safetyStock} {product.unit}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-zinc-200/80">
          <span className="text-[10px] text-zinc-400 font-semibold uppercase">STORAGE CONDITION</span>
          <div className="text-sm font-bold text-zinc-900 mt-1 capitalize">
            {product.storageCondition.replace('_', ' ')}
          </div>
          <div className="text-[10px] text-zinc-500">Shelf life: ~{product.shelfLifeDays} days</div>
        </div>
      </div>

      {/* Batches Breakdown Table */}
      <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-900">Active Batches & Shelf-Life Rotation</h2>
          <p className="text-xs text-zinc-500">Managed via strict First Expired, First Out (FEFO) rules</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-zinc-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Batch Number</th>
                <th className="py-2.5 px-3">Remaining Quantity</th>
                <th className="py-2.5 px-3">Expiry Date</th>
                <th className="py-2.5 px-3">Received Date</th>
                <th className="py-2.5 px-3">Storage Location</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {product.batches.map((batch) => {
                const daysLeft = Math.ceil(
                  (new Date(batch.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <tr key={batch.id} className="hover:bg-zinc-50/60">
                    <td className="py-3 px-3 font-mono font-bold text-zinc-900">
                      #{batch.batchNumber}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-zinc-900">
                      {batch.quantity} {product.unit}
                    </td>
                    <td className="py-3 px-3 font-medium text-zinc-800">
                      {batch.expiryDate}
                    </td>
                    <td className="py-3 px-3 text-zinc-500">
                      {batch.receivedDate}
                    </td>
                    <td className="py-3 px-3 text-zinc-600">
                      {batch.location || 'Primary Bay'}
                    </td>
                    <td className="py-3 px-3">
                      {daysLeft <= 1 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          Expires in {daysLeft}d (Critical)
                        </span>
                      ) : daysLeft <= 3 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {daysLeft} days left
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Fresh ({daysLeft}d)
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Movement History */}
      <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-900">Product Movement & Audit Trail</h2>
          <p className="text-xs text-zinc-500">All inbound stock, POS sales deductions, and adjustments</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-zinc-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Quantity</th>
                <th className="py-2.5 px-3">Batch</th>
                <th className="py-2.5 px-3">Audit Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {productTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-zinc-400">
                    No transactions recorded for this SKU yet.
                  </td>
                </tr>
              ) : (
                productTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-zinc-50/60">
                    <td className="py-3 px-3 text-zinc-500 font-mono text-[11px]">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 text-zinc-700">
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-zinc-900">
                      {tx.type.includes('out') || tx.type.includes('deduction') || tx.type === 'waste' ? '-' : '+'}
                      {tx.quantity} {tx.unit}
                    </td>
                    <td className="py-3 px-3 font-mono text-zinc-500">
                      {tx.batchNumber || 'FEFO'}
                    </td>
                    <td className="py-3 px-3 text-zinc-700">
                      {tx.reason}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
