import React, { useState } from 'react';
import { Plus, Search, Pencil, Trash2, User, Mail, Phone, X, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Seller } from '../../types';

const Sellers: React.FC = () => {
  const {
    sellers,
    isDarkMode,
    isSellerModalOpen,
    setIsSellerModalOpen,
    editingSeller,
    setEditingSeller,
    handleSaveSeller,
    handleDeleteSeller
  } = useApp();

  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState<Partial<Seller>>({
    name: '',
    email: '',
    phone: ''
  });

  const filteredSellers = sellers.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (seller?: Seller) => {
    if (seller) {
      setEditingSeller(seller);
      setFormData({ name: seller.name, email: seller.email, phone: seller.phone });
    } else {
      setEditingSeller(null);
      setFormData({ name: '', email: '', phone: '' });
    }
    setIsSellerModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveSeller(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">Equipe de Vendas</h2>
          <p className="text-slate-500 text-sm">Gerencie os vendedores que realizam as operações no sistema</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-tighter transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} />
          Novo Vendedor
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input
          type="text"
          placeholder="Buscar vendedor por nome ou e-mail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn(
            "w-full pl-12 pr-4 py-4 rounded-3xl border focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium",
            isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSellers.map((seller) => (
          <motion.div
            key={seller.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "p-6 rounded-3xl border group transition-all relative overflow-hidden",
              isDarkMode ? "bg-slate-900 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                <User size={24} />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(seller)}
                  className="p-2 rounded-xl bg-slate-500/10 text-slate-500 hover:bg-blue-500 hover:text-white transition-all"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDeleteSeller(seller.id)}
                  className="p-2 rounded-xl bg-slate-500/10 text-slate-500 hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-black uppercase tracking-tight text-lg">{seller.name}</h3>
              <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                <Mail size={12} />
                {seller.email || 'Sem e-mail'}
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                <Phone size={12} />
                {seller.phone || 'Sem telefone'}
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isSellerModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSellerModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                "relative w-full max-w-md p-8 rounded-[40px] border shadow-2xl",
                isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
              )}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">
                    {editingSeller ? 'Editar Vendedor' : 'Novo Vendedor'}
                  </h2>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Dados Cadastrais</p>
                </div>
                <button
                  onClick={() => setIsSellerModalOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Nome Completo</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={cn(
                          "w-full pl-12 pr-4 py-4 rounded-2xl border focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold",
                          isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                        )}
                        placeholder="Nome do vendedor"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={cn(
                          "w-full pl-12 pr-4 py-4 rounded-2xl border focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold",
                          isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                        )}
                        placeholder="vendedor@empresa.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Telefone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={cn(
                          "w-full pl-12 pr-4 py-4 rounded-2xl border focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold",
                          isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                        )}
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-tighter transition-all shadow-xl shadow-blue-500/20 mt-4"
                >
                  <Save size={20} />
                  {editingSeller ? 'Salvar Alterações' : 'Cadastrar Vendedor'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sellers;
