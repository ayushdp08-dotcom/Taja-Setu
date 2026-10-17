import React, { useState, useRef, useEffect } from 'react';
import {
  BotMessageSquare,
  Sparkles,
  Send,
  RefreshCw,
  User,
  CheckCircle2,
  AlertTriangle,
  ShoppingCart,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actions?: string[];
  isAi?: boolean;
}

export const AssistantPage: React.FC = () => {
  const {
    businessType,
    profile,
    products,
    criticalExpiringBatches,
    totalLowStock,
    totalWasteCost,
    reorderRecommendations,
    formatCurrency,
  } = useInventory();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'm_welcome',
      sender: 'assistant',
      text: `Hello! I am your TajaSetu AI Copilot for **${profile.businessName}** (${businessType.toUpperCase()}).\n\nI have real-time visibility into your ${products.length} active SKUs, ${criticalExpiringBatches.length} expiring batches, and pending replenishment orders. How can I optimize your stock operations today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions: ['Which products will expire this week?', 'What should I reorder tomorrow?', 'Which products risk the most waste?'],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickPrompts = [
    'Which products will expire this week?',
    'What should I reorder tomorrow?',
    businessType === 'cafe'
      ? 'How much milk will my café need tomorrow?'
      : businessType === 'bakery'
      ? 'Which bakery products should I prepare more of?'
      : 'Which restaurant ingredients may run out?',
    'Which products risk the most waste?',
  ];

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || inputMessage;
    if (!q.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: q.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: q.trim(),
          businessContext: {
            businessType,
            businessName: profile.businessName,
            currency: profile.currency,
            totalProducts: products.length,
            lowStockItems: totalLowStock.map((p) => ({
              name: p.name,
              currentStock: p.currentStock,
              unit: p.unit,
              reorderLevel: p.reorderLevel,
              costPrice: p.costPrice,
              suggestedReorder: reorderRecommendations.find((r) => r.product.id === p.id)?.recommendedQty || 20,
              supplierName: p.supplierName,
            })),
            expiringSoon: criticalExpiringBatches.map((b) => ({
              name: b.product.name,
              quantity: b.batch.quantity,
              unit: b.product.unit,
              batchNumber: b.batch.batchNumber,
              daysLeft: b.daysLeft,
              wasteRiskCost: b.batch.quantity * b.product.costPrice,
            })),
            fastMoving: products.slice(0, 4).map((p) => p.name),
            wasteLoss: formatCurrency(totalWasteCost),
          },
        }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Analysis completed.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: data.actions || ['Check Reorder List', 'View Expiry Calendar'],
        isAi: !data.isAiFallback,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          sender: 'assistant',
          text: `Based on your live stock records, you have ${criticalExpiringBatches.length} batches near their expiry window and ${totalLowStock.length} items below safety stock thresholds. Review the Reorder and Freshness Intelligence tabs for immediate actions.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col justify-between">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <BotMessageSquare className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-zinc-900">AI Business Assistant</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Live operational reasoning grounded in {profile.businessName}'s real-time inventory
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-zinc-900 text-white'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-emerald-600" />}
              </div>

              <div
                className={`max-w-[82%] sm:max-w-[70%] p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                  isUser
                    ? 'bg-zinc-900 text-white rounded-tr-xs'
                    : 'bg-zinc-50 border border-zinc-200/70 text-zinc-800 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-line font-medium">{msg.text}</div>

                {msg.actions && msg.actions.length > 0 && (
                  <div className="pt-2 border-t border-zinc-200/60 flex flex-wrap gap-1.5">
                    {msg.actions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(act)}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-emerald-800 hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                      >
                        {act}
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[10px] text-right ${
                    isUser ? 'text-zinc-400' : 'text-zinc-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2.5 text-xs text-zinc-500 bg-zinc-50 p-3 rounded-2xl w-fit border border-zinc-200">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
            <span>TajaSetu AI is analyzing your inventory velocity...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="shrink-0 px-3 py-1.5 rounded-full bg-white border border-zinc-200 hover:border-emerald-500 hover:bg-emerald-50 text-zinc-700 hover:text-emerald-900 transition-colors text-[11px] font-medium shadow-2xs"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="bg-white rounded-2xl p-2 pl-4 border border-zinc-200/90 shadow-sm flex items-center gap-2"
      >
        <input
          type="text"
          placeholder={`Ask anything about ${profile.businessName}'s inventory, demand forecasts, or food waste...`}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 text-xs outline-hidden text-zinc-800"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() || loading}
          className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
