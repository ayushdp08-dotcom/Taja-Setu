import React, { useState } from 'react';
import {
  Truck,
  Phone,
  Mail,
  MapPin,
  Clock,
  DollarSign,
  Plus,
  ShieldCheck,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { Supplier } from '../types';

export const SuppliersPage: React.FC = () => {
  const { suppliers, formatCurrency } = useInventory();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Supplier Directory & Vendor Partners
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage vendor lead times, minimum order values, contact details, and fulfillment reliability scores.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Supplier</span>
        </button>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:border-zinc-300 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {supplier.category}
                </span>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{supplier.reliabilityScore}% Reliability</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-zinc-900">{supplier.name}</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Contact: {supplier.contactPerson}</p>

              {/* Contact info */}
              <div className="mt-4 pt-3 border-t border-zinc-100 space-y-2 text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="font-mono">{supplier.phone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{supplier.email}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{supplier.address}</span>
                </div>
              </div>

              {/* Order Terms Grid */}
              <div className="my-4 p-3 rounded-xl bg-zinc-50 border border-zinc-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase">LEAD TIME</span>
                  <div className="font-bold text-zinc-900 mt-0.5">
                    {supplier.leadTimeDays} Day(s)
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase">MIN ORDER</span>
                  <div className="font-bold font-mono text-zinc-900 mt-0.5">
                    {formatCurrency(supplier.minOrderValue)}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
              <span>Terms: <strong className="text-zinc-700">{supplier.paymentTerms}</strong></span>
              <span className="text-emerald-700 font-semibold">Active Vendor</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-zinc-200 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-zinc-900">Add New Supplier Partner</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-500 mb-4">
              Vendor profiles help calculate exact lead-time demand buffers and replenishment dates.
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-zinc-700">Vendor / Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Heritage Farm Organics"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-700">Category</label>
                <input
                  type="text"
                  placeholder="e.g. Dairy / Fresh Produce"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-zinc-700">Lead Time (Days)</label>
                  <input
                    type="number"
                    defaultValue={2}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-700">Phone</label>
                  <input
                    type="text"
                    defaultValue="+91 98450 12345"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 mt-1"
                  />
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Supplier partner registered successfully!');
                  setShowAddModal(false);
                }}
                className="px-5 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-xs"
              >
                Save Supplier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
