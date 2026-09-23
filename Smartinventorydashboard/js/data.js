(function(){
  "use strict";

  const STORE_KEY   = "chandni.products.v1";
  const ORDERS_KEY  = "chandni.orders.v1";

  var DEFAULT_PRODUCTS = [
    { name:"Wireless Mouse",            cat:"Peripherals",        price:699,  stock:7,  avgSales:4, soldToday:5 },
    { name:"USB-C Cable 1m",            cat:"Cables & Chargers",  price:299,  stock:5,  avgSales:6, soldToday:6 },
    { name:"HDMI Cable 2m",             cat:"Cables & Chargers",  price:449,  stock:3,  avgSales:2, soldToday:1 },
    { name:"Screen Protector Universal",cat:"Mobile Accessories", price:199,  stock:6,  avgSales:5, soldToday:4 },
    { name:"Power Bank 10000mAh",       cat:"Cables & Chargers",  price:1299, stock:9,  avgSales:5, soldToday:3 },
    { name:"Gaming Headset",            cat:"Audio",              price:1899, stock:8,  avgSales:2, soldToday:1 },
    { name:"Portable SSD 1TB",          cat:"Storage",            price:6499, stock:4,  avgSales:1, soldToday:0 },
    { name:"Bluetooth Earbuds",         cat:"Audio",              price:1599, stock:15, avgSales:3, soldToday:2 },
    { name:"Wireless Charger Pad",      cat:"Cables & Chargers",  price:899,  stock:11, avgSales:3, soldToday:2 },
    { name:"Smart Watch Band",          cat:"Mobile Accessories", price:399,  stock:14, avgSales:4, soldToday:3 },
    { name:"Mechanical Keyboard",       cat:"Peripherals",        price:2999, stock:22, avgSales:2, soldToday:1 },
    { name:"Webcam 1080p",              cat:"Peripherals",        price:1999, stock:18, avgSales:1, soldToday:1 },
    { name:"Phone Case - iPhone 15",    cat:"Mobile Accessories", price:499,  stock:40, avgSales:8, soldToday:9 },
    { name:"Laptop Stand",              cat:"Peripherals",        price:899,  stock:25, avgSales:1, soldToday:0 },
    { name:"Smart Bulb",                cat:"Smart Home",         price:649,  stock:30, avgSales:1, soldToday:0 }
  ];

  function read(key, fallback){
    try{
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    }catch(e){ return fallback; }
  }
  function write(key, value){
    try{ localStorage.setItem(key, JSON.stringify(value)); }catch(e){}
  }

  var products = read(STORE_KEY, null);
  if(!Array.isArray(products) || products.length === 0){
    products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
    write(STORE_KEY, products);
  }
  var orders = read(ORDERS_KEY, {});

  function saveProducts(){ write(STORE_KEY, products); }
  function saveOrders(){ write(ORDERS_KEY, orders); }

  /* ---------- Business logic (shared across every page) ---------- */

  function status(item){
    var days = item.avgSales > 0 ? item.stock / item.avgSales : Infinity;
    if(days <= 2) return "critical";
    if(days <= 5) return "low";
    return "good";
  }

  function stockoutDays(item){
    if(item.avgSales <= 0) return Infinity;
    return Math.max(0, Math.round(item.stock / item.avgSales));
  }

  /* Suggested reorder: enough to cover ~7 days of average sales, min 1. */
  function suggestedOrder(item){
    return Math.max(1, Math.ceil(item.avgSales * 7 - item.stock));
  }

  function inr(n){
    return "\u20B9" + Math.round(n).toLocaleString("en-IN");
  }

  function inrCompact(n){
    if(n >= 100000) return "\u20B9" + (n / 100000).toFixed(2) + " Lakh";
    if(n >= 1000)   return "\u20B9" + (n / 1000).toFixed(1) + "k";
    return inr(n);
  }

  function orderPlaced(name){ return !!orders[name]; }

  function placeOrder(item, qty){
    orders[item.name] = true;
    saveOrders();
  }

  function addStock(item, qty){
    item.stock += qty;
    saveProducts();
  }

  function addProduct(item){
    products.push(item);
    saveProducts();
  }

  window.Inventory = {
    products: products,
    status: status,
    stockoutDays: stockoutDays,
    suggestedOrder: suggestedOrder,
    inr: inr,
    inrCompact: inrCompact,
    orderPlaced: orderPlaced,
    placeOrder: placeOrder,
    addStock: addStock,
    addProduct: addProduct
  };
})();