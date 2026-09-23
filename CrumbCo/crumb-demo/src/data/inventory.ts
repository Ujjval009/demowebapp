import type { RawMaterial } from '../types';

export const rawMaterials: RawMaterial[] = [
  { id: 'm1', name: 'Refined Flour (Maida)', unit: 'kg', stock: 48, reorderLevel: 20 },
  { id: 'm2', name: 'Butter', unit: 'kg', stock: 6, reorderLevel: 10 },
  { id: 'm3', name: 'Cocoa Powder', unit: 'kg', stock: 2, reorderLevel: 5 },
  { id: 'm4', name: 'Fresh Cream', unit: 'L', stock: 14, reorderLevel: 8 },
  { id: 'm5', name: 'Active Yeast', unit: 'g', stock: 900, reorderLevel: 1000 },
  { id: 'm6', name: 'Dark Chocolate Chips', unit: 'kg', stock: 1.5, reorderLevel: 2 },
  { id: 'm7', name: 'Free-Range Eggs', unit: 'pcs', stock: 120, reorderLevel: 100 },
  { id: 'm8', name: 'Apricot Jam', unit: 'kg', stock: 9, reorderLevel: 6 },
];

export const RESTOCK_AMOUNT: Record<string, number> = {
  m1: 25,
  m2: 8,
  m3: 5,
  m4: 10,
  m5: 1000,
  m6: 3,
  m7: 50,
  m8: 6,
};