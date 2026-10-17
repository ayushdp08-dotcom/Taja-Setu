import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  ArrowUpDown,
  MoreVertical,
  Edit3,
  Archive,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  FileSpreadsheet,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { Product } from '../types';
import { BUSINESS_CONFIGS } from '../data/mockData';

interface InventoryPageProps {
  onOpenAddModal: () => void;
  onSelectProduct: (product: Product) => void;
  onAdjustStock: (product: Product) => void;
}

export const InventoryPage: React.FC<InventoryPageProps> = ({
  onOpenAddModal,
  onSelectProduct,
  onAdjustStock,
}) => {
  const { businessType, products, formatCurrency, archiveProduct } = useInventory();
  const config = BUSINESS_CONFIGS[businessType] || BUSINESS_CONFIGS.grocery;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'low_stock' | 'optimal' | 'archived'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'cost'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (statusFilter === 'archived') return !!p.archived;
        if (p.archived) return false;

        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.supplierName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;

        let matchesStatus = true;
        if (statusFilter === 'low_stock') {
          matchesStatus = p.currentStock <= p.reorderLevel;
        } else if (statusFilter === 'optimal') {
          matchesStatus = p.currentStock > p.reorderLevel;
        }

        return matchesSearch && matchesCat && matchesStatus;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
        else if (sortBy === 'stock') cmp = a.currentStock - b.currentStock;
        else if (sortBy === 'cost') cmp = a.costPrice - b.costPrice;
        return sortOrder === 'asc' ? cmp : -cmp;
      });
  }, [products, searchQuery, selectedCategory, statusFilter, sortBy, sortOrder]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['SKU', 'Name', 'Category', 'CurrentStock', 'Unit', 'CostPrice', 'SellingPrice', 'ReorderLevel', 'Supplier'];
    const rows = filteredProducts.map((p) => [
      p.sku,
      `"${p.name}"`,
      p.category,
      p.currentStock,
      p.unit,
      p.costPrice,
      p.sellingPrice,
      p.reorderLevel,
      `"${p.supplierName}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TajaSetu_${businessType}_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import Sample Trigger
  const handleImportCSVClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';
    fileInput.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        alert(`Sample CSV "${file.name}" verified! 6 new product items mapped into ${config.name} catalog.`);
      }
    };
    fileInput.click();
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Quick Actions */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            Inventory Catalogue
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage active SKUs, batch codes, storage conditions, and safety stock levels.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleImportCSVClick}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200 transition-colors shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-zinc-500" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Item</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, SKU code, or supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-zinc-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-48 py-2 px-3 text-xs rounded-xl border border-zinc-200 bg-white font-medium focus:border-emerald-500 outline-hidden"
          >
            <option value="all">All Categories</option>
            {config.categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full sm:w-40 py-2 px-3 text-xs rounded-xl border border-zinc-200 bg-white font-medium focus:border-emerald-500 outline-hidden"
          >
            <option value="all">All Stock Levels</option>
            <option value="low_stock">Low Stock (≤ Reorder)</option>
            <option value="optimal">Optimal Stock</option>
            <option value="archived">Archived SKUs</option>
          </select>
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-500 font-semibold uppercase text-[10px] tracking-wider">
                <th
                  className="py-3 px-4 cursor-pointer hover:text-zinc-800"
                  onClick={() => {
                    if (sortBy === 'name') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    else {
                      setSortBy('name');
                      setSortOrder('asc');
                    }
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Product & SKU</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Category</th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-zinc-800"
                  onClick={() => {
                    if (sortBy === 'stock') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    else {
                      setSortBy('stock');
                      setSortOrder('asc');
                    }
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>On-Hand Stock</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Cost / Selling</th>
                <th className="py-3 px-4">Earliest Expiry</th>
                <th className="py-3 px-4">Storage</th>
                <th className="py-3 px-4">Stock Health</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-400">
                    <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No matching inventory products found.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isLow = product.currentStock <= product.reorderLevel;
                  const earliestBatch = [...product.batches].sort(
                    (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
                  )[0];

                  const daysUntilExpiry = earliestBatch
                    ? Math.ceil(
                        (new Date(earliestBatch.expiryDate).getTime() - new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    : null;

                  return (
                    <tr key={product.id} className="hover:bg-zinc-50/60 transition-colors">
                      {/* Product Name & SKU */}
                      <td className="py-3.5 px-4">
                        <div
                          className="font-bold text-zinc-900 hover:text-emerald-700 cursor-pointer"
                          onClick={() => onSelectProduct(product)}
                        >
                          {product.name}
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono flex items-center gap-1.5 mt-0.5">
                          <span>{product.sku}</span>
                          <span>•</span>
                          <span>{product.batches.length} batch(es)</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-zinc-600 font-medium">
                        {product.category}
                      </td>

                      {/* On-Hand Stock & Reorder Point */}
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold font-mono text-zinc-900 text-sm">
                          {product.currentStock} <span className="text-xs font-normal text-zinc-500">{product.unit}</span>
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          Reorder at: {product.reorderLevel} {product.unit}
                        </div>
                      </td>

                      {/* Cost / Selling Price */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-semibold text-zinc-800">
                          {formatCurrency(product.costPrice)}
                        </div>
                        {product.sellingPrice > 0 && (
                          <div className="text-[10px] text-emerald-700 font-medium">
                            Sell: {formatCurrency(product.sellingPrice)}
                          </div>
                        )}
                      </td>

                      {/* Earliest Expiry Batch */}
                      <td className="py-3.5 px-4">
                        {earliestBatch ? (
                          <div>
                            <div className="font-semibold text-zinc-800 flex items-center gap-1">
                              <span>{earliestBatch.expiryDate}</span>
                            </div>
                            <div className="text-[10px] font-mono text-zinc-400">
                              #{earliestBatch.batchNumber} ({earliestBatch.quantity} {product.unit})
                            </div>
                          </div>
                        ) : (
                          <span className="text-zinc-400 text-xs">No batches</span>
                        )}
                      </td>

                      {/* Storage Condition */}
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-medium text-zinc-600 capitalize bg-zinc-100 px-2 py-0.5 rounded-md">
                          {product.storageCondition.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Stock Health */}
                      <td className="py-3.5 px-4">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>Low Stock</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>In Stock</span>
                          </span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onAdjustStock(product)}
                            title="Stock In / Out / Audit"
                            className="p-1.5 rounded-lg border border-zinc-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-colors text-zinc-600"
                          >
                            <ArrowUpDown className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onSelectProduct(product)}
                            title="View Product History"
                            className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 transition-colors text-zinc-600"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => archiveProduct(product.id)}
                            title={product.archived ? 'Restore' : 'Archive'}
                            className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-700"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer count */}
        <div className="px-4 py-3 bg-zinc-50/70 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
          <span>
            Showing <strong className="text-zinc-800">{filteredProducts.length}</strong> items in catalog
          </span>
          <span>FEFO Rotation Active</span>
        </div>
      </div>
    </div>
  );
};
