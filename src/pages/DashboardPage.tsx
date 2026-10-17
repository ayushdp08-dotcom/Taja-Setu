import React from 'react';
import {
  Boxes,
  CalendarClock,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ShoppingCart,
  DollarSign,
  Package,
  Layers,
  Clock,
  Store,
  Coffee,
  UtensilsCrossed,
  Croissant,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Flame,
  Plus,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { BusinessType } from '../types';

interface DashboardPageProps {
  navigate: (route: string) => void;
  onOpenAddModal: () => void;
  onOpenPosModal: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  navigate,
  onOpenAddModal,
  onOpenPosModal,
}) => {
  const {
    businessType,
    profile,
    products,
    recipes,
    purchaseOrders,
    stockValue,
    totalLowStock,
    criticalExpiringBatches,
    expiredBatches,
    totalWasteCost,
    reorderRecommendations,
    freshnessRecommendations,
    formatCurrency,
    sellRecipeItem,
    executeBakeBatch,
  } = useInventory();

  // Top metric stat cards
  const statCards = [
    {
      title: 'Active Stock Valuation',
      value: formatCurrency(stockValue),
      change: '+4.8% vs last week',
      isPositive: true,
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      action: () => navigate('inventory'),
      actionText: 'View Inventory',
    },
    {
      title: 'Near-Expiry Batches (≤7d)',
      value: criticalExpiringBatches.length.toString(),
      subtext: `${criticalExpiringBatches.filter((b) => b.daysLeft <= 2).length} critical (≤48h)`,
      isPositive: criticalExpiringBatches.length === 0,
      icon: CalendarClock,
      color: criticalExpiringBatches.length > 0 ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100',
      action: () => navigate('expiry'),
      actionText: 'FEFO Calendar',
    },
    {
      title: 'Replenishment Needed',
      value: totalLowStock.length.toString(),
      subtext: `${reorderRecommendations.length} PO recommendations`,
      isPositive: totalLowStock.length === 0,
      icon: ShoppingCart,
      color: totalLowStock.length > 0 ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-zinc-50 text-zinc-700 border-zinc-100',
      action: () => navigate('reorder'),
      actionText: 'Review POs',
    },
    {
      title: 'Waste Loss Prevented',
      value: formatCurrency(
        freshnessRecommendations.reduce((acc, r) => acc + r.estimatedAvoidableWasteCost, 0) || 3200
      ),
      subtext: `Past 30d write-offs: ${formatCurrency(totalWasteCost)}`,
      isPositive: true,
      icon: Sparkles,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      action: () => navigate('freshness-intelligence'),
      actionText: 'Freshness AI (USP)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome / Business Status Header */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Stock Operations
            </span>
            <span className="text-xs text-zinc-400">•</span>
            <span className="text-xs text-zinc-500 font-medium">{profile.location}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
            {profile.businessName}
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Real-time FEFO inventory rotation, recipe consumption, and predictive reorders.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {businessType !== 'grocery' && (
            <button
              onClick={onOpenPosModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80 transition-colors shadow-2xs"
            >
              {businessType === 'bakery' ? <Croissant className="w-4 h-4 text-emerald-600" /> : <Coffee className="w-4 h-4 text-emerald-600" />}
              <span>{businessType === 'bakery' ? 'Bake New Batch' : 'Simulate Drink/Meal Sale'}</span>
            </button>
          )}

          <button
            onClick={() => navigate('freshness-intelligence')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>Freshness AI (USP)</span>
          </button>
        </div>
      </div>

      {/* 4 Top KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-zinc-500">{card.title}</span>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${card.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-zinc-900 tracking-tight">
                  {card.value}
                </div>
                <div className="mt-1 text-xs text-zinc-500 flex items-center gap-1">
                  {card.change && (
                    <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> {card.change}
                    </span>
                  )}
                  {card.subtext && <span>{card.subtext}</span>}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <button
                  onClick={card.action}
                  className="font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
                >
                  <span>{card.actionText}</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Freshness Intelligence Hero Banner (USP) */}
      {criticalExpiringBatches.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-white rounded-2xl p-5 border border-emerald-200/80 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    USP FEATURE • FRESHNESS INTELLIGENCE AI
                  </span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-rose-100 text-rose-800 font-bold border border-rose-200">
                    {criticalExpiringBatches.length} Batches Flagged
                  </span>
                </div>
                <h3 className="text-base font-bold text-zinc-900 mt-0.5">
                  Save {criticalExpiringBatches[0]?.product.name} (Batch #{criticalExpiringBatches[0]?.batch.batchNumber})
                </h3>
                <p className="text-xs text-zinc-600 mt-1 max-w-2xl leading-relaxed">
                  Only {criticalExpiringBatches[0]?.daysLeft} day(s) before expiry. TajaSetu AI recommends applying a{' '}
                  <span className="font-semibold text-emerald-800">20% Flash Combo</span> or allocating directly to today's kitchen prep to avoid an estimated loss of{' '}
                  <span className="font-semibold text-rose-700 font-mono">
                    {formatCurrency(criticalExpiringBatches[0]?.batch.quantity * criticalExpiringBatches[0]?.product.costPrice)}
                  </span>
                  .
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => navigate('freshness-intelligence')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Open Waste Simulator</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WORKFLOW-SPECIFIC WIDGETS SECTION */}
      {businessType === 'grocery' && (
        /* ================= GROCERY STORE WIDGETS ================= */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fast Moving vs Slow Moving Products */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Grocery Category Stock Distribution</h3>
                <p className="text-xs text-zinc-500">Retail categories, unit varieties & replenishment velocity</p>
              </div>
              <button
                onClick={() => navigate('inventory')}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                All SKUs →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-100 text-zinc-400 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">On-Hand Stock</th>
                    <th className="py-2.5 px-3">Unit Cost</th>
                    <th className="py-2.5 px-3">Health Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {products.slice(0, 5).map((p) => {
                    const isLow = p.currentStock <= p.reorderLevel;
                    return (
                      <tr key={p.id} className="hover:bg-zinc-50/60 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-semibold text-zinc-900">{p.name}</div>
                          <div className="text-[11px] text-zinc-400 font-mono">{p.sku}</div>
                        </td>
                        <td className="py-3 px-3 text-zinc-600">{p.category}</td>
                        <td className="py-3 px-3 font-semibold text-zinc-900 font-mono">
                          {p.currentStock} {p.unit}
                        </td>
                        <td className="py-3 px-3 text-zinc-700 font-mono">{formatCurrency(p.costPrice)}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              isLow
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            {isLow ? 'Low Stock' : 'Optimal'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Grocery Reorder & Lead Times */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Supplier Replenishment</h3>
                <p className="text-xs text-zinc-500">Short lead time alerts</p>
              </div>
              <button
                onClick={() => navigate('reorder')}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                Create PO →
              </button>
            </div>

            <div className="space-y-3">
              {reorderRecommendations.slice(0, 3).map((rec, i) => (
                <div key={i} className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/70 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900">{rec.product.name}</span>
                    <span className="font-bold text-emerald-700">+{rec.recommendedQty} {rec.product.unit}</span>
                  </div>
                  <div className="text-[11px] text-zinc-500 flex items-center justify-between">
                    <span>Lead time: {rec.leadTimeDays}d • Safety: {rec.safetyStock} {rec.product.unit}</span>
                    <span className="font-mono text-zinc-700">{formatCurrency(rec.estimatedCost)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-medium">Pending Purchase Orders</span>
              <span className="font-bold text-zinc-900">{purchaseOrders.filter((p) => p.status === 'sent').length} in transit</span>
            </div>
          </div>
        </div>
      )}

      {businessType === 'cafe' && (
        /* ================= CAFE WIDGETS ================= */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Beverage Recipes & Live POS Simulation */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Beverage Recipe Inventory Deduction</h3>
                <p className="text-xs text-zinc-500">
                  Every latte, cappuccino, and cold brew sold automatically deducts exact coffee beans & milk
                </p>
              </div>
              <button
                onClick={() => navigate('recipes')}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                Menu Recipes →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {recipes.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl border border-zinc-200/80 bg-zinc-50/50 hover:bg-zinc-50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {rec.category}
                      </span>
                      <span className="font-bold text-xs text-zinc-900">{formatCurrency(rec.sellingPrice)}</span>
                    </div>
                    <h4 className="font-bold text-xs text-zinc-900">{rec.name}</h4>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      {rec.ingredients.map((ing) => `${ing.quantity}${ing.unit} ${ing.productName.split(' ')[0]}`).join(', ')}
                    </p>
                  </div>

                  <button
                    onClick={() => sellRecipeItem(rec.id, 1)}
                    className="mt-4 w-full py-1.5 px-3 rounded-lg bg-white border border-zinc-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 text-xs font-semibold text-zinc-700 shadow-2xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Coffee className="w-3.5 h-3.5" />
                    <span>Quick Sell 1 Cup</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Milk & Short-Shelf-Life Alerts */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">Barista Milk Spoilage Warning</h4>
                <p className="text-xs text-amber-800/90 mt-0.5">
                  Whole Barista Milk (Batch #MILK-BAR-15) expires tomorrow! At current consumption rate (~18L/day), approx 6L must be used before 11 PM to prevent write-off.
                </p>
              </div>
            </div>
          </div>

          {/* Daily Cup Demand & Beans Velocity */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Daily Demand & Hopper Levels</h3>
              <p className="text-xs text-zinc-500">Projected barista consumption</p>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/70">
                <div className="text-[11px] text-zinc-500 font-medium">ESPRESSO ROAST BEANS</div>
                <div className="text-base font-extrabold text-zinc-900 mt-0.5">
                  4,500g <span className="text-xs font-normal text-zinc-500">(~250 shots capacity)</span>
                </div>
                <div className="mt-2 w-full bg-zinc-200 rounded-full h-1.5">
                  <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/70">
                <div className="text-[11px] text-zinc-500 font-medium">WHOLE & OAT MILK ON-HAND</div>
                <div className="text-base font-extrabold text-zinc-900 mt-0.5">
                  25 Litres <span className="text-xs font-normal text-zinc-500">(~110 lattes)</span>
                </div>
                <div className="mt-2 w-full bg-zinc-200 rounded-full h-1.5">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '48%' }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/70">
                <div className="text-[11px] text-zinc-500 font-medium">PAPER CUPS & LIDS</div>
                <div className="text-base font-extrabold text-zinc-900 mt-0.5">
                  240 Units <span className="text-xs font-normal text-zinc-500">(Reorder at 300)</span>
                </div>
                <div className="mt-2 w-full bg-zinc-200 rounded-full h-1.5">
                  <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: '38%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {businessType === 'restaurant' && (
        /* ================= RESTAURANT WIDGETS ================= */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kitchen Walk-In & Station Storage */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Kitchen Storage Stations & Walk-In Stock</h3>
                <p className="text-xs text-zinc-500">
                  Walk-in chiller, prep line wells, meat freezer & dry spices
                </p>
              </div>
              <button
                onClick={() => navigate('inventory')}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                Storage Audit →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-zinc-900">Walk-in Chiller (2°C)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                    Optimal Temp
                  </span>
                </div>
                <p className="text-xs text-zinc-600">
                  • Fior di Latte Mozzarella: 8.5 kg (Batch #MOZ-101)<br />
                  • Boneless Chicken: 14 kg (Expiring in 24h)<br />
                  • Heavy Cream & Butter: 6 units
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-zinc-900">Pizza Prep Line Wells</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold">
                    Service Ready
                  </span>
                </div>
                <p className="text-xs text-zinc-600">
                  • San Marzano Plum Tomatoes: 25 kg<br />
                  • Fresh Genovese Basil: 600g<br />
                  • Extra Virgin Olive Oil: 4L
                </p>
              </div>
            </div>

            {/* Chef Daily Prep Recommendations */}
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/70">
              <div className="flex items-center gap-2 mb-2">
                <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-900">
                  Chef's Daily Kitchen Prep Recommendation
                </span>
              </div>
              <p className="text-xs text-zinc-700 leading-relaxed">
                Expected Friday dinner surge (+40% demand). Prepare{' '}
                <span className="font-semibold text-zinc-900">45 portions of Neapolitan Margherita</span> and portion{' '}
                <span className="font-semibold text-zinc-900">12kg of Pollo Herb Chicken</span> prior to 6 PM shift.
              </p>
            </div>
          </div>

          {/* Restaurant Waste Log & Cost Control */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Food Waste Cost Watch</h3>
                <p className="text-xs text-zinc-500">Ingredient write-off control</p>
              </div>
              <button
                onClick={() => navigate('waste-analytics')}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                Full Log →
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/70 text-xs">
                <div className="flex items-center justify-between font-bold text-rose-900">
                  <span>Expired Fior di Latte Mozzarella</span>
                  <span>-₹1,680</span>
                </div>
                <div className="text-[11px] text-rose-700 mt-1">
                  3.5kg logged on Oct 15 • Reason: Shelf Spoilage
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/70 text-xs">
                <div className="flex items-center justify-between font-bold text-zinc-900">
                  <span>Gross Profit Margin Est.</span>
                  <span className="text-emerald-700 font-mono">68.4%</span>
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">
                  Food cost target: 30% • Actual: 31.6%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {businessType === 'bakery' && (
        /* ================= BAKERY WIDGETS ================= */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Batch Baking & Raw-to-Finished Conversion */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Artisan Oven Batches & Raw Conversions</h3>
                <p className="text-xs text-zinc-500">
                  Turn bulk T65 flour & butter into crusty sourdough loaves and flaky viennoiserie
                </p>
              </div>
              <button
                onClick={() => navigate('recipes')}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                Production Recipes →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recipes.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl border border-zinc-200/80 bg-zinc-50/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                        Batch of {rec.batchOutputUnits || 12}
                      </span>
                      <span className="font-mono text-xs font-bold text-zinc-900">
                        {formatCurrency(rec.sellingPrice)}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-zinc-900">{rec.name}</h4>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      {rec.ingredients.map((ing) => `${ing.quantity}${ing.unit} ${ing.productName.split(' ')[0]}`).join(', ')}
                    </p>
                  </div>

                  <button
                    onClick={() => executeBakeBatch(rec.id, 1)}
                    className="mt-4 w-full py-1.5 px-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold shadow-2xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Bake Fresh Batch Now</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Baking Schedule Recommendation */}
            <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-200/80 flex items-start gap-3">
              <Flame className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-orange-900">Tomorrow Morning's Bake Recommendation</h4>
                <p className="text-xs text-orange-800/90 mt-0.5 leading-relaxed">
                  Projected Saturday bread demand: 36 Country Sourdough Loaves. Current unsold inventory: 14 loaves (expires today). TajaSetu AI recommends baking{' '}
                  <span className="font-semibold text-zinc-900">2 full batches (24 loaves)</span> at 4:30 AM to hit target sell-through without afternoon surplus.
                </p>
              </div>
            </div>
          </div>

          {/* Bakery Finished Goods Shelf Life */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Baked Goods Shelf Life</h3>
              <p className="text-xs text-zinc-500">Same-day & next-day fresh goods</p>
            </div>

            <div className="space-y-3">
              {products
                .filter((p) => p.isPreparedDish)
                .map((p) => (
                  <div key={p.id} className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/70 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-zinc-900">
                      <span>{p.name}</span>
                      <span className="font-mono text-emerald-700">{p.currentStock} {p.unit}</span>
                    </div>
                    <div className="text-[11px] text-zinc-500 flex items-center justify-between">
                      <span>Shelf life: {p.shelfLifeDays} day(s)</span>
                      <span className="text-amber-700 font-semibold">Sell by today</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* RECENT STOCK MOVEMENTS LOG */}
      <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Recent Inventory Audit Trail</h3>
            <p className="text-xs text-zinc-500">FEFO stock deductions, purchase receipts, and audit adjustments</p>
          </div>
          <button
            onClick={() => navigate('inventory')}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            View Full Log →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-zinc-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3">Product Name</th>
                <th className="py-2.5 px-3">Transaction Type</th>
                <th className="py-2.5 px-3">Quantity</th>
                <th className="py-2.5 px-3">Audit Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.slice(0, 4).map((p, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/60">
                  <td className="py-2.5 px-3 text-zinc-500 font-mono text-[11px]">Today, 10:45 AM</td>
                  <td className="py-2.5 px-3 font-semibold text-zinc-900">{p.name}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      stock_in
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-bold font-mono text-zinc-900">
                    +{p.currentStock} {p.unit}
                  </td>
                  <td className="py-2.5 px-3 text-zinc-600 text-[11px]">Batch verified and stored in {p.storageCondition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
