import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useApp } from './context/AppContext';
import { cn } from './lib/utils';

// Layout Components
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import BottomNav from './components/Layout/BottomNav';

// Feature Modules
import Dashboard from './components/Dashboard/Dashboard';
import Inventory from './components/Inventory/Inventory';
import Sales from './components/Sales/Sales';
import Customers from './components/Customers/Customers';
import ServiceOrders from './components/ServiceOrders/ServiceOrders';
import Users from './components/Users/Users';
import Settings from './components/Settings/Settings';
import Logs from './components/Logs/Logs';

// Auth
import Login from './components/Auth/Login';

// Overlays
import Calculator from './components/Shared/Calculator';
import NotificationsPanel from './components/Shared/NotificationsPanel';

// Feedback
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const App: React.FC = () => {
  const { 
    currentUser, 
    activeTab, 
    isDarkMode, 
    notification, 
    setNotification,
    isDataLoaded
  } = useApp();

  if (!isDataLoaded) {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center flex-col gap-6",
        isDarkMode ? "bg-zinc-950 text-white" : "bg-white text-zinc-900"
      )}>
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-black uppercase tracking-widest text-zinc-500 animate-pulse">
          Carregando Universo...
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <Inventory />;
      case 'sales': return <Sales />;
      case 'customers': return <Customers />;
      case 'os': return <ServiceOrders />;
      case 'users': return <Users />;
      case 'settings': return <Settings />;
      case 'logs': return <Logs />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className={cn(
      "min-h-screen",
      isDarkMode ? "bg-zinc-950 text-white" : "bg-white text-zinc-900"
    )}>
      {/* Main Layout */}
      <Sidebar />
      
      <main className="pl-0 md:pl-64 flex flex-col min-h-screen">
        <Header />
        
        <div className="flex-1 p-4 md:p-8 overflow-y-auto max-h-[calc(100vh-64px)] pb-24 md:pb-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {renderActiveTab()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <NotificationsPanel />
      <Calculator />
      <BottomNav />

      {/* Global Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]"
          >
            <div className={cn(
              "px-5 py-3 rounded-xl shadow-xl flex items-center gap-4 border min-w-[300px]",
              notification.type === 'success' 
                ? "bg-emerald-600 border-emerald-500 text-white" 
                : "bg-red-600 border-red-500 text-white"
            )}>
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold uppercase tracking-tight">{notification.message}</p>
                <p className="text-[9px] opacity-80 font-bold uppercase tracking-widest leading-none mt-0.5">
                  Notificação do Sistema
                </p>
              </div>
              <button 
                onClick={() => setNotification(null)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
