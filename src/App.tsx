/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { NotificationsDrawer } from './components/layout/NotificationsDrawer';
import { AddProductModal } from './components/modals/AddProductModal';
import { PosSaleModal } from './components/modals/PosSaleModal';
import { StockAdjustModal } from './components/modals/StockAdjustModal';

// Pages
import { WelcomePage } from './pages/WelcomePage';
import { AuthPage } from './pages/AuthPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { InventoryPage } from './pages/InventoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ExpiryPage } from './pages/ExpiryPage';
import { ForecastPage } from './pages/ForecastPage';
import { ReorderPage } from './pages/ReorderPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { PurchaseOrdersPage } from './pages/PurchaseOrdersPage';
import { WasteAnalyticsPage } from './pages/WasteAnalyticsPage';
import { FreshnessIntelligencePage } from './pages/FreshnessIntelligencePage';
import { AssistantPage } from './pages/AssistantPage';
import { RecipePage } from './pages/RecipePage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { Product, BusinessType } from './types';

function AppContent() {
  const { isAuthenticated, businessType, setBusinessType } = useInventory();

  // Route state (synced with hash or direct)
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) return hash;
    return isAuthenticated ? 'dashboard' : 'welcome';
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);

  // Modal states
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPosModalOpen, setIsPosModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Sync hash changes
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) setCurrentRoute(hash);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user is not authenticated and is on protected routes, redirect to welcome or login
  const isPublicRoute = currentRoute === 'welcome' || currentRoute === 'login' || currentRoute === 'onboarding';

  // Render logic
  if (!isAuthenticated && !isPublicRoute) {
    return (
      <WelcomePage
        onSelectBusiness={(type) => {
          setBusinessType(type);
          navigate('login');
        }}
        onQuickDemo={(type) => {
          setBusinessType(type);
          navigate('dashboard');
        }}
      />
    );
  }

  if (currentRoute === 'welcome') {
    return (
      <WelcomePage
        onSelectBusiness={(type) => {
          setBusinessType(type);
          navigate('login');
        }}
        onQuickDemo={(type) => {
          setBusinessType(type);
          navigate('dashboard');
        }}
      />
    );
  }

  if (currentRoute === 'login') {
    return (
      <AuthPage
        onSuccess={() => navigate('dashboard')}
        onBackToWelcome={() => navigate('welcome')}
      />
    );
  }

  if (currentRoute === 'onboarding') {
    return <OnboardingPage onComplete={() => navigate('dashboard')} />;
  }

  // Authenticated App Shell with Sidebar & Navbar
  return (
    <div className="min-h-screen bg-zinc-50/50 flex">
      {/* Desktop Sidebar & Mobile Drawer */}
      <Sidebar
        currentRoute={currentRoute}
        navigate={navigate}
        isMobileOpen={isMobileNavOpen}
        setIsMobileOpen={setIsMobileNavOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Navbar
          currentRoute={currentRoute}
          navigate={navigate}
          setIsMobileOpen={setIsMobileNavOpen}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenPosModal={() => setIsPosModalOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentRoute === 'dashboard' && (
            <DashboardPage
              navigate={navigate}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenPosModal={() => setIsPosModalOpen(true)}
            />
          )}

          {currentRoute === 'inventory' && (
            <InventoryPage
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onSelectProduct={(prod) => {
                setSelectedProduct(prod);
                navigate('product-detail');
              }}
              onAdjustStock={(prod) => setAdjustingProduct(prod)}
            />
          )}

          {currentRoute === 'product-detail' && selectedProduct && (
            <ProductDetailPage
              product={selectedProduct}
              onBack={() => navigate('inventory')}
              onAdjustStock={(prod) => setAdjustingProduct(prod)}
            />
          )}

          {currentRoute === 'expiry' && <ExpiryPage />}

          {currentRoute === 'forecast' && <ForecastPage />}

          {currentRoute === 'reorder' && <ReorderPage navigate={navigate} />}

          {currentRoute === 'suppliers' && <SuppliersPage />}

          {currentRoute === 'purchase-orders' && <PurchaseOrdersPage navigate={navigate} />}

          {currentRoute === 'waste-analytics' && <WasteAnalyticsPage />}

          {currentRoute === 'freshness-intelligence' && <FreshnessIntelligencePage />}

          {currentRoute === 'assistant' && <AssistantPage />}

          {currentRoute === 'recipes' && <RecipePage />}

          {currentRoute === 'settings' && <SettingsPage />}

          {currentRoute === 'profile' && <ProfilePage navigate={navigate} />}
        </main>
      </div>

      {/* Global Modals */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <PosSaleModal
        isOpen={isPosModalOpen}
        onClose={() => setIsPosModalOpen(false)}
      />

      {adjustingProduct && (
        <StockAdjustModal
          product={adjustingProduct}
          onClose={() => setAdjustingProduct(null)}
        />
      )}

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        navigate={navigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <InventoryProvider>
      <AppContent />
    </InventoryProvider>
  );
}
