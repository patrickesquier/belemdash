import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import { CATEGORIES } from '../../constants';

const ProductModal: React.FC = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    isDarkMode,
    editingProduct,
    setEditingProduct,
    handleSaveProduct,
    enableServices
  } = useApp();

  if (!isModalOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      quantity: Number(formData.get('quantity')),
      price: Number(formData.get('price')),
      costPrice: Number(formData.get('costPrice')),
      sku: formData.get('sku') as string,
      condition: formData.get('condition') as any,
      isService: formData.get('isService') === 'on',
    };
    handleSaveProduct(productData);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          className={cn(
            "absolute inset-0 backdrop-blur-sm",
            isDarkMode ? "bg-black/60" : "bg-black/10"
          )}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={cn(
            "relative w-full max-w-lg border rounded-xl shadow-xl overflow-hidden",
            isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
          )}
        >
          <div className={cn(
            "p-6 border-b flex items-center justify-between",
            isDarkMode ? "border-zinc-800" : "border-zinc-200"
          )}>
            <h2 className="text-xl font-bold">{editingProduct ? 'Editar Produto' : 'Adicionar Produto'}</h2>
            <button 
              onClick={() => {
                setIsModalOpen(false);
                setEditingProduct(null);
              }} 
              className="text-zinc-500 hover:text-zinc-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Nome do Produto</label>
                <input
                  name="name"
                  required
                  defaultValue={editingProduct?.name}
                  className={cn(
                    "w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-xs",
                    isDarkMode ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                  )}
                  placeholder="Ex: Teclado Mecânico RGB"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">SKU / Código</label>
                <input
                  name="sku"
                  required
                  defaultValue={editingProduct?.sku}
                  className={cn(
                    "w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-xs",
                    isDarkMode ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                  )}
                  placeholder="TEC-001"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Categoria</label>
                <select
                  name="category"
                  required
                  defaultValue={editingProduct?.category || CATEGORIES[0]}
                  className={cn(
                    "w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-xs",
                    isDarkMode ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                  )}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Quantidade</label>
                <input
                  name="quantity"
                  type="number"
                  required
                  min="0"
                  defaultValue={editingProduct?.quantity || 0}
                  className={cn(
                    "w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-xs",
                    isDarkMode ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Preço Unitário (R$)</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  min="0"
                  defaultValue={editingProduct?.price || 0}
                  className={cn(
                    "w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-xs",
                    isDarkMode ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Preço de Custo (R$)</label>
                <input
                  name="costPrice"
                  type="number"
                  step="0.01"
                  required
                  min="0"
                  defaultValue={editingProduct?.costPrice || 0}
                  className={cn(
                    "w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-xs",
                    isDarkMode ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                  )}
                />
              </div>

              {enableServices && (
                <div className={cn(
                  "col-span-2 flex items-center gap-3 p-2.5 border rounded-lg",
                  isDarkMode ? "bg-zinc-800/30 border-zinc-700" : "bg-zinc-50 border-zinc-100"
                )}>
                  <input
                    type="checkbox"
                    name="isService"
                    id="isService"
                    defaultChecked={editingProduct?.isService}
                    className="w-3.5 h-3.5 accent-blue-600"
                  />
                  <label htmlFor="isService" className="text-xs font-bold text-zinc-500 uppercase tracking-widest cursor-pointer">Serviço (Mão de Obra)</label>
                </div>
              )}

              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Condição / Status</label>
                <div className="flex flex-wrap gap-3">
                  {['Pronto para Venda', 'Com Defeito', 'Pendente'].map((status) => (
                    <label 
                      key={status}
                      className={cn(
                        "flex-1 min-w-[140px] flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-all",
                        isDarkMode ? "bg-zinc-800 border-zinc-700 hover:bg-zinc-750" : "bg-zinc-50 border-zinc-100 hover:bg-zinc-200"
                      )}
                    >
                      <input
                        type="radio"
                        name="condition"
                        value={status}
                        defaultChecked={(!editingProduct && status === 'Pronto para Venda') || editingProduct?.condition === status}
                        className={cn(
                          "accent-blue-500",
                          status === 'Pronto para Venda' && "accent-emerald-500",
                          status === 'Com Defeito' && "accent-red-500",
                          status === 'Pendente' && "accent-amber-500"
                        )}
                      />
                      <span className="text-sm font-medium">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingProduct(null);
                }}
                className={cn(
                  "flex-1 px-4 py-2.5 rounded-lg font-bold text-xs transition-all",
                  isDarkMode ? "bg-zinc-800 hover:bg-zinc-700 text-white" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-900"
                )}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all shadow-md text-xs"
              >
                Salvar Produto
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductModal;
