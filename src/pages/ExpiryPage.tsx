import React, { useState } from 'react';
import {
  CalendarClock,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Info,
  Calendar,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

export const ExpiryPage: React.FC = () => {
  const {
    products,
    criticalExpiringBatches,
    expiredBatches,
    formatCurrency,
    recordWaste,
    adjustStock,
  } = useInventory();

  const [activeTab, setActiveTab] = useState<'all' | '1d' | '3d' | '7d' | 'expired'>('all');

  const filteredBatches = () => {
    if (activeTab === 'expired') {
      return expiredBatches.map((b) => ({
        ...b,
        isExpired: true,
      }));
    }
    if (activeTab === '1d') {
      return criticalExpiringBatches.filter((b) => b.daysLeft <= 1);
    }
    if (activeTab === '3d') {
      return criticalExpiringBatches.filter((b) => b.daysLeft <= 3);
    }
    if (activeTab === '7d') {
      return criticalExpiringBatches;
    }
    return criticalExpiringBatches;
  };

  const batchesToShow = filteredBatches();

  const handleMarkUsed = (productId: string, batchNumber: string, qty: number) => {
    adjustStock(productId, -qty, 'stock_out', `FEFO usage prior to expiry`, batchNumber);
  };

  const handleMarkWaste = (
    productId: string,
    productName: string,
    category: string,
    batchNumber: string,
    qty: number,
    unit: string,
    cost: number
  ) => {
    recordWaste({
      productId,
      productName,
      category,
      batchNumber,
      quantity: qty,
      unit,
      lossAmount: qty * cost,
      reason: 'expired',
      loggedBy: 'Floor Manager',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              Food Safety & Shelf-Life
            </span>
            <span className="text-xs text-zinc-400">•</span>
            <span className="text-xs text-zinc-500 font-medium">FEFO (First Expired, First Out)</span>
          </div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Expiry Calendar & Shelf-Life Watch
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Identify perishable batches before expiration, enforce FEFO rotation, and track write-off losses.
          </p>
        </div>

        {/* Financial Exposure summary */}
        <div className="flex items-center gap-3">
          <div className="p-3 px-4 rounded-xl bg-rose-50/80 border border-rose-200 text-right">
            <span className="text-[10px] text-rose-600 font-bold uppercase">AT-RISK EXPIRY VALUE</span>
            <div className="text-lg font-extrabold font-mono text-rose-700">
              {formatCurrency(
                criticalExpiringBatches.reduce((acc, b) => acc + b.batch.quantity * b.product.costPrice, 0)
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Food Safety Compliance Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <span className="font-bold">Strict Food Safety Protocol:</span> Expired products must never be sold or served to customers. Batches past their expiry date are marked for immediate disposal write-off to maintain health department compliance and customer trust.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          Expiring in ≤ 7 Days ({criticalExpiringBatches.length})
        </button>

        <button
          onClick={() => setActiveTab('3d')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === '3d'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          Expiring in ≤ 3 Days ({criticalExpiringBatches.filter((b) => b.daysLeft <= 3).length})
        </button>

        <button
          onClick={() => setActiveTab('1d')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === '1d'
              ? 'bg-rose-600 text-white shadow-2xs'
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          Critical (Expires Tomorrow / 24h) ({criticalExpiringBatches.filter((b) => b.daysLeft <= 1).length})
        </button>

        <button
          onClick={() => setActiveTab('expired')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'expired'
              ? 'bg-zinc-900 text-white shadow-2xs'
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          Expired Inventory ({expiredBatches.length})
        </button>
      </div>

      {/* Batches Cards / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {batchesToShow.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-10 text-center border border-zinc-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-zinc-900">Zero Batches In This Time Window</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Your rotation velocity is matching incoming supplier shipments.
            </p>
          </div>
        ) : (
          batchesToShow.map((item: any, idx: number) => {
            const isExp = !!item.isExpired;
            const daysLeft = item.daysLeft !== undefined ? item.daysLeft : -item.daysPast;
            const lossVal = item.batch.quantity * item.product.costPrice;

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-zinc-200/90 shadow-xs flex flex-col justify-between hover:border-zinc-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isExp
                          ? 'bg-zinc-900 text-white border-zinc-900'
                          : daysLeft <= 1
                          ? 'bg-rose-100 text-rose-800 border-rose-200 animate-pulse'
                          : daysLeft <= 3
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {isExp
                        ? `Expired ${item.daysPast}d Ago`
                        : daysLeft === 0
                        ? 'Expires Today'
                        : daysLeft === 1
                        ? 'Expires Tomorrow'
                        : `${daysLeft} Days Remaining`}
                    </span>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600">
                      Batch #{item.batch.batchNumber}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-zinc-900">{item.product.name}</h3>
                  <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1.5">
                    <span>{item.product.category}</span>
                    <span>•</span>
                    <span>Expiry: <strong className="text-zinc-800">{item.batch.expiryDate}</strong></span>
                  </div>

                  {/* Quantity & Location */}
                  <div className="my-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-400 font-semibold uppercase">AT RISK</span>
                      <div className="font-mono font-bold text-zinc-900 text-sm mt-0.5">
                        {item.batch.quantity} {item.product.unit}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 font-semibold uppercase">EST. LOSS VALUE</span>
                      <div className="font-mono font-bold text-rose-700 text-sm mt-0.5">
                        {formatCurrency(lossVal)}
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-zinc-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Location: {item.batch.location || 'Walk-in Chiller'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                  {!isExp ? (
                    <>
                      <button
                        onClick={() => handleMarkUsed(item.product.id, item.batch.batchNumber, item.batch.quantity)}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition-colors text-center"
                      >
                        Mark as Used (FEFO)
                      </button>
                      <button
                        onClick={() =>
                          handleMarkWaste(
                            item.product.id,
                            item.product.name,
                            item.product.category,
                            item.batch.batchNumber,
                            item.batch.quantity,
                            item.product.unit,
                            item.product.costPrice
                          )
                        }
                        className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 border border-zinc-200 transition-colors"
                        title="Write-off as Waste"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() =>
                        handleMarkWaste(
                          item.product.id,
                          item.product.name,
                          item.product.category,
                          item.batch.batchNumber,
                          item.batch.quantity,
                          item.product.unit,
                          item.product.costPrice
                        )
                      }
                      className="w-full py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Write Off Expired Stock ({formatCurrency(lossVal)})</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
