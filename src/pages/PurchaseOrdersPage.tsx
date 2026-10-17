import React from 'react';
import {
  FileText,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Package,
  Layers,
  Calendar,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

interface PurchaseOrdersPageProps {
  navigate: (route: string) => void;
}

export const PurchaseOrdersPage: React.FC<PurchaseOrdersPageProps> = ({ navigate }) => {
  const { purchaseOrders, updatePOStatus, formatCurrency } = useInventory();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'received':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Stock Received</span>
          </span>
        );
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <Truck className="w-3 h-3 text-blue-600" />
            <span>Sent / In Transit</span>
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Vendor Confirmed</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Purchase Orders & Inbound Shipments
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Track purchase orders sent to suppliers. Marking an order "Received" automatically replenishes inventory on-hand.
          </p>
        </div>

        <button
          onClick={() => navigate('reorder')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New PO from Recommendations</span>
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {purchaseOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-zinc-200">
            <FileText className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-zinc-900">No Purchase Orders Created Yet</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              Generate purchase orders directly from your Smart Reorder Recommendations tab.
            </p>
          </div>
        ) : (
          purchaseOrders.map((po) => {
            const isReceived = po.status === 'received';

            return (
              <div
                key={po.id}
                className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs hover:border-zinc-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-zinc-900 font-mono flex items-center gap-2">
                        <span>{po.poNumber}</span>
                        {getStatusBadge(po.status)}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        Vendor: <strong className="text-zinc-800">{po.supplierName}</strong> • Created: {new Date(po.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 font-semibold uppercase">TOTAL AMOUNT</span>
                    <div className="text-base font-extrabold font-mono text-zinc-900">
                      {formatCurrency(po.totalAmount)}
                    </div>
                  </div>
                </div>

                {/* Items in PO */}
                <div className="bg-zinc-50/70 rounded-xl p-3 border border-zinc-100 space-y-2">
                  <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    ITEMS ORDERED
                  </div>
                  <div className="space-y-1.5">
                    {po.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-white border border-zinc-100"
                      >
                        <div className="font-semibold text-zinc-900">{item.productName}</div>
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-zinc-700">
                            {item.quantity} {item.unit} @ {formatCurrency(item.unitCost)}
                          </span>
                          <span className="font-mono font-bold text-zinc-900">
                            {formatCurrency(item.totalCost)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer with actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Expected Delivery: <strong className="text-zinc-800">{po.expectedDeliveryDate}</strong></span>
                  </div>

                  {!isReceived ? (
                    <button
                      onClick={() => updatePOStatus(po.id, 'received')}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors flex items-center justify-center gap-1.5 self-end sm:self-auto"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Receive Shipment (Auto-Replenish Stock)</span>
                    </button>
                  ) : (
                    <div className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Received & Stock Updated ({new Date(po.receivedAt || '').toLocaleDateString()})</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
