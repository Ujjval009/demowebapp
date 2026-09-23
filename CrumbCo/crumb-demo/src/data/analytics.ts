import type { BestSeller, BranchSales, Customer, RevenuePoint } from '../types';

export const customers: Customer[] = [
  { id: 'c1', name: 'Priya Raman', tier: 'Gold', points: 1240, lastVisit: '2 days ago', email: 'priya.raman@example.com', phone: '+91 98400 11223', totalSpend: 18500, visits: 34 },
  { id: 'c2', name: 'Arjun Krishnan', tier: 'Silver', points: 480, lastVisit: 'Today', email: 'arjun.k@example.com', phone: '+91 98400 44556', totalSpend: 7200, visits: 12 },
  { id: 'c3', name: 'Meera Shankar', tier: 'Gold', points: 2010, lastVisit: 'Yesterday', email: 'meera.sh@example.com', phone: '+91 98400 77889', totalSpend: 24100, visits: 41 },
  { id: 'c4', name: 'Vikram Nair', tier: 'Bronze', points: 180, lastVisit: '5 days ago', email: 'vikram.n@example.com', phone: '+91 98400 99001', totalSpend: 3100, visits: 5 },
  { id: 'c5', name: 'Divya Menon', tier: 'Silver', points: 610, lastVisit: '3 days ago', email: 'divya.m@example.com', phone: '+91 98400 22334', totalSpend: 8900, visits: 17 },
  { id: 'c6', name: 'Rahul Iyer', tier: 'Bronze', points: 240, lastVisit: '1 week ago', email: 'rahul.iyer@example.com', phone: '+91 98400 55667', totalSpend: 4100, visits: 9 },
];

function nextTierPoints(tier: Customer['tier']): number {
  switch (tier) {
    case 'Gold':
      return 5000;
    case 'Silver':
      return 1000;
    default:
      return 500;
  }
}

export { nextTierPoints };

export const revenueByDay: RevenuePoint[] = [
  { day: 'Mon', revenue: 64200, orders: 412 },
  { day: 'Tue', revenue: 71300, orders: 455 },
  { day: 'Wed', revenue: 58800, orders: 388 },
  { day: 'Thu', revenue: 79600, orders: 502 },
  { day: 'Fri', revenue: 68400, orders: 447 },
  { day: 'Sat', revenue: 92400, orders: 589 },
  { day: 'Sun', revenue: 98100, orders: 612 },
];

export const branchSales: BranchSales[] = [
  { branch: 'Anna Nagar', revenue: 842000, target: 900000 },
  { branch: 'T. Nagar', revenue: 610500, target: 650000 },
  { branch: 'RS Puram', revenue: 498200, target: 520000 },
  { branch: 'Gandhipuram', revenue: 534000, target: 560000 },
  { branch: 'Peelamedu', revenue: 389400, target: 420000 },
];

export const bestSellers: BestSeller[] = [
  { product: 'Butter Croissant', units: 412, revenue: 26780 },
  { product: 'Sourdough Loaf', units: 198, revenue: 35640 },
  { product: 'Choco Muffin', units: 350, revenue: 19250 },
  { product: 'Red Velvet Slice', units: 164, revenue: 19680 },
  { product: 'Cinnamon Roll', units: 288, revenue: 20160 },
];