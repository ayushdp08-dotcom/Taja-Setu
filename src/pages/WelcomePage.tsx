import React from 'react';
import {
  Sparkles,
  Store,
  Coffee,
  UtensilsCrossed,
  Croissant,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Leaf,
  CheckCircle2,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { BusinessType } from '../types';

interface WelcomePageProps {
  onSelectBusiness: (type: BusinessType) => void;
  onQuickDemo: (type: BusinessType) => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onSelectBusiness,
  onQuickDemo,
}) => {
  const { setBusinessType } = useInventory();

  const businessCards: Array<{
    type: BusinessType;
    title: string;
    subtitle: string;
    icon: any;
    highlights: string[];
    tag: string;
    tagColor: string;
    color: string;
  }> = [
    {
      type: 'grocery',
      title: 'Grocery Store',
      subtitle: 'Packaged goods, produce, dairy, beverages, and household essentials.',
      icon: Store,
      highlights: ['Batch-wise expiry alerts', 'FMCG reorder velocity', 'Multi-unit tracking (kg/pcs/L)'],
      tag: 'Retail & Supermarket',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      color: 'hover:border-emerald-500',
    },
    {
      type: 'cafe',
      title: 'Artisan Café',
      subtitle: 'Coffee beans, milk, syrups, bakery items, and specialty beverages.',
      icon: Coffee,
      highlights: ['Recipe auto-deduction per drink', 'Milk short shelf-life warnings', 'Daily cup demand forecast'],
      tag: 'Coffee Shop & Roastery',
      tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
      color: 'hover:border-amber-500',
    },
    {
      type: 'restaurant',
      title: 'Restaurant & Kitchen',
      subtitle: 'Raw ingredients, meat, seafood, kitchen stock, and prepared dishes.',
      icon: UtensilsCrossed,
      highlights: ['Kitchen walk-in & line storage', 'Chef daily prep recommendations', 'Food waste cost logs'],
      tag: 'Dine-In & Cloud Kitchen',
      tagColor: 'bg-teal-50 text-teal-700 border-teal-200',
      color: 'hover:border-teal-500',
    },
    {
      type: 'bakery',
      title: 'Bakery & Patisserie',
      subtitle: 'Flour, sugar, butter, baked products, and production batches.',
      icon: Croissant,
      highlights: ['Raw flour-to-finished loaf conversion', 'Daily bake batch planner', 'Artisan shelf-life tracking'],
      tag: 'Bakehouse & Pastry',
      tagColor: 'bg-orange-50 text-orange-700 border-orange-200',
      color: 'hover:border-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-emerald-100">
      {/* Top Banner / Navigation */}
      <nav className="h-18 px-6 lg:px-12 border-b border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-tight text-zinc-900 flex items-center gap-1.5">
              TajaSetu <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">AI</span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium">Enterprise Food Waste & Stock Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500 font-medium bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Phone OTP Authentication • India (+91)</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold mb-6 shadow-2xs">
          <Leaf className="w-3.5 h-3.5 text-emerald-600" />
          <span>Reducing Food Spoilage & Maximizing Margins with Gemini AI</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight max-w-3xl leading-tight">
          Smarter Inventory. <br className="hidden sm:inline" />
          <span className="text-emerald-600">Fresher Products.</span> Better Profits.
        </h1>

        <p className="mt-4 text-sm sm:text-base text-zinc-600 max-w-2xl leading-relaxed">
          Your AI-powered inventory partner for reducing food waste and growing your business.
          Select your business model to experience tailored workflows, automatic recipe deductions, and real-time Freshness Intelligence.
        </p>

        {/* 4 Selectable Business Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full text-left">
          {businessCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.type}
                className={`group relative bg-white border border-zinc-200/90 rounded-2xl p-5 hover:shadow-lg transition-all duration-200 flex flex-col justify-between ${card.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-800 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${card.tagColor}`}>
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">
                    {card.subtitle}
                  </p>

                  <div className="mt-4 pt-3 border-t border-zinc-100 space-y-1.5">
                    {card.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-zinc-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-zinc-100 space-y-2">
                  <button
                    onClick={() => onSelectBusiness(card.type)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-emerald-600 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <span>Continue with Phone OTP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      setBusinessType(card.type);
                      onQuickDemo(card.type);
                    }}
                    className="w-full py-1.5 text-[11px] font-medium text-zinc-500 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-lg transition-colors text-center"
                  >
                    Explore Demo Directly →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Badges */}
        <div className="mt-14 max-w-4xl w-full grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-zinc-100">
          <div className="flex flex-col items-center text-center p-3">
            <Zap className="w-5 h-5 text-emerald-600 mb-1.5" />
            <div className="text-xs font-bold text-zinc-800">FEFO Expiry Tracking</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">First Expired, First Out</div>
          </div>
          <div className="flex flex-col items-center text-center p-3">
            <TrendingUp className="w-5 h-5 text-emerald-600 mb-1.5" />
            <div className="text-xs font-bold text-zinc-800">Demand Forecasting</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">1d, 7d & 30d Predictions</div>
          </div>
          <div className="flex flex-col items-center text-center p-3">
            <Sparkles className="w-5 h-5 text-emerald-600 mb-1.5" />
            <div className="text-xs font-bold text-zinc-800">Freshness Intelligence</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Avoidable Waste Simulator</div>
          </div>
          <div className="flex flex-col items-center text-center p-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1.5" />
            <div className="text-xs font-bold text-zinc-800">Isolated Data Security</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Independent Store Accounts</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-zinc-100 text-center text-xs text-zinc-400">
        <p>© 2026 TajaSetu AI. Engineered for restaurants, cafés, bakeries, and grocery stores in India & globally.</p>
      </footer>
    </div>
  );
};
