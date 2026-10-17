import React, { useState } from 'react';
import {
  Settings,
  Building2,
  DollarSign,
  ShieldCheck,
  RefreshCw,
  Bell,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

export const SettingsPage: React.FC = () => {
  const { profile, updateProfile, resetBusinessData } = useInventory();
  const [businessName, setBusinessName] = useState(profile.businessName);
  const [ownerName, setOwnerName] = useState(profile.ownerName);
  const [location, setLocation] = useState(profile.location);
  const [currency, setCurrency] = useState(profile.currency);
  const [fefoEnforced, setFefoEnforced] = useState(profile.fefoEnforced);
  const [defaultSafetyDays, setDefaultSafetyDays] = useState(profile.defaultSafetyDays);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      businessName,
      ownerName,
      location,
      currency,
      fefoEnforced,
      defaultSafetyDays,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Business & Inventory Settings</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure currency, FEFO food safety rules, and SMS authentication mode.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-semibold text-zinc-700">Business / Store Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-200 focus:border-emerald-500 outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-700">Manager / Owner Name</label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-200 focus:border-emerald-500 outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-700">Location / City</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-200 focus:border-emerald-500 outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-700">Preferred Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-200 bg-white"
            >
              <option value="₹">INR (₹) — Indian Rupee</option>
              <option value="$">USD ($) — US Dollar</option>
              <option value="€">EUR (€) — Euro</option>
              <option value="£">GBP (£) — British Pound</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-700">Default Safety Buffer (Days)</label>
            <input
              type="number"
              min="1"
              max="30"
              value={defaultSafetyDays}
              onChange={(e) => setDefaultSafetyDays(parseInt(e.target.value, 10) || 3)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-200 outline-hidden"
            />
          </div>
        </div>

        {/* FEFO Setting */}
        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-zinc-900">Enforce FEFO Rotation Rules</div>
            <div className="text-[11px] text-zinc-500">
              Orders and recipe preparations automatically prioritize earliest expiring batch codes.
            </div>
          </div>
          <input
            type="checkbox"
            checked={fefoEnforced}
            onChange={(e) => setFefoEnforced(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded-sm"
          />
        </div>

        {/* SMS Mode Info */}
        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/70 text-xs space-y-1">
          <div className="font-semibold text-zinc-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Phone OTP Provider Configuration</span>
          </div>
          <p className="text-zinc-500 text-[11px] leading-relaxed">
            Running in <strong>Demo Sandbox Mode</strong>. Real phone verification with India +91 numbers connects to the prototype's verified OTP handler (code: 123456). To connect live Twilio/Supabase SMS, configure your credentials in the server environment.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Reset Data Card */}
      <div className="bg-white rounded-2xl p-6 border border-rose-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-rose-900">Reset Business Demo Records</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Clear locally modified batches, recipes, and write-offs to restore fresh sample data for {profile.businessName}.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset this store to initial sample data?')) {
              resetBusinessData();
              alert('Store records refreshed to default seed data!');
            }
          }}
          className="px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shrink-0"
        >
          Reset Store Data
        </button>
      </div>
    </div>
  );
};
