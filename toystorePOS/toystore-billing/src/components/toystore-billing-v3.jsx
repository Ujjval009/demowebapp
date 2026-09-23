import { useState, useMemo } from "react";
import { Plus, Minus, Trash2, Search, Blocks, Gamepad2, PawPrint, Puzzle, Bike, ShoppingCart, CreditCard, Banknote, CheckCircle2 } from "lucide-react";

const CATEGORY_STYLE = {
  blocks: { label: "Building Blocks", icon: Blocks, accent: "#3B5BA5", tint: "#EAF0FA" },
  plush: { label: "Plush Animals", icon: PawPrint, accent: "#A85570", tint: "#F7ECEF" },
  games: { label: "Board Games", icon: Gamepad2, accent: "#6B4FA0", tint: "#F1EDF8" },
  puzzles: { label: "Puzzles", icon: Puzzle, accent: "#9C6B27", tint: "#F6EFE3" },
  outdoor: { label: "Outdoor", icon: Bike, accent: "#2F7D6B", tint: "#E7F3F0" },
};
const CATEGORIES = Object.keys(CATEGORY_STYLE).map((id) => ({ id, ...CATEGORY_STYLE[id] }));

const PRODUCTS = [
  { id: "BLK-104", name: "Rainbow Brick Tower (200pc)", cat: "blocks", price: 24.99, sku: "402118", stock: 34 },
  { id: "BLK-207", name: "City Builder Set", cat: "blocks", price: 39.5, sku: "402119", stock: 12 },
  { id: "BLK-311", name: "Mini Bricks Starter Bag", cat: "blocks", price: 9.99, sku: "402120", stock: 58 },
  { id: "PLU-050", name: "Sir Waddles the Duck", cat: "plush", price: 14.0, sku: "551002", stock: 27 },
  { id: "PLU-062", name: "Jumbo Sleepy Sloth", cat: "plush", price: 22.5, sku: "551009", stock: 9 },
  { id: "PLU-071", name: "Pocket Fox Trio", cat: "plush", price: 11.25, sku: "551014", stock: 41 },
  { id: "GAM-014", name: "Marble Race Deluxe", cat: "games", price: 18.99, sku: "610221", stock: 16 },
  { id: "GAM-022", name: "Word Hunters Family Edition", cat: "games", price: 16.0, sku: "610233", stock: 22 },
  { id: "GAM-031", name: "Stack & Topple", cat: "games", price: 12.5, sku: "610240", stock: 30 },
  { id: "PUZ-009", name: "500pc Starlit Forest", cat: "puzzles", price: 13.75, sku: "702011", stock: 19 },
  { id: "PUZ-013", name: "Wooden Shape Sorter", cat: "puzzles", price: 15.99, sku: "702018", stock: 25 },
  { id: "OUT-005", name: "Sidewalk Chalk Bucket", cat: "outdoor", price: 7.5, sku: "800104", stock: 44 },
  { id: "OUT-012", name: "Two-Wheel Balance Bike", cat: "outdoor", price: 64.0, sku: "800119", stock: 6 },
  { id: "OUT-018", name: "Bubble Blaster 3000", cat: "outdoor", price: 10.99, sku: "800127", stock: 37 },
];

const TAX_RATE = 0.0725;
const currency = (n) => `$${n.toFixed(2)}`;

function Logomark() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30">
      <rect width="30" height="30" rx="7" fill="#1B2430" />
      <rect x="7" y="9" width="16" height="3" rx="1.5" fill="#FFFFFF" />
      <rect x="13" y="9" width="4" height="13" rx="1.5" fill="#FFFFFF" />
    </svg>
  );
}

export default function ToyStoreBilling() {
  const [activeCat, setActiveCat] = useState("blocks");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [stage, setStage] = useState("sell");
  const [order, setOrder] = useState(null);
  const [orderCounter, setOrderCounter] = useState(1042);

  const visibleProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const matchesCat = q ? true : p.cat === activeCat;
      const matchesQuery = q ? p.name.toLowerCase().includes(q) || p.sku.includes(q) : true;
      return matchesCat && matchesQuery;
    });
  }, [activeCat, query]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.id === product.id);
      if (existing) return prev.map((l) => (l.id === product.id ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { ...product, qty: 1 }];
    });
  };
  const changeQty = (id, delta) =>
    setCart((prev) => prev.map((l) => (l.id === id ? { ...l, qty: l.qty + delta } : l)).filter((l) => l.qty > 0));
  const removeLine = (id) => setCart((prev) => prev.filter((l) => l.id !== id));

  const subtotal = cart.reduce((s, l) => s + l.price * l.qty, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const itemCount = cart.reduce((n, l) => n + l.qty, 0);

  const startCheckout = () => cart.length && setStage("pay");
  const completeSale = (method) => {
    const num = orderCounter;
    setOrder({ number: num, lines: cart, subtotal, tax, total, method, time: new Date() });
    setOrderCounter((n) => n + 1);
    setStage("receipt");
  };
  const newSale = () => {
    setCart([]);
    setOrder(null);
    setStage("sell");
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F6F8] text-[#1B2430]" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontVariantNumeric: "tabular-nums" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}</style>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-[#E4E7EC]">
        <div className="flex items-center gap-3">
          <Logomark />
          <div>
            <h1 className="text-[15px] leading-tight" style={{ fontWeight: 700 }}>ToyStore Billing</h1>
            <p className="text-[11px] text-[#6B7280]">Point of Sale</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-[12px] text-[#6B7280]">
          <span>Cashier: <span className="text-[#1B2430]" style={{ fontWeight: 600 }}>Priya M.</span></span>
          <span>Register <span className="text-[#1B2430]" style={{ fontWeight: 600 }}>03</span></span>
          <span>Order <span className="text-[#1B2430]" style={{ fontWeight: 600 }}>#{orderCounter}</span></span>
          <span>{new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
      </div>

      {stage !== "receipt" ? (
        <div className="grid" style={{ gridTemplateColumns: "216px 1fr 360px" }}>
          {/* Category sidebar */}
          <div className="border-r border-[#E4E7EC] bg-white p-3 flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-3 px-2.5 py-2 rounded-md bg-[#F5F6F8] border border-[#E4E7EC]">
              <Search size={14} color="#6B7280" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search or scan SKU"
                className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#9AA0AC]"
              />
            </div>
            <span className="px-2.5 text-[11px] uppercase tracking-wide text-[#9AA0AC] mb-1" style={{ fontWeight: 600, letterSpacing: "0.04em" }}>Categories</span>
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              const active = activeCat === c.id && !query;
              return (
                <button
                  key={c.id}
                  onClick={() => { setActiveCat(c.id); setQuery(""); }}
                  className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left relative"
                  style={{ background: active ? "#F5F6F8" : "transparent" }}
                >
                  {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full" style={{ background: c.accent }} />}
                  <span className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: c.tint }}>
                    <Icon size={14} color={c.accent} />
                  </span>
                  <span className="text-[13px]" style={{ fontWeight: active ? 600 : 500, color: active ? "#1B2430" : "#4B5563" }}>{c.label}</span>
                </button>
              );
            })}
          </div>

          {/* Product grid */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px]" style={{ fontWeight: 700 }}>
                {query ? `Results for "${query}"` : CATEGORY_STYLE[activeCat]?.label}
              </h2>
              <span className="text-[12px] text-[#9AA0AC]">{visibleProducts.length} items</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {visibleProducts.map((p) => {
                const c = CATEGORY_STYLE[p.cat];
                const Icon = c.icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => addToCart(p)}
                    className="text-left rounded-lg border border-[#E4E7EC] bg-white p-3.5 hover:border-[#C7CDD6] hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="w-9 h-9 rounded-md flex items-center justify-center" style={{ background: c.tint }}>
                        <Icon size={16} color={c.accent} />
                      </span>
                      <span className="text-[10px] text-[#9AA0AC] mt-1">{p.stock} in stock</span>
                    </div>
                    <div className="text-[13px] mb-1" style={{ fontWeight: 600, lineHeight: 1.35 }}>{p.name}</div>
                    <div className="text-[11px] text-[#9AA0AC] mb-3">SKU {p.sku}</div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#F0F1F4]">
                      <span className="text-[14px]" style={{ fontWeight: 700 }}>{currency(p.price)}</span>
                      <span className="w-6 h-6 rounded-md border border-[#D8DCE3] flex items-center justify-center">
                        <Plus size={12} color="#4B5563" />
                      </span>
                    </div>
                  </button>
                );
              })}
              {visibleProducts.length === 0 && (
                <p className="text-[13px] text-[#9AA0AC] col-span-3">No items match that search.</p>
              )}
            </div>
          </div>

          {/* Cart / checkout panel */}
          <div className="border-l border-[#E4E7EC] bg-white flex flex-col">
            {stage === "sell" && (
              <>
                <div className="px-4 py-3.5 border-b border-[#E4E7EC] flex items-center gap-2">
                  <ShoppingCart size={15} color="#4B5563" />
                  <span className="text-[13px]" style={{ fontWeight: 700 }}>Current Sale</span>
                  <span className="text-[12px] text-[#9AA0AC] ml-auto">{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
                </div>
                <div className="flex-1 overflow-auto px-4 py-3">
                  {cart.length === 0 ? (
                    <p className="text-[13px] text-[#9AA0AC] mt-10 text-center">No items added yet.</p>
                  ) : (
                    <div className="flex flex-col">
                      {cart.map((l) => (
                        <div key={l.id} className="flex items-start justify-between gap-2 py-3 border-b border-[#F0F1F4]">
                          <div className="flex-1">
                            <div className="text-[13px]" style={{ fontWeight: 600 }}>{l.name}</div>
                            <div className="text-[11px] text-[#9AA0AC]">{currency(l.price)} &times; {l.qty}</div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => changeQty(l.id, -1)} className="w-6 h-6 rounded-md border border-[#D8DCE3] flex items-center justify-center">
                              <Minus size={11} />
                            </button>
                            <span className="w-5 text-center text-[12px]">{l.qty}</span>
                            <button onClick={() => changeQty(l.id, 1)} className="w-6 h-6 rounded-md border border-[#D8DCE3] flex items-center justify-center">
                              <Plus size={11} />
                            </button>
                            <button onClick={() => removeLine(l.id)} className="ml-1 text-[#B3B9C2] hover:text-[#A85570]">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="px-4 py-4 border-t border-[#E4E7EC] text-[13px]">
                  <div className="flex justify-between text-[#6B7280] mb-1.5"><span>Subtotal</span><span>{currency(subtotal)}</span></div>
                  <div className="flex justify-between text-[#6B7280] mb-3"><span>Tax ({(TAX_RATE * 100).toFixed(2)}%)</span><span>{currency(tax)}</span></div>
                  <div className="flex justify-between text-[17px] pt-3 border-t border-[#E4E7EC]" style={{ fontWeight: 700 }}><span>Total</span><span>{currency(total)}</span></div>
                  <button
                    onClick={startCheckout}
                    disabled={cart.length === 0}
                    className="w-full mt-4 py-2.5 rounded-md text-[13px] disabled:opacity-40"
                    style={{ background: "#1B2430", color: "#FFFFFF", fontWeight: 600 }}
                  >
                    Charge {currency(total)}
                  </button>
                </div>
              </>
            )}

            {stage === "pay" && (
              <div className="flex-1 flex flex-col px-5 py-6">
                <button onClick={() => setStage("sell")} className="text-[12px] text-[#9AA0AC] mb-6 self-start">&larr; Back to sale</button>
                <p className="text-[12px] text-[#9AA0AC] mb-1">Amount due</p>
                <p className="text-[32px] mb-8" style={{ fontWeight: 700 }}>{currency(total)}</p>
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => completeSale("Card")}
                    className="flex items-center justify-center gap-2 py-3 rounded-md border border-[#D8DCE3] text-[13px]"
                    style={{ fontWeight: 600 }}
                  >
                    <CreditCard size={15} /> Pay with Card
                  </button>
                  <button
                    onClick={() => completeSale("Cash")}
                    className="flex items-center justify-center gap-2 py-3 rounded-md text-[13px]"
                    style={{ background: "#1B2430", color: "#FFFFFF", fontWeight: 600 }}
                  >
                    <Banknote size={15} /> Pay with Cash
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center py-10 px-4">
          <div className="w-full max-w-sm border border-[#E4E7EC] rounded-lg bg-white p-6">
            <div className="flex items-center justify-center gap-2 mb-1">
              <CheckCircle2 size={16} color="#2F7D6B" />
              <span className="text-[12px]" style={{ fontWeight: 700, color: "#2F7D6B" }}>Payment complete</span>
            </div>
            <div className="text-center mb-5">
              <div className="text-[15px] mt-3" style={{ fontWeight: 700 }}>ToyStore Billing</div>
              <div className="text-[11px] text-[#9AA0AC]">Register 03 &middot; Order #{order.number}</div>
              <div className="text-[11px] text-[#9AA0AC]">{order.time.toLocaleString()}</div>
            </div>
            <div className="border-t border-dashed border-[#D8DCE3]" />
            <div className="flex flex-col gap-1.5 text-[12px] py-3">
              {order.lines.map((l) => (
                <div key={l.id} className="flex justify-between">
                  <span className="text-[#4B5563]">{l.qty} &times; {l.name}</span>
                  <span style={{ fontWeight: 600 }}>{currency(l.price * l.qty)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-dashed border-[#D8DCE3]" />
            <div className="text-[12px] flex flex-col gap-1.5 py-3">
              <div className="flex justify-between text-[#6B7280]"><span>Subtotal</span><span>{currency(order.subtotal)}</span></div>
              <div className="flex justify-between text-[#6B7280]"><span>Tax</span><span>{currency(order.tax)}</span></div>
              <div className="flex justify-between text-[14px] pt-1" style={{ fontWeight: 700 }}><span>Total</span><span>{currency(order.total)}</span></div>
              <div className="flex justify-between text-[#9AA0AC] pt-1"><span>Paid via</span><span>{order.method}</span></div>
            </div>
            <div className="border-t border-[#E4E7EC] mb-5" />
            <button
              onClick={newSale}
              className="w-full py-2.5 rounded-md text-[13px]"
              style={{ background: "#1B2430", color: "#FFFFFF", fontWeight: 600 }}
            >
              Start New Sale
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
