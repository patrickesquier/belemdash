import React from 'react';
import { Edit3, Trash2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import { Product } from '../../types';

const InventoryTable: React.FC = () => {
  const {
    filteredProducts,
    isDarkMode,
    setEditingProduct,
    setIsModalOpen,
    handleDeleteProduct,
    currentUser
  } = useApp();

  return (
    <div className={cn(
      "rounded-xl border overflow-hidden",
      isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
    )}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={cn(
              "border-b transition-colors duration-300",
              isDarkMode ? "border-slate-800 bg-slate-800/50" : "border-slate-100 bg-slate-50"
            )}>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 hidden sm:table-cell">SKU</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Produto</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 hidden md:table-cell">Categoria</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Estoque</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Preço</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/10">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.tr
                  key={product.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={cn(
                    "group transition-colors",
                    isDarkMode ? "hover:bg-slate-800/40" : "hover:bg-slate-50"
                  )}
                >
                  <td className="px-6 py-4">
                    {product.quantity <= (useApp().lowStockThreshold || 5) ? (
                      <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full w-fit text-xs font-bold ring-1 ring-amber-500/20">
                        <AlertCircle size={14} />
                        Baixo
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full w-fit text-xs font-bold ring-1 ring-emerald-500/20">
                        Ativo
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500 hidden sm:table-cell">{product.sku}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-sm tracking-tight">{product.name}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">{product.isService ? 'Serviço' : 'Produto'}</div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className={cn(
                      "px-2 py-1 rounded-lg text-xs font-medium",
                      isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"
                    )}>
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-sm">{product.quantity}</td>
                  <td className="px-6 py-4 font-bold text-blue-500 text-sm">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      {currentUser?.role !== 'user' && (
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setIsModalOpen(true);
                          }}
                          className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-xl transition-colors"
                          title="Editar"
                        >
                          <Edit3 size={18} />
                        </button>
                      )}
                      {currentUser?.role === 'admin' && (
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div className="p-12 text-center text-slate-500">Nenhum produto encontrado.</div>
        )}
      </div>
    </div>
  );
};

export default InventoryTable;
