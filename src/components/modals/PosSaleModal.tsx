import React, { useState } from 'react';
import { X, Utensils, CheckCircle2, AlertCircle, Sparkles, Croissant, ArrowRight } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

interface PosSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PosSaleModal: React.FC<PosSaleModalProps> = ({ isOpen, onClose }) => {
  const { businessType, recipes, sellRecipeItem, executeBakeBatch, formatCurrency, products } = useInventory();
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(recipes[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string; missing?: string[] } | null>(null);

  if (!isOpen) return null;

  const currentRecipe = recipes.find((r) => r.id === selectedRecipeId) || recipes[0];
  const isBakery = businessType === 'bakery';

  const handleAction = () => {
    setStatusMessage(null);
    if (!currentRecipe) return;

    if (isBakery) {
      const res = executeBakeBatch(currentRecipe.id, quantity);
      if (res.success) {
        setStatusMessage({ type: 'success', text: res.message });
      } else {
        setStatusMessage({ type: 'error', text: res.message });
      }
    } else {
      const res = sellRecipeItem(currentRecipe.id, quantity);
      if (res.success) {
        setStatusMessage({ type: 'success', text: res.message });
      } else {
        setStatusMessage({
          type: 'error',
          text: res.message,
          missing: res.missingIngredients,
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-zinc-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              {isBakery ? <Croissant className="w-4 h-4" /> : <Utensils className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900">
                {isBakery ? 'Bake Production Batch' : 'Simulate POS Menu Sale'}
              </h2>
              <p className="text-xs text-zinc-500">
                {isBakery
                  ? 'Deducts raw flour & butter, produces fresh baked goods'
                  : 'Auto-deducts exact ingredient quantities using FEFO'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setStatusMessage(null);
              onClose();
            }}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {statusMessage && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border-rose-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-semibold">{statusMessage.text}</div>
                {statusMessage.missing && statusMessage.missing.length > 0 && (
                  <ul className="list-disc pl-4 space-y-0.5 text-rose-700">
                    {statusMessage.missing.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {recipes.length === 0 ? (
            <div className="text-center py-6 text-xs text-zinc-500">
              No recipes registered for this business yet.
            </div>
          ) : (
            <>
              {/* Select Recipe */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  {isBakery ? 'Select Baking Recipe' : 'Select Menu Item to Order'}
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {recipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      onClick={() => {
                        setSelectedRecipeId(recipe.id);
                        setStatusMessage(null);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        selectedRecipeId === recipe.id
                          ? 'bg-emerald-50/70 border-emerald-400 shadow-2xs ring-1 ring-emerald-400/40'
                          : 'bg-white border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-zinc-900">{recipe.name}</div>
                        <div className="text-[11px] text-zinc-500">
                          {recipe.ingredients.length} ingredients • Est. cost {formatCurrency(recipe.costPrice)}
                        </div>
                      </div>
                      <div className="text-xs font-bold text-emerald-700">
                        {formatCurrency(recipe.sellingPrice)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                <div>
                  <div className="text-xs font-semibold text-zinc-800">
                    {isBakery ? 'Number of Batches' : 'Portions / Orders'}
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    {isBakery
                      ? `Yields ${(currentRecipe?.batchOutputUnits || 12) * quantity} finished items`
                      : 'Multiplies ingredient deductions proportionately'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-lg border border-zinc-200 bg-white text-zinc-700 font-bold hover:bg-zinc-50 flex items-center justify-center text-xs"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-zinc-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded-lg border border-zinc-200 bg-white text-zinc-700 font-bold hover:bg-zinc-50 flex items-center justify-center text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Ingredient breakdown summary */}
              {currentRecipe && (
                <div className="space-y-2 border-t border-zinc-100 pt-3">
                  <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                    <span>INGREDIENTS AUTO-DEDUCTED</span>
                    <span>ON-HAND STOCK</span>
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {currentRecipe.ingredients.map((ing) => {
                      const prod = products.find((p) => p.id === ing.productId);
                      const totalNeeded = ing.quantity * quantity;
                      const hasSufficient = prod && prod.currentStock >= totalNeeded;

                      return (
                        <div
                          key={ing.productId}
                          className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-zinc-50/70"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-zinc-800">{ing.productName}</span>
                            <span className="text-[11px] text-zinc-500">
                              (-{totalNeeded.toFixed(2)} {ing.unit})
                            </span>
                          </div>
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                              hasSufficient
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {prod ? `${prod.currentStock.toFixed(1)} ${prod.unit}` : 'Missing'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              Done
            </button>
            <button
              type="button"
              disabled={recipes.length === 0}
              onClick={handleAction}
              className="px-5 py-2 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <span>{isBakery ? 'Bake Batch & Stock In' : 'Execute Sale & Deduct'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
