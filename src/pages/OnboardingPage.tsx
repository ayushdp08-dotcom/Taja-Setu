import React, { useState } from 'react';
import {
  Sparkles,
  Building2,
  User,
  MapPin,
  Clock,
  DollarSign,
  Scale,
  ArrowRight,
  CheckCircle2,
  Boxes,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { BUSINESS_CONFIGS } from '../data/mockData';

interface OnboardingPageProps {
  onComplete: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const { businessType, profile, updateProfile } = useInventory();
  const config = BUSINESS_CONFIGS[businessType] || BUSINESS_CONFIGS.grocery;

  const [businessName, setBusinessName] = useState(profile.businessName || `${config.name} Outlet`);
  const [ownerName, setOwnerName] = useState(profile.ownerName || 'Store Manager');
  const [location, setLocation] = useState(profile.location || 'Bengaluru, India');
  const [currency, setCurrency] = useState(profile.currency || '₹');
  const [timezone, setTimezone] = useState(profile.timezone || 'Asia/Kolkata (IST)');
  const [defaultSafetyDays, setDefaultSafetyDays] = useState(profile.defaultSafetyDays || 3);
  const [fefoEnforced, setFefoEnforced] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      businessName,
      ownerName,
      location,
      currency,
      timezone,
      defaultSafetyDays,
      fefoEnforced,
      onboardingCompleted: true,
    });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-2xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200/90 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-6 border-b border-zinc-100 bg-emerald-50/40">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>STEP 2 OF 2 • BUSINESS CONFIGURATION</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
              Configure Your {config.name}
            </h1>
            <p className="mt-1 text-xs text-zinc-600 leading-relaxed">
              Tailor inventory rules, measurement units, and food safety thresholds for your daily operations.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Business / Outlet Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-zinc-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Manager / Owner Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-zinc-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>City / Location</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-zinc-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Currency</span>
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-zinc-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden font-medium bg-white"
                >
                  <option value="₹">INR (₹) — Indian Rupee</option>
                  <option value="$">USD ($) — US Dollar</option>
                  <option value="€">EUR (€) — Euro</option>
                  <option value="£">GBP (£) — British Pound</option>
                  <option value="AED">AED (د.إ) — UAE Dirham</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Timezone</span>
                </label>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-zinc-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden font-medium"
                />
              </div>
            </div>

            {/* FEFO & Food Safety Rules */}
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-3">
              <div className="text-xs font-bold text-zinc-900">Food Safety & Shelf-Life Rules</div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-zinc-800">
                    Enforce FEFO (First Expired, First Out)
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Stock deduction automatically draws oldest batches first to eliminate spoilage.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={fefoEnforced}
                  onChange={(e) => setFefoEnforced(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded-sm border-zinc-300 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-zinc-800">
                    Default Safety Stock Days
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Buffer stock maintained before triggering replenishment alerts.
                  </div>
                </div>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={defaultSafetyDays}
                  onChange={(e) => setDefaultSafetyDays(parseInt(e.target.value, 10) || 3)}
                  className="w-16 text-xs px-2 py-1.5 text-center font-mono rounded-lg border border-zinc-200 bg-white"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={onComplete}
                className="text-xs font-medium text-zinc-500 hover:text-zinc-800"
              >
                Skip optional details & launch →
              </button>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <span>Save & Enter Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
