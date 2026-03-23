export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  costPrice: number;
  sku: string;
  condition: 'Pronto para Venda' | 'Com Defeito' | 'Pendente';
  lastUpdated: string;
  isService?: boolean;
}

export interface ServiceOrder {
  id: string;
  customerName: string;
  customerPhone?: string;
  customerCPF?: string;
  equipment: string;
  serialNumber?: string;
  problemDescription: string;
  status: 'Pendente' | 'Em Andamento' | 'Concluído' | 'Cancelado' | 'Em Análise' | 'Aguardando Peças' | 'Pronto' | 'Entregue';
  priority: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
  entryDate: string;
  deliveryDate?: string;
  technician?: string;
  estimatedCost?: number;
  observations?: string;
  servicePerformed?: string;
  items?: SaleItem[]; // Parts used in the service
}

export interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  costPrice?: number;
  priceType: 'Individual' | 'Kit';
  warranty: string;
  total: number;
}

export interface SaleHistoryEntry {
  timestamp: string;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'revert' | 'cancel';
  details: string;
  previousState?: string; // JSON string of the sale before this change
}

export interface Sale {
  id: string;
  items: SaleItem[];
  totalValue: number;
  discount: number;
  finalValue: number;
  seller: string;
  customerName?: string;
  customerEmail?: string;
  customerCPF?: string;
  customerPhone?: string;
  paymentMethod: 'PIX' | 'Cartão' | 'Dinheiro';
  timestamp: string;
  status?: 'active' | 'cancelled';
  history?: SaleHistoryEntry[];
}

export type Category = 'Hardware' | 'Periféricos' | 'Redes' | 'Armazenamento' | 'Serviços' | 'Outros';

export const CATEGORIES: Category[] = ['Hardware', 'Periféricos', 'Redes', 'Armazenamento', 'Serviços', 'Outros'];

export interface User {
  id: string;
  username: string;
  password?: string;
  role: 'admin' | 'supervisor' | 'user';
  name: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  address?: string;
  totalSpent: number;
  lastPurchase?: string;
  createdAt: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: 'create_sale' | 'update_sale' | 'delete_sale' | 'revert_sale' | 'cancel_sale' | 'system_backup' | 'system_restore' | 'create_customer' | 'update_customer' | 'delete_customer' | 'create_os' | 'update_os' | 'delete_os' | 'create_product' | 'update_product' | 'delete_product' | 'login' | 'logout' | 'error';
  details: string;
  payload?: any;
}
