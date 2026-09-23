import React, { useState, useMemo } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  History,
  Settings,
  Search,
  Plus,
  Minus,
  Trash2,
  AlertTriangle,
  Bell,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
  .font-display { font-family: 'Fraunces', serif; }
  .font-ui { font-family: 'Space Grotesk', sans-serif; }
`;

const INITIAL_PRODUCTS = [
  { id: "RIC-025", name: "Basmati Rice 25kg", category: "Grains & Staples", stock: 42, reorder: 20, price: 1850 },
  { id: "OIL-015", name: "Sunflower Oil 15L", category: "Cooking Essentials", stock: 8, reorder: 15, price: 2200 },
  { id: "FLR-025", name: "Wheat Flour 25kg", category: "Grains & Staples", stock: 30, reorder: 20, price: 950 },
  { id: "TEA-100", name: "Tea Leaves 1kg", category: "Beverages", stock: 55, reorder: 25, price: 480 },
  { id: "DET-500", name: "Detergent Powder 5kg", category: "Household", stock: 6, reorder: 15, price: 620 },
  { id: "SUG-050", name: "Refined Sugar 50kg", category: "Grains & Staples", stock: 18, reorder: 20, price: 2400 },
  { id: "DAL-025", name: "Toor Dal 25kg", category: "Grains & Staples", stock: 25, reorder: 15, price: 3100 },
  { id: "SLT-020", name: "Salt 1kg, pack of 20", category: "Household", stock: 40, reorder: 20, price: 260 },
  { id: "NDL-040", name: "Instant Noodles, carton of 40", category: "Snacks", stock: 12, reorder: 20, price: 780 },
  { id: "SOP-072", name: "Bath Soap, carton of 72", category: "Household", stock: 5, reorder: 10, price: 1440 },
];

const INITIAL_SALES = [
  { id: "S-1042", when: "Today · 10:14 AM", customer: "Verma General Store", items: 3, total: 5820 },
  { id: "S-1041", when: "Today · 9:02 AM", customer: "Om Traders", items: 2, total: 2960 },
  { id: "S-1040", when: "Yesterday · 5:40 PM", customer: "Sri Ganesh Kirana", items: 5, total: 9120 },
  { id: "S-1039", when: "Yesterday · 2:15 PM", customer: "New Bharat Stores", items: 1, total: 1850 },
  { id: "S-1038", when: "2 days ago", customer: "Laxmi Wholesale Mart", items: 4, total: 7460 },
];

const NAV = [
  { id: "dashboard", label: "Overview", icon: LayoutDashboard },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "billing", label: "Billing counter", icon: ShoppingCart },
  { id: "sales", label: "Sales history", icon: History },
];

function rupees(n) {
  return "₹" + n.toLocaleString("en-IN");
}

export default function App() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [sales, setSales] = useState(INITIAL_SALES);
  const [tab, setTab] = useState("dashboard");
  const [cart, setCart] = useState([]); // {id, qty}
  const [query, setQuery] = useState("");
  const [confirmMsg, setConfirmMsg] = useState("");

  const lowStock = useMemo(() => products.filter((p) => p.stock <= p.reorder), [products]);
  const inventoryValue = useMemo(() => products.reduce((s, p) => s + p.stock * p.price, 0), [products]);
  const todaysSales = useMemo(
    () => sales.filter((s) => s.when.startsWith("Today")).reduce((s, x) => s + x.total, 0),
    [sales]
  );

  const cartLines = cart.map((c) => {
    const p = products.find((x) => x.id === c.id);
    return { ...p, qty: c.qty };
  });
  const subtotal = cartLines.reduce((s, l) => s + l.qty * l.price, 0);
  const tax = Math.round(subtotal * 0.05);
  const cartTotal = subtotal + tax;

  function addToCart(product) {
    if (product.stock <= 0) return;
    setCart((c) => {
      const existing = c.find((x) => x.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) return c;
        return c.map((x) => (x.id === product.id ? { ...x, qty: x.qty + 1 } : x));
      }
      return [...c, { id: product.id, qty: 1 }];
    });
  }

  function changeQty(id, delta) {
    setCart((c) =>
      c
        .map((x) => {
          if (x.id !== id) return x;
          const product = products.find((p) => p.id === id);
          const next = Math.min(Math.max(x.qty + delta, 1), product.stock);
          return { ...x, qty: next };
        })
        .filter(Boolean)
    );
  }

  function removeFromCart(id) {
    setCart((c) => c.filter((x) => x.id !== id));
  }

  function completeSale() {
    if (cartLines.length === 0) return;
    setProducts((prev) =>
      prev.map((p) => {
        const line = cartLines.find((l) => l.id === p.id);
        return line ? { ...p, stock: p.stock - line.qty } : p;
      })
    );
    const newSale = {
      id: "S-" + (1043 + sales.length - 5),
      when: "Just now",
      customer: "Walk-in counter sale",
      items: cartLines.reduce((s, l) => s + l.qty, 0),
      total: cartTotal,
    };
    setSales((prev) => [newSale, ...prev]);
    setCart([]);
    setConfirmMsg(`Sale ${newSale.id} recorded — ${rupees(cartTotal)}`);
    setTimeout(() => setConfirmMsg(""), 3000);
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      p.id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="font-ui w-full min-h-screen bg-stone-100 text-slate-900 flex">
      <style>{FONTS}</style>

      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-slate-900 text-slate-300 flex flex-col">
        <div className="px-5 py-6 border-b border-slate-800">
          <div className="font-display text-xl text-white tracking-tight">Portside</div>
          <div className="text-xs text-slate-400 mt-0.5">Wholesale distribution</div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={
                  "w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors " +
                  (active
                    ? "bg-slate-800 text-white border-l-2 border-amber-400 pl-[10px]"
                    : "hover:bg-slate-800/60 hover:text-white border-l-2 border-transparent")
                }
              >
                <Icon size={17} strokeWidth={1.8} />
                {item.label}
                {item.id === "inventory" && lowStock.length > 0 && (
                  <span className="ml-auto text-[11px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded-sm">
                    {lowStock.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="px-3 pb-3">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:bg-slate-800/60 hover:text-white">
            <Settings size={17} strokeWidth={1.8} />
            Settings
          </button>
        </div>

        <div className="px-5 py-4 border-t border-slate-800 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center text-sm font-semibold">
            A
          </div>
          <div className="leading-tight">
            <div className="text-sm text-white">Admin</div>
            <div className="text-xs text-slate-500">Superadmin</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2 border border-stone-300 px-3 py-1.5 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Portside — Main warehouse
            <ChevronDown size={14} className="text-slate-400" />
          </div>
          <button className="text-slate-500 hover:text-slate-900">
            <Bell size={19} strokeWidth={1.8} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-8">
          {tab === "dashboard" && (
            <Dashboard
              products={products}
              sales={sales}
              lowStock={lowStock}
              inventoryValue={inventoryValue}
              todaysSales={todaysSales}
            />
          )}
          {tab === "inventory" && (
            <Inventory products={filteredProducts} query={query} setQuery={setQuery} />
          )}
          {tab === "billing" && (
            <Billing
              products={products}
              cartLines={cartLines}
              addToCart={addToCart}
              changeQty={changeQty}
              removeFromCart={removeFromCart}
              subtotal={subtotal}
              tax={tax}
              cartTotal={cartTotal}
              completeSale={completeSale}
              confirmMsg={confirmMsg}
            />
          )}
          {tab === "sales" && <SalesHistory sales={sales} />}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, tone = "default" }) {
  const toneClass =
    tone === "danger"
      ? "border-rose-300"
      : tone === "accent"
      ? "border-amber-300"
      : "border-stone-200";
  return (
    <div className={"bg-white border " + toneClass + " p-5"}>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-display text-3xl mt-1.5 text-slate-900">{value}</div>
      {sub && <div className="text-xs text-slate-400 mt-1.5">{sub}</div>}
    </div>
  );
}

function Dashboard({ products, sales, lowStock, inventoryValue, todaysSales }) {
  return (
    <div>
      <div className="mb-7">
        <h1 className="font-display text-3xl">Warehouse overview</h1>
        <p className="text-sm text-slate-500 mt-1">Stock position and counter activity across Portside.</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Today's sales" value={rupees(todaysSales)} sub={sales.filter(s=>s.when.startsWith("Today")).length + " transactions"} tone="accent" />
        <StatCard label="Inventory value" value={rupees(inventoryValue)} sub={products.length + " SKUs tracked"} />
        <StatCard label="Low stock" value={lowStock.length + " items"} sub="Below reorder level" tone={lowStock.length ? "danger" : "default"} />
        <StatCard label="Active SKUs" value={products.length} sub="Across 5 categories" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-stone-200">
          <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
            <h2 className="font-display text-lg">Recent sales</h2>
          </div>
          <div>
            {sales.slice(0, 5).map((s) => (
              <div key={s.id} className="px-5 py-3 border-b border-stone-100 last:border-0 flex items-center justify-between text-sm">
                <div>
                  <div className="text-slate-900">{s.customer}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{s.id} · {s.when}</div>
                </div>
                <div className="font-display text-base">{rupees(s.total)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-stone-200">
          <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
            <h2 className="font-display text-lg">Needs replenishing</h2>
          </div>
          <div>
            {lowStock.length === 0 && (
              <div className="px-5 py-6 text-sm text-slate-400">All items are above their reorder level.</div>
            )}
            {lowStock.map((p) => (
              <div key={p.id} className="px-5 py-3 border-b border-stone-100 last:border-0 flex items-center justify-between text-sm">
                <div>
                  <div className="text-slate-900">{p.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{p.id} · reorder at {p.reorder}</div>
                </div>
                <div className="flex items-center gap-1.5 text-rose-600">
                  <AlertTriangle size={14} />
                  {p.stock} left
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StockBar({ stock, reorder }) {
  const capacity = Math.max(reorder * 3, stock, 1);
  const pct = Math.min((stock / capacity) * 100, 100);
  const low = stock <= reorder;
  return (
    <div className="w-24 h-1.5 bg-stone-200">
      <div
        className={"h-full " + (low ? "bg-rose-500" : "bg-emerald-500")}
        style={{ width: pct + "%" }}
      />
    </div>
  );
}

function Inventory({ products, query, setQuery }) {
  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl">Inventory</h1>
          <p className="text-sm text-slate-500 mt-1">Stock on hand across the main warehouse.</p>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, SKU or category"
            className="border border-stone-300 pl-9 pr-3 py-2 text-sm w-72 bg-white focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      <div className="bg-white border border-stone-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 text-left text-xs text-slate-500">
              <th className="px-5 py-3 font-normal">Product</th>
              <th className="px-5 py-3 font-normal">Category</th>
              <th className="px-5 py-3 font-normal">Stock</th>
              <th className="px-5 py-3 font-normal">Unit price</th>
              <th className="px-5 py-3 font-normal">Value</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-stone-100 last:border-0">
                <td className="px-5 py-3.5">
                  <div className="text-slate-900">{p.name}</div>
                  <div className="text-xs text-slate-400">{p.id}</div>
                </td>
                <td className="px-5 py-3.5 text-slate-500">{p.category}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className={p.stock <= p.reorder ? "text-rose-600" : "text-slate-900"}>{p.stock}</span>
                    <StockBar stock={p.stock} reorder={p.reorder} />
                  </div>
                </td>
                <td className="px-5 py-3.5">{rupees(p.price)}</td>
                <td className="px-5 py-3.5 font-display">{rupees(p.stock * p.price)}</td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                  No products match that search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Billing({ products, cartLines, addToCart, changeQty, removeFromCart, subtotal, tax, cartTotal, completeSale, confirmMsg }) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl">Billing counter</h1>
        <p className="text-sm text-slate-500 mt-1">Tap a product to add it to the current sale.</p>
      </div>

      <div className="grid grid-cols-3 gap-6 items-start">
        <div className="col-span-2 grid grid-cols-3 gap-3">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => addToCart(p)}
              disabled={p.stock <= 0}
              className="text-left bg-white border border-stone-200 p-4 hover:border-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <div className="text-xs text-slate-400">{p.id}</div>
              <div className="text-sm text-slate-900 mt-1 leading-snug">{p.name}</div>
              <div className="flex items-center justify-between mt-3">
                <span className="font-display text-base">{rupees(p.price)}</span>
                <span className="text-xs text-slate-400">{p.stock} in stock</span>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-white border border-stone-200 sticky top-0">
          <div className="px-5 py-4 border-b border-stone-200">
            <h2 className="font-display text-lg">Current sale</h2>
          </div>

          <div className="max-h-80 overflow-auto">
            {cartLines.length === 0 && (
              <div className="px-5 py-8 text-sm text-slate-400 text-center">Cart is empty.</div>
            )}
            {cartLines.map((l) => (
              <div key={l.id} className="px-5 py-3 border-b border-stone-100 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-900">{l.name}</span>
                  <button onClick={() => removeFromCart(l.id)} className="text-slate-300 hover:text-rose-500">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2 border border-stone-200">
                    <button onClick={() => changeQty(l.id, -1)} className="px-2 py-1 hover:bg-stone-50">
                      <Minus size={12} />
                    </button>
                    <span className="text-xs w-5 text-center">{l.qty}</span>
                    <button onClick={() => changeQty(l.id, 1)} className="px-2 py-1 hover:bg-stone-50">
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="font-display">{rupees(l.qty * l.price)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 py-4 border-t border-stone-200 space-y-1.5 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>{rupees(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>GST (5%)</span>
              <span>{rupees(tax)}</span>
            </div>
            <div className="flex justify-between font-display text-lg pt-1.5 border-t border-stone-100 mt-1.5">
              <span>Total</span>
              <span>{rupees(cartTotal)}</span>
            </div>
          </div>

          <div className="px-5 pb-5">
            <button
              onClick={completeSale}
              disabled={cartLines.length === 0}
              className="w-full bg-slate-900 text-white py-2.5 text-sm hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Complete sale
            </button>
            {confirmMsg && (
              <div className="mt-3 flex items-center gap-1.5 text-emerald-600 text-xs">
                <CheckCircle2 size={14} />
                {confirmMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SalesHistory({ sales }) {
  const total = sales.reduce((s, x) => s + x.total, 0);
  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl">Sales history</h1>
          <p className="text-sm text-slate-500 mt-1">{sales.length} transactions on record.</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">Total recorded</div>
          <div className="font-display text-2xl">{rupees(total)}</div>
        </div>
      </div>

      <div className="bg-white border border-stone-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 text-left text-xs text-slate-500">
              <th className="px-5 py-3 font-normal">Sale ID</th>
              <th className="px-5 py-3 font-normal">Customer</th>
              <th className="px-5 py-3 font-normal">When</th>
              <th className="px-5 py-3 font-normal">Items</th>
              <th className="px-5 py-3 font-normal">Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.id} className="border-b border-stone-100 last:border-0">
                <td className="px-5 py-3.5 text-slate-500">{s.id}</td>
                <td className="px-5 py-3.5 text-slate-900">{s.customer}</td>
                <td className="px-5 py-3.5 text-slate-500">{s.when}</td>
                <td className="px-5 py-3.5 text-slate-500">{s.items}</td>
                <td className="px-5 py-3.5 font-display">{rupees(s.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
