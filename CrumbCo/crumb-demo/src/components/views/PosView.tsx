import { useMemo, useReducer, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, products } from '../../data/products';
import { cartReducer, cartTotals } from '../../features/cart/cartReducer';
import { formatINR } from '../../lib/format';

export function PosView() {
  const { pushToast } = useApp();
  const [cart, dispatch] = useReducer(cartReducer, { lines: [] });
  const [category, setCategory] = useState<string>('All');
  const [discountPct, setDiscountPct] = useState(0);
  const [billNo, setBillNo] = useState(() => Number(localStorage.getItem('crumb-bill-no')) || 2401);

  const filtered = useMemo(
    () => (category === 'All' ? products : products.filter((p) => p.category === category)),
    [category],
  );

  const totals = cartTotals(cart.lines, discountPct);

  const add = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) dispatch({ type: 'ADD', product });
  };

  const checkout = () => {
    if (cart.lines.length === 0) {
      pushToast('Your cart is empty — add at least one item.', 'warning');
      return;
    }
    const nextBill = billNo + 1;
    setBillNo(nextBill);
    localStorage.setItem('crumb-bill-no', String(nextBill));
    pushToast(
      `Bill #${nextBill} generated for ${formatINR(totals.total)} — GST ${formatINR(totals.gst)} included.`,
      'success',
    );
    dispatch({ type: 'CLEAR' });
    setDiscountPct(0);
  };

  return (
    <div className="pos-grid">
      <div className="panel">
        <h3>Quick Bill</h3>
        <div className="desc">Tap an item to add it to the cart</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {['All', ...CATEGORIES].map((c) => (
            <button
              key={c}
              type="button"
              className={`btn${category === c ? ' btn-caramel' : ''}`}
              style={{ padding: '7px 13px', fontSize: 12.5 }}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="pos-products">
          {filtered.map((product) => (
            <button key={product.id} type="button" className="pos-btn" onClick={() => add(product.id)}>
              <span className="emoji" aria-hidden="true">{product.emoji}</span>
              <span>{product.name}</span>
              <span className="p">{formatINR(product.price)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h3>Cart</h3>
          <span className="desc" style={{ marginBottom: 0 }}>
            Bill #{billNo}
          </span>
        </div>
        <div className="cart">
          {cart.lines.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '22px 0', color: 'var(--muted)', fontSize: 13 }}>
              Cart is empty — tap a product to start a bill.
            </div>
          ) : (
            <>
              {cart.lines.map((line) => (
                <div className="row" key={line.product.id}>
                  <span>
                    <span style={{ marginRight: 6 }}>{line.product.emoji}</span>
                    {line.product.name}
                  </span>
                  <span className="qty">
                    <button type="button" onClick={() => dispatch({ type: 'DECR', productId: line.product.id })}>−</button>
                    <span style={{ minWidth: 18, textAlign: 'center', fontWeight: 700 }}>{line.qty}</span>
                    <button type="button" onClick={() => dispatch({ type: 'INCR', productId: line.product.id })}>+</button>
                  </span>
                  <span style={{ fontWeight: 700 }}>{formatINR(line.product.price * line.qty)}</span>
                  <button
                    type="button"
                    className="icon-btn danger"
                    style={{ width: 24, height: 24, fontSize: 11 }}
                    onClick={() => dispatch({ type: 'REMOVE', productId: line.product.id })}
                    aria-label={`Remove ${line.product.name}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <div className="row" style={{ borderBottom: 'none' }}>
                <span className="subtotal">Discount</span>
                <select
                  className="select"
                  style={{ padding: '5px 8px', fontSize: 12 }}
                  value={discountPct}
                  onChange={(e) => setDiscountPct(Number(e.target.value))}
                  aria-label="Discount"
                >
                  <option value={0}>No discount</option>
                  <option value={5}>5% off</option>
                  <option value={10}>10% off</option>
                  <option value={20}>20% off</option>
                </select>
              </div>
              <div className="row" style={{ borderBottom: 'none' }}>
                <span className="subtotal">Subtotal</span>
                <span>{formatINR(totals.subtotal)}</span>
              </div>
              <div className="row" style={{ borderBottom: 'none' }}>
                <span className="subtotal">Discount</span>
                <span style={totals.discount ? { color: 'var(--sage)' } : undefined}>−{formatINR(totals.discount)}</span>
              </div>
              <div className="row" style={{ borderBottom: 'none' }}>
                <span className="subtotal">GST (5%)</span>
                <span>{formatINR(totals.gst)}</span>
              </div>
              <div className="total row">
                <span>Total</span>
                <span>{formatINR(totals.total)}</span>
              </div>
            </>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button
            type="button"
            className="btn checkout-btn"
            style={{ flex: 1, background: 'var(--crust)', color: 'var(--flour)', border: 'none', padding: '12px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
            onClick={checkout}
          >
            Charge customer · {formatINR(totals.total)}
          </button>
          {cart.lines.length > 0 && (
            <button type="button" className="btn" onClick={() => dispatch({ type: 'CLEAR' })}>
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}