import React from 'react';
import { Search, Bell, Sun, Moon, User, LayoutGrid, Calculator } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';

const Header: React.FC = () => {
  const { 
    isDarkMode, 
    setIsDarkMode, 
    searchQuery, 
    setSearchQuery, 
    currentUser,
    activeTab,
    setIsCalculatorOpen,
    setIsNotificationsOpen,
    logs
  } = useApp();

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Painel de Controle';
      case 'inventory': return 'Gestão de Estoque';
      case 'sales': return 'Ponto de Venda';
      case 'customers': return 'Base de Clientes';
      case 'os': return 'Centro de Serviços';
      case 'logs': return 'Histórico do Sistema';
      case 'users': return 'Gestão de Acesso';
      case 'settings': return 'Configurações Globais';
      default: return 'Estoque Fácil';
    }
  };

  return (
    <header className={cn(
      "h-16 px-8 flex items-center justify-between sticky top-0 z-30",
      isDarkMode 
        ? "bg-zinc-950 border-b border-zinc-900 shadow-md" 
        : "bg-white border-b border-zinc-100 shadow-sm"
    )}>
      <div className="flex items-center gap-1.5 flex-1">
        <h2 className={cn(
          "text-sm md:text-lg font-bold uppercase tracking-tight mr-4 md:mr-8 truncate max-w-[120px] md:max-w-none",
          isDarkMode ? "text-white" : "text-zinc-900"
        )}>
          {getPageTitle()}
        </h2>
        
        {/* Universal Search Bar (Contextual) - Hidden on mobile, use view search */}
        {['inventory', 'sales', 'customers', 'os', 'logs'].includes(activeTab) && (
          <div className="relative w-full max-w-xs group hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-2 rounded-lg border outline-none transition-all duration-200 text-xs",
                isDarkMode 
                  ? "bg-zinc-900 border-zinc-800 text-white focus:border-blue-500" 
                  : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-blue-500"
              )}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-2 p-1 rounded-lg md:p-1.5 md:rounded-xl bg-zinc-500/5 border border-zinc-500/10">
          <button 
            onClick={() => setIsCalculatorOpen(prev => !prev)}
            className={cn(
              "p-2 md:p-2.5 rounded-lg transition-all duration-200",
              isDarkMode ? "text-zinc-500 hover:text-white" : "text-zinc-500 hover:text-zinc-900"
            )}
            title="Calculadora"
          >
            <Calculator size={16} />
          </button>
          <button 
            onClick={() => setIsNotificationsOpen(prev => !prev)}
            className={cn(
              "p-2 md:p-2.5 rounded-lg transition-all duration-200 relative",
              isDarkMode ? "text-zinc-500 hover:text-white" : "text-zinc-500 hover:text-zinc-900"
            )}
            title="Notificações"
          >
            <Bell size={16} />
            {logs.length > 0 && (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-zinc-950" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-4 md:pl-6 md:border-l md:border-zinc-500/20">
          <div className="text-right hidden md:flex flex-col justify-center">
            <span className={cn(
              "text-xs font-black uppercase tracking-tight leading-none",
              isDarkMode ? "text-white" : "text-zinc-900"
            )}>
              {currentUser?.name}
            </span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
              {currentUser?.role || 'User'}
            </span>
          </div>
          
          <div className={cn(
            "w-8 h-8 md:w-9 md:h-9 rounded-lg overflow-hidden flex items-center justify-center border transition-all duration-300 group cursor-pointer",
            isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-zinc-50 border-zinc-200"
          )}>
            <div className="w-6 h-6 md:w-7 md:h-7 rounded bg-zinc-700 flex items-center justify-center">
              <User size={12} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
