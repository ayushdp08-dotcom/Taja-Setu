import React from 'react';
import {
  ShieldCheck,
  Phone,
  User,
  Building2,
  MapPin,
  Clock,
  LogOut,
  Store,
  Coffee,
  UtensilsCrossed,
  Croissant,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { BusinessType } from '../types';

interface ProfilePageProps {
  navigate: (route: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ navigate }) => {
  const { profile, businessType, setBusinessType, logout } = useInventory();

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Account Profile & Security</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Verified Indian mobile phone number authentication & store authorization.
          </p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Verified Phone Card */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-900">{profile.phone}</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  <span>Verified Indian Phone OTP</span>
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Authenticated via secure 6-digit SMS OTP protocol
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-zinc-100 text-xs">
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
            <span className="text-[10px] text-zinc-400 font-semibold uppercase">BUSINESS MANAGER</span>
            <div className="font-bold text-zinc-900 mt-0.5">{profile.ownerName}</div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
            <span className="text-[10px] text-zinc-400 font-semibold uppercase">OUTLET LOCATION</span>
            <div className="font-bold text-zinc-900 mt-0.5">{profile.location}</div>
          </div>
        </div>
      </div>

      {/* Switch Active Business */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-900">Switch Business Storefront</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Experience isolated databases and custom workflows across all 4 supported verticals.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setBusinessType('grocery')}
            className={`p-3.5 rounded-xl border text-center transition-all ${
              businessType === 'grocery'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-400 ring-2 ring-emerald-500/20'
                : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700'
            }`}
          >
            <Store className="w-5 h-5 mx-auto mb-1.5 text-emerald-600" />
            <div className="text-xs font-bold">Grocery</div>
          </button>

          <button
            onClick={() => setBusinessType('cafe')}
            className={`p-3.5 rounded-xl border text-center transition-all ${
              businessType === 'cafe'
                ? 'bg-amber-50 text-amber-900 border-amber-400 ring-2 ring-amber-500/20'
                : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700'
            }`}
          >
            <Coffee className="w-5 h-5 mx-auto mb-1.5 text-amber-600" />
            <div className="text-xs font-bold">Café</div>
          </button>

          <button
            onClick={() => setBusinessType('restaurant')}
            className={`p-3.5 rounded-xl border text-center transition-all ${
              businessType === 'restaurant'
                ? 'bg-teal-50 text-teal-900 border-teal-400 ring-2 ring-teal-500/20'
                : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700'
            }`}
          >
            <UtensilsCrossed className="w-5 h-5 mx-auto mb-1.5 text-teal-600" />
            <div className="text-xs font-bold">Restaurant</div>
          </button>

          <button
            onClick={() => setBusinessType('bakery')}
            className={`p-3.5 rounded-xl border text-center transition-all ${
              businessType === 'bakery'
                ? 'bg-orange-50 text-orange-900 border-orange-400 ring-2 ring-orange-500/20'
                : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700'
            }`}
          >
            <Croissant className="w-5 h-5 mx-auto mb-1.5 text-orange-600" />
            <div className="text-xs font-bold">Bakery</div>
          </button>
        </div>
      </div>
    </div>
  );
};
