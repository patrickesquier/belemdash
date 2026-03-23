import React from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import SalesHistory from './SalesHistory';
import SalesModal from './SalesModal';

const Sales: React.FC = () => {
  const {
    isDarkMode,
    setIsSalesModalOpen,
    setEditingSale,
    setCart,
    setSellerName,
    setCustomerName,
    setCustomerEmail,
    setCustomerCPF,
    setCustomerPhone,
    setDiscount
  } = useApp();

  const handleNewSale = () => {
    setEditingSale(null);
    setCart([]);
    setSellerName('');
    setCustomerName('');
    setCustomerEmail('');
    setCustomerCPF('');
    setCustomerPhone('');
    setDiscount(0);
    setIsSalesModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold uppercase tracking-tight">Histórico de Vendas</h2>
        <button
          onClick={handleNewSale}
          className={cn(
            "p-3 rounded-lg bg-blue-600 hover:bg-blue-500 flex items-center justify-center gap-2 transition-all font-bold shadow-md",
            "text-white"
          )}
        >
          <Plus size={20} />
          <span>Nova Venda</span>
        </button>
      </div>

      <SalesHistory />
      <SalesModal />
    </div>
  );
};

export default Sales;
