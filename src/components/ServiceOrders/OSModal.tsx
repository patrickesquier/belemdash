import React, { useEffect } from 'react';
import { X, User, Phone, FileText, Settings, AlertCircle, Clock, CheckCircle2, Package, Trash2, Plus, Minus, ClipboardList, PenTool } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import { SaleItem } from '../../types';

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

  useEffect(() => {
    if (editingOS) {
      setPriority((editingOS.priority as any) || 'Média');
    } else {
      setPriority('Média');
    }
  }, [editingOS]);

  useEffect(() => {
    if (osCustomerCPF.length >= 11) {
      const customer = customers.find(c => c.cpf === osCustomerCPF || c.cpf?.replace(/\D/g, '') === osCustomerCPF.replace(/\D/g, ''));
      if (customer) {
        setOsCustomerName(customer.name);
        setOsCustomerPhone(customer.phone || '');
      }
    }
  }, [osCustomerCPF, customers, setOsCustomerName, setOsCustomerPhone]);

  if (!isOSModalOpen) return null;

  const handleClose = () => {
    setIsOSModalOpen(false);
    setEditingOS(null);
    setOsCustomerName('');
    setOsCustomerPhone('');
    setOsCustomerCPF('');
    setOsItems([]);
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
            isDarkMode ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"
          )}
        >
          <div className={cn(
            "p-6 border-b flex items-center justify-between",
            isDarkMode ? "border-zinc-800" : "border-zinc-200"
          )}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-500">
                <Settings size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{editingOS ? `Editar OS: ${editingOS.id}` : 'Nova Ordem de Serviço'}</h2>
                <p className="text-xs text-zinc-500">Gestão de reparos e manutenção técnica</p>
              </div>
            </div>
            <button onClick={handleClose} className="text-zinc-500 hover:text-zinc-100 transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Left: General Info and Problems */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                  <User size={14} /> Informações do Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5 focus-within:text-blue-500 transition-colors">
                    <label className="text-[10px] font-bold uppercase text-zinc-500 ml-1">CPF/CNPJ</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                      <input
                        value={osCustomerCPF}
                        onChange={(e) => setOsCustomerCPF(e.target.value)}
                        className={cn(
                          "w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all text-sm",
                          isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-zinc-50 border-zinc-200"
                        )}
                        placeholder="Pesquisar por CPF"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-1.5 focus-within:text-blue-500 transition-colors">
                    <label className="text-[10px] font-bold uppercase text-zinc-500 ml-1">Nome do Cliente</label>
                    <input
                      value={osCustomerName}
                      onChange={(e) => setOsCustomerName(e.target.value)}
                      required
                      className={cn(
                        "w-full px-4 py-2.5 rounded-xl border outline-none transition-all text-sm",
                        isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-zinc-50 border-zinc-200"
                      )}
                      placeholder="Nome completo"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-800/30">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                  <PenTool size={14} /> Equipamento e Problema
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-zinc-500 ml-1">Equipamento</label>
                    <input
                      name="equipment"
                      required
                      defaultValue={editingOS?.equipment}
                      className={cn(
                        "w-full px-4 py-2.5 rounded-xl border outline-none transition-all text-sm",
                        isDarkMode ? "bg-zinc-800 border-zinc-700 focus:border-blue-500" : "bg-zinc-50 border-zinc-200 focus:border-blue-500"
                      )}
                      placeholder="Ex: Notebook Dell Latitude"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-zinc-500 ml-1">Nº de Série</label>
                    <input
                      name="serialNumber"
                      defaultValue={editingOS?.serialNumber}
                      className={cn(
                        "w-full px-4 py-2.5 rounded-xl border outline-none transition-all text-sm",
                        isDarkMode ? "bg-zinc-800 border-zinc-700 focus:border-blue-500" : "bg-zinc-50 border-zinc-200 focus:border-blue-500"
                      )}
                      placeholder="Identificação do fabricante"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-zinc-500 ml-1">Descrição do Problema</label>
                  <textarea
                    name="problemDescription"
                    required
                    defaultValue={editingOS?.problemDescription}
                    rows={3}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm resize-none",
                      isDarkMode ? "bg-zinc-800 border-zinc-700 focus:border-blue-500" : "bg-zinc-50 border-zinc-200 focus:border-blue-500"
                    )}
                    placeholder="Descreva o que está acontecendo..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-zinc-500 ml-1">Observações Internas</label>
                  <textarea
                    name="observations"
                    defaultValue={editingOS?.observations}
                    rows={2}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm resize-none",
                      isDarkMode ? "bg-zinc-800 border-zinc-700 focus:border-blue-500" : "bg-zinc-50 border-zinc-200 focus:border-blue-500"
                    )}
                    placeholder="Notas internas ou acessórios deixados..."
                  />
                </div>
                {editingOS && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-zinc-500 ml-1 text-emerald-500">Serviço Realizado</label>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-800/30">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-zinc-500 ml-1 text-blue-500">Peças e Componentes</label>
                  <div className={cn(
                    "p-4 rounded-2xl border max-h-[200px] overflow-y-auto space-y-3",
                    isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-zinc-100 border-zinc-200"
                  )}>
                    {products.filter(p => !p.isService).slice(0, 5).map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => addItemToOS(p)}
                        className={cn(
                          "w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all",
                          isDarkMode ? "bg-zinc-900 border-zinc-800 hover:border-blue-500/50" : "bg-white border-zinc-200 hover:border-blue-500/50"
                        )}
                      >
                        <span className="text-xs font-medium">{p.name}</span>
                        <Plus size={14} className="text-blue-500" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-zinc-500 ml-1">Itens Adicionados</label>
                  <div className={cn(
                    "p-4 rounded-2xl border max-h-[200px] overflow-y-auto space-y-2",
                    isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-zinc-100 border-zinc-200"
                  )}>
                    {osItems.length === 0 ? (
                      <div className="text-center py-8 text-zinc-600 text-xs italic">Nenhuma peça adicionada</div>
                    ) : (
                      osItems.map(item => (
                        <div key={item.productId} className={cn(
                          "p-2 rounded-xl border flex items-center justify-between gap-2",
                          isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
                        )}>
                          <span className="text-[10px] font-bold truncate flex-1">{item.name}</span>
                          <div className="flex items-center gap-1.5">
                            <button type="button" onClick={() => updateItemQuantity(item.productId, -1)} className="p-0.5 rounded-md bg-zinc-800"><Minus size={10} /></button>
                            <span className="text-[10px] font-black w-4 text-center">{item.quantity}</span>
                            <button type="button" onClick={() => updateItemQuantity(item.productId, 1)} className="p-0.5 rounded-md bg-zinc-800"><Plus size={10} /></button>
                            <button type="button" onClick={() => removeItemFromOS(item.productId)} className="text-red-500 ml-1"><Trash2 size={12} /></button>
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
              isDarkMode ? "bg-zinc-950/50 border-zinc-800" : "bg-zinc-50/50 border-zinc-100"
            )}>
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Status & Prioridade</h3>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-zinc-500 ml-1">Status Atual</label>
                    <select
                      name="status"
                      defaultValue={editingOS?.status || 'Pendente'}
                      className={cn(
                        "w-full px-4 py-2.5 rounded-xl border outline-none transition-all text-sm appearance-none cursor-pointer",
                        isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
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
                    <label className="text-[10px] font-bold uppercase text-zinc-500 ml-1">Prioridade</label>
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
                              isDarkMode ? "border-zinc-800 text-zinc-600 bg-zinc-900" : "border-zinc-200 text-zinc-400 bg-white"
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

              <div className="space-y-4 pt-4 border-t border-zinc-800/30">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Responsável & Valor</h3>
                <div className="space-y-3">
                  <div className="space-y-1.5 focus-within:text-blue-500 transition-colors">
                    <label className="text-[10px] font-bold uppercase text-zinc-500 ml-1">Técnico Responsável</label>
                    <input
                      name="technician"
                      defaultValue={editingOS?.technician}
                      className={cn(
                        "w-full px-4 py-2.5 rounded-xl border outline-none transition-all text-sm",
                        isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
                      )}
                      placeholder="Nome do técnico"
                    />
                  </div>
                  <div className="space-y-1.5 focus-within:text-emerald-500 transition-colors">
                    <label className="text-[10px] font-bold uppercase text-zinc-500 ml-1">Custo Estimado (R$)</label>
                    <input
                      name="estimatedCost"
                      type="number"
                      step="0.01"
                      defaultValue={editingOS?.estimatedCost}
                      className={cn(
                        "w-full px-4 py-2.5 rounded-xl border outline-none transition-all text-sm font-bold",
                        isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
                      )}
                      placeholder="0,00"
                    />
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
                    isDarkMode ? "bg-zinc-800 text-zinc-400 hover:text-white" : "bg-zinc-100 text-zinc-500 hover:text-zinc-900"
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
