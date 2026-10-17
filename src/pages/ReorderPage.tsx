import React, { useState } from 'react';
import {
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  Truck,
  Plus,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

interface ReorderPageProps {
  navigate: (route: string) => void;
}

export const ReorderPage: React.FC<ReorderPageProps> = ({ navigate }) => {
  const {
    reorderRecommendations,
    formatCurrency,
    createPurchaseOrder,
    profile,
  } = useInventory();

  const [orderedItems, setOrderedItems] = useState<Record<string, boolean>>({});

  const handleOrder = (rec: any) => {
    createPurchaseOrder({
      poNumber: `PO-${rec.product.sku.slice(0, 3)}-${Math.floor(100 + Math.random() * 900)}`,
      supplierId: rec.product.supplierId,
      supplierName: rec.product.supplierName,
      items: [
        {
          productId: rec.product.id,
          productName: rec.product.name,
          quantity: rec.recommendedQty,
          unit: rec.product.unit,
          unitCost: rec.product.costPrice,
          totalCost: rec.estimatedCost,
        },
      ],
      totalAmount: rec.estimatedCost,
      expectedDeliveryDate: new Date(Date.now() + rec.leadTimeDays * 86400000)
        .toISOString()
        .split('T')[0],
      notes: `Automated replenishment based on TajaSetu AI Reorder calculation.`,
    });

    setOrderedItems((prev) => ({ ...prev, [rec.product.id]: true }));
  };

  const totalCost = reorderRecommendations.reduce((acc, r) => acc + r.estimatedCost, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Just-In-Time Supply
            </span>
            <span className="text-xs text-zinc-400">•</span>
            <span className="text-xs text-zinc-500 font-medium">Lead Time & Safety Buffer Adjusted</span>
          </div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Smart Reorder Recommendations
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Transparent calculation: Recommended = (Lead Time Demand + Safety Stock) − (Current Stock + On Order).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-right">
            <span className="text-[10px] text-zinc-400 font-semibold uppercase">TOTAL SUGGESTED PO VALUE</span>
            <div className="text-lg font-extrabold font-mono text-zinc-900">
              {formatCurrency(totalCost)}
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {reorderRecommendations.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-zinc-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-zinc-900">All Stock Levels Above Safety Threshold</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
              No inventory reorders are needed at this moment. Current on-hand quantities plus pending deliveries satisfy expected demand.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reorderRecommendations.map((rec, idx) => {
              const isOrdered = orderedItems[rec.product.id];

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 border border-zinc-200/90 shadow-xs flex flex-col justify-between hover:border-zinc-300 transition-all"
                >
                  <div>
                    {/* Urgency & Lead time */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          rec.urgency === 'critical'
                            ? 'bg-rose-100 text-rose-800 border-rose-200'
                            : 'bg-amber-100 text-amber-800 border-amber-200'
                        }`}
                      >
                        {rec.urgency === 'critical' ? 'Urgent Deficit' : 'Scheduled Reorder'}
                      </span>

                      <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                        <Truck className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{rec.leadTimeDays}d Lead Time</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-zinc-900">{rec.product.name}</h3>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      Supplier: <strong className="text-zinc-700">{rec.product.supplierName}</strong>
                    </div>

                    {/* Calculation breakdown */}
                    <div className="my-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100 grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-zinc-400 font-semibold uppercase">CURRENT</span>
                        <div className="font-mono font-bold text-zinc-800 mt-0.5">
                          {rec.currentStock} {rec.product.unit}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 font-semibold uppercase">SAFETY BUFFER</span>
                        <div className="font-mono font-bold text-zinc-800 mt-0.5">
                          {rec.safetyStock} {rec.product.unit}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 font-semibold uppercase">ON ORDER</span>
                        <div className="font-mono font-bold text-zinc-800 mt-0.5">
                          {rec.onOrderQty} {rec.product.unit}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-900 uppercase">
                          RECOMMENDED PURCHASE
                        </span>
                        <div className="font-mono font-extrabold text-emerald-800 text-sm">
                          +{rec.recommendedQty} {rec.product.unit}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-emerald-900 uppercase">
                          EST. COST
                        </span>
                        <div className="font-mono font-bold text-emerald-900 text-sm">
                          {formatCurrency(rec.estimatedCost)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500 font-medium">
                      Order by: <strong className="text-zinc-800">{rec.suggestedDate}</strong>
                    </span>

                    <button
                      onClick={() => handleOrder(rec)}
                      disabled={isOrdered}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 ${
                        isOrdered
                          ? 'bg-emerald-100 text-emerald-800 cursor-default'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {isOrdered ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>PO Generated</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Generate PO</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
