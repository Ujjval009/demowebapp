window.Router = (function(){
  function current(){
    const h = (location.hash || "#/pos").replace(/^#\/?/,"");
    const seg = h.split("?")[0];
    return seg || "pos";
  }

  function navigate(route){
    if (route === "logout"){ Auth.logout(); return; }
    location.hash = "#/" + route;
  }

  function go(screen){
    const views = document.querySelectorAll("[data-view]");
    views.forEach(v => { v.style.display = (v.getAttribute("data-view") === screen) ? "" : "none"; });
    const navBtns = document.querySelectorAll(".nav-btn[data-route]");
    navBtns.forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-route") === screen);
    });
    document.dispatchEvent(new CustomEvent("view:"+screen));
  }

  function init(){
    const doRoute = function(){
      const screen = current();
      const allowed = ["pos","customers","history"];
      const target = allowed.includes(screen) ? screen : "pos";
      go(target);
    };
    window.addEventListener("hashchange", doRoute);
    doRoute();
  }

  return { init, navigate, go, current };
})();
