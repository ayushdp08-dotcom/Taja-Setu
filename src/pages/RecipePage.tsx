import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Croissant,
  Coffee,
  Plus,
  ArrowRight,
  Flame,
  CheckCircle2,
  DollarSign,
  Clock,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

export const RecipePage: React.FC = () => {
  const {
    businessType,
    recipes,
    products,
    sellRecipeItem,
    executeBakeBatch,
    formatCurrency,
  } = useInventory();

  const isBakery = businessType === 'bakery';
  const [feedback, setFeedback] = useState<{ id: string; success: boolean; msg: string } | null>(null);

  const handleExecute = (recipeId: string) => {
    setFeedback(null);
    if (isBakery) {
      const res = executeBakeBatch(recipeId, 1);
      setFeedback({ id: recipeId, success: res.success, msg: res.message });
    } else {
      const res = sellRecipeItem(recipeId, 1);
      setFeedback({
        id: recipeId,
        success: res.success,
        msg: res.missingIngredients?.join(', ') || res.message,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {isBakery ? 'Production Batch Conversion' : 'POS Recipe Inventory Deduction'}
            </span>
          </div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            {isBakery ? 'Artisan Batch Baking & Conversions' : 'Recipe & Menu Item Management'}
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            {isBakery
              ? 'Convert raw bulk flour, butter, and yeast into fresh baked loaves and pastries.'
              : 'Selling menu items automatically deducts exact ingredient quantities from on-hand stock via FEFO.'}
          </p>
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {recipes.map((rec) => {
          const isItemFeedback = feedback?.id === rec.id;
          const grossProfit = rec.sellingPrice - rec.costPrice;
          const marginPct = Math.round((grossProfit / rec.sellingPrice) * 100);

          return (
            <div
              key={rec.id}
              className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:border-zinc-300 transition-all space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                    {rec.category}
                  </span>
                  <span className="text-xs font-bold font-mono text-emerald-700">
                    {marginPct}% Margin
                  </span>
                </div>

                <h3 className="text-base font-bold text-zinc-900">{rec.name}</h3>
                <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1 font-mono">
                  <span>Price: <strong className="text-zinc-800">{formatCurrency(rec.sellingPrice)}</strong></span>
                  <span>Cost: {formatCurrency(rec.costPrice)}</span>
                </div>

                {/* Ingredients List */}
                <div className="my-4 pt-3 border-t border-zinc-100 space-y-2">
                  <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    {isBakery ? 'RAW BATCH INGREDIENTS' : 'DEDUCTED PER ORDER'}
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {rec.ingredients.map((ing, i) => {
                      const prod = products.find((p) => p.id === ing.productId);
                      const hasStock = prod && prod.currentStock >= ing.quantity;

                      return (
                        <div
                          key={i}
                          className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-zinc-50 border border-zinc-100"
                        >
                          <span className="font-medium text-zinc-800">{ing.productName}</span>
                          <span className="font-mono text-[11px] text-zinc-600">
                            {ing.quantity} {ing.unit}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {isItemFeedback && (
                  <div
                    className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                      feedback.success
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'bg-rose-50 text-rose-900 border border-rose-200'
                    }`}
                  >
                    {feedback.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span className="font-medium">{feedback.msg}</span>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-zinc-100">
                <button
                  onClick={() => handleExecute(rec.id)}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  {isBakery ? <Flame className="w-3.5 h-3.5" /> : <Coffee className="w-3.5 h-3.5" />}
                  <span>{isBakery ? 'Bake Batch (Stock In Finished Goods)' : 'Simulate Order & Auto-Deduct'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
