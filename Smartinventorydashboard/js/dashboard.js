(function(){
  "use strict";
  const I = window.Inventory;
  const A = window.App;

  A.initCommon('dashboard');

  document.getElementById('dash-date').textContent =
    new Date().toLocaleDateString("en-IN", { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  function statIcon(st){
    return st === 'critical' ? 'crit' : st === 'low' ? 'warn' : 'good';
  }

  function renderStats(){
    const totalValue = I.products.reduce((s,p)=> s + p.price*p.stock, 0);
    const critical = I.products.filter(p=> I.status(p) === 'critical').length;
    const low      = I.products.filter(p=> I.status(p) === 'low').length;
    const unitsToday = I.products.reduce((s,p)=> s + p.soldToday, 0);
    const salesToday = I.products.reduce((s,p)=> s + p.price*p.soldToday, 0);

    document.getElementById('stat-value').textContent = I.inrCompact(totalValue);
    document.getElementById('stat-value-sub').textContent = 'across ' + I.products.length + ' SKUs';
    document.getElementById('stat-low').textContent = critical + low;
    document.getElementById('stat-low-sub').textContent = critical + ' critical &middot; ' + low + ' low';
    document.getElementById('stat-units').textContent = unitsToday;
    document.getElementById('stat-sales').textContent = I.inr(salesToday);
  }

  function renderReorderPanel(){
    const flagged = I.products
      .filter(p=> I.status(p) !== 'good')
      .sort((a,b)=> I.stockoutDays(a) - I.stockoutDays(b))
      .slice(0, 5);

    const panel = document.getElementById('reorder-panel');
    if(flagged.length === 0){
      panel.innerHTML = `
        <div class="empty">
          <div class="empty-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <h3>All stocked up</h3>
          <p>Nothing needs reordering right now.</p>
        </div>`;
      return;
    }
    document.getElementById('reorder-sub').textContent =
      flagged.length + ' item' + (flagged.length === 1 ? '' : 's') + ' need attention &middot; ranked by soonest stockout';

    const rows = flagged.map(p=>{
      const st = I.status(p);
      const days = I.stockoutDays(p);
      const side = I.orderPlaced(p.name)
        ? `<span class="tag tag-good">Order placed</span>`
        : `<a class="btn btn-outline btn-sm" href="reorder.html">Reorder</a>`;
      return `
        <div class="list-row">
          <div class="item-pill ${st === 'good' ? '' : st}">${p.name.split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase()}</div>
          <div class="list-main">
            <div class="list-title">${p.name}</div>
            <div class="list-meta">${p.cat} &middot; stock <b>${p.stock}</b> &middot; stockout in
              <b>${isFinite(days) ? days + (days === 1 ? ' day' : ' days') : '—'}</b></div>
          </div>
          <div class="list-side">${side}</div>
        </div>`;
    }).join('');
    panel.innerHTML = rows;
  }

  function renderTopSellers(){
    const tops = I.products.slice()
      .sort((a,b)=> b.soldToday - a.soldToday)
      .slice(0, 5);
    const max = Math.max(1, ...tops.map(p=> p.soldToday));

    const rows = tops.map(p=>`
      <div class="bar-row">
        <div class="bar-label">
          <b>${p.name}</b><span class="sub">${p.cat}</span>
        </div>
        <div class="bar-track"><div class="bar-fill ${I.status(p) === 'good' ? 'good' : ''}" style="width:${Math.max(3, p.soldToday/max*100)}%"></div></div>
        <div class="bar-value">${p.soldToday}<span class="sub">units</span></div>
      </div>`).join('');

    document.getElementById('top-sellers').innerHTML = rows;
  }

  function renderCategories(){
    const byCat = {};
    I.products.forEach(p=>{
      byCat[p.cat] = (byCat[p.cat]||0) + p.price*p.stock;
    });
    const list = Object.entries(byCat)
      .map(([cat, val])=> ({ cat, val }))
      .sort((a,b)=> b.val - a.val);
    const max = list.length ? list[0].val : 1;

    const rows = list.map(x=>{
      const pct = Math.max(4, Math.round(x.val / max * 100));
      return `
        <div class="bar-row">
          <div class="bar-label"><b>${x.cat}</b><span class="sub">${pct}% of stock value</span></div>
          <div class="bar-track"><div class="bar-fill good" style="width:${pct}%"></div></div>
          <div class="bar-value">${I.inrCompact(x.val)}</div>
        </div>`;
    }).join('');

    document.getElementById('category-bars').innerHTML = rows;
  }

  renderStats();
  renderReorderPanel();
  renderTopSellers();
  renderCategories();
})();