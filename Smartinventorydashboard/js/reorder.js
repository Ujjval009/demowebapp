(function(){
  "use strict";
  const I = window.Inventory;
  const A = window.App;

  A.initCommon('reorder');

  function pillClass(st){
    return st === 'critical' ? 'crit' : st === 'low' ? 'warn' : '';
  }

  function render(){
    const flagged = I.products
      .filter(p=> I.status(p) !== 'good')
      .sort((a,b)=> I.stockoutDays(a) - I.stockoutDays(b));

    const pending = flagged.filter(p=> !I.orderPlaced(p.name));
    const est = pending.reduce((s,p)=> s + I.suggestedOrder(p) * p.price, 0);

    document.getElementById('r-count').textContent = flagged.length;
    document.getElementById('r-value').textContent = I.inrCompact(est);
    document.getElementById('r-sub').textContent =
      flagged.length === 0 ? 'Everything is comfortably stocked.' :
      (flagged.length === 1 ? '1 item' : flagged.length + ' items') + ' need restocking';
    document.getElementById('r-remaining').textContent =
      pending.length === 0 ? 'All orders placed' : pending.length + ' open';

    const list = document.getElementById('r-list');

    if(flagged.length === 0){
      list.innerHTML = `
        <div class="empty">
          <div class="empty-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <h3>Nothing needs reordering</h3>
          <p>All items are comfortably stocked. Check back as stock runs down.</p>
        </div>`;
      return;
    }

    list.innerHTML = flagged.map(p=>{
      const st = I.status(p);
      const days = I.stockoutDays(p);
      const qty = I.suggestedOrder(p);
      const done = I.orderPlaced(p.name);

      const metaLabel = st === 'critical'
        ? '<b>Critical</b> &ndash; running out fast'
        : 'Low &ndash; restock soon';

      const action = done
        ? `<span class="btn btn-success btn-sm" disabled="true">Order placed ✓</span>`
        : `<button class="btn btn-primary btn-sm" data-order="${p.name}" data-qty="${qty}">
             <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
             Order ${qty}
           </button>`;

      const details = `
        <div class="list-main">
          <div class="list-title">${p.name}</div>
          <div class="list-meta">${p.cat} &middot; ${metaLabel}
            &middot; stock <b>${p.stock}</b> &middot; ${p.avgSales}/day avg
            &middot; stockout in <b>${isFinite(days) ? days + (days === 1 ? ' day' : ' days') : '—'}</b></div>
        </div>`;

      const sideTop = `<div class="mono" style="font-size:15px;font-weight:700">${qty} units</div>`;
      const sideSub = `<div style="font-size:11.5px;color:var(--muted)">≈ ${I.inr(qty*p.price)}</div>`;

      return `
        <div class="list-row">
          <div class="item-pill ${pillClass(st)}">${p.name.split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase()}</div>
          ${details}
          <div class="list-side">
            ${sideTop}
            ${sideSub}
            <div style="margin-top:8px">${action}</div>
          </div>
        </div>`;
    }).join('');

    list.querySelectorAll('[data-order]').forEach(btn=>{
      btn.addEventListener('click', function(){
        const name = this.dataset.order;
        const qty = Number(this.dataset.qty);
        const p = I.products.find(x=> x.name === name);
        I.placeOrder(p, qty);
        I.addStock(p, qty);
        A.toast('Order placed: ' + qty + ' × ' + p.name + ' (restock +' + qty + ')');
        render();
      });
    });
  }

  /* If there are no flagged items, still render an empty state. */
  render();
})();