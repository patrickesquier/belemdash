import React, { useEffect, useState, useRef } from 'react';
import { X, User, Phone, FileText, Settings, AlertCircle, Clock, CheckCircle2, Package, Trash2, Plus, Minus, ClipboardList, PenTool, Search, ChevronDown, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import { SaleItem, Customer } from '../../types';

const OSModal: React.FC = () => {
  const {
    isOSModalOpen,
    setIsOSModalOpen,
    isDarkMode,
    editingOS,
    setEditingOS,
    customers,
    products,
    osCustomerName,
    setOsCustomerName,
    osCustomerPhone,
    setOsCustomerPhone,
    osCustomerCPF,
    setOsCustomerCPF,
    osItems,
    setOsItems,
    handleSaveOS,
    showNotification
  } = useApp();

  const [priority, setPriority] = React.useState<'Baixa' | 'Média' | 'Alta'>(
    (editingOS?.priority as any) || 'Média'
  );
  const [paymentMethod, setPaymentMethod] = React.useState<'PIX' | 'Cartão' | 'Dinheiro'>(
    (editingOS?.paymentMethod as any) || 'PIX'
  );

  // Autocomplete state
  const [nameSearch, setNameSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Filter customers by name
  const filteredCustomers = nameSearch.length >= 1
    ? customers.filter(c =>
        c.name.toLowerCase().includes(nameSearch.toLowerCase()) ||
        (c.cpf && c.cpf.includes(nameSearch))
      ).slice(0, 8)
    : [];

  // Pre-fill when editing OS
  useEffect(() => {
    if (editingOS) {
      setPriority((editingOS.priority as any) || 'Média');
      setPaymentMethod((editingOS.paymentMethod as any) || 'PIX');
      setOsCustomerName(editingOS.customerName || '');
      setOsCustomerPhone(editingOS.customerPhone || '');
      setOsCustomerCPF(editingOS.customerCPF || '');
      setNameSearch(editingOS.customerName || '');
      setOsItems(editingOS.items || []);
      // Try to find linked customer
      const linked = customers.find(c =>
        c.name === editingOS.customerName ||
        (editingOS.customerCPF && c.cpf === editingOS.customerCPF)
      );
      setSelectedCustomer(linked || null);
    } else {
      setPriority('Média');
      setPaymentMethod('PIX');
    }
  }, [editingOS]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOSModalOpen) return null;

  const handleClose = () => {
    setIsOSModalOpen(false);
    setEditingOS(null);
    setOsCustomerName('');
    setOsCustomerPhone('');
    setOsCustomerCPF('');
    setOsItems([]);
    setNameSearch('');
    setSelectedCustomer(null);
    setShowSuggestions(false);
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setNameSearch(customer.name);
    setOsCustomerName(customer.name);
    setOsCustomerPhone(customer.phone || '');
    setOsCustomerCPF(customer.cpf || '');
    setShowSuggestions(false);
  };

  const handleClearCustomer = () => {
    setSelectedCustomer(null);
    setNameSearch('');
    setOsCustomerName('');
    setOsCustomerPhone('');
    setOsCustomerCPF('');
    setShowSuggestions(false);
  };

  const handleNameInputChange = (value: string) => {
    setNameSearch(value);
    setOsCustomerName(value);
    setSelectedCustomer(null);
    setOsCustomerCPF('');
    setOsCustomerPhone('');
    setShowSuggestions(true);
  };

  const addItemToOS = (product: any) => {
    const existing = osItems.find(item => item.productId === product.id);
    if (existing) {
      setOsItems(prev => prev.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice }
          : item
      ));
    } else {
      const newItem: SaleItem = {
        productId: product.id,
        name: product.name,
        quantity: 1,
        unitPrice: product.price,
        costPrice: product.costPrice,
        priceType: 'Individual',
        warranty: '90 dias',
        total: product.price
      };
      setOsItems(prev => [...prev, newItem]);
    }
  };

  const removeItemFromOS = (productId: string) => {
    setOsItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateItemQuantity = (productId: string, delta: number) => {
    setOsItems(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty, total: newQty * item.unitPrice };
      }
      return item;
    }));
  };

  const updateItemWarranty = (productId: string, warranty: string) => {
    setOsItems(prev => prev.map(item =>
      item.productId === productId ? { ...item, warranty } : item
    ));
  };

  const partsTotal = osItems.reduce((acc, item) => acc + item.total, 0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!osCustomerName.trim()) {
      showNotification('Informe o nome do cliente', 'error');
      return;
    }
    const formData = new FormData(e.currentTarget);
    handleSaveOS({
      equipment: formData.get('equipment') as string,
      serialNumber: formData.get('serialNumber') as string,
      problemDescription: formData.get('problemDescription') as string,
      status: formData.get('status') as any,
      priority: priority,
      technician: formData.get('technician') as string,
      estimatedCost: Number(formData.get('estimatedCost')),
      observations: formData.get('observations') as string,
      servicePerformed: formData.get('servicePerformed') as string,
      paymentMethod: paymentMethod,
      warranty: formData.get('warranty') as string,
      items: osItems,
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
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
            "relative w-full max-w-5xl border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]",
            isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
          )}
        >
          <div className={cn(
            "p-6 border-b flex items-center justify-between",
            isDarkMode ? "border-slate-800" : "border-slate-200"
          )}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-500">
                <Settings size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{editingOS ? `Editar OS: ${editingOS.id}` : 'Nova Ordem de Serviço'}</h2>
                <p className="text-xs text-slate-500">Gestão de reparos e manutenção técnica</p>
              </div>
            </div>
            <button onClick={handleClose} className="text-slate-500 hover:text-slate-100 transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Left: General Info and Problems */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <User size={14} /> Informações do Cliente
                </h3>

                {/* ──────────────── EDIT MODE: readonly customer info ──────────────── */}
                {editingOS ? (
                  <div className={cn(
                    "rounded-2xl border p-4 space-y-3",
                    isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"
                  )}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{osCustomerName}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Cliente vinculado a esta OS</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {osCustomerPhone && (
                        <div className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium",
                          isDarkMode ? "bg-slate-900 text-slate-400" : "bg-white text-slate-600 border border-slate-200"
                        )}>
                          <Phone size={12} className="text-slate-500" />
                          {osCustomerPhone}
                        </div>
                      )}
                      {osCustomerCPF && (
                        <div className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium",
                          isDarkMode ? "bg-slate-900 text-slate-400" : "bg-white text-slate-600 border border-slate-200"
                        )}>
                          <FileText size={12} className="text-slate-500" />
                          {osCustomerCPF}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* ──────────────── CREATE MODE: autocomplete by name ──────────────── */
                  <div className="space-y-3">
                    {/* Name autocomplete */}
                    <div ref={autocompleteRef} className="space-y-1.5 focus-within:text-blue-500 transition-colors relative">
                      <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Nome do Cliente</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                          value={nameSearch}
                          onChange={(e) => handleNameInputChange(e.target.value)}
                          onFocus={() => nameSearch.length >= 1 && setShowSuggestions(true)}
                          className={cn(
                            "w-full pl-10 pr-10 py-2.5 rounded-xl border outline-none transition-all text-sm",
                            isDarkMode ? "bg-slate-800 border-slate-700 focus:border-blue-500" : "bg-slate-50 border-slate-200 focus:border-blue-500",
                            selectedCustomer && "border-blue-500/50"
                          )}
                          placeholder="Digite o nome do cliente..."
                          autoComplete="off"
                        />
                        {nameSearch && (
                          <button
                            type="button"
                            onClick={handleClearCustomer}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>

                      {/* Dropdown suggestions */}
                      <AnimatePresence>
                        {showSuggestions && filteredCustomers.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.12 }}
                            className={cn(
                              "absolute z-50 w-full mt-1 rounded-2xl border shadow-2xl overflow-hidden",
                              isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                            )}
                          >
                            <div className="max-h-52 overflow-y-auto">
                              {filteredCustomers.map((customer) => (
                                <button
                                  key={customer.id}
                                  type="button"
                                  onClick={() => handleSelectCustomer(customer)}
                                  className={cn(
                                    "w-full px-4 py-3 text-left flex items-center gap-3 transition-colors border-b last:border-b-0",
                                    isDarkMode
                                      ? "border-slate-700 hover:bg-slate-700"
                                      : "border-slate-100 hover:bg-slate-50"
                                  )}
                                >
                                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0">
                                    <User size={14} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate">{customer.name}</p>
                                    <div className="flex items-center gap-3 mt-0.5">
                                      {customer.phone && (
                                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                          <Phone size={9} /> {customer.phone}
                                        </span>
                                      )}
                                      {customer.cpf && (
                                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                          <FileText size={9} /> {customer.cpf}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                        {showSuggestions && nameSearch.length >= 1 && filteredCustomers.length === 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className={cn(
                              "absolute z-50 w-full mt-1 rounded-2xl border shadow-xl px-4 py-4 text-center",
                              isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                            )}
                          >
                            <p className="text-xs text-slate-500 font-medium">Nenhum cliente encontrado</p>
                            <p className="text-[10px] text-slate-600 mt-0.5">O nome digitado será usado como está</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Show filled customer info badge when selected */}
                    {selectedCustomer && (
                      <div className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl border",
                        isDarkMode ? "bg-blue-500/5 border-blue-500/20" : "bg-blue-50 border-blue-200"
                      )}>
                        <div className="flex-1 min-w-0 grid grid-cols-2 gap-2">
                          {selectedCustomer.phone && (
                            <span className="text-[10px] text-blue-500 font-bold flex items-center gap-1">
                              <Phone size={10} /> {selectedCustomer.phone}
                            </span>
                          )}
                          {selectedCustomer.cpf && (
                            <span className="text-[10px] text-blue-500 font-bold flex items-center gap-1">
                              <FileText size={10} /> {selectedCustomer.cpf}
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] font-black uppercase text-blue-500 bg-blue-500/10 px-2 py-1 rounded-lg">
                          Vinculado
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800/30">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <PenTool size={14} /> Equipamento e Problema
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Equipamento</label>
                    <input
                      name="equipment"
                      required
                      defaultValue={editingOS?.equipment}
                      className={cn(
                        "w-full px-4 py-2.5 rounded-xl border outline-none transition-all text-sm",
                        isDarkMode ? "bg-slate-800 border-slate-700 focus:border-blue-500" : "bg-slate-50 border-slate-200 focus:border-blue-500"
                      )}
                      placeholder="Ex: Notebook Dell Latitude"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Nº de Série</label>
                    <input
                      name="serialNumber"
                      defaultValue={editingOS?.serialNumber}
                      className={cn(
                        "w-full px-4 py-2.5 rounded-xl border outline-none transition-all text-sm",
                        isDarkMode ? "bg-slate-800 border-slate-700 focus:border-blue-500" : "bg-slate-50 border-slate-200 focus:border-blue-500"
                      )}
                      placeholder="Identificação do fabricante"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Descrição do Problema</label>
                  <textarea
                    name="problemDescription"
                    required
                    defaultValue={editingOS?.problemDescription}
                    rows={3}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm resize-none",
                      isDarkMode ? "bg-slate-800 border-slate-700 focus:border-blue-500" : "bg-slate-50 border-slate-200 focus:border-blue-500"
                    )}
                    placeholder="Descreva o que está acontecendo..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Observações Internas</label>
                  <textarea
                    name="observations"
                    defaultValue={editingOS?.observations}
                    rows={2}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm resize-none",
                      isDarkMode ? "bg-slate-800 border-slate-700 focus:border-blue-500" : "bg-slate-50 border-slate-200 focus:border-blue-500"
                    )}
                    placeholder="Notas internas ou acessórios deixados..."
                  />
                </div>
                {editingOS && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-500 ml-1 text-emerald-500">Serviço Realizado</label>
                    <textarea
                      name="servicePerformed"
                      defaultValue={editingOS?.servicePerformed}
                      rows={3}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm resize-none",
                        isDarkMode ? "bg-emerald-500/5 border-emerald-500/20 focus:border-emerald-500 text-emerald-500" : "bg-emerald-50 border-emerald-200 focus:border-emerald-500 text-emerald-700"
                      )}
                      placeholder="O que foi feito para resolver?"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800/30">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-500 ml-1 text-blue-500">Peças e Componentes</label>
                  <div className={cn(
                    "p-4 rounded-2xl border max-h-[200px] overflow-y-auto space-y-3",
                    isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200"
                  )}>
                    {products.filter(p => !p.isService).slice(0, 5).map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => addItemToOS(p)}
                        className={cn(
                          "w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all",
                          isDarkMode ? "bg-slate-900 border-slate-800 hover:border-blue-500/50" : "bg-white border-slate-200 hover:border-blue-500/50"
                        )}
                      >
                        <span className="text-xs font-medium">{p.name}</span>
                        <Plus size={14} className="text-blue-500" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Itens Adicionados</label>
                  <div className={cn(
                    "p-4 rounded-2xl border max-h-[200px] overflow-y-auto space-y-2",
                    isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200"
                  )}>
                    {osItems.length === 0 ? (
                      <div className="text-center py-8 text-slate-600 text-xs italic">Nenhuma peça adicionada</div>
                    ) : (
                      osItems.map(item => (
                        <div key={item.productId} className={cn(
                          "p-3 rounded-xl border space-y-2",
                          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                        )}>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-black uppercase truncate flex-1">{item.name}</span>
                            <div className="flex items-center gap-1.5">
                              <button type="button" onClick={() => updateItemQuantity(item.productId, -1)} className="p-1 rounded-md bg-slate-800 text-white hover:bg-blue-600 transition-colors"><Minus size={10} /></button>
                              <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                              <button type="button" onClick={() => updateItemQuantity(item.productId, 1)} className="p-1 rounded-md bg-slate-800 text-white hover:bg-blue-600 transition-colors"><Plus size={10} /></button>
                              <button type="button" onClick={() => removeItemFromOS(item.productId)} className="text-red-500 ml-1 hover:scale-110 transition-transform"><Trash2 size={12} /></button>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                             <div className="flex items-center justify-between">
                               <label className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Garantia Peça</label>
                               <span className="text-[10px] font-black text-blue-500">
                                 {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total)}
                               </span>
                             </div>
                             <div className="relative">
                               <ShieldCheck className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-500" size={10} />
                               <input
                                 value={item.warranty}
                                 onChange={(e) => updateItemWarranty(item.productId, e.target.value)}
                                 className={cn(
                                   "w-full pl-7 pr-2 py-1.5 rounded-lg border text-[10px] font-bold outline-none transition-all",
                                   isDarkMode ? "bg-slate-950 border-slate-800 text-blue-400 focus:border-blue-500" : "bg-slate-50 border-slate-200 text-blue-600 focus:border-blue-500"
                                 )}
                                 placeholder="Ex: 90 dias"
                               />
                             </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Status and Meta */}
            <div className={cn(
              "w-full md:w-[320px] p-6 border-l flex flex-col gap-6 overflow-y-auto",
              isDarkMode ? "bg-slate-950/50 border-slate-800" : "bg-slate-50/50 border-slate-100"
            )}>
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Status & Prioridade</h3>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Status Atual</label>
                    <select
                      name="status"
                      defaultValue={editingOS?.status || 'Pendente'}
                      className={cn(
                        "w-full px-4 py-2.5 rounded-xl border outline-none transition-all text-sm appearance-none cursor-pointer",
                        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                      )}
                    >
                      <option value="Pendente">🟡 Pendente</option>
                      <option value="Em Análise">🔵 Em Análise</option>
                      <option value="Orçamento">🟠 Orçamento</option>
                      <option value="Aprovado">🟢 Aprovado</option>
                      <option value="Em Reparo">🛠️ Em Reparo</option>
                      <option value="Concluído">✅ Concluído</option>
                      <option value="Entregue">📦 Entregue</option>
                      <option value="Cancelado">❌ Cancelado</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Prioridade</label>
                    <div className="flex gap-2">
                      {(['Baixa', 'Média', 'Alta'] as const).map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={cn(
                            "flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all border",
                            p === priority ? (
                              p === 'Alta' ? "border-red-500 text-red-500 bg-red-500/20 shadow-lg shadow-red-500/10" :
                              p === 'Média' ? "border-amber-500 text-amber-500 bg-amber-500/20 shadow-lg shadow-amber-500/10" :
                              "border-emerald-500 text-emerald-500 bg-emerald-500/20 shadow-lg shadow-emerald-500/10"
                            ) : (
                              isDarkMode ? "border-slate-800 text-slate-600 bg-slate-900" : "border-slate-200 text-slate-400 bg-white"
                            ),
                            "hover:scale-[1.05] active:scale-[0.95]"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800/30">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Responsável & Valor</h3>
                <div className="space-y-3">
                  <div className="space-y-1.5 focus-within:text-blue-500 transition-colors">
                    <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Técnico Responsável</label>
                    <input
                      name="technician"
                      defaultValue={editingOS?.technician}
                      className={cn(
                        "w-full px-4 py-2.5 rounded-xl border outline-none transition-all text-sm",
                        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                      )}
                      placeholder="Nome do técnico"
                    />
                  </div>
                  <div className="space-y-1.5 focus-within:text-emerald-500 transition-colors">
                    <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Custo Estimado (R$)</label>
                    <input
                      name="estimatedCost"
                      type="number"
                      step="0.01"
                      defaultValue={editingOS?.estimatedCost}
                      className={cn(
                        "w-full px-4 py-2.5 rounded-xl border outline-none transition-all text-sm font-bold",
                        isDarkMode ? "bg-slate-900 border-slate-800 text-emerald-500" : "bg-white border-slate-200 text-emerald-600"
                      )}
                      placeholder="0,00"
                    />
                  </div>

                  <div className="space-y-1.5 focus-within:text-blue-500 transition-colors">
                    <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Garantia do Serviço</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" size={16} />
                      <input
                        name="warranty"
                        defaultValue={editingOS?.warranty}
                        className={cn(
                          "w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all text-sm font-bold",
                          isDarkMode ? "bg-slate-900 border-slate-800 text-blue-400 focus:border-blue-500" : "bg-white border-slate-200 text-blue-600 focus:border-blue-500"
                        )}
                        placeholder="Ex: 90 dias para serviço"
                      />
                    </div>
                  </div>

                  {/* Financial Summary Box */}
                  <div className={cn(
                    "p-4 rounded-2xl border space-y-3",
                    isDarkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                  )}>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <span>Total Peças</span>
                      <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(partsTotal)}</span>
                    </div>
                    <div className="h-px bg-slate-800/50" />
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Total Geral Est.</span>
                      <span className="text-lg font-black text-blue-500">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(partsTotal + (editingOS?.estimatedCost || 0))}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Forma de Pagamento</label>
                    <div className="flex gap-2">
                      {(['PIX', 'Cartão', 'Dinheiro'] as const).map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPaymentMethod(p)}
                          className={cn(
                            "flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all border",
                            p === paymentMethod ? "border-blue-500 text-blue-500 bg-blue-500/10 shadow-sm" : (isDarkMode ? "border-slate-800 text-slate-500 bg-slate-900" : "border-slate-200 text-slate-400 bg-white"),
                            "hover:scale-[1.05] active:scale-[0.95]"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1" />

              <div className="space-y-3 pt-6">
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-black uppercase tracking-tighter transition-all shadow-lg shadow-blue-500/20"
                >
                  {editingOS ? 'Atualizar Ordem' : 'Gerar Ordem de Serviço'}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className={cn(
                    "w-full py-3 rounded-2xl font-bold transition-all text-sm",
                    isDarkMode ? "bg-slate-800 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-500 hover:text-slate-900"
                  )}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OSModal;
