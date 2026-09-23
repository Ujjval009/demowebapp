(function(){
  const { customers } = AppData;
  const $ = (sel) => document.querySelector(sel);
  const money = (n) => "₹" + n.toLocaleString("en-IN");

  function render(){
    const table = $("#customerTableBody");
    if (!table) return;
    const q = (($("#custSearch")||{}).value||"").trim().toLowerCase();
    const filtered = customers.filter(c =>
      !q || c.name.toLowerCase().includes(q) || (c.phone||"").includes(q) || (c.email||"").toLowerCase().includes(q)
    );

    if (filtered.length === 0){
      table.innerHTML = `<tr><td colspan="5"><div class="empty-table">No customers found.</div></td></tr>`;
      return;
    }

    table.innerHTML = "";
    filtered.forEach(c=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><div class="cell-name">${c.name}</div></td>
        <td class="cell-muted">${c.phone||"—"}</td>
        <td class="cell-muted">${c.email||"—"}</td>
        <td class="cell-muted">${c.visits}</td>
        <td><span class="cell-money">${money(c.totalSpent)}</span></td>
        <td>
          <div class="cell-actions">
            <button class="btn sm" data-edit="${c.id}">Edit</button>
            <button class="btn sm danger" data-del="${c.id}">Delete</button>
          </div>
        </td>`;
      tr.querySelector('[data-edit]').onclick = ()=> openModal(c);
      tr.querySelector('[data-del]').onclick = ()=> delCustomer(c.id);
      table.appendChild(tr);
    });
  }

  function delCustomer(id){
    const c = customers.find(x=>x.id===id);
    if (!c) return;
    if (!confirm(`Delete customer "${c.name}"?`)) return;
    const idx = customers.indexOf(c);
    customers.splice(idx,1);
    render();
  }

  // ---------- Modal ----------
  let editingId = null;

  function openModal(c){
    editingId = c ? c.id : null;
    $("#custModalTitle").textContent = c ? "Edit Customer" : "New Customer";
    $("#fName").value = c ? c.name : "";
    $("#fPhone").value = c ? (c.phone||"") : "";
    $("#fEmail").value = c ? (c.email||"") : "";
    $("#modalOverlay").classList.add("open");
    setTimeout(()=> $("#fName").focus(), 50);
  }
  function closeModal(){
    $("#modalOverlay").classList.remove("open");
    editingId = null;
  }
  function saveCustomer(){
    const name = $("#fName").value.trim();
    const phone = $("#fPhone").value.trim();
    const email = $("#fEmail").value.trim();
    if (!name){ $("#fName").focus(); return; }

    if (editingId){
      const c = customers.find(x=>x.id===editingId);
      if (c){ c.name = name; c.phone = phone; c.email = email; }
    } else {
      customers.push({ id: AppData.nextCustomerId, name, phone, email, totalSpent:0, visits:0 });
    }
    closeModal();
    render();
  }

  function init(){
    if (!$("#customerTableBody")) return;
    render();
    if ($("#custSearch")) $("#custSearch").addEventListener("input", render);
    if ($("#newCustBtn")) $("#newCustBtn").addEventListener("click", ()=> openModal(null));
    if ($("#modalClose")) $("#modalClose").addEventListener("click", closeModal);
    if ($("#modalCancel")) $("#modalCancel").addEventListener("click", closeModal);
    if ($("#modalSave")) $("#modalSave").addEventListener("click", saveCustomer);
    if ($("#modalOverlay")) $("#modalOverlay").addEventListener("click", (e)=>{ if (e.target.id==="modalOverlay") closeModal(); });
  }

  document.addEventListener("view:customers", init);
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
