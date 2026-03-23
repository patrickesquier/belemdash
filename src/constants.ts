import { 
  Shield, Cpu, Monitor, HardDrive, Smartphone, Laptop, 
  MousePointer2, Wifi, Zap, Activity, Award, Settings, 
  Package, Box, ShoppingCart 
} from 'lucide-react';
import { Category } from './types';

export const API_URL = '';
export const STORAGE_KEY = 'belemti_inventory';
export const SALES_STORAGE_KEY = 'belemti_sales';
export const DISTRIBUTOR_KEY = 'belemti_distributor';
export const DISTRIBUTOR_LOGO_KEY = 'belemti_distributor_logo';
export const DISTRIBUTOR_ICON_KEY = 'belemti_distributor_icon';
export const DISTRIBUTOR_COLOR_KEY = 'belemti_distributor_color';
export const DISTRIBUTOR_DESC_KEY = 'belemti_distributor_desc';
export const DISTRIBUTOR_LABEL_KEY = 'belemti_distributor_label';
export const APP_NAME_KEY = 'belemti_app_name';
export const APP_ICON_KEY = 'belemti_app_icon';
export const WARRANTY_TERM_KEY = 'belemti_warranty_term';
export const USERS_STORAGE_KEY = 'belemti_users';
export const CURRENT_USER_KEY = 'belemti_current_user';
export const LOGS_STORAGE_KEY = 'belemti_logs';
export const CUSTOMERS_STORAGE_KEY = 'belemti_customers';
export const SERVICE_ORDERS_STORAGE_KEY = 'belemti_service_orders';
export const ENABLE_SERVICES_KEY = 'belemti_enable_services';
export const DARK_MODE_KEY = 'belemti_dark_mode';
export const TOKEN_KEY = 'belemti_token';

export const AVAILABLE_ICONS = [
  { name: 'Shield', icon: Shield },
  { name: 'Cpu', icon: Cpu },
  { name: 'Monitor', icon: Monitor },
  { name: 'HardDrive', icon: HardDrive },
  { name: 'Smartphone', icon: Smartphone },
  { name: 'Laptop', icon: Laptop },
  { name: 'MousePointer2', icon: MousePointer2 },
  { name: 'Wifi', icon: Wifi },
  { name: 'Zap', icon: Zap },
  { name: 'Activity', icon: Activity },
  { name: 'Award', icon: Award },
  { name: 'Settings', icon: Settings },
  { name: 'Package', icon: Package },
  { name: 'Box', icon: Box },
  { name: 'ShoppingCart', icon: ShoppingCart }
];

export const AVAILABLE_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
  '#ec4899', '#06b6d4', '#f97316', '#141414', '#71717a'
];

export const CATEGORIES: Category[] = ['Hardware', 'Periféricos', 'Redes', 'Armazenamento', 'Serviços', 'Outros'];
