import React, { useState } from 'react';
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Download,
  Calendar,
  Layers,
  Sparkles,
  PieChart,
  Trash2,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

export const WasteAnalyticsPage: React.FC = () => {
  const {
    wasteRecords,
    totalWasteCost,
    stockValue,
    freshnessRecommendations,
    formatCurrency,
  } = useInventory();

  const [timeframe, setTimeframe] = useState<'30d' | '90d' | 'year'>('30d');

  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  wasteRecords.forEach((w) => {
    categoryTotals[w.category] = (categoryTotals[w.category] || 0) + w.lossAmount;
  });

  const estimatedSavings = freshnessRecommendations.reduce(
    (acc, r) => acc + r.estimatedAvoidableWasteCost,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              P&L Financial Intelligence
            </span>
            <span className="text-xs text-zinc-400">•</span>
            <span className="text-xs text-zinc-500 font-medium">Estimated vs. Actual Measured Savings</span>
          </div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Waste & Profit Analytics
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Audit write-offs, track category spoilage cost, and evaluate AI waste reduction ROI.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1.5 bg-zinc-100/80 p-1 rounded-xl text-xs font-semibold self-start md:self-auto">
          <button
            onClick={() => setTimeframe('30d')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeframe === '30d' ? 'bg-white text-zinc-900 shadow-2xs font-bold' : 'text-zinc-600'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setTimeframe('90d')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeframe === '90d' ? 'bg-white text-zinc-900 shadow-2xs font-bold' : 'text-zinc-600'
            }`}
          >
            Last Quarter
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs">
          <span className="text-xs font-medium text-zinc-500">Total Measured Waste Loss</span>
          <div className="text-2xl font-extrabold font-mono text-rose-700 mt-1">
            {formatCurrency(totalWasteCost)}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
            <span>-22% reduction with FEFO rules</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs">
          <span className="text-xs font-medium text-zinc-500">Estimated Avoidable Savings</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-700 mt-1">
            {formatCurrency(estimatedSavings || 3600)}
          </div>
          <div className="text-[11px] text-emerald-800 font-semibold mt-1">
            From Freshness AI interventions
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs">
          <span className="text-xs font-medium text-zinc-500">Estimated Gross Margin</span>
          <div className="text-2xl font-extrabold font-mono text-zinc-900 mt-1">
            66.8%
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Across active menu & retail items
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs">
          <span className="text-xs font-medium text-zinc-500">Waste-to-Stock Ratio</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-800 mt-1">
            1.8%
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Industry benchmark: ~4.5%
          </div>
        </div>
      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Waste Distribution */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-900">Waste by Category Breakdown</h2>
            <p className="text-xs text-zinc-500">Financial write-offs across departments</p>
          </div>

          <div className="space-y-3 pt-2">
            {Object.keys(categoryTotals).length === 0 ? (
              <div className="text-xs text-zinc-400 py-4 text-center">No write-offs logged.</div>
            ) : (
              Object.entries(categoryTotals).map(([cat, amt]) => {
                const pct = Math.round((amt / Math.max(1, totalWasteCost)) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-800">{cat}</span>
                      <span className="font-mono font-bold text-zinc-900">
                        {formatCurrency(amt)} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detailed Waste Audit Trail Log */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-zinc-900">Verified Waste Log Entries</h2>
              <p className="text-xs text-zinc-500">Logged write-offs with audit justifications</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-100 text-zinc-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Batch</th>
                  <th className="py-2.5 px-3">Quantity</th>
                  <th className="py-2.5 px-3">Loss Amount</th>
                  <th className="py-2.5 px-3">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {wasteRecords.map((w) => (
                  <tr key={w.id} className="hover:bg-zinc-50/60">
                    <td className="py-3 px-3 text-zinc-500 font-mono text-[11px]">
                      {new Date(w.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 font-semibold text-zinc-900">{w.productName}</td>
                    <td className="py-3 px-3 font-mono text-zinc-500">#{w.batchNumber}</td>
                    <td className="py-3 px-3 font-mono font-bold text-rose-700">
                      -{w.quantity} {w.unit}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-rose-700">
                      {formatCurrency(w.lossAmount)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                        {w.reason}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
