(function(){
  "use strict";
  const I = window.Inventory;
  const A = window.App;

  A.initCommon('sales');

  document.getElementById('sales-date').textContent =
    new Date().toLocaleDateString("en-IN", { day:'numeric', month:'long', year:'numeric' });

  function fillClass(st){
    return st === 'good' ? 'good' : st === 'low' ? 'warn' : 'crit';
  }

  function renderStats(){
    const salesToday = I.products.reduce((s,p)=> s + p.price*p.soldToday, 0);
    const unitsToday = I.products.reduce((s,p)=> s + p.soldToday, 0);
    const avgUnits   = I.products.reduce((s,p)=> s + p.avgSales, 0);
    const soldSome   = I.products.filter(p=> p.soldToday > 0);
    const best       = soldSome.sort((a,b)=> b.soldToday - a.soldToday)[0];

    document.getElementById('s-today').textContent = I.inr(salesToday);
    document.getElementById('s-today-sub').textContent = 'across ' + soldSome.length + ' active SKUs';
    document.getElementById('s-units').textContent = unitsToday;
    document.getElementById('s-units-sub').textContent =
      avgUnits + ' units/day forecast';
    document.getElementById('s-avg').textContent = avgUnits;
    document.getElementById('s-best').textContent = best ? best.name : '—';
    document.getElementById('s-best-sub').textContent = best
      ? best.soldToday + ' units · ' + I.inr(best.soldToday * best.price)
      : 'No sales yet today';
  }

  function barChart(containerId, mode){
    const modeToday = containerId === 'today-bars';
    const list = I.products.slice()
      .sort((a,b)=> modeToday ? b.soldToday - a.soldToday : b.avgSales - a.avgSales)
      .slice(0, 7);
    const key = modeToday ? 'soldToday' : 'avgSales';
    const max = Math.max(1, ...list.map(p=> p[key]));

    const rows = list.map(p=>{
      const val = p[key];
      const pct = Math.max(3, val / max * 100);
      const valueLabel = modeToday
        ? val + '<span class="sub">units · ' + I.inr(val*p.price) + '</span>'
        : val + '<span class="sub">units/day</span>';
      return `
        <div class="bar-row">
          <div class="bar-label"><b>${p.name}</b><span class="sub">${p.cat}</span></div>
          <div class="bar-track"><div class="bar-fill ${fillClass(I.status(p))}" style="width:${pct}%"></div></div>
          <div class="bar-value">${valueLabel}</div>
        </div>`;
    }).join('');
    document.getElementById(containerId).innerHTML = rows;
  }

  renderStats();
  barChart('today-bars', 'today');
  barChart('avg-bars', 'avg');
})();