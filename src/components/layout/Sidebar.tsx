import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  CalendarClock,
  TrendingUp,
  ShoppingCart,
  Truck,
  FileText,
  BarChart3,
  Sparkles,
  BotMessageSquare,
  Settings,
  ShieldCheck,
  UtensilsCrossed,
  Store,
  Coffee,
  Croissant,
  LogOut,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { BusinessType } from '../../types';

interface SidebarProps {
  currentRoute: string;
  navigate: (route: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
  highlight?: boolean;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  navigate,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { businessType, setBusinessType, profile, logout, criticalExpiringBatches, totalLowStock } = useInventory();

  const businessIcons: Record<BusinessType, any> = {
    grocery: Store,
    cafe: Coffee,
    restaurant: UtensilsCrossed,
    bakery: Croissant,
  };

  const BusinessIcon = businessIcons[businessType] || Store;

  const navItems: NavGroup[] = [
    {
      group: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        {
          id: 'freshness-intelligence',
          label: 'Freshness AI (USP)',
          icon: Sparkles,
          badge: criticalExpiringBatches.length > 0 ? `${criticalExpiringBatches.length} At Risk` : 'Active',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          highlight: true,
        },
        { id: 'assistant', label: 'AI Business Assistant', icon: BotMessageSquare },
      ],
    },
    {
      group: 'STOCK & SHELF LIFE',
      items: [
        { id: 'inventory', label: 'Inventory List', icon: Boxes },
        ...(businessType !== 'grocery'
          ? [
              {
                id: 'recipes',
                label: businessType === 'bakery' ? 'Batch Production' : 'Recipes & Menu POS',
                icon: businessType === 'bakery' ? Flame : UtensilsCrossed,
              },
            ]
          : []),
        {
          id: 'expiry',
          label: 'Expiry & FEFO Calendar',
          icon: CalendarClock,
          badge: criticalExpiringBatches.length > 0 ? `${criticalExpiringBatches.length}` : undefined,
          badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
        },
        { id: 'forecast', label: 'AI Demand Forecast', icon: TrendingUp },
        {
          id: 'reorder',
          label: 'Smart Reorder',
          icon: ShoppingCart,
          badge: totalLowStock.length > 0 ? `${totalLowStock.length}` : undefined,
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        },
      ],
    },
    {
      group: 'SUPPLY & ANALYTICS',
      items: [
        { id: 'purchase-orders', label: 'Purchase Orders', icon: FileText },
        { id: 'suppliers', label: 'Suppliers Directory', icon: Truck },
        { id: 'waste-analytics', label: 'Waste & Profit Analytics', icon: BarChart3 },
      ],
    },
    {
      group: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Business Settings', icon: Settings },
        { id: 'profile', label: 'Profile & Security', icon: ShieldCheck },
      ],
    },
  ];

  const handleNavClick = (id: string) => {
    navigate(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-zinc-200/90 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-zinc-100 flex items-center justify-between">
          <button
            onClick={() => navigate('dashboard')}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-700 transition-colors">
              <Sparkles className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <div className="font-bold text-base tracking-tight text-zinc-900 flex items-center gap-1.5">
                TajaSetu <span className="text-xs px-1.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">AI</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">Next-Gen Inventory</p>
            </div>
          </button>
        </div>

        {/* Business Selector Pill */}
        <div className="p-3 border-b border-zinc-100 bg-zinc-50/60">
          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 px-1 flex items-center justify-between">
            <span>ACTIVE WORKFLOW</span>
            <button
              onClick={() => navigate('welcome')}
              className="text-[10px] text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Change
            </button>
          </div>
          <div className="relative">
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value as BusinessType)}
              className="w-full text-xs font-medium text-zinc-800 bg-white border border-zinc-200 rounded-lg pl-8 pr-7 py-2 appearance-none focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-2xs"
            >
              <option value="grocery">Grocery Store</option>
              <option value="cafe">Artisan Café</option>
              <option value="restaurant">Restaurant & Kitchen</option>
              <option value="bakery">Bakehouse & Patisserie</option>
            </select>
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-600">
              <BusinessIcon className="w-3.5 h-3.5" />
            </div>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-[10px]">
              ▼
            </div>
          </div>
          <div className="mt-1 px-1 text-[11px] text-zinc-600 font-medium truncate">
            {profile.businessName}
          </div>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-xs font-medium scrollbar-thin">
          {navItems.map((group, gIdx) => (
            <div key={gIdx} className="space-y-0.5">
              <div className="px-2.5 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                {group.group}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-all text-left group ${
                      isActive
                        ? 'bg-emerald-50/80 text-emerald-900 font-semibold border border-emerald-200/60 shadow-2xs'
                        : item.highlight
                        ? 'bg-emerald-50/30 text-zinc-800 hover:bg-emerald-50/60 hover:text-emerald-900'
                        : 'text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-emerald-600'
                            : item.highlight
                            ? 'text-emerald-500 group-hover:text-emerald-600'
                            : 'text-zinc-400 group-hover:text-zinc-600'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${item.badgeColor || 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-zinc-100 bg-white">
          <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                {profile.ownerName?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-zinc-900 truncate">
                  {profile.ownerName}
                </div>
                <div className="text-[10px] text-zinc-500 truncate">{profile.phone}</div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus:outline-hidden"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
