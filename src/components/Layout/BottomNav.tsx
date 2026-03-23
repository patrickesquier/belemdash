import React from 'react';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, User, 
  Wrench, FileText, Settings, Menu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const BottomNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isDarkMode, 
    currentUser,
    enableServices,
    distributorColor
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const mainItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'inventory', label: 'Estoque', icon: Package },
    { id: 'sales', label: 'Vendas', icon: ShoppingCart },
    { id: 'customers', label: 'Clientes', icon: Users },
  ];

  const moreItems = [
    ...(enableServices ? [{ id: 'os', label: 'Ordens de Serviço', icon: Wrench }] : []),
    ...(currentUser?.role === 'admin' ? [{ id: 'logs', label: 'Audit / Logs', icon: FileText }] : []),
    ...(currentUser?.role === 'admin' || currentUser?.role === 'supervisor' ? [{ id: 'users', label: 'Usuários', icon: User }] : []),
    ...(currentUser?.role === 'admin' ? [{ id: 'settings', label: 'Configurações', icon: Settings }] : []),
  ];

  return (
    <>
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 z-50 md:hidden border-t safe-area-bottom pb-2",
        isDarkMode ? "bg-zinc-950/80 backdrop-blur-xl border-zinc-900" : "bg-white/80 backdrop-blur-xl border-zinc-100"
      )}>
        <div className="flex items-center justify-around h-16 px-4">
          {mainItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMenuOpen(false);
                }}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 transition-all relative px-3",
                  isActive 
                    ? "text-blue-500" 
                    : (isDarkMode ? "text-zinc-500" : "text-zinc-400")
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="bottom-nav-active"
                    className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-blue-500"
                  />
                )}
                <Icon size={20} className={cn("transition-transform duration-300", isActive && "scale-110")} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-all px-3",
              isMenuOpen || moreItems.some(i => i.id === activeTab)
                ? "text-blue-500" 
                : (isDarkMode ? "text-zinc-500" : "text-zinc-400")
            )}
          >
             <Menu size={20} className={cn("transition-transform duration-300", isMenuOpen && "rotate-90")} />
             <span className="text-[10px] font-bold uppercase tracking-tighter">Mais</span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className={cn(
              "fixed bottom-20 left-4 right-4 z-50 rounded-2xl border shadow-2xl p-4 md:hidden overflow-hidden",
              isDarkMode ? "bg-zinc-900/90 backdrop-blur-2xl border-zinc-800" : "bg-white/90 backdrop-blur-2xl border-zinc-200"
            )}
          >
            <div className="grid grid-cols-2 gap-3">
              {moreItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl transition-all",
                      isActive 
                        ? "bg-blue-500 text-white" 
                        : (isDarkMode ? "bg-zinc-800/50 text-zinc-400" : "bg-zinc-100 text-zinc-600")
                    )}
                  >
                    <Icon size={18} />
                    <span className="text-xs font-bold truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
            <div 
              className="absolute inset-0 pointer-events-none opacity-5 shadow-[inset_0_0_80px_rgba(59,130,246,0.3)]"
              style={{ background: `radial-gradient(circle at bottom right, ${distributorColor}40, transparent)` }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default BottomNav;
