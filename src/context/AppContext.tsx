import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product, Sale, Customer, ServiceOrder, User, LogEntry, SaleItem, Seller } from '../types';
import * as Constants from '../constants';
import { printInventory, printServiceOrder, printServiceReceipt, printSalesReport, printSaleReceipt } from '../utils/print';

interface AppContextType {
  // State
  activeTab: string;
  products: Product[];
  sales: Sale[];
  customers: Customer[];
  serviceOrders: ServiceOrder[];
  users: User[];
  sellers: Seller[];
  logs: LogEntry[];
  currentUser: User | null;
  token: string | null;
  isDataLoaded: boolean;
  // Theme
  isDarkMode: boolean;
  searchQuery: string;
  debouncedSearchQuery: string;
  enableServices: boolean;

  // Modal States
  isDistributorModalOpen: boolean;
  isModalOpen: boolean;
  isSalesModalOpen: boolean;
  isCustomerModalOpen: boolean;
  isOSModalOpen: boolean;
  isUserModalOpen: boolean;
  isLogsModalOpen: boolean;
  isCalculatorOpen: boolean;
  isNotificationsOpen: boolean;

  // Editing States
  editingProduct: Product | null;
  editingSale: Sale | null;
  editingCustomer: Customer | null;
  editingOS: ServiceOrder | null;
  editingUser: User | null;
  cart: SaleItem[];
  sellerName: string;
  customerName: string;
  customerEmail: string;
  customerCPF: string;
  customerPhone: string;
  paymentMethod: 'PIX' | 'Cartão' | 'Dinheiro';
  discount: number;

  // OS States
  osCustomerName: string;
  osCustomerPhone: string;
  osCustomerCPF: string;
  osItems: SaleItem[];

  // User States
  newUserName: string;
  newUserUsername: string;
  newUserPassword: string;
  newUserRole: 'admin' | 'supervisor' | 'user';

  // Settings
  distributorName: string;
  distributorLogo: string | null;
  distributorLogoBlend: 'normal' | 'multiply' | 'screen';
  distributorIcon: string;
  distributorColor: string;
  distributorDescription: string;
  distributorLabel: string;
  appName: string;
  appIcon: string;
  lowStockThreshold: number;
  warrantyTerm: string;

  // Actions
  setActiveTab: (tab: string) => void;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  setServiceOrders: React.Dispatch<React.SetStateAction<ServiceOrder[]>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setSellers: React.Dispatch<React.SetStateAction<Seller[]>>;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setEnableServices: React.Dispatch<React.SetStateAction<boolean>>;

  setIsDistributorModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSalesModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCustomerModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOSModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSellerModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLogsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCalculatorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNotificationsOpen: React.Dispatch<React.SetStateAction<boolean>>;

  setEditingProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  setEditingSale: React.Dispatch<React.SetStateAction<Sale | null>>;
  setEditingCustomer: React.Dispatch<React.SetStateAction<Customer | null>>;
  setEditingOS: React.Dispatch<React.SetStateAction<ServiceOrder | null>>;
  setEditingUser: React.Dispatch<React.SetStateAction<User | null>>;
  setEditingSeller: React.Dispatch<React.SetStateAction<Seller | null>>;
  setCart: React.Dispatch<React.SetStateAction<SaleItem[]>>;
  setSellerName: React.Dispatch<React.SetStateAction<string>>;
  setCustomerName: React.Dispatch<React.SetStateAction<string>>;
  setCustomerEmail: React.Dispatch<React.SetStateAction<string>>;
  setCustomerCPF: React.Dispatch<React.SetStateAction<string>>;
  setCustomerPhone: React.Dispatch<React.SetStateAction<string>>;
  setPaymentMethod: React.Dispatch<React.SetStateAction<'PIX' | 'Cartão' | 'Dinheiro'>>;
  setDiscount: React.Dispatch<React.SetStateAction<number>>;

  setOsCustomerName: React.Dispatch<React.SetStateAction<string>>;
  setOsCustomerPhone: React.Dispatch<React.SetStateAction<string>>;
  setOsCustomerCPF: React.Dispatch<React.SetStateAction<string>>;
  setOsItems: React.Dispatch<React.SetStateAction<SaleItem[]>>;

  setNewUserName: React.Dispatch<React.SetStateAction<string>>;
  setNewUserUsername: React.Dispatch<React.SetStateAction<string>>;
  setNewUserPassword: React.Dispatch<React.SetStateAction<string>>;
  setNewUserRole: React.Dispatch<React.SetStateAction<'admin' | 'supervisor' | 'user'>>;
  setLowStockThreshold: React.Dispatch<React.SetStateAction<number>>;

  // Handlers
  handleDeleteProduct: (id: string) => Promise<void>;
  handleDeleteCustomer: (id: string) => Promise<void>;
  handleSaveCustomer: (customerData: Partial<Customer>) => Promise<void>;
  handleSaveSeller: (sellerData: Partial<Seller>) => Promise<void>;
  handleSaveOS: (osData: Partial<ServiceOrder>) => Promise<void>;
  handleSaveUser: () => Promise<void>;
  handleExportData: () => void;
  handleImportData: (data: any) => Promise<void>;
  handleRestoreSale: (sale: Sale) => Promise<void>;
  handleDeleteOS: (id: string) => Promise<void>;
  handleDeleteUser: (id: string) => Promise<void>;
  handleDeleteSeller: (id: string) => Promise<void>;
  handleSaveProduct: (productData: any) => Promise<void>;
  handleSaveSale: () => Promise<void>;
  handleEditSale: (sale: Sale) => void;
  handleDeleteSale: (sale: Sale) => Promise<void>;
  showNotification: (message: string, type?: 'success' | 'error') => void;
  addLog: (action: LogEntry['action'], details: string, payload?: any) => Promise<void>;
  saveSetting: (key: string, value: string) => Promise<void>;
  handleLogout: () => void;

  // Stats
  stats: any;
  filteredProducts: Product[];

  // Notifications state
  notification: { message: string; type: 'success' | 'error' } | null;
  setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(Constants.CURRENT_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem(Constants.TOKEN_KEY));
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem(Constants.DARK_MODE_KEY);
    return savedMode ? JSON.parse(savedMode) : true;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [enableServices, setEnableServices] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [isOSModalOpen, setIsOSModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDistributorModalOpen, setIsDistributorModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editingOS, setEditingOS] = useState<ServiceOrder | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [sellerName, setSellerName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerCPF, setCustomerCPF] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'Cartão' | 'Dinheiro'>('PIX');
  const [discount, setDiscount] = useState(0);

  const [osCustomerName, setOsCustomerName] = useState('');
  const [osCustomerPhone, setOsCustomerPhone] = useState('');
  const [osCustomerCPF, setOsCustomerCPF] = useState('');
  const [osItems, setOsItems] = useState<SaleItem[]>([]);

  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'supervisor' | 'user'>('user');

  // Settings
  const [distributorName, setDistributorName] = useState('BELEMTI');
  const [distributorLogo, setDistributorLogo] = useState<string | null>(null);
  const [distributorLogoBlend, setDistributorLogoBlend] = useState<'normal' | 'multiply' | 'screen'>('normal');
  const [distributorIcon, setDistributorIcon] = useState('Shield');
  const [distributorColor, setDistributorColor] = useState('#3b82f6');
  const [distributorDescription, setDistributorDescription] = useState('VEM PRA CÁ QUE AGENTE RESOLVE');
  const [distributorLabel, setDistributorLabel] = useState('');
  const [appName, setAppName] = useState('BELEMTI');
  const [appIcon, setAppIcon] = useState('Shield');
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);
  const [warrantyTerm, setWarrantyTerm] = useState(`1. A garantia é válida apenas para defeitos de fabricação, não cobrindo danos causados por mau uso, quedas, umidade ou oscilações de energia.
2. O prazo de garantia é individual para cada produto, conforme especificado na tabela acima, a contar da data desta venda.
3. Para acionar a garantia, é obrigatória a apresentação deste documento e o produto deve estar com seus lacres de segurança intactos.
4. A garantia não cobre perda de dados ou softwares instalados.`);

  const fetchWithAuth = useCallback(async (url: string, options: RequestInit = {}) => {
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${localStorage.getItem(Constants.TOKEN_KEY)}`,
      'Content-Type': 'application/json',
    };
    return fetch(url, { ...options, headers });
  }, []);

  const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!token) {
        setIsDataLoaded(true);
        return;
      }

      try {
        const fetchJson = async (url: string) => {
          const res = await fetchWithAuth(url);
          if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
              handleLogout();
              throw new Error('Sessão expirada ou inválida');
            }
            throw new Error(`Error fetching ${url}: ${res.statusText}`);
          }
          return res.json();
        };

        const [productsRes, salesRes, customersRes, osRes, usersRes, settingsRes, logsRes] = await Promise.all([
          fetchJson('/api/products'),
          fetchJson('/api/sales'),
          fetchJson('/api/customers'),
          fetchJson('/api/service-orders'),
          (currentUser?.role === 'admin' || currentUser?.role === 'supervisor') ? fetchJson('/api/users') : Promise.resolve([]),
          fetchJson('/api/settings'),
          (currentUser?.role === 'admin') ? fetchJson('/api/logs') : Promise.resolve([]),
        ]);

        if (Array.isArray(productsRes)) setProducts(productsRes);
        if (Array.isArray(salesRes)) setSales(salesRes);
        if (Array.isArray(customersRes)) setCustomers(customersRes);
        if (Array.isArray(osRes)) setServiceOrders(osRes);
        if (Array.isArray(usersRes)) setUsers(usersRes);
        if (Array.isArray(logsRes)) setLogs(logsRes);

        if (settingsRes && !settingsRes.error) {
          if (settingsRes.distributorName) setDistributorName(settingsRes.distributorName);
          if (settingsRes.distributorDescription) setDistributorDescription(settingsRes.distributorDescription);
          if (settingsRes.distributorLabel) setDistributorLabel(settingsRes.distributorLabel);
          if (settingsRes.distributorLogo) setDistributorLogo(settingsRes.distributorLogo);
          if (settingsRes.distributorLogoBlend) setDistributorLogoBlend(settingsRes.distributorLogoBlend as any);
          if (settingsRes.distributorIcon) setDistributorIcon(settingsRes.distributorIcon);
          if (settingsRes.distributorColor) setDistributorColor(settingsRes.distributorColor);
          if (settingsRes.appName) setAppName(settingsRes.appName);
          if (settingsRes.appIcon) setAppIcon(settingsRes.appIcon);
          if (settingsRes.lowStockThreshold) setLowStockThreshold(Number(settingsRes.lowStockThreshold));
          if (settingsRes.warrantyTerm) setWarrantyTerm(settingsRes.warrantyTerm);
          if (settingsRes.enableServices) setEnableServices(settingsRes.enableServices === 'true' || settingsRes.enableServices === true);
        }

        setIsDataLoaded(true);
      } catch (err: any) {
        if (err.message !== 'Unauthorized') {
          console.error('Failed to load data from API', err);
          showNotification('Erro ao carregar dados do servidor', 'error');
        }
      }
    };

    loadData();
  }, [token, fetchWithAuth, showNotification]);

  const addLog = async (action: LogEntry['action'], details: string, payload?: any) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || 'system',
      userName: currentUser?.name || 'Sistema',
      action,
      details,
      payload
    };
    setLogs(prev => [newLog, ...prev]);

    await fetchWithAuth('/api/logs', {
      method: 'POST',
      body: JSON.stringify(newLog)
    });
  };

  const saveSetting = async (key: string, value: string) => {
    // Update local state first for immediate feedback
    switch (key) {
      case 'distributorName': setDistributorName(value); break;
      case 'distributorDescription': setDistributorDescription(value); break;
      case 'distributorLabel': setDistributorLabel(value); break;
      case 'distributorIcon': setDistributorIcon(value); break;
      case 'distributorColor': setDistributorColor(value); break;
      case 'distributorLogo': setDistributorLogo(value); break;
      case 'distributorLogoBlend': setDistributorLogoBlend(value as any); break;
      case 'appName': setAppName(value); break;
      case 'appIcon': setAppIcon(value); break;
      case 'lowStockThreshold': setLowStockThreshold(Number(value)); break;
      case 'warrantyTerm': setWarrantyTerm(value); break;
      case 'enableServices': setEnableServices(value === 'true' || value === 'true'); break;
    }

    try {
      await fetchWithAuth('/api/settings', {
        method: 'POST',
        body: JSON.stringify({ key, value })
      });
    } catch (err) {
      console.error('Failed to save setting', err);
      showNotification('Erro ao salvar configuração no servidor', 'error');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem(Constants.CURRENT_USER_KEY);
    localStorage.removeItem(Constants.TOKEN_KEY);
    setActiveTab('dashboard');
    showNotification('Sessão encerrada');
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;
    try {
      const res = await fetchWithAuth(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        showNotification('Produto excluído com sucesso');
        addLog('delete_product', `Produto ID ${id} excluído`);
      }
    } catch (err) {
      showNotification('Erro ao excluir produto', 'error');
    }
  };

  const handleEditSale = (sale: Sale) => {
    if (currentUser?.role === 'user') {
      showNotification('Apenas administradores e supervisores podem editar vendas', 'error');
      return;
    }
    setEditingSale(sale);
    setCart(sale.items);
    setSellerName(sale.seller);
    setCustomerName(sale.customerName || '');
    setCustomerEmail(sale.customerEmail || '');
    setCustomerCPF(sale.customerCPF || '');
    setCustomerPhone(sale.customerPhone || '');
    setPaymentMethod(sale.paymentMethod);
    setDiscount(sale.discount);
    setIsSalesModalOpen(true);
  };

  const handleDeleteSale = async (sale: Sale) => {
    if (currentUser?.role === 'user') {
      showNotification('Apenas administradores e supervisores podem cancelar vendas', 'error');
      return;
    }

    const isCancelled = sale.status === 'cancelled';

    if (isCancelled) {
      if (currentUser?.role !== 'admin') {
        showNotification('Apenas administradores podem excluir permanentemente uma venda cancelada', 'error');
        return;
      }
      if (confirm('Deseja excluir permanentemente esta venda cancelada do sistema? Esta ação será registrada no log.')) {
        setSales(prev => prev.filter(s => s.id !== sale.id));
        await fetchWithAuth(`/api/sales/${sale.id}`, { method: 'DELETE' });
        addLog('delete_sale', `Venda ${sale.id} excluída permanentemente`, sale);
        showNotification('Venda excluída permanentemente');
      }
      return;
    }

    if (confirm('Deseja cancelar esta venda? O estoque será restaurado e a ação será registrada no log.')) {
      const updatedProducts = products.map(product => {
        const saleItem = sale.items.find(item => item.productId === product.id);
        if (saleItem && !product.isService) {
          return { ...product, quantity: product.quantity + saleItem.quantity };
        }
        return product;
      });
      setProducts(updatedProducts);

      // Save updated products
      for (const p of updatedProducts) {
        const saleItem = sale.items.find(item => item.productId === p.id);
        if (saleItem && !p.isService) {
          await fetchWithAuth('/api/products', {
            method: 'POST',
            body: JSON.stringify(p)
          });
        }
      }

      const updatedSale: Sale = {
        ...sale,
        status: 'cancelled'
      };

      setSales(prev => prev.map(s => s.id === sale.id ? updatedSale : s));
      await fetchWithAuth('/api/sales', {
        method: 'POST',
        body: JSON.stringify(updatedSale)
      });

      addLog('cancel_sale', `Venda ${sale.id} cancelada`, sale);
      showNotification('Venda cancelada e estoque restaurado.', 'error');
    }
  };

  const handleSaveSale = async () => {
    if (cart.length === 0) {
      showNotification('Adicione itens ao carrinho!', 'error');
      return;
    }
    if (!sellerName) {
      showNotification('Informe o nome do vendedor!', 'error');
      return;
    }

    const totalValue = cart.reduce((acc, item) => acc + item.total, 0);
    const finalValue = totalValue - discount;

    let sale: Sale;
    if (editingSale) {
      // Revert stock for old sale items first
      const restoredProducts = products.map(p => {
        const oldItem = editingSale.items.find(item => item.productId === p.id);
        if (oldItem && !p.isService) {
          return { ...p, quantity: p.quantity + oldItem.quantity };
        }
        return p;
      });

      // Apply new sale items
      const updatedProducts = restoredProducts.map(p => {
        const newItem = cart.find(item => item.productId === p.id);
        if (newItem && !p.isService) {
          return { ...p, quantity: p.quantity - newItem.quantity };
        }
        return p;
      });

      setProducts(updatedProducts);

      sale = {
        ...editingSale,
        items: cart,
        totalValue,
        discount,
        finalValue,
        seller: sellerName,
        customerName,
        customerEmail,
        customerCPF,
        customerPhone,
        paymentMethod,
        timestamp: new Date().toISOString()
      };
    } else {
      sale = {
        id: Math.random().toString(36).substr(2, 9),
        items: cart,
        totalValue,
        discount,
        finalValue,
        seller: sellerName,
        customerName,
        customerEmail,
        customerCPF,
        customerPhone,
        paymentMethod,
        timestamp: new Date().toISOString(),
        status: 'active'
      };
    }

    try {
      const res = await fetchWithAuth('/api/sales', {
        method: 'POST',
        body: JSON.stringify(sale)
      });

      if (!res.ok) {
        throw new Error(`Erro ao salvar venda: ${res.statusText}`);
      }

      if (editingSale) {
        setSales(prev => prev.map(s => s.id === editingSale.id ? sale : s));
        showNotification('Venda atualizada com sucesso!');
        addLog('update_sale', `Venda ${sale.id} atualizada`, sale);
      } else {
        setSales(prev => [sale, ...prev]);
        showNotification('Venda realizada com sucesso!');
        addLog('create_sale', `Venda ${sale.id} realizada`, sale);

        // Update product quantities locally
        const updatedProducts = products.map(p => {
          const item = (cart as any).find((i: any) => i.productId === p.id);
          if (item && !p.isService) {
            return { ...p, quantity: p.quantity - item.quantity };
          }
          return p;
        });
        setProducts(updatedProducts);

        if (window.confirm('Venda realizada! Deseja imprimir o comprovante/garantia?')) {
          printSaleReceipt(
            sale,
            distributorName,
            distributorDescription,
            distributorLabel,
            distributorLogo || null,
            distributorIcon,
            distributorColor,
            warrantyTerm,
            distributorLogoBlend
          );
        }
        // Update customer totalSpent
        if (customerName) {
          const matchedCustomer = customers.find(c =>
            c.name === customerName ||
            (customerCPF && c.cpf && c.cpf.replace(/\D/g, '') === customerCPF.replace(/\D/g, ''))
          );
          if (matchedCustomer) {
            const updatedCustomer = {
              ...matchedCustomer,
              totalSpent: (matchedCustomer.totalSpent || 0) + finalValue
            };
            setCustomers(prev => prev.map(c => c.id === matchedCustomer.id ? updatedCustomer : c));
            fetchWithAuth('/api/customers', {
              method: 'POST',
              body: JSON.stringify(updatedCustomer)
            }).catch(err => console.error('Failed to update customer totalSpent', err));
          }
        }
      }

      setIsSalesModalOpen(false);
      setEditingSale(null);
      setCart([]);
      setSellerName('');
      setCustomerName('');
      setCustomerEmail('');
      setCustomerCPF('');
      setCustomerPhone('');
      setDiscount(0);

    } catch (err) {
      console.error('Failed to save sale', err);
      showNotification('Erro ao salvar venda no servidor. Verifique sua conexão.', 'error');
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    const customer = customers.find(c => c.id === id);
    if (!customer) return;
    if (!window.confirm(`Deseja realmente excluir o cliente ${customer.name}?`)) return;
    try {
      const res = await fetchWithAuth(`/api/customers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCustomers(prev => prev.filter(c => c.id !== id));
        showNotification('Cliente excluído com sucesso');
        addLog('delete_customer', `Cliente ${customer.name} excluído`);
      }
    } catch (err) {
      showNotification('Erro ao excluir cliente', 'error');
    }
  };

  const handleSaveCustomer = async (customerData: Partial<Customer>) => {
    let customer: Customer;
    if (editingCustomer) {
      customer = { ...editingCustomer, ...customerData } as Customer;
    } else {
      customer = {
        id: Math.random().toString(36).substr(2, 9),
        name: customerData.name || '',
        email: customerData.email,
        phone: customerData.phone,
        cpf: customerData.cpf,
        address: customerData.address,
        totalSpent: 0,
        createdAt: new Date().toISOString(),
      };
    }

    try {
      const res = await fetchWithAuth('/api/customers', {
        method: 'POST',
        body: JSON.stringify(customer)
      });

      if (!res.ok) {
        throw new Error(`Erro ao salvar cliente: ${res.statusText}`);
      }

      if (editingCustomer) {
        setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? customer : c));
        showNotification('Cliente atualizado com sucesso');
        addLog('update_customer', `Cliente atualizado: ${customerData.name}`, { id: editingCustomer.id, ...customerData });
      } else {
        setCustomers(prev => [customer, ...prev]);
        showNotification('Cliente cadastrado com sucesso');
        addLog('create_customer', `Novo cliente cadastrado: ${customer.name}`, customer);
      }

      setIsCustomerModalOpen(false);
      setEditingCustomer(null);

    } catch (err) {
      console.error('Failed to save customer', err);
      showNotification('Erro ao salvar no servidor. Verifique sua conexão.', 'error');
    }
  };

  const handleSaveSeller = async (sellerData: Partial<Seller>) => {
    let seller: Seller;
    if (editingSeller) {
      seller = { ...editingSeller, ...sellerData } as Seller;
    } else {
      seller = {
        id: Math.random().toString(36).substr(2, 9),
        name: sellerData.name || '',
        email: sellerData.email,
        phone: sellerData.phone,
      };
    }

    try {
      const res = await fetchWithAuth('/api/sellers', {
        method: 'POST',
        body: JSON.stringify(seller)
      });
      if (!res.ok) throw new Error('Failed to save seller');

      if (editingSeller) {
        setSellers(prev => prev.map(s => s.id === editingSeller.id ? seller : s));
        showNotification('Vendedor atualizado com sucesso');
        addLog('update_seller', `Vendedor atualizado: ${seller.name}`, seller);
      } else {
        setSellers(prev => [...prev, seller]);
        showNotification('Vendedor cadastrado com sucesso');
        addLog('create_seller', `Novo vendedor: ${seller.name}`, seller);
      }
      setIsSellerModalOpen(false);
      setEditingSeller(null);
    } catch (err) {
      showNotification('Erro ao salvar vendedor', 'error');
    }
  };

  const handleDeleteSeller = async (id: string) => {
    const seller = sellers.find(s => s.id === id);
    if (!seller) return;
    if (!window.confirm(`Excluir vendedor ${seller.name}?`)) return;

    try {
      const res = await fetchWithAuth(`/api/sellers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete seller');
      setSellers(prev => prev.filter(s => s.id !== id));
      showNotification('Vendedor excluído com sucesso');
      addLog('delete_seller', `Vendedor excluído: ${seller.name}`);
    } catch (err) {
      showNotification('Erro ao excluir vendedor', 'error');
    }
  };

  const handleDeleteOS = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta ordem de serviço?')) return;
    try {
      const res = await fetchWithAuth(`/api/service-orders/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setServiceOrders(prev => prev.filter(os => os.id !== id));
        showNotification('OS excluída com sucesso');
        addLog('delete_os', `OS ID ${id} excluída`);
      }
    } catch (err) {
      showNotification('Erro ao excluir OS', 'error');
    }
  };

  const handleSaveOS = async (osData: Partial<ServiceOrder>) => {
    const { printServiceOrder, printServiceReceipt } = await import('../utils/print');

    let os: ServiceOrder;
    const isEditing = !!editingOS;

    if (isEditing && editingOS) {
      os = {
        ...editingOS,
        ...osData,
        customerName: osCustomerName,
        customerPhone: osCustomerPhone,
        customerCPF: osCustomerCPF,
        items: osItems
      } as ServiceOrder;
    } else {
      os = {
        id: `OS-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        customerName: osCustomerName,
        customerPhone: osCustomerPhone,
        customerCPF: osCustomerCPF,
        equipment: osData.equipment || '',
        serialNumber: osData.serialNumber,
        problemDescription: osData.problemDescription || '',
        status: osData.status || 'Pendente',
        priority: osData.priority || 'Média',
        entryDate: osData.entryDate || new Date().toISOString(),
        technician: osData.technician,
        estimatedCost: osData.estimatedCost,
        observations: osData.observations || '',
        servicePerformed: osData.servicePerformed || '',
        items: osItems,
      };
    }

    try {
      const res = await fetchWithAuth('/api/service-orders', {
        method: 'POST',
        body: JSON.stringify(os)
      });

      if (!res.ok) {
        throw new Error(`Erro ao salvar OS: ${res.statusText}`);
      }

      // Only update local state if API succeeded
      if (isEditing) {
        setServiceOrders(prev => prev.map(o => o.id === (editingOS as ServiceOrder).id ? os : o));
        showNotification('Ordem de Serviço atualizada com sucesso');
        addLog('update_os', `OS atualizada: ${os.equipment} - ${os.customerName}`, { id: os.id, ...osData });
      } else {
        setServiceOrders(prev => [os, ...prev]);
        showNotification('Ordem de Serviço gerada com sucesso');
        addLog('create_os', `Nova OS gerada: ${os.equipment} - ${os.customerName}`, os);

        // Auto-print only for new OS
        printServiceOrder(os, distributorName, distributorDescription, distributorLabel, distributorLogo, distributorIcon, distributorColor, distributorLogoBlend);
      }

      // Print receipt if completed
      if (os.status === 'Concluído' || os.status === 'Entregue') {
        printServiceReceipt(os, distributorName, distributorDescription, distributorLabel, distributorLogo, distributorIcon, distributorColor, warrantyTerm, distributorLogoBlend);
      }

      setIsOSModalOpen(false);
      setEditingOS(null);
      setOsCustomerName('');
      setOsCustomerPhone('');
      setOsCustomerCPF('');
      setOsItems([]);

    } catch (err) {
      console.error('Failed to save OS', err);
      showNotification('Erro ao salvar no servidor. Verifique sua conexão.', 'error');
    }
  };

  const handleSaveUser = async () => {
    if (!newUserName || !newUserUsername || (!editingUser && !newUserPassword)) {
      showNotification('Preencha todos os campos obrigatórios', 'error');
      return;
    }

    if (currentUser?.role === 'supervisor' && newUserRole !== 'user') {
      showNotification('Supervisores só podem criar usuários comuns', 'error');
      return;
    }

    const newUser: User = {
      id: editingUser ? editingUser.id : Math.random().toString(36).substr(2, 9),
      name: newUserName,
      username: newUserUsername,
      password: newUserPassword || (editingUser ? editingUser.password : ''),
      role: newUserRole
    };

    let updatedUsers: User[];
    if (editingUser) {
      updatedUsers = users.map(u => u.id === editingUser.id ? newUser : u);
      showNotification('Usuário atualizado com sucesso');
    } else {
      if (users.find(u => u.username === newUserUsername)) {
        showNotification('Este nome de usuário já existe', 'error');
        return;
      }
      updatedUsers = [newUser, ...users];
      showNotification('Usuário cadastrado com sucesso');
    }

    setUsers(updatedUsers);
    await fetchWithAuth('/api/users', {
      method: 'POST',
      body: JSON.stringify(newUser)
    });

    if (currentUser && editingUser && currentUser.id === editingUser.id) {
      setCurrentUser(newUser);
      localStorage.setItem(Constants.CURRENT_USER_KEY, JSON.stringify(newUser));
    }

    setIsUserModalOpen(false);
    setEditingUser(null);
    setNewUserName('');
    setNewUserUsername('');
    setNewUserPassword('');
    setNewUserRole('user');
  };

  const handleExportData = () => {
    const data = { products, sales, customers, serviceOrders, users, logs };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showNotification('Backup exportado com sucesso');
    addLog('system_backup', 'Backup do sistema exportado');
  };

  const handleImportData = async (data: any) => {
    if (!data.products || !data.sales) {
      showNotification('Arquivo de backup inválido', 'error');
      return;
    }

    try {
      await fetchWithAuth('/api/import', {
        method: 'POST',
        body: JSON.stringify(data)
      });

      setProducts(data.products || []);
      setSales(data.sales || []);
      setCustomers(data.customers || []);
      setServiceOrders(data.serviceOrders || []);
      setUsers(data.users || []);
      setLogs(data.logs || []);

      showNotification('Backup restaurado com sucesso');
      addLog('system_restore', 'Backup do sistema restaurado');
    } catch (err) {
      showNotification('Erro ao restaurar backup no servidor', 'error');
    }
  };

  const handleRestoreSale = async (saleToRestore: Sale) => {
    if (sales.find(s => s.id === saleToRestore.id)) {
      showNotification('Uma venda com este ID já existe no sistema.', 'error');
      return;
    }

    if (saleToRestore.status !== 'cancelled') {
      const updatedProducts = products.map(p => {
        const item = saleToRestore.items.find(i => i.productId === p.id);
        return (item && !p.isService) ? { ...p, quantity: p.quantity - item.quantity } : p;
      });
      setProducts(updatedProducts);

      for (const p of updatedProducts) {
        const item = saleToRestore.items.find(i => i.productId === p.id);
        if (item && !p.isService) {
          await fetchWithAuth('/api/products', {
            method: 'POST',
            body: JSON.stringify(p)
          });
        }
      }
    }

    setSales(prev => [saleToRestore, ...prev]);
    await fetchWithAuth('/api/sales', {
      method: 'POST',
      body: JSON.stringify(saleToRestore)
    });

    showNotification('Venda restaurada com sucesso');
    addLog('revert_sale', `Venda ${saleToRestore.id} restaurada do histórico`, { id: saleToRestore.id });
  };

  const handleDeleteUser = async (id: string) => {
    if (id === currentUser?.id) {
      showNotification('Você não pode excluir seu próprio usuário', 'error');
      return;
    }
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    try {
      const res = await fetchWithAuth(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== id));
        showNotification('Usuário excluído com sucesso');
      }
    } catch (err) {
      showNotification('Erro ao excluir usuário', 'error');
    }
  };

  const handleSaveProduct = async (productData: any) => {
    let product: Product;
    if (editingProduct) {
      product = { ...editingProduct, ...productData, lastUpdated: new Date().toISOString() };
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? product : p));
      showNotification('Produto atualizado com sucesso!');
      addLog('update_product', `Produto ${product.name} atualizado`, product);
    } else {
      product = {
        id: Math.random().toString(36).substr(2, 9),
        ...productData,
        lastUpdated: new Date().toISOString(),
      };
      setProducts(prev => [product, ...prev]);
      showNotification('Produto adicionado com sucesso!');
      addLog('create_product', `Produto ${product.name} criado`, product);
    }

    await fetchWithAuth('/api/products', {
      method: 'POST',
      body: JSON.stringify(product)
    });

    setIsModalOpen(false);
    setEditingProduct(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter(p =>
      p.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [products, debouncedSearchQuery]);

  const stats = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];
    const safeSales = Array.isArray(sales) ? sales : [];
    const safeCustomers = Array.isArray(customers) ? customers : [];
    const safeOS = Array.isArray(serviceOrders) ? serviceOrders : [];

    const totalValue = safeProducts.reduce((acc, p) => acc + (p.price * p.quantity), 0);
    const totalItems = safeProducts.reduce((acc, p) => acc + p.quantity, 0);
    const lowStockProducts = safeProducts
      .filter(p => !p.isService && p.quantity <= lowStockThreshold)
      .sort((a, b) => a.quantity - b.quantity)
      .slice(0, 5);

    const totalCustomers = safeCustomers.length;
    const pendingOS = safeOS.filter(os => os.status === 'Pendente').length;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const activeSales = safeSales.filter(s => s.status !== 'cancelled');
    const monthlySales = activeSales.filter(s => {
      const d = new Date(s.timestamp);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const totalRevenue = activeSales.reduce((acc, s) => acc + s.finalValue, 0);
    const monthlyRevenue = monthlySales.reduce((acc, s) => acc + s.finalValue, 0);

    const monthlyProfit = monthlySales.reduce((acc, sale) => {
      const saleProfit = (sale.items || []).reduce((itemAcc, item) => {
        const cost = item.costPrice || 0;
        return itemAcc + (item.unitPrice - cost) * item.quantity;
      }, 0);
      return acc + saleProfit - (sale.discount || 0);
    }, 0);

    const paymentData = [
      { name: 'PIX', value: activeSales.filter(s => s.paymentMethod === 'PIX').length },
      { name: 'Cartão', value: activeSales.filter(s => s.paymentMethod === 'Cartão').length },
      { name: 'Dinheiro', value: activeSales.filter(s => s.paymentMethod === 'Dinheiro').length },
    ];

    const productSales: Record<string, number> = {};
    activeSales.forEach(s => {
      (s.items || []).forEach(item => {
        productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
      });
    });
    const topProducts = Object.entries(productSales)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      const daySales = activeSales.filter(s => new Date(s.timestamp).toLocaleDateString() === d.toLocaleDateString());
      const total = daySales.reduce((acc, s) => acc + s.finalValue, 0);
      return { name: dateStr, total, date: d };
    }).reverse();

    return {
      totalValue, totalItems, lowStock: safeProducts.filter(p => !p.isService && p.quantity <= lowStockThreshold).length,
      lowStockProducts, monthlyProfit, paymentData, topProducts, last7Days,
      totalRevenue, monthlyRevenue, totalCustomers, pendingOS
    };
  }, [products, sales, customers, serviceOrders]);

  const value = {
    products, sales, customers, serviceOrders, users, logs, currentUser, token, isDataLoaded, isDarkMode,
    activeTab, searchQuery, debouncedSearchQuery, enableServices,
    isDistributorModalOpen, isModalOpen, isSalesModalOpen, isCustomerModalOpen, isOSModalOpen, isUserModalOpen, isLogsModalOpen,
    isCalculatorOpen, isNotificationsOpen,
    editingProduct, editingSale, editingCustomer, editingOS, editingUser, cart, sellerName,
    customerName, customerEmail, customerCPF, customerPhone, paymentMethod, discount,
    osCustomerName, osCustomerPhone, osCustomerCPF, osItems,
    newUserName, newUserUsername, newUserPassword, newUserRole,
    distributorName, distributorLogo, distributorLogoBlend, distributorIcon, distributorColor,
    distributorDescription, distributorLabel, appName, appIcon, lowStockThreshold, warrantyTerm,
    setProducts, setSales, setCustomers, setServiceOrders, setUsers, setCurrentUser, setToken,
    setIsDarkMode, setActiveTab, setSearchQuery, setEnableServices,
    setIsDistributorModalOpen, setIsModalOpen, setIsSalesModalOpen, setIsCustomerModalOpen, setIsOSModalOpen, setIsUserModalOpen, setIsLogsModalOpen,
    setIsCalculatorOpen, setIsNotificationsOpen,
    setEditingProduct, setEditingSale, setEditingCustomer, setEditingOS, setEditingUser, setCart, setSellerName,
    setCustomerName, setCustomerEmail, setCustomerCPF, setCustomerPhone, setPaymentMethod, setDiscount,
    setOsCustomerName, setOsCustomerPhone, setOsCustomerCPF, setOsItems,
    setNewUserName, setNewUserUsername, setNewUserPassword, setNewUserRole, setLowStockThreshold,
    handleDeleteProduct, handleDeleteSale, handleDeleteCustomer, handleDeleteOS, handleDeleteUser, handleSaveProduct, handleSaveSale, handleEditSale, handleSaveCustomer, handleSaveOS, handleSaveUser,
    handleExportData, handleImportData, handleRestoreSale,
    handleSaveSeller, handleDeleteSeller,
    showNotification, addLog, saveSetting, handleLogout,
    stats, filteredProducts, notification, setNotification,
    sellers, setSellers, isSellerModalOpen, setIsSellerModalOpen, editingSeller, setEditingSeller
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
