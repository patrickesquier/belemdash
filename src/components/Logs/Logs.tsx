import React from 'react';
import { FileText, Search, Clock, User, Filter, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import { Sale } from '../../types';

const Logs: React.FC = () => {
  const {
    logs,
    isDarkMode,
    searchQuery,
    setSearchQuery,
    handleRestoreSale,
    showNotification
  } = useApp();

  const filteredLogs = logs.filter(log =>
    log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActionColor = (action: string) => {
    if (action.includes('create')) return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    if (action.includes('delete')) return "bg-red-500/10 text-red-500 border-red-500/20";
    if (action.includes('update')) return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    if (action.includes('revert') || action.includes('restore')) return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    return "bg-slate-500/10 text-slate-500 border-slate-500/20";
  };

  const onRestoreSale = (sale: Sale) => {
    if (window.confirm('Deseja restaurar esta venda? O estoque será ajustado novamente.')) {
      handleRestoreSale(sale);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="group flex flex-col">
          <h2 className="text-2xl font-black uppercase tracking-tighter">Histórico de Atividades</h2>
          <p className="text-xs text-slate-500 font-medium">Logs detalhados de todas as ações no sistema</p>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Pesquisar histórico..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-11 pr-4 py-3 rounded-2xl border outline-none transition-all text-sm font-medium",
              isDarkMode 
                ? "bg-slate-900 border-slate-800 focus:border-blue-500 text-white" 
                : "bg-white border-slate-200 focus:border-blue-500 shadow-sm"
            )}
          />
        </div>
      </div>

      <div className={cn(
        "rounded-3xl border overflow-hidden",
        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      )}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={cn(
                "border-b",
                isDarkMode ? "border-slate-800 bg-slate-800/50" : "border-slate-100 bg-slate-50"
              )}>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Evento / Data</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hidden sm:table-cell">Colaborador</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Detalhes da Ação</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/10">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className={cn(
                    "group transition-colors",
                    isDarkMode ? "hover:bg-slate-800/40" : "hover:bg-slate-50"
                  )}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <span className={cn(
                        "px-2 py-0.5 rounded-md text-[9px] font-black uppercase border w-fit",
                        getActionColor(log.action)
                      )}>
                        {log.action.replace('_', ' ')}
                      </span>
                      <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-mono uppercase font-bold">
                        {new Date(log.timestamp).toLocaleString('pt-BR')}
                      </div>
                      <div className="sm:hidden text-[9px] text-blue-500 font-black uppercase">
                        @{log.userName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black",
                        isDarkMode ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-400"
                      )}>
                        {log.userName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-bold">{log.userName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors leading-relaxed">
                      {log.details}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {log.action === 'delete_sale' && log.payload && (
                      <button
                        onClick={() => onRestoreSale(log.payload)}
                        className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-xl transition-all group/btn flex items-center gap-2 ml-auto"
                        title="Restaurar Venda Excluída"
                      >
                        <RotateCcw size={16} className="group-hover/btn:rotate-[-45deg] transition-transform" />
                        <span className="text-[10px] font-black uppercase hidden group-hover/btn:block">Restaurar</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLogs.length === 0 && (
            <div className="p-20 text-center text-slate-500 italic flex flex-col items-center gap-3">
              <FileText size={40} className="opacity-20" />
              Nenhum registro encontrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Logs;
