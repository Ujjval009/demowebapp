import type { Product } from '../types';

export const CATEGORIES = ['Viennoiserie', 'Artisan Breads', 'Cakes & Slices', 'Cookies & Bites'] as const;

export const products: Product[] = [
  { id: 'p01', name: 'Butter Croissant', price: 65, emoji: '🥐', category: 'Viennoiserie' },
  { id: 'p02', name: 'Pain au Chocolat', price: 85, emoji: '🥐', category: 'Viennoiserie' },
  { id: 'p03', name: 'Cinnamon Roll', price: 70, emoji: '🥨', category: 'Viennoiserie' },
  { id: 'p04', name: 'Almond Danish', price: 95, emoji: '🥐', category: 'Viennoiserie' },
  { id: 'p05', name: 'Sourdough Loaf', price: 180, emoji: '🍞', category: 'Artisan Breads' },
  { id: 'p06', name: 'Whole Wheat Bread', price: 90, emoji: '🍞', category: 'Artisan Breads' },
  { id: 'p07', name: 'Multigrain Roll', price: 55, emoji: '🥖', category: 'Artisan Breads' },
  { id: 'p08', name: 'Ciabatta', price: 120, emoji: '🥖', category: 'Artisan Breads' },
  { id: 'p09', name: 'Choco Muffin', price: 55, emoji: '🧁', category: 'Cakes & Slices' },
  { id: 'p10', name: 'Red Velvet Slice', price: 120, emoji: '🍰', category: 'Cakes & Slices' },
  { id: 'p11', name: 'Blueberry Cheesecake', price: 160, emoji: '🍰', category: 'Cakes & Slices' },
  { id: 'p12', name: 'Gooey Brownie', price: 75, emoji: '🍫', category: 'Cakes & Slices' },
  { id: 'p13', name: 'Oat & Choc Cookie', price: 40, emoji: '🍪', category: 'Cookies & Bites' },
  { id: 'p14', name: 'Macaron Trio', price: 180, emoji: '🍬', category: 'Cookies & Bites' },
  { id: 'p15', name: 'Granola Cup', price: 65, emoji: '🍯', category: 'Cookies & Bites' },
  { id: 'p16', name: 'Cream Donut', price: 60, emoji: '🍩', category: 'Cookies & Bites' },
];