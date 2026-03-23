import React from 'react';
import { Plus, Search, Edit3, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import CustomerModal from './CustomerModal';

const Customers: React.FC = () => {
  const {
    customers,
    isDarkMode,
    setIsCustomerModalOpen,
    setEditingCustomer,
    handleDeleteCustomer,
    searchQuery,
    setSearchQuery
  } = useApp();

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.cpf?.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Pesquisar clientes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all font-medium",
              isDarkMode 
                ? "bg-zinc-900 border-zinc-800 focus:border-blue-500 text-white" 
                : "bg-white border-zinc-200 focus:border-blue-500 shadow-sm"
            )}
          />
        </div>
        
        <button
          onClick={() => {
            setEditingCustomer(null);
            setIsCustomerModalOpen(true);
          }}
          className={cn(
            "w-full md:w-auto p-4 rounded-2xl bg-blue-500 hover:bg-blue-600 flex items-center justify-center gap-2 transition-all font-bold shadow-lg shadow-blue-500/20",
            isDarkMode ? "text-black" : "text-white"
          )}
        >
          <Plus size={20} />
          <span>Novo Cliente</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "rounded-3xl border overflow-hidden transition-colors duration-300",
          isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={cn(
                "border-b transition-colors duration-300",
                isDarkMode ? "border-zinc-800 bg-zinc-800/50" : "border-zinc-100 bg-zinc-50"
              )}>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 hidden md:table-cell">Contato</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 hidden sm:table-cell">Documento</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Total Gasto</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/10">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className={cn(
                    "group transition-colors",
                    isDarkMode ? "hover:bg-zinc-800/40" : "hover:bg-zinc-50"
                  )}
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-sm tracking-tight">{customer.name}</div>
                    <div className="text-[10px] text-zinc-500 font-mono uppercase">ID: {customer.id}</div>
                    {customer.phone && (
                      <div className="md:hidden flex items-center gap-1.5 text-[10px] text-emerald-500 font-bold mt-1 uppercase">
                        <Phone size={10} />
                        {customer.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex flex-col gap-1">
                      {customer.email && (
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <Mail size={12} className="text-blue-500/50" />
                          {customer.email}
                        </div>
                      )}
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <Phone size={12} className="text-emerald-500/50" />
                          {customer.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-zinc-500 hidden sm:table-cell">
                    {customer.cpf || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-blue-500 text-sm">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(customer.totalSpent)}
                    </div>
                    <div className="text-[9px] text-zinc-500 uppercase font-bold">Desde: {new Date(customer.createdAt).toLocaleDateString('pt-BR')}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingCustomer(customer);
                          setIsCustomerModalOpen(true);
                        }}
                        title="Editar"
                        className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-xl transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer.id)}
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
          {filteredCustomers.length === 0 && (
            <div className="p-12 text-center text-zinc-500">Nenhum cliente encontrado.</div>
          )}
        </div>
      </motion.div>
      
      <CustomerModal />
    </div>
  );
};

export default Customers;
