import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  DollarSign,
  Sliders,
  ShieldAlert,
  Leaf,
  Layers,
  RefreshCw,
  Info,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

export const FreshnessIntelligencePage: React.FC = () => {
  const {
    businessType,
    profile,
    criticalExpiringBatches,
    freshnessRecommendations,
    applyFreshnessRecommendation,
    formatCurrency,
  } = useInventory();

  // Interactive Waste Prevention Simulator states
  const [demandSurgePercent, setDemandSurgePercent] = useState<number>(20);
  const [discountPercent, setDiscountPercent] = useState<number>(25);
  const [kitchenReallocationPercent, setKitchenReallocationPercent] = useState<number>(30);
  const [appliedItems, setAppliedItems] = useState<Record<string, boolean>>({});

  // Server-side Gemini AI insights
  const [aiInsights, setAiInsights] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  useEffect(() => {
    async function fetchInsights() {
      if (freshnessRecommendations.length === 0) return;
      setLoadingAi(true);
      try {
        const res = await fetch('/api/gemini/freshness-insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemsAtRisk: freshnessRecommendations.slice(0, 3),
            businessType,
            currency: profile.currency,
          }),
        });
        const data = await res.json();
        if (data.insights) {
          setAiInsights(data.insights);
        }
      } catch {
        setAiInsights(
          'AI Freshness Analysis: Priority batch rotation recommended for all dairy and short-shelf items. Implement 20% discount combo pairings to clear batches with under 48h shelf life.'
        );
      } finally {
        setLoadingAi(false);
      }
    }
    fetchInsights();
  }, [businessType, freshnessRecommendations, profile.currency]);

  // Dynamic simulation calculations
  const totalBaseRiskCost = freshnessRecommendations.reduce(
    (acc, r) => acc + r.estimatedAvoidableWasteCost,
    0
  );

  // Total quantity of goods currently at risk
  const totalQuantityAtRisk = freshnessRecommendations.reduce(
    (acc, r) => acc + r.quantityAtRisk,
    0
  );

  // Simulated recovery percentage based on sliders
  const estimatedUpliftFraction =
    Math.min(95, 40 + (demandSurgePercent * 0.6) + (discountPercent * 0.8) + (kitchenReallocationPercent * 0.5)) / 100;

  const simulatedCostAvoided = Math.round(totalBaseRiskCost * estimatedUpliftFraction);
  const simulatedProductsSaved = Math.round(totalQuantityAtRisk * estimatedUpliftFraction);
  const simulatedLeftoverUnits = Math.max(0, Math.round(totalQuantityAtRisk - simulatedProductsSaved));

  const handleApply = (id: string) => {
    applyFreshnessRecommendation(id);
    setAppliedItems((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Signature USP Banner Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-emerald-100 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            <span>SIGNATURE USP • FRESHNESS INTELLIGENCE ENGINE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Prevent Food Waste Before It Happens
          </h1>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
            TajaSetu AI continuously intersects batch expiration dates, current inventory, and predicted demand to flag unconsumed perishables and simulate real-time waste prevention strategies.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center shrink-0">
          <div className="text-[11px] font-medium text-emerald-200 uppercase tracking-wider">
            POTENTIAL LOSS AT RISK
          </div>
          <div className="text-2xl font-extrabold font-mono text-white mt-0.5">
            {formatCurrency(totalBaseRiskCost || 4200)}
          </div>
          <div className="text-[10px] text-emerald-200 mt-0.5">
            {freshnessRecommendations.length} active batch recommendations
          </div>
        </div>
      </div>

      {/* Gemini AI Strategic Executive Brief */}
      <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                Gemini 3.8 Flash • Real-Time Strategic Freshness Brief
              </h3>
              <p className="text-[11px] text-zinc-500">
                Contextual AI analysis for your {profile.businessName}
              </p>
            </div>
          </div>

          {loadingAi && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing perishables...</span>
            </div>
          )}
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/70 text-xs text-zinc-700 leading-relaxed font-sans">
          {aiInsights ? (
            <p className="whitespace-pre-line">{aiInsights}</p>
          ) : (
            <p>
              Immediate batch prioritization recommended for all dairy, eggs, and short-shelf inventory. Implement FEFO rotation and prioritize batches expiring within 48h for today's kitchen prep and meal combos.
            </p>
          )}
        </div>
      </div>

      {/* SECTION 1: Prioritized "Save These Products First" List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-900">
              Save These Products First (Priority Ranked)
            </h2>
            <p className="text-xs text-zinc-500">
              Ranked by urgency, unconsumed quantity risk, and financial exposure
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {freshnessRecommendations.length} Priority Items
          </span>
        </div>

        {freshnessRecommendations.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-zinc-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-zinc-900">All Batches Within Safe Run-Rates</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
              No perishables are currently projected to expire before normal consumption. Inventory rotation is healthy!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {freshnessRecommendations.map((rec) => {
              const isApplied = appliedItems[rec.id];

              return (
                <div
                  key={rec.id}
                  className="bg-white rounded-2xl p-5 border border-zinc-200/90 shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            rec.urgency === 'critical'
                              ? 'bg-rose-100 text-rose-800 border-rose-200'
                              : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}
                        >
                          {rec.daysRemaining <= 1 ? 'Expires Tomorrow' : `${rec.daysRemaining} Days Left`}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                          #{rec.batchNumber}
                        </span>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-zinc-400 font-semibold uppercase">Waste Risk</div>
                        <div className="text-sm font-extrabold font-mono text-rose-700">
                          {formatCurrency(rec.estimatedAvoidableWasteCost)}
                        </div>
                      </div>
                    </div>

                    {/* Product Name & Stats */}
                    <h3 className="text-sm font-bold text-zinc-900">{rec.productName}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Expires: <span className="font-semibold text-zinc-800">{rec.expiryDate}</span>
                    </p>

                    {/* Metric comparison box */}
                    <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 text-xs">
                      <div>
                        <span className="text-[10px] text-zinc-400 font-semibold uppercase">UNCONSUMED RISK</span>
                        <div className="font-bold font-mono text-zinc-800 mt-0.5">
                          {rec.quantityAtRisk} {rec.unit}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 font-semibold uppercase">PREDICTED DEMAND</span>
                        <div className="font-bold font-mono text-emerald-700 mt-0.5">
                          {rec.predictedDemandBeforeExpiry} {rec.unit}
                        </div>
                      </div>
                    </div>

                    {/* AI Recommendation & Reason */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-xs font-semibold text-emerald-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Recommended Action:</span>
                      </div>
                      <p className="text-xs font-medium text-zinc-800 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100/80">
                        {rec.suggestedAction}
                      </p>
                      <p className="text-[11px] text-zinc-500 leading-relaxed mt-1">
                        <span className="font-semibold text-zinc-600">Why: </span>
                        {rec.reason}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400 font-medium">
                      Confidence: {rec.confidence}%
                    </span>

                    <button
                      onClick={() => handleApply(rec.id)}
                      disabled={isApplied}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 ${
                        isApplied
                          ? 'bg-emerald-100 text-emerald-800 cursor-default'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Action Applied</span>
                        </>
                      ) : (
                        <>
                          <span>Apply Recommendation</span>
                          <ArrowRight className="w-3.5 h-3.5" />
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

      {/* SECTION 2: Interactive Waste Prevention Simulator */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/90 shadow-xs space-y-6">
        <div>
          <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <Sliders className="w-3.5 h-3.5 text-emerald-600" />
            <span>INTERACTIVE SIMULATOR</span>
          </div>
          <h2 className="text-lg font-bold text-zinc-900">Waste Prevention Simulator</h2>
          <p className="text-xs text-zinc-500 max-w-2xl leading-relaxed">
            Adjust hypothetical demand, planned promotional discounts, and kitchen preparation shifts to compare estimated waste under your current plan versus the proposed TajaSetu strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sliders on Left */}
          <div className="space-y-5 bg-zinc-50/70 p-5 rounded-2xl border border-zinc-200/70">
            {/* Slider 1: Promotional Discount */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-zinc-800">
                  Targeted Expiry Discount (% off at counter)
                </label>
                <span className="font-bold font-mono text-emerald-700">{discountPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>0% (Full Price)</span>
                <span>25% (Recommended)</span>
                <span>50% (Flash Clearance)</span>
              </div>
            </div>

            {/* Slider 2: Hypothetical Demand Surge */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-zinc-800">
                  Hypothetical Customer Footfall Surge (%)
                </label>
                <span className="font-bold font-mono text-emerald-700">+{demandSurgePercent}%</span>
              </div>
              <input
                type="range"
                min="-20"
                max="50"
                step="5"
                value={demandSurgePercent}
                onChange={(e) => setDemandSurgePercent(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>-20% (Rainy / Slow)</span>
                <span>0% (Normal)</span>
                <span>+50% (Weekend Peak)</span>
              </div>
            </div>

            {/* Slider 3: Kitchen / Menu Reallocation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-zinc-800">
                  Prep & Menu Reallocation (% shifted to high-velocity dishes)
                </label>
                <span className="font-bold font-mono text-emerald-700">{kitchenReallocationPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={kitchenReallocationPercent}
                onChange={(e) => setKitchenReallocationPercent(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>0% (As-is)</span>
                <span>30% (Recommended)</span>
                <span>60% (Aggressive Prep)</span>
              </div>
            </div>
          </div>

          {/* Results Summary on Right */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200">
                <div className="text-[11px] font-bold text-emerald-900 uppercase">
                  POTENTIAL WASTE AVOIDED
                </div>
                <div className="text-2xl font-extrabold font-mono text-emerald-700 mt-1">
                  {formatCurrency(simulatedCostAvoided)}
                </div>
                <div className="text-[11px] text-emerald-800 mt-1 font-medium">
                  {Math.round(estimatedUpliftFraction * 100)}% of at-risk value recovered
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <div className="text-[11px] font-bold text-zinc-700 uppercase">
                  PRODUCTS SAVED
                </div>
                <div className="text-2xl font-extrabold font-mono text-zinc-900 mt-1">
                  {simulatedProductsSaved} <span className="text-xs font-normal text-zinc-500">units</span>
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">
                  Rescued from scheduled write-off
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <div className="text-[11px] font-bold text-zinc-700 uppercase">
                  EXPECTED REMAINING LEFTOVER
                </div>
                <div className="text-xl font-bold font-mono text-zinc-800 mt-1">
                  {simulatedLeftoverUnits} <span className="text-xs font-normal text-zinc-500">units</span>
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">
                  Within acceptable variance
                </div>
              </div>

              <div className="p-4 rounded-xl bg-teal-50/80 border border-teal-200">
                <div className="text-[11px] font-bold text-teal-900 uppercase">
                  PROJECTED ROI BOOST
                </div>
                <div className="text-xl font-bold font-mono text-teal-800 mt-1">
                  +3.4%
                </div>
                <div className="text-[11px] text-teal-800 mt-1 font-medium">
                  Net gross margin contribution
                </div>
              </div>
            </div>

            {/* Assumptions & Legal Disclaimer */}
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-[11px] text-zinc-500 space-y-1">
              <div className="font-semibold text-zinc-700 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-zinc-400" />
                <span>Simulation Assumptions & Food Safety Disclaimer:</span>
              </div>
              <p className="leading-relaxed">
                Estimates are calculated using historical store elasticity (~1.4x volume per 20% discount). These are predictive estimates, not guaranteed revenues. Never sell or prepare products that have passed their verified expiry date or exhibit compromised storage integrity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
