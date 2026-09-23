(function(){
  "use strict";
  const I = window.Inventory;
  const A = window.App;

  A.initCommon('inventory');

  const searchEl   = document.getElementById('search');
  const categoryEl = document.getElementById('category');
  const sortEl     = document.getElementById('sort');
  const tbody      = document.getElementById('tbody');

  function populateCategories(){
    const cats = [...new Set(I.products.map(p=> p.cat))].sort();
    categoryEl.innerHTML = '<option value="all">All categories</option>' +
      cats.map(c=> `<option value="${c}">${c}</option>`).join('');
    const list = document.getElementById('cat-list');
    list.innerHTML = cats.map(c=> `<option value="${c}"></option>`).join('');
  }

  function stockPct(p){
    if(p.avgSales <= 0) return 100;
    const days = p.stock / p.avgSales;
    const pct = Math.min(100, days / 5 * 100);
    return Math.max(2, pct);
  }
  function trackClass(st){
    return st === 'critical' ? 'stock-t-crit' : st === 'low' ? 'stock-t-warn' : 'stock-t-good';
  }

  function render(){
    const q = searchEl.value.trim().toLowerCase();
    const cat = categoryEl.value;
    const mode = sortEl.value;

    let rows = I.products.filter(p=>{
      const mQ = p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q);
      const mC = cat === 'all' || p.cat === cat;
      return mQ && mC;
    });

    rows = rows.slice().sort((a,b)=>{
      if(mode === 'stock-asc') return a.stock - b.stock;
      if(mode === 'name-asc')  return a.name.localeCompare(b.name);
      if(mode === 'sales-desc')return b.avgSales - a.avgSales;
      if(mode === 'value-desc')return (b.price*b.stock) - (a.price*a.stock);
      return I.stockoutDays(a) - I.stockoutDays(b);
    });

    if(rows.length === 0){
      tbody.innerHTML = `<tr><td colspan="6" class="empty-cell">No items match your search.</td></tr>`;
      return;
    }

    tbody.innerHTML = rows.map(p=>{
      const st = I.status(p);
      const days = I.stockoutDays(p);
      const tagClass = st === 'critical' ? 'tag-critical' : st === 'low' ? 'tag-low' : 'tag-good';
      const tagLabel = st === 'critical' ? 'Critical' : st === 'low' ? 'Low' : 'Good';
      return `
        <tr data-name="${p.name}">
          <td>
            <div class="cell-name">${p.name}</div>
            <div class="cell-sub">${p.cat}</div>
          </td>
          <td class="mono">
            ${p.stock}
            <div class="stock-track"><span class="${trackClass(st)}" style="width:${stockPct(p)}%"></span></div>
          </td>
          <td class="mono hide-md">${p.avgSales}/day</td>
          <td class="mono hide-md">${isFinite(days) ? days : '—'}</td>
          <td><span class="tag ${tagClass}">${tagLabel}</span></td>
          <td style="text-align:right; white-space:nowrap">
            <button class="btn btn-outline btn-sm" data-add="10">+10 in</button>
            <button class="btn btn-ghost btn-sm" data-add="1" title="Restock 1">+1</button>
          </td>
        </tr>`;
    }).join('');

    tbody.querySelectorAll('[data-add]').forEach(btn=>{
      btn.addEventListener('click', function(){
        const name = this.closest('tr').dataset.name;
        const p = I.products.find(x=> x.name === name);
        I.addStock(p, Number(this.dataset.add));
        A.toast('+'+this.dataset.add+' units added to "'+p.name+'"');
        render();
      });
    });
  }

  searchEl.addEventListener('input', render);
  categoryEl.addEventListener('change', render);
  sortEl.addEventListener('change', render);
  document.getElementById('reset').addEventListener('click', function(){
    searchEl.value = '';
    categoryEl.value = 'all';
    sortEl.value = 'stockout-asc';
    render();
  });

  /* ---------- Add-item modal ---------- */
  const backdrop = document.getElementById('modal-backdrop');
  const form     = document.getElementById('add-form');
  const closeBtns = [document.getElementById('modal-close'), document.getElementById('modal-cancel')];

  function openModal(){ backdrop.classList.add('open'); form.fName && form.fName.focus(); }
  function closeModal(){ backdrop.classList.remove('open'); }

  document.getElementById('add-item-btn').addEventListener('click', openModal);
  closeBtns.forEach(b=> b.addEventListener('click', closeModal));
  backdrop.addEventListener('click', function(e){
    if(e.target === backdrop) closeModal();
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeModal();
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name  = document.getElementById('f-name').value.trim();
    var cat   = document.getElementById('f-cat').value.trim();
    var price = Number(document.getElementById('f-price').value);
    var stock = Number(document.getElementById('f-stock').value);
    var avg   = Number(document.getElementById('f-avg').value);

    if(!name || !cat || isNaN(price) || isNaN(stock) || isNaN(avg)) return;

    const item = { name, cat, price, stock, avgSales: avg, soldToday: 0 };
    I.addProduct(item);
    A.toast('Added "' + name + '" to inventory');
    form.reset();
    closeModal();
    populateCategories();
    categoryEl.value = cat;
    render();
  });

  populateCategories();
  render();
})();