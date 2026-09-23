import type { CartLine, Product } from '../../types';

export interface CartState {
  lines: CartLine[];
}

export type CartAction =
  | { type: 'ADD'; product: Product }
  | { type: 'INCR'; productId: string }
  | { type: 'DECR'; productId: string }
  | { type: 'REMOVE'; productId: string }
  | { type: 'CLEAR' };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.lines.find((l) => l.product.id === action.product.id);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.product.id === action.product.id ? { ...l, qty: l.qty + 1 } : l,
          ),
        };
      }
      return { lines: [...state.lines, { product: action.product, qty: 1 }] };
    }
    case 'INCR':
      return {
        lines: state.lines.map((l) =>
          l.product.id === action.productId ? { ...l, qty: l.qty + 1 } : l,
        ),
      };
    case 'DECR':
      return {
        lines: state.lines
          .map((l) =>
            l.product.id === action.productId ? { ...l, qty: l.qty - 1 } : l,
          )
          .filter((l) => l.qty > 0),
      };
    case 'REMOVE':
      return { lines: state.lines.filter((l) => l.product.id !== action.productId) };
    case 'CLEAR':
      return { lines: [] };
    default:
      return state;
  }
}

export function cartTotals(lines: CartLine[], discountPct = 0) {
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const discount = Math.round(subtotal * (discountPct / 100));
  const gst = Math.round((subtotal - discount) * 0.05);
  const total = subtotal - discount + gst;
  return { subtotal, discount, gst, total, itemCount: lines.reduce((s, l) => s + l.qty, 0) };
}