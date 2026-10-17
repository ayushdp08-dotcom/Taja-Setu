import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Search,
  Plus,
  Sparkles,
  Utensils,
  Store,
  Coffee,
  Croissant,
  UtensilsCrossed,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { BusinessType } from '../../types';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
  setIsMobileOpen: (open: boolean) => void;
  onOpenAddModal: () => void;
  onOpenPosModal: () => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  navigate,
  setIsMobileOpen,
  onOpenAddModal,
  onOpenPosModal,
  onOpenNotifications,
}) => {
  const { businessType, setBusinessType, profile, notifications, criticalExpiringBatches } = useInventory();
  const [showBusinessDropdown, setShowBusinessDropdown] = useState(false);

  const unreadAlerts = notifications.filter((n) => !n.isRead).length;

  const getPageTitle = (route: string) => {
    switch (route) {
      case 'dashboard':
        return 'Operations Dashboard';
      case 'inventory':
        return 'Inventory & Stock Management';
      case 'freshness-intelligence':
        return 'Freshness Intelligence AI';
      case 'assistant':
        return 'AI Business Assistant';
      case 'expiry':
        return 'Expiry & FEFO Calendar';
      case 'forecast':
        return 'AI Demand Forecasting';
      case 'reorder':
        return 'Smart Reorder Recommendations';
      case 'suppliers':
        return 'Supplier Directory';
      case 'purchase-orders':
        return 'Purchase Orders';
      case 'waste-analytics':
        return 'Waste & Profit Analytics';
      case 'recipes':
        return businessType === 'bakery' ? 'Artisan Batch Baking' : 'Recipe & Menu Consumption';
      case 'settings':
        return 'Business Settings';
      case 'profile':
        return 'Profile & Security';
      default:
        return 'Inventory Overview';
    }
  };

  const businessLabels: Record<BusinessType, { name: string; icon: any; color: string }> = {
    grocery: { name: 'Grocery Store', icon: Store, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    cafe: { name: 'Artisan Café', icon: Coffee, color: 'text-amber-800 bg-amber-50 border-amber-200' },
    restaurant: { name: 'Restaurant Kitchen', icon: UtensilsCrossed, color: 'text-teal-800 bg-teal-50 border-teal-200' },
    bakery: { name: 'Bakehouse & Bakery', icon: Croissant, color: 'text-orange-800 bg-orange-50 border-orange-200' },
  };

  const currentBusinessInfo = businessLabels[businessType] || businessLabels.grocery;
  const CurrentIcon = currentBusinessInfo.icon;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left section: Hamburger & Route Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
              {getPageTitle(currentRoute)}
            </h1>

            {/* Business type badge with switcher */}
            <div className="relative">
              <button
                onClick={() => setShowBusinessDropdown(!showBusinessDropdown)}
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentBusinessInfo.color} hover:opacity-90 transition-opacity`}
              >
                <CurrentIcon className="w-3.5 h-3.5" />
                <span>{currentBusinessInfo.name}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {showBusinessDropdown && (
                <div
                  className="absolute left-0 mt-2 w-48 bg-white border border-zinc-200 rounded-xl shadow-lg p-1.5 z-50 text-xs font-medium space-y-0.5"
                  onClick={() => setShowBusinessDropdown(false)}
                >
                  <div className="px-2 py-1 text-[10px] text-zinc-400 font-semibold uppercase">Switch Store Type</div>
                  <button
                    onClick={() => setBusinessType('grocery')}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left ${businessType === 'grocery' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-zinc-700 hover:bg-zinc-50'}`}
                  >
                    <Store className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Grocery Store</span>
                  </button>
                  <button
                    onClick={() => setBusinessType('cafe')}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left ${businessType === 'cafe' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-zinc-700 hover:bg-zinc-50'}`}
                  >
                    <Coffee className="w-3.5 h-3.5 text-amber-600" />
                    <span>Artisan Café</span>
                  </button>
                  <button
                    onClick={() => setBusinessType('restaurant')}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left ${businessType === 'restaurant' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-zinc-700 hover:bg-zinc-50'}`}
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5 text-teal-600" />
                    <span>Restaurant Kitchen</span>
                  </button>
                  <button
                    onClick={() => setBusinessType('bakery')}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left ${businessType === 'bakery' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-zinc-700 hover:bg-zinc-50'}`}
                  >
                    <Croissant className="w-3.5 h-3.5 text-orange-600" />
                    <span>Bakehouse & Bakery</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Action buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick POS / Sell Recipe button (if cafe, restaurant, bakery) */}
        {businessType !== 'grocery' && (
          <button
            onClick={onOpenPosModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80 transition-colors shadow-2xs"
          >
            {businessType === 'bakery' ? <Croissant className="w-3.5 h-3.5 text-emerald-700" /> : <Utensils className="w-3.5 h-3.5 text-emerald-700" />}
            <span>{businessType === 'bakery' ? 'Bake Batch' : 'Simulate POS Order'}</span>
          </button>
        )}

        {/* Add Product Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </button>

        {/* Notifications Icon Button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
          title="Notification Center"
        >
          <Bell className="w-4 h-4" />
          {unreadAlerts > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>

        {/* Profile Pill */}
        <button
          onClick={() => navigate('profile')}
          className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-lg hover:bg-zinc-50 border border-transparent hover:border-zinc-200 transition-colors text-left"
        >
          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
            {profile.ownerName?.charAt(0) || 'A'}
          </div>
          <div className="hidden xl:block">
            <div className="text-xs font-medium text-zinc-800 leading-tight">
              {profile.ownerName?.split(' ')[0]}
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5" /> Verified
            </div>
          </div>
        </button>
      </div>
    </header>
  );
};
