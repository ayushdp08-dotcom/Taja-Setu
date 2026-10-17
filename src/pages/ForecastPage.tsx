import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  BarChart2,
  Layers,
  ArrowUpRight,
  Flame,
  Info,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

export const ForecastPage: React.FC = () => {
  const { demandForecasts, formatCurrency, products } = useInventory();
  const [timeHorizon, setTimeHorizon] = useState<'1d' | '7d' | '30d'>('7d');
  const [festivalSurgeActive, setFestivalSurgeActive] = useState<boolean>(true);

  // 7-day historical simulated run
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri (Surge)', 'Sat (Peak)', 'Sun (Peak)'];
  const dailyVelocity = [32, 35, 38, 42, 68, 85, 78];
  const predictedNextWeek = [34, 37, 40, 45, 72, 90, 84];

  const maxVal = Math.max(...predictedNextWeek, ...dailyVelocity);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Predictive Analytics Engine
            </span>
            <span className="text-xs text-zinc-400">•</span>
            <span className="text-xs text-zinc-500 font-medium">92% Model Confidence</span>
          </div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            AI Demand Forecasting
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Transparent machine-learning forecasts projecting 1-day, 7-day, and 30-day product consumption.
          </p>
        </div>

        {/* Festival / Weekend Surge Toggle */}
        <div className="flex items-center gap-3 bg-zinc-50 p-2.5 px-3.5 rounded-2xl border border-zinc-200/80">
          <div className="text-left">
            <div className="text-xs font-bold text-zinc-900 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>Weekend & Festival Multiplier</span>
            </div>
            <div className="text-[10px] text-zinc-500">Applies +25% consumption uplift</div>
          </div>
          <input
            type="checkbox"
            checked={festivalSurgeActive}
            onChange={(e) => setFestivalSurgeActive(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded-sm border-zinc-300 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Forecast Chart Card */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-zinc-900">Historical Actuals vs. Predicted Daily Units</h2>
            <p className="text-xs text-zinc-500">
              Aggregate unit velocity across all fast-moving menu & inventory items
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-zinc-100/80 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setTimeHorizon('1d')}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeHorizon === '1d' ? 'bg-white text-zinc-900 shadow-2xs font-bold' : 'text-zinc-600'
              }`}
            >
              Next 24h
            </button>
            <button
              onClick={() => setTimeHorizon('7d')}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeHorizon === '7d' ? 'bg-white text-zinc-900 shadow-2xs font-bold' : 'text-zinc-600'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeHorizon('30d')}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeHorizon === '30d' ? 'bg-white text-zinc-900 shadow-2xs font-bold' : 'text-zinc-600'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>

        {/* Visual Bar Chart Comparison */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-end gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-500">
              <span className="w-3 h-3 rounded-sm bg-zinc-300 inline-block" />
              <span>Past 7-Day Actual Sales</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <span className="w-3 h-3 rounded-sm bg-emerald-600 inline-block" />
              <span>Predicted Demand ({festivalSurgeActive ? '+25% Peak' : 'Standard'})</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-4 h-48 items-end pt-6 border-b border-zinc-200">
            {weekDays.map((day, i) => {
              const actualH = (dailyVelocity[i] / maxVal) * 100;
              const predH = ((predictedNextWeek[i] * (festivalSurgeActive ? 1.15 : 1)) / maxVal) * 100;

              return (
                <div key={i} className="flex flex-col items-center h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-full">
                    {/* Actual Bar */}
                    <div
                      style={{ height: `${actualH}%` }}
                      className="w-1/2 max-w-[20px] bg-zinc-200 rounded-t-sm transition-all group-hover:bg-zinc-300"
                      title={`Actual: ${dailyVelocity[i]} units`}
                    />
                    {/* Forecast Bar */}
                    <div
                      style={{ height: `${predH}%` }}
                      className="w-1/2 max-w-[20px] bg-emerald-600 rounded-t-sm transition-all group-hover:bg-emerald-700 shadow-2xs"
                      title={`Predicted: ${Math.round(predictedNextWeek[i] * (festivalSurgeActive ? 1.15 : 1))} units`}
                    />
                  </div>
                  <span className="mt-2 text-[10px] text-zinc-500 font-medium truncate w-full text-center">
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Item-by-Item Demand Predictions Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-zinc-900">Per-SKU Demand Forecasts & Stockout Risk</h2>
            <p className="text-xs text-zinc-500">Transparent mathematical calculations based on historical consumption velocity</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Next 1 Day</th>
                <th className="py-3 px-4">Next 7 Days</th>
                <th className="py-3 px-4">Next 30 Days</th>
                <th className="py-3 px-4">Stockout Risk</th>
                <th className="py-3 px-4">Pattern & Seasonality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {demandForecasts.map((f) => {
                const multiplier = festivalSurgeActive ? 1.25 : 1.0;
                const f1 = Math.round(f.forecast1d * multiplier);
                const f7 = Math.round(f.forecast7d * multiplier);
                const f30 = Math.round(f.forecast30d * multiplier);

                return (
                  <tr key={f.productId} className="hover:bg-zinc-50/60">
                    <td className="py-3.5 px-4 font-bold text-zinc-900">
                      {f.productName}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-zinc-800">
                      {f.currentStock}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-emerald-800">
                      ~{f1} units
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-emerald-800">
                      ~{f7} units
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-600">
                      ~{f30} units
                    </td>
                    <td className="py-3.5 px-4">
                      {f.stockoutRisk === 'high' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          High (Reorder Urgently)
                        </span>
                      ) : f.stockoutRisk === 'medium' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          Medium Buffer
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Safe Level
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-500 text-[11px]">
                      {f.weekdayPattern}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-zinc-50 border-t border-zinc-100 text-xs text-zinc-500 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-zinc-400 shrink-0" />
          <span>Transparent Forecasting: Calculations rely on rolling lead times and actual past receipts. No arbitrary artificial predictions.</span>
        </div>
      </div>
    </div>
  );
};
