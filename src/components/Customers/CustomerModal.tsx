import React from 'react';
import { X, User, Mail, Phone, FileText, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';

const CustomerModal: React.FC = () => {
  const {
    isCustomerModalOpen,
    setIsCustomerModalOpen,
    isDarkMode,
    editingCustomer,
    setEditingCustomer,
    handleSaveCustomer
  } = useApp();

  if (!isCustomerModalOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    handleSaveCustomer({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      cpf: formData.get('cpf') as string,
      address: formData.get('address') as string,
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setIsCustomerModalOpen(false);
            setEditingCustomer(null);
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
            "relative w-full max-w-lg border rounded-3xl shadow-2xl overflow-hidden",
            isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
          )}
        >
          <div className={cn(
            "p-6 border-b flex items-center justify-between",
            isDarkMode ? "border-slate-800" : "border-slate-200"
          )}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-500">
                <User size={24} />
              </div>
              <h2 className="text-xl font-bold">{editingCustomer ? 'Editar Cliente' : 'Novo Cliente'}</h2>
            </div>
            <button 
              onClick={() => {
                setIsCustomerModalOpen(false);
                setEditingCustomer(null);
              }} 
              className="text-slate-500 hover:text-slate-100 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5 focus-within:text-blue-500 transition-colors">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  name="name"
                  required
                  defaultValue={editingCustomer?.name}
                  className={cn(
                    "w-full pl-12 pr-4 py-3 rounded-2xl border outline-none transition-all font-medium",
                    isDarkMode ? "bg-slate-800 border-slate-700 focus:border-blue-500" : "bg-slate-50 border-slate-200 focus:border-blue-500"
                  )}
                  placeholder="Nome do cliente"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 focus-within:text-blue-500 transition-colors">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    name="email"
                    type="email"
                    defaultValue={editingCustomer?.email}
                    className={cn(
                      "w-full pl-12 pr-4 py-3 rounded-2xl border outline-none transition-all font-medium",
                      isDarkMode ? "bg-slate-800 border-slate-700 focus:border-blue-500" : "bg-slate-50 border-slate-200 focus:border-blue-500"
                    )}
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>
              <div className="space-y-1.5 focus-within:text-blue-500 transition-colors">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    name="phone"
                    defaultValue={editingCustomer?.phone}
                    className={cn(
                      "w-full pl-12 pr-4 py-3 rounded-2xl border outline-none transition-all font-medium",
                      isDarkMode ? "bg-slate-800 border-slate-700 focus:border-blue-500" : "bg-slate-50 border-slate-200 focus:border-blue-500"
                    )}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 focus-within:text-blue-500 transition-colors">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">CPF / CNPJ</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  name="cpf"
                  defaultValue={editingCustomer?.cpf}
                  className={cn(
                    "w-full pl-12 pr-4 py-3 rounded-2xl border outline-none transition-all font-medium",
                    isDarkMode ? "bg-slate-800 border-slate-700 focus:border-blue-500" : "bg-slate-50 border-slate-200 focus:border-blue-500"
                  )}
                  placeholder="000.000.000-00"
                />
              </div>
            </div>

            <div className="space-y-1.5 focus-within:text-blue-500 transition-colors">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Endereço</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  name="address"
                  defaultValue={editingCustomer?.address}
                  className={cn(
                    "w-full pl-12 pr-4 py-3 rounded-2xl border outline-none transition-all font-medium",
                    isDarkMode ? "bg-slate-800 border-slate-700 focus:border-blue-500" : "bg-slate-50 border-slate-200 focus:border-blue-500"
                  )}
                  placeholder="Rua, Número, Bairro, Cidade"
                />
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsCustomerModalOpen(false);
                  setEditingCustomer(null);
                }}
                className={cn(
                  "flex-1 px-4 py-3 rounded-2xl font-bold transition-all",
                  isDarkMode ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                )}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20"
              >
                Salvar Cliente
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CustomerModal;
