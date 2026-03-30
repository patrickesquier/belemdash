import {
  LayoutDashboard, Package, ShoppingCart, Users, User,
  Wrench, FileText, Settings, Moon, Sun, Power, LogOut,
  ChevronRight, ChevronDown
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import belemLogo from '../../assets/belem-ti-logo.png';

const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isDarkMode,
    setIsDarkMode,
    handleLogout,
    currentUser,
    enableServices,
    appName,
    distributorColor
  } = useApp();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Estoque', icon: Package },
    { id: 'sales', label: 'Vendas', icon: ShoppingCart },
    { id: 'customers', label: 'Clientes', icon: Users },
    ...(enableServices ? [{ id: 'os', label: 'Ordens de Serviço', icon: Wrench }] : []),
    ...(currentUser?.role === 'admin' ? [{ id: 'logs', label: 'Audit / Logs', icon: FileText }] : []),
    ...(currentUser?.role === 'admin' || currentUser?.role === 'supervisor' ? [{ id: 'users', label: 'Usuários', icon: User }] : []),
    ...(currentUser?.role === 'admin' || currentUser?.role === 'supervisor' ? [{ id: 'sellers', label: 'Vendedores', icon: Users }] : []),
    ...(currentUser?.role === 'admin' ? [{ id: 'settings', label: 'Configurações', icon: Settings }] : []),
  ];

  return (
    <aside className={cn(
      "fixed left-0 top-0 bottom-0 w-64 z-40 border-r hidden md:flex flex-col",
      isDarkMode
        ? "bg-[#020617] border-slate-800/60 shadow-2xl shadow-black/50"
        : "bg-white border-slate-100 shadow-sm"
    )}>
      {/* Sidebar Header */}
      <div className="p-8 pb-4">
        <div className="flex items-center gap-4 group">
          <div className="relative">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 overflow-hidden p-2"
              style={{ backgroundColor: `${distributorColor}25` }}
            >
              <img
                src={belemLogo}
                alt="Logo Belém TI"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#020617] rounded-lg flex items-center justify-center border-2 border-slate-800 group-hover:bg-blue-600 transition-colors">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse group-hover:bg-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-bold uppercase truncate max-w-[140px]">
              {appName}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Sistema PDV</span>
              <div className="w-1 h-1 bg-slate-700 rounded-full" />
              <span className="text-[9px] font-bold text-slate-600">v2.4.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-5 py-8 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)] custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? (isDarkMode ? "bg-slate-800/80 text-white" : "bg-slate-100 text-slate-900")
                  : (isDarkMode ? "text-slate-500 hover:text-slate-200 hover:bg-slate-800/40" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50")
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                isActive
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-600/25"
                  : "bg-slate-500/5 group-hover:bg-slate-500/10"
              )}>
                <Icon size={20} className={cn("transition-transform duration-500", isActive && "scale-110")} />
              </div>

              <span className={cn(
                "text-sm font-bold tracking-tight transition-colors duration-300",
                isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"
              )}>
                {item.label}
              </span>

              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1.5 h-6 bg-blue-600 rounded-r-full"
                />
              )}

              {!isActive && (
                <ChevronRight className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-slate-600" size={14} />
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800/50">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-white uppercase">
            {currentUser?.name.charAt(0)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-300 truncate uppercase">{currentUser?.name}</span>
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none">
              {currentUser?.role}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-all duration-200",
              isDarkMode
                ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                : "bg-white border-slate-200 text-slate-500 hover:text-slate-900"
            )}
          >
            {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
            <span className="text-[9px] font-bold uppercase">Tema</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
            title="Sair"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
