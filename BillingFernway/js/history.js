(function(){
  const { sales } = AppData;
  const $ = (sel) => document.querySelector(sel);
  const money = (n) => "₹" + n.toLocaleString("en-IN");

  const methodLabel = (m) => ({cash:"Cash",card:"Card",upi:"GPay/UPI",split:"Split"}[m] || "Cash");

  function renderSummary(){
    const totalRevenue = sales.reduce((s,x)=>s+x.total,0);
    const avg = sales.length ? Math.round(totalRevenue/sales.length) : 0;
    const set = (id, v)=>{ const el=$(id); if (el) el.textContent = v; };
    set("#statRevenue", money(totalRevenue));
    set("#statOrders", sales.length);
    set("#statAvg", money(avg));
  }

  function renderChart(){
    const wrap = $("#weeklyChart");
    if (!wrap) return;
    const days = last7Days();
    const dayTotal = {};
    days.forEach(d=> dayTotal[d.key] = 0);
    sales.forEach(s=>{
      const key = s.date.slice(0,10);
      if (dayTotal[key] !== undefined) dayTotal[key] += s.total;
    });
    const max = Math.max(1, ...days.map(d=>dayTotal[d.key]));
    wrap.innerHTML = "";
    days.forEach(d=>{
      const val = dayTotal[d.key];
      const h = Math.max(4, Math.round((val/max)*100));
      const col = document.createElement("div");
      col.className = "bar-col";
      col.innerHTML = `
        <div class="bar-track"><div class="bar" style="height:${h}%"><span class="bar-val">${money(val)}</span></div></div>
        <div class="bar-label">${d.label}</div>`;
      wrap.appendChild(col);
    });
  }

  function last7Days(){
    const out = [];
    const today = new Date();
    const pad = n => String(n).padStart(2,"0");
    for (let i=6;i>=0;i--){
      const d = new Date(today); d.setDate(today.getDate()-i);
      out.push({ key:`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`, label: d.toLocaleDateString("en-IN",{weekday:"short"}) });
    }
    return out;
  }

  function renderTable(){
    const table = $("#salesTableBody");
    if (!table) return;
    if (sales.length===0){
      table.innerHTML = `<tr><td colspan="6"><div class="empty-table">No sales recorded yet.</div></td></tr>`;
      return;
    }
    table.innerHTML = "";
    sales.forEach(s=>{
      const tagClass = s.method==="cash" ? "green" : s.method==="card" ? "teal" : s.method==="upi" ? "amber" : "gray";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="cell-name">${s.id}</td>
        <td class="cell-muted">${s.date}</td>
        <td>${s.customer}</td>
        <td class="cell-muted">${s.items.length} item(s)</td>
        <td><span class="tag ${tagClass}">${methodLabel(s.method)}</span></td>
        <td><span class="cell-money">${money(s.total)}</span></td>
        <td><button class="btn sm" data-view-sale="${s.id}">View</button></td>`;
      tr.querySelector('[data-view-sale]').onclick = ()=> openReceipt(s);
      table.appendChild(tr);
    });
  }

  function openReceipt(s){
    $("#rId").textContent = s.id;
    $("#rDate").textContent = s.date;
    $("#rCustomer").textContent = s.customer || "Walk-in";
    $("#rMethod").textContent = methodLabel(s.method);

    const lines = $("#receiptLines");
    lines.innerHTML = "";
    s.items.forEach(it=>{
      const div = document.createElement("div");
      div.className = "receipt-line";
      div.innerHTML = `
        <div><span class="rl-name">${it.name}</span> <span class="rl-quantity">× ${it.qty}</span></div>
        <div>${money(it.price*it.qty)}</div>`;
      lines.appendChild(div);
    });
    $("#rSubtotal").textContent = money(s.subtotal);
    $("#rTax").textContent = money(s.tax);
    $("#rTotal").textContent = money(s.total);
    $("#receiptModal").classList.add("open");
  }
  function closeReceipt(){
    const m = $("#receiptModal");
    if (m) m.classList.remove("open");
  }

  function init(){
    if (!$("#salesTableBody")) return;
    renderSummary();
    renderChart();
    renderTable();
    if ($("#receiptClose")) $("#receiptClose").addEventListener("click", closeReceipt);
    const rm = $("#receiptModal");
    if (rm) rm.addEventListener("click",(e)=>{ if(e.target.id==="receiptModal") closeReceipt(); });
  }

  document.addEventListener("view:history", init);
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
