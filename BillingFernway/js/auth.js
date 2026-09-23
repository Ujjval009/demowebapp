window.Auth = (function(){
  const KEY = "fernway_auth";
  const PROFILE_KEY = "fernway_profile";

  function current(){
    try{ return sessionStorage.getItem(KEY) === "1"; }catch(e){ return false; }
  }
  function profile(){
    try{ return JSON.parse(sessionStorage.getItem(PROFILE_KEY) || "null"); }catch(e){ return null; }
  }
  function isAuthenticated(){
    if (!current()) return false;
    // prevent log-in redirect loops on login page
    return true;
  }
  function login(email, password){
    const u = (AppData.users || []).find(x =>
      x.email.toLowerCase() === (email||"").trim().toLowerCase() &&
      x.password === password
    );
    if (!u) return false;
    try{
      sessionStorage.setItem(KEY,"1");
      sessionStorage.setItem(PROFILE_KEY, JSON.stringify({name:u.name, role:u.role, avatar:u.avatar, email:u.email}));
    }catch(e){}
    return true;
  }
  function logout(){
    try{ sessionStorage.removeItem(KEY); sessionStorage.removeItem(PROFILE_KEY); }catch(e){}
    window.location.href = "index.html";
  }
  return { isAuthenticated, login, logout, profile };
})();
