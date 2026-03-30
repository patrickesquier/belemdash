import React, { useState } from 'react';
import { History, Printer, Edit3, Trash2, QrCode, CreditCard, Banknote, Search, FileDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import { Sale } from '../../types';
import { printSalesReport, printSaleReceipt } from '../../utils/print';

const SalesHistory: React.FC = () => {
  const {
    sales,
    isDarkMode,
    currentUser,
    handleDeleteSale,
    handleEditSale,
    distributorName,
    distributorDescription,
    distributorLabel,
    distributorLogo,
    distributorIcon,
    distributorColor,
    distributorLogoBlend,
    searchQuery,
    setSearchQuery,
    warrantyTerm
  } = useApp();

  const [selectedSaleForHistory, setSelectedSaleForHistory] = useState<Sale | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const filteredSales = sales.filter(s => 
    s.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.seller.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input
            type="text"
            placeholder="Pesquisar vendas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-10 pr-4 py-2 rounded-lg border outline-none font-medium text-xs",
              isDarkMode 
                ? "bg-slate-900 border-slate-800 text-white" 
                : "bg-slate-50 border-slate-200"
            )}
          />
        </div>
        
        <button
          onClick={() => printSalesReport(sales, distributorName, distributorDescription, distributorLabel, distributorLogo, distributorIcon, distributorColor, distributorLogoBlend)}
          className={cn(
            "w-full md:w-auto px-4 py-2 rounded-lg border flex items-center justify-center gap-2 font-bold text-xs",
            isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          )}
        >
          <FileDown size={20} />
          <span>Relatório de Vendas</span>
        </button>
      </div>

      <div
        className={cn(
          "rounded-xl border overflow-hidden",
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
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Data</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 hidden sm:table-cell">Vendedor</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 hidden md:table-cell">Pagamento</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Total</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/10">
              {filteredSales.map((sale) => (
                <tr
                  key={sale.id}
                  className={cn(
                    "group transition-colors",
                    isDarkMode ? "hover:bg-slate-800/40" : "hover:bg-slate-50",
                    sale.status === 'cancelled' && "opacity-60 grayscale-[0.5]"
                  )}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">{new Date(sale.timestamp).toLocaleString('pt-BR')}</span>
                      {sale.status === 'cancelled' && (
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Cancelada</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-sm tracking-tight">{sale.customerName || 'Cliente Balcão'}</div>
                    <div className="text-[10px] text-slate-500 font-mono uppercase truncate max-w-[80px]">{sale.id}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500 hidden sm:table-cell">{sale.seller}</td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      {sale.paymentMethod === 'PIX' && <QrCode size={14} className="text-emerald-500" />}
                      {sale.paymentMethod === 'Cartão' && <CreditCard size={14} className="text-blue-500" />}
                      {sale.paymentMethod === 'Dinheiro' && <Banknote size={14} className="text-amber-500" />}
                      <span className={cn(
                        sale.paymentMethod === 'PIX' ? "text-emerald-500" :
                        sale.paymentMethod === 'Cartão' ? "text-blue-500" : "text-amber-500"
                      )}>
                        {sale.paymentMethod}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-slate-500 line-through decoration-slate-500/50">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.totalValue)}
                    </div>
                    <div className="font-bold text-blue-500">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.finalValue)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setSelectedSaleForHistory(sale);
                          setIsHistoryModalOpen(true);
                        }}
                        title="Ver Histórico"
                        className="p-2 hover:bg-slate-500/10 text-slate-500 rounded-xl transition-colors"
                      >
                        <History size={18} />
                      </button>
                      <button
                        onClick={() => printSaleReceipt(
                          sale, 
                          distributorName, 
                          distributorDescription, 
                          distributorLabel, 
                          distributorLogo, 
                          distributorIcon, 
                          distributorColor, 
                          warrantyTerm,
                          distributorLogoBlend
                        )}
                        title="Imprimir Comprovante / Garantia"
                        className="p-2 hover:bg-slate-500/10 text-slate-500 rounded-xl transition-colors"
                      >
                        <Printer size={18} />
                      </button>
                      {currentUser?.role !== 'user' && (
                        <button
                          onClick={() => {
                            if (sale.status === 'cancelled') return;
                            handleEditSale(sale);
                          }}
                          disabled={sale.status === 'cancelled'}
                          className={cn(
                            "p-2 rounded-xl transition-colors",
                            sale.status === 'cancelled' 
                              ? "text-slate-700 cursor-not-allowed" 
                              : "hover:bg-blue-500/10 text-blue-500"
                          )}
                          title="Editar"
                        >
                          <Edit3 size={18} />
                        </button>
                      )}
                      {(currentUser?.role === 'admin' || (currentUser?.role === 'supervisor' && sale.status !== 'cancelled')) && (
                        <button
                          onClick={() => handleDeleteSale(sale)}
                          className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-colors"
                          title={sale.status === 'cancelled' ? "Excluir Permanentemente" : "Cancelar Venda"}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredSales.length === 0 && (
            <div className="p-12 text-center text-slate-500">Nenhuma venda encontrada.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesHistory;
