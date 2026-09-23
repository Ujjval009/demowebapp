(function(){
  "use strict";

  function initCommon(page){
    /* Highlight the active nav item. */
    var links = document.querySelectorAll('.nav a');
    links.forEach(function(link){
      if(link.getAttribute('data-page') === page){
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });

    /* Live reorder badge in the nav. */
    var flagged = Inventory.products.filter(function(p){ return Inventory.status(p) !== 'good'; });
    var badgeEls = document.querySelectorAll('.nav-badge');
    badgeEls.forEach(function(el){
      if(flagged.length > 0){
        el.textContent = flagged.length;
      }else{
        el.parentElement.classList.add('no-badge');
        el.remove();
      }
    });

    /* Footer timestamp. */
    var ts = document.querySelector('[data-live-ts]');
    if(ts){
      ts.textContent = new Date().toLocaleString("en-IN", {
        day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit"
      });
    }
  }

  function toast(message){
    var box = document.getElementById('toast');
    if(!box){
      box = document.createElement('div');
      box.className = 'toast';
      box.id = 'toast';
      document.body.appendChild(box);
    }
    box.textContent = message;
    box.classList.add('show');
    clearTimeout(box._t);
    box._t = setTimeout(function(){ box.classList.remove('show'); }, 2400);
  }

  function el(html){
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  window.App = { initCommon: initCommon, toast: toast, el: el };
})();