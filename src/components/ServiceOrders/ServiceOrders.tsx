import React from 'react';
import { Plus, Search, Edit3, Trash2, Clock, CheckCircle2, AlertCircle, FileText, Printer, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import OSModal from './OSModal';
import { printServiceOrder, printServiceReceipt } from '../../utils/print';

const ServiceOrders: React.FC = () => {
  const {
    serviceOrders,
    isDarkMode,
    setIsOSModalOpen,
    setEditingOS,
    handleDeleteOS,
    searchQuery,
    setSearchQuery,
    distributorName,
    distributorDescription,
    distributorLabel,
    distributorLogo,
    distributorIcon,
    distributorColor,
    warrantyTerm,
    distributorLogoBlend
  } = useApp();

  const filteredOS = serviceOrders.filter(os =>
    os.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    os.equipment.toLowerCase().includes(searchQuery.toLowerCase()) ||
    os.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    os.technician?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Aprovado': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Concluído': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'Cancelado': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'text-red-500';
      case 'Média': return 'text-amber-500';
      case 'Baixa': return 'text-emerald-500';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Pesquisar OS, cliente ou equipamento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all font-medium",
              isDarkMode 
                ? "bg-slate-900 border-slate-800 focus:border-blue-500 text-white" 
                : "bg-white border-slate-200 focus:border-blue-500 shadow-sm"
            )}
          />
        </div>
        
        <button
          onClick={() => {
            setEditingOS(null);
            setIsOSModalOpen(true);
          }}
          className={cn(
            "w-full md:w-auto p-4 rounded-2xl bg-blue-500 hover:bg-blue-600 flex items-center justify-center gap-2 transition-all font-bold shadow-lg shadow-blue-500/20",
            isDarkMode ? "text-black" : "text-white"
          )}
        >
          <Plus size={20} />
          <span>Nova OS</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "rounded-3xl border overflow-hidden transition-colors duration-300",
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={cn(
                "border-b transition-colors duration-300",
                isDarkMode ? "border-slate-800 bg-slate-800/50" : "border-slate-100 bg-slate-50"
              )}>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">ID / Data</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Cliente / Equipamento</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 hidden sm:table-cell">Prioridade</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 hidden md:table-cell">Valor Est.</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/10">
              {filteredOS.map((os) => (
                <tr
                  key={os.id}
                  className={cn(
                    "group transition-colors",
                    isDarkMode ? "hover:bg-slate-800/40" : "hover:bg-slate-50"
                  )}
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-blue-500">{os.id}</div>
                    <div className="text-[10px] text-slate-500 font-mono uppercase">{new Date(os.entryDate).toLocaleDateString('pt-BR')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-sm tracking-tight">{os.customerName}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 font-bold uppercase">
                      <ShieldCheck size={10} className="text-slate-600" />
                      {os.equipment}
                    </div>
                    <div className="md:hidden text-[9px] text-blue-500 font-black uppercase mt-1">
                      ID: {os.id} | {os.technician || 'S/ Técnico'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-black uppercase border",
                      getStatusColor(os.status)
                    )}>
                      {os.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <div className={cn(
                      "text-xs font-bold flex items-center gap-1",
                      getPriorityColor(os.priority)
                    )}>
                      <AlertCircle size={14} />
                      {os.priority}
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="font-bold text-blue-500">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(os.estimatedCost || 0)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => printServiceOrder(os, distributorName, distributorDescription, distributorLabel, distributorLogo, distributorIcon, distributorColor, distributorLogoBlend)}
                        title="Imprimir OS (Entrada)"
                        className="p-2 hover:bg-slate-500/10 text-slate-500 rounded-xl transition-colors"
                      >
                        <Printer size={18} />
                      </button>
                      {os.status === 'Concluído' && (
                        <button
                          onClick={() => printServiceReceipt(os, distributorName, distributorDescription, distributorLabel, distributorLogo, distributorIcon, distributorColor, warrantyTerm, distributorLogoBlend)}
                          title="Imprimir Recibo / Garantia"
                          className="p-2 hover:bg-emerald-500/10 text-emerald-500 rounded-xl transition-colors"
                        >
                          <ShieldCheck size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditingOS(os);
                          setIsOSModalOpen(true);
                        }}
                        title="Editar"
                        className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-xl transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteOS(os.id)}
                        className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOS.length === 0 && (
            <div className="p-12 text-center text-slate-500">Nenhuma ordem de serviço encontrada.</div>
          )}
        </div>
      </motion.div>
      
      <OSModal />
    </div>
  );
};

export default ServiceOrders;
