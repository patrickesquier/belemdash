import React from 'react';
import { X, Search, Trash2, Plus, Minus, User, Mail, CreditCard, Banknote, QrCode, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import { SaleItem } from '../../types';

const SalesModal: React.FC = () => {
  const {
    isSalesModalOpen,
    setIsSalesModalOpen,
    isDarkMode,
    editingSale,
    setEditingSale,
    products,
    cart,
    setCart,
    sellerName,
    setSellerName,
    customerName,
    setCustomerName,
    customerEmail,
    setCustomerEmail,
    customerCPF,
    setCustomerCPF,
    customerPhone,
    setCustomerPhone,
    paymentMethod,
    setPaymentMethod,
    discount,
    setDiscount,
    handleSaveSale,
    showNotification,
    searchQuery,
    setSearchQuery
  } = useApp();

  if (!isSalesModalOpen) return null;

  const totalValue = cart.reduce((acc, item) => acc + item.total, 0);
  const finalValue = totalValue - discount;

  const [mobileTab, setMobileTab] = React.useState<'products' | 'cart'>('products');

  const handleClose = () => {
    setIsSalesModalOpen(false);
    setEditingSale(null);
    setCart([]);
    setSellerName('');
    setCustomerName('');
    setCustomerEmail('');
    setCustomerCPF('');
    setCustomerPhone('');
    setDiscount(0);
  };

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      if (!product.isService && existing.quantity >= product.quantity) {
        showNotification('Quantidade máxima atingida!', 'error');
        return;
      }
      setCart(prev => prev.map(item => 
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
      setCart(prev => [...prev, newItem]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    const product = products.find(p => p.id === productId);
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        if (!product?.isService && product && newQty > product.quantity) {
          showNotification('Estoque insuficiente!', 'error');
          return item;
        }
        return { ...item, quantity: newQty, total: newQty * item.unitPrice };
      }
      return item;
    }));
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
            "relative w-full max-w-5xl border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
            isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
          )}
        >
          <div className={cn(
            "p-6 border-b flex items-center justify-between",
            isDarkMode ? "border-zinc-800" : "border-zinc-200"
          )}>
            <div>
              <h2 className="text-xl font-bold">{editingSale ? 'Editar Venda' : 'Nova Venda / Saída'}</h2>
              <p className="text-xs text-zinc-500">Registre a saída de mercadorias ou serviços</p>
            </div>
            <button onClick={handleClose} className="text-zinc-500 hover:text-zinc-100 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="md:hidden flex border-b border-zinc-800">
            <button
              onClick={() => setMobileTab('products')}
              className={cn(
                "flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all",
                mobileTab === 'products' ? "text-blue-500 border-b-2 border-blue-500" : "text-zinc-500"
              )}
            >
              Produtos
            </button>
            <button
              onClick={() => setMobileTab('cart')}
              className={cn(
                "flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                mobileTab === 'cart' ? "text-blue-500 border-b-2 border-blue-500" : "text-zinc-500"
              )}
            >
              Carrinho
              {cart.length > 0 && (
                <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Left: Product Search */}
            <div className={cn(
              "flex-1 p-6 border-r overflow-y-auto",
              isDarkMode ? "border-zinc-800" : "border-zinc-100",
              "md:block",
              mobileTab === 'products' ? "block" : "hidden"
            )}>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="text"
                  placeholder="Pesquisar por nome ou SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                    isDarkMode ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                {products
                  .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
                  .slice(0, 10)
                  .map(product => (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      disabled={!product.isService && product.quantity <= 0}
                      className={cn(
                        "p-4 rounded-2xl border text-left transition-all group flex items-center justify-between",
                        isDarkMode 
                          ? "bg-zinc-800/50 border-zinc-700 hover:border-blue-500/50" 
                          : "bg-zinc-50 border-zinc-200 hover:border-blue-500/50",
                        (!product.isService && product.quantity <= 0) && "opacity-50 cursor-not-allowed grayscale"
                      )}
                    >
                      <div>
                        <div className="font-bold">{product.name}</div>
                        <div className="text-xs text-zinc-500">SKU: {product.sku} | Estoque: {product.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-500">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                        </div>
                        <div className="text-[10px] text-zinc-500 uppercase font-bold">{product.category}</div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Right: Cart and Customer Info */}
            <div className={cn(
              "w-full md:w-[400px] flex flex-col overflow-hidden",
              isDarkMode ? "bg-zinc-950/50" : "bg-zinc-50/50",
              "md:flex",
              mobileTab === 'cart' ? "flex" : "hidden"
            )}>
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {/* Cart Items */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Itens da Venda ({cart.length})</h3>
                  {cart.length === 0 ? (
                    <div className="py-8 text-center border-2 border-dashed border-zinc-800 rounded-3xl text-zinc-600 text-sm">
                      Carrinho vazio
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {cart.map(item => (
                        <div key={item.productId} className={cn(
                          "p-4 rounded-2xl border flex flex-col gap-3",
                          isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
                        )}>
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-sm font-bold leading-tight">{item.name}</span>
                            <button onClick={() => removeFromCart(item.productId)} className="text-zinc-500 hover:text-red-500">
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400"><Minus size={14} /></button>
                              <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400"><Plus size={14} /></button>
                            </div>
                            <span className="font-bold text-blue-500">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Customer Info */}
                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Informações do Cliente</h3>
                  <div className="space-y-3">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                      <input
                        placeholder="Nome do Cliente"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className={cn(
                          "w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                          isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
                        )}
                      />
                    </div>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                      <input
                        placeholder="CPF"
                        value={customerCPF}
                        onChange={(e) => setCustomerCPF(e.target.value)}
                        className={cn(
                          "w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                          isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment & Seller */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Vendedor</label>
                    <input
                      value={sellerName}
                      onChange={(e) => setSellerName(e.target.value)}
                      className={cn(
                        "w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                        isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
                      )}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Método de Pagamento</label>
                    <div className="flex gap-2">
                      {(['PIX', 'Cartão', 'Dinheiro'] as const).map(method => (
                        <button
                          key={method}
                          onClick={() => setPaymentMethod(method)}
                          className={cn(
                            "flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5",
                            paymentMethod === method
                              ? "bg-blue-500/10 border-blue-500 text-blue-500 shadow-sm"
                              : isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-500" : "bg-white border-zinc-200 text-zinc-500"
                          )}
                        >
                          {method === 'PIX' && <QrCode size={14} />}
                          {method === 'Cartão' && <CreditCard size={14} />}
                          {method === 'Dinheiro' && <Banknote size={14} />}
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer: Summary and Action */}
              <div className={cn(
                "p-6 border-t space-y-4",
                isDarkMode ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"
              )}>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-zinc-500">
                    <span>Subtotal</span>
                    <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-red-500">
                    <span>Desconto</span>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className={cn(
                        "w-24 text-right px-2 py-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-500/50",
                        isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-zinc-200 shadow-sm"
                      )}
                    />
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
                    <span className="text-lg font-black uppercase tracking-tighter">Total</span>
                    <span className="text-2xl font-black text-blue-500">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finalValue)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSaveSale}
                  className={cn(
                    "w-full py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 font-black uppercase tracking-tighter transition-all shadow-lg shadow-blue-500/20",
                    isDarkMode ? "text-black" : "text-white"
                  )}
                >
                  Finalizar Venda
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SalesModal;
