import React from 'react';
import { X, ShoppingCart, User, AlertCircle, Info, ArrowRight, Package, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import { LogEntry } from '../../types';

const NotificationsPanel: React.FC = () => {
  const { isNotificationsOpen, setIsNotificationsOpen, isDarkMode, logs } = useApp();

  const getLogIcon = (action: LogEntry['action']) => {
    switch (action) {
      case 'create_sale': 
      case 'update_sale':
      case 'delete_sale': return <ShoppingCart size={14} className="text-blue-500" />;
      case 'login':
      case 'logout': return <User size={14} className="text-zinc-500" />;
      case 'create_product':
      case 'update_product':
      case 'delete_product': return <Package size={14} className="text-emerald-500" />;
      case 'create_os':
      case 'update_os':
      case 'delete_os': return <Wrench size={14} className="text-amber-500" />;
      case 'error': return <AlertCircle size={14} className="text-red-500" />;
      default: return <Info size={14} className="text-blue-400" />;
    }
  };

  const recentLogs = [...logs].reverse().slice(0, 10);

  if (!isNotificationsOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/20"
        onClick={() => setIsNotificationsOpen(false)}
      />

      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        className={cn(
          "fixed right-0 top-0 bottom-0 w-80 z-[60] border-l shadow-2xl flex flex-col",
          isDarkMode ? "bg-zinc-950 border-zinc-900" : "bg-white border-zinc-100"
        )}
      >
        <div className="p-6 border-b border-zinc-500/10 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Notificações</h3>
          <button 
            onClick={() => setIsNotificationsOpen(false)}
            className="p-1 hover:bg-zinc-500/10 rounded-lg transition-colors"
          >
            <X size={16} className="text-zinc-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {recentLogs.length === 0 ? (
            <div className="text-center py-10 opacity-30 flex flex-col items-center gap-2">
              <Info size={40} />
              <p className="text-[10px] font-bold uppercase">Sem registros recentes</p>
            </div>
          ) : (
            recentLogs.map((log, i) => (
              <div 
                key={log.id} 
                className={cn(
                  "p-4 rounded-xl border transition-all duration-300",
                  isDarkMode ? "bg-zinc-900 border-zinc-900 hover:border-zinc-800" : "bg-zinc-50 border-zinc-100 hover:border-zinc-200"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-zinc-500/10">
                    {getLogIcon(log.action)}
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">
                    {new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors">
                  {log.details}
                </p>
              </div>
            ))
          )}
        </div>

        {recentLogs.length > 0 && (
          <div className="p-6 border-t border-zinc-500/10">
            <button 
              onClick={() => {
                // Should navigate to logs tab
                setIsNotificationsOpen(false);
              }}
              className="w-full py-3 rounded-lg border border-zinc-500/10 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-500/5 transition-all flex items-center justify-center gap-2"
            >
              Ver Tudo <ArrowRight size={12} />
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default NotificationsPanel;
