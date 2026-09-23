(function(){
  const { products, categories, paymentMethods, customers, sales, TAX_RATE } = AppData;

  const state = {
    query:"",
    activeCat:"All",
    cart:{},
    customer:null,
    payment:null,
  };

  const $ = (sel) => document.querySelector(sel);
  const money = (n) => "₹" + n.toLocaleString("en-IN");

  function productName(row){
    return products.find(p=>p.id===row.id) || {name:"",price:0,color:"#888",ini:"?"};
  }

  // ---------- Chips ----------
  function renderChips(){
    const row = $("#chipRow");
    if (!row) return;
    row.innerHTML = "";
    categories.forEach(cat=>{
      const el = document.createElement("div");
      el.className = "chip" + (state.activeCat === cat ? " active" : "");
      el.textContent = cat;
      el.onclick = () => { state.activeCat = cat; renderChips(); renderGrid(); };
      row.appendChild(el);
    });
  }

  // ---------- Product grid ----------
  function renderGrid(){
    const grid = $("#productGrid");
    if (!grid) return;
    const q = state.query.trim().toLowerCase();
    const filtered = products.filter(p=>{
      const matchesCat = state.activeCat === "All" || p.cat === state.activeCat;
      const matchesQ = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      return matchesCat && matchesQ;
    });

    if (filtered.length === 0){
      grid.innerHTML = `<div class="empty-grid">No products match your search.</div>`;
      return;
    }

    grid.innerHTML = "";
    filtered.forEach(p=>{
      const out = p.stock === 0;
      const card = document.createElement("div");
      card.className = "card" + (out ? " out" : "");
      const dotClass = out ? "out-dot" : (p.stock <= 8 ? "low" : "");
      card.innerHTML = `
        <div class="swatch" style="background:${p.color}">${p.ini}</div>
        <div class="card-body">
          <div class="pname">${p.name}</div>
          <div class="price">${money(p.price)}</div>
          <div class="stockline"><span class="dot ${dotClass}"></span>${out ? "Out of stock" : "In stock: " + p.stock}</div>
        </div>`;
      if (!out) card.onclick = () => addToCart(p.id);
      grid.appendChild(card);
    });
  }

  // ---------- Cart ----------
  function addToCart(id){
    const p = products.find(x=>x.id===id);
    const currentQty = state.cart[id] || 0;
    if (currentQty >= p.stock) return;
    state.cart[id] = currentQty + 1;
    renderCart();
  }
  function changeQty(id, delta){
    const p = products.find(x=>x.id===id);
    const next = (state.cart[id] || 0) + delta;
    if (next <= 0){ delete state.cart[id]; }
    else if (next > p.stock){ /* clamp */ }
    else { state.cart[id] = next; }
    renderCart();
  }
  function removeItem(id){ delete state.cart[id]; renderCart(); }

  function cartTotals(){
    const ids = Object.keys(state.cart);
    const subtotal = ids.reduce((s,id)=> s + productName({id}).price * state.cart[id], 0);
    const tax = Math.round(subtotal * TAX_RATE);
    return { subtotal, tax, total: subtotal + tax };
  }

  function renderCart(){
    const ids = Object.keys(state.cart);
    const itemsEl = $("#cartItems");
    const countEl = $("#cartCount");
    if (countEl) countEl.textContent = ids.reduce((s,id)=>s+state.cart[id],0);

    if (ids.length === 0){
      if (itemsEl) itemsEl.innerHTML = `
        <div class="cart-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.5 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8.3a2 2 0 0 0 2-1.6L21 8H6"/></svg>
          <div class="l1">Cart is empty</div>
          <div class="l2">Click products to add them here</div>
        </div>`;
    } else {
      itemsEl.innerHTML = "";
      ids.forEach(id=>{
        const p = productName({id});
        const qty = state.cart[id];
        const row = document.createElement("div");
        row.className = "line-item";
        row.innerHTML = `
          <div class="li-swatch" style="background:${p.color}">${p.ini}</div>
          <div class="li-info">
            <div class="li-name">${p.name}</div>
            <div class="li-unit">${money(p.price)} each</div>
          </div>
          <div class="li-qty">
            <button data-act="dec">−</button>
            <span class="qn">${qty}</span>
            <button data-act="inc">+</button>
          </div>
          <div class="li-total">${money(p.price*qty)}</div>
          <button class="li-remove" data-act="rm">×</button>
        `;
        row.querySelector('[data-act="inc"]').onclick = ()=>changeQty(id,1);
        row.querySelector('[data-act="dec"]').onclick = ()=>changeQty(id,-1);
        row.querySelector('[data-act="rm"]').onclick = ()=>removeItem(id);
        itemsEl.appendChild(row);
      });
    }

    const t = cartTotals();
    if ($("#subtotalVal")) $("#subtotalVal").textContent = money(t.subtotal);
    if ($("#taxVal")) $("#taxVal").textContent = money(t.tax);
    if ($("#totalVal")) $("#totalVal").textContent = money(t.total);
    if ($("#completeBtn")) $("#completeBtn").disabled = ids.length === 0;
  }

  // ---------- Customer ----------
  function renderCustomer(){
    const area = $("#customerArea");
    if (!area) return;
    if (state.customer){
      area.innerHTML = `
        <div class="cust-chip">
          <div>
            <div class="cname">${state.customer.name}</div>
            <div class="cphone">${state.customer.phone || ""}</div>
          </div>
          <button id="custClear">×</button>
        </div>`;
      $("#custClear").onclick = ()=>{ state.customer = null; renderCustomer(); };
    } else {
      area.innerHTML = `
        <input class="cust-input" id="custInput" list="custList" placeholder="Search by phone or name…">
        <datalist id="custList">${customers.map(c=>`<option value="${c.name}">`).join("")}</datalist>
        <div class="new-cust-link" id="newCustLink">+ New customer</div>
      `;
      const input = $("#custInput");
      input.oninput = ()=>{
        const match = customers.find(c=>c.name.toLowerCase() === input.value.toLowerCase());
        if (match){ state.customer = match; renderCustomer(); }
      };
      $("#newCustLink").onclick = ()=>{
        const name = prompt("Customer name?");
        if (!name) return;
        state.customer = { name, phone:"— new —" };
        renderCustomer();
      };
    }
  }

  // ---------- Payment ----------
  function renderPay(){
    const wrap = $("#payGrid");
    if (!wrap) return;
    wrap.innerHTML = "";
    paymentMethods.forEach(m=>{
      const btn = document.createElement("div");
      btn.className = "pay-btn" + (state.payment===m.id ? " active" : "");
      btn.innerHTML = `${m.icon}<span>${m.label}</span>`;
      btn.onclick = ()=>{ state.payment = m.id; renderPay(); };
      wrap.appendChild(btn);
    });
  }

  // ---------- Checkout ----------
  function completeSale(){
    const ids = Object.keys(state.cart);
    if (ids.length === 0) return;
    const t = cartTotals();
    const method = state.payment || "cash";
    const methodLabel = (paymentMethods.find(m=>m.id===method)||{}).label || "Cash";

    const receiptNo = "R-" + AppData.bumpReceipt();
    const now = new Date();
    const pad = n => String(n).padStart(2,"0");
    const dateStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const items = ids.map(id=>{
      const p = productName({id});
      return { name: p.name, price: p.price, qty: state.cart[id] };
    });

    sales.unshift({
      id: receiptNo, date: dateStr,
      customer: state.customer ? state.customer.name : "Walk-in",
      items, subtotal: t.subtotal, tax: t.tax, total: t.total,
      method
    });

    showToast(`Sale complete`, `${receiptNo} · ${money(t.total)} · ${methodLabel}`);

    ids.forEach(id=>{
      const p = products.find(x=>x.id==id);
      p.stock = Math.max(0, p.stock - state.cart[id]);
    });

    if (state.customer){
      const c = customers.find(x=>x.name === state.customer.name);
      if (c){ c.totalSpent += t.total; c.visits += 1; }
    }

    state.cart = {};
    state.customer = null;
    state.payment = null;
    renderGrid();
    renderCart();
    renderCustomer();
    renderPay();
  }

  // ---------- Toast ----------
  let toastTimer;
  function showToast(title, sub){
    const titleEl = $("#toastTitle"), subEl = $("#toastSub"), toast = $("#toast");
    if (!toast) return;
    if (titleEl) titleEl.textContent = title;
    if (subEl) subEl.textContent = sub;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=> toast.classList.remove("show"), 2600);
  }

  // ---------- Wire up (only if POS view present) ----------
  function init(){
    if (!$("#productGrid")) return;
    if ($("#searchInput")) $("#searchInput").addEventListener("input", (e)=>{ state.query = e.target.value; renderGrid(); });
    if ($("#completeBtn")) $("#completeBtn").addEventListener("click", completeSale);
    renderChips();
    renderGrid();
    renderCart();
    renderCustomer();
    renderPay();
  }

  document.addEventListener("view:pos", init);
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
