export type ViewKey =
  | 'dashboard'
  | 'pos'
  | 'inventory'
  | 'expiry'
  | 'analytics'
  | 'crm'
  | 'franchise';

export type ToastType = 'success' | 'info' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export interface NavItem {
  key: ViewKey;
  label: string;
  icon: string;
  badge?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  emoji: string;
  category: string;
}

export interface CartLine {
  product: Product;
  qty: number;
}

export interface RawMaterial {
  id: string;
  name: string;
  unit: string;
  stock: number;
  reorderLevel: number;
}

export type ExpiryStatus = 'Fresh' | 'Watch' | 'Markdown';

export interface ExpiryBatch {
  id: string;
  product: string;
  branch: string;
  baked: string;
  expiresInHrs: number;
  status: ExpiryStatus;
  markedDown?: boolean;
}

export type Compliance = 'Up to date' | 'Audit due';

export interface Branch {
  id: string;
  name: string;
  revenueMtd: number;
  royalty: number;
  compliance: Compliance;
}

export type CustomerTier = 'Gold' | 'Silver' | 'Bronze';

export interface Customer {
  id: string;
  name: string;
  tier: CustomerTier;
  points: number;
  lastVisit: string;
  email: string;
  phone: string;
  totalSpend: number;
  visits: number;
}

export interface RevenuePoint {
  day: string;
  revenue: number;
  orders: number;
}

export interface BranchSales {
  branch: string;
  revenue: number;
  target: number;
}

export interface BestSeller {
  product: string;
  units: number;
  revenue: number;
}

export interface ModuleCard {
  key: ViewKey;
  icon: string;
  title: string;
  desc: string;
  tone: number;
}