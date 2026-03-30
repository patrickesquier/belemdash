import React from 'react';
import { Plus, Search, FileDown, LayoutGrid, List } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import InventoryTable from './InventoryTable';
import ProductModal from './ProductModal';
import { printInventory } from '../../utils/print';

const Inventory: React.FC = () => {
  const {
    isDarkMode,
    setIsModalOpen,
    setEditingProduct,
    searchQuery,
    setSearchQuery,
    products,
    distributorName,
    distributorDescription,
    distributorLabel,
    distributorLogo,
    distributorIcon,
    distributorColor,
    distributorLogoBlend,
    currentUser
  } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input
            type="text"
            placeholder="Pesquisar produtos (Ctrl+K)..."
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
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => printInventory(products, distributorName, distributorDescription, distributorLabel, distributorLogo, distributorIcon, distributorColor, distributorLogoBlend)}
            className={cn(
              "flex-1 md:flex-none px-4 py-2 rounded-lg border flex items-center justify-center gap-2 font-bold text-xs",
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            )}
          >
            <FileDown size={18} />
            <span className="hidden md:inline">Exportar PDF</span>
          </button>
          
          {currentUser?.role !== 'user' && (
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsModalOpen(true);
              }}
              className={cn(
                "flex-1 md:flex-none px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 flex items-center justify-center gap-2 font-bold shadow-md text-xs text-white"
              )}
            >
              <Plus size={18} />
              <span>Novo Produto</span>
            </button>
          )}
        </div>
      </div>

      <InventoryTable />
      <ProductModal />
    </div>
  );
};

export default Inventory;
