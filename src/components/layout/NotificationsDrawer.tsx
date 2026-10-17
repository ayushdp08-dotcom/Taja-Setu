import React from 'react';
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Trash2,
  FileText,
  Boxes,
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (route: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  navigate,
}) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useInventory();

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: string, severity: string) => {
    if (severity === 'critical') return <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />;
    if (severity === 'warning') return <Clock className="w-4 h-4 text-amber-600 shrink-0" />;
    if (severity === 'success') return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
    if (type === 'purchase_order') return <FileText className="w-4 h-4 text-blue-600 shrink-0" />;
    return <Boxes className="w-4 h-4 text-zinc-500 shrink-0" />;
  };

  const formatTime = (isoString: string) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-2xs transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-zinc-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-zinc-900">Notification Center</h3>
                <p className="text-xs text-zinc-500">
                  {unreadCount > 0 ? `${unreadCount} unread inventory alerts` : 'All caught up!'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium px-2 py-1 rounded-md hover:bg-emerald-50 transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {notifications.length === 0 ? (
              <div className="text-center py-12 px-4">
                <Bell className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
                <p className="text-xs text-zinc-500">No active alerts at this moment.</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    markNotificationRead(item.id);
                    if (item.linkRoute) {
                      navigate(item.linkRoute.replace('/', ''));
                      onClose();
                    }
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    !item.isRead
                      ? 'bg-zinc-50/90 border-zinc-200 hover:border-emerald-300 shadow-2xs'
                      : 'bg-white border-zinc-100 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getIcon(item.type, item.severity)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="text-xs font-semibold text-zinc-900 truncate">{item.title}</h4>
                        <span className="text-[10px] text-zinc-400 shrink-0">
                          {formatTime(item.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 leading-relaxed">{item.message}</p>
                      {item.linkRoute && (
                        <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                          <span>Take Action</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Notification settings footer */}
          <div className="p-3 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between text-xs text-zinc-500">
            <span>Push alerts active</span>
            <button
              onClick={() => {
                navigate('settings');
                onClose();
              }}
              className="text-emerald-600 hover:underline font-medium"
            >
              Alert Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
