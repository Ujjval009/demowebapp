window.AppData = (function(){

  const products = [
    { id:1, name:"Premium Oversized Tee",   sku:"AP-1001", price:999,  stock:45, cat:"Apparel",     color:"#7C6A55", ini:"OT" },
    { id:2, name:"Classic Denim Jacket",     sku:"AP-1002", price:2499, stock:12, cat:"Apparel",     color:"#3C4E63", ini:"DJ" },
    { id:3, name:"Urban Cargo Pants",        sku:"AP-1003", price:1499, stock:24, cat:"Apparel",     color:"#4F5B4D", ini:"CP" },
    { id:4, name:"Ribbed Knit Sweater",      sku:"AP-1004", price:1899, stock:6,  cat:"Apparel",     color:"#6E4A44", ini:"KS" },
    { id:5, name:"Court Sneakers",           sku:"FW-2001", price:3299, stock:9,  cat:"Footwear",    color:"#8A5A2E", ini:"CS" },
    { id:6, name:"Canvas High-Tops",         sku:"FW-2002", price:2199, stock:0,  cat:"Footwear",    color:"#5B4636", ini:"HT" },
    { id:7, name:"Leather Belt",             sku:"AC-3001", price:799,  stock:31, cat:"Accessories", color:"#4A3B2C", ini:"LB" },
    { id:8, name:"Wool Beanie",              sku:"AC-3002", price:499,  stock:18, cat:"Accessories", color:"#5D4A66", ini:"WB" },
    { id:9, name:"Structured Cap",           sku:"AC-3003", price:699,  stock:22, cat:"Accessories", color:"#2E5C55", ini:"SC" },
    { id:10, name:"Crossbody Bag",           sku:"AC-3004", price:1799, stock:4,  cat:"Accessories", color:"#6B3F4C", ini:"CB" },
  ];

  const categories = ["All","Apparel","Footwear","Accessories"];

  const paymentMethods = [
    { id:"cash", label:"Cash", icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></svg>' },
    { id:"card", label:"Card", icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>' },
    { id:"upi",  label:"GPay/UPI", icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/></svg>' },
    { id:"split",label:"Split", icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M16 3h3a2 2 0 0 1 2 2v3"/><path d="M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>' },
  ];

  const customers = [
    { id:1, name:"Aarav Shah",   phone:"98765 43210", email:"aarav.shah@mail.com",  totalSpent:12480, visits:6 },
    { id:2, name:"Neha Kapoor",  phone:"91234 56789", email:"neha.k@mail.com",       totalSpent:8990,  visits:4 },
    { id:3, name:"Devansh Rao",  phone:"90000 11223", email:"devansh.rao@mail.com",  totalSpent:6599,  visits:3 },
    { id:4, name:"Sana Iyer",    phone:"99887 66554", email:"sana.iyer@mail.com",    totalSpent:0,     visits:0 },
    { id:5, name:"Kabir Menon",  phone:"88445 22110", email:"kabir.menon@mail.com",  totalSpent:15240, visits:8 },
    { id:6, name:"Tara Batra",   phone:"77665 55443", email:"tara.batra@mail.com",   totalSpent:3299,  visits:2 },
    { id:7, name:"Rohan Verma",  phone:"66554 44332", email:"rohan.verma@mail.com",  totalSpent:2199,  visits:1 },
  ];

  const users = [
    { email:"admin@fernway.com", password:"admin123", name:"Riya Mehta", role:"Shop Cashier", avatar:"RM" },
    { email:"owner@fernway.com", password:"owner123", name:"Fernway Admin", role:"Owner", avatar:"FA" },
  ];

  const sales = [
    { id:"R-1042", date:"2026-09-08 10:24", customer:"Aarav Shah",
      items:[{name:"Premium Oversized Tee",price:999,qty:1},{name:"Court Sneakers",price:3299,qty:1}],
      subtotal:4298, tax:215, total:4513, method:"card" },
    { id:"R-1041", date:"2026-09-08 09:47", customer:"Walk-in",
      items:[{name:"Urban Cargo Pants",price:1499,qty:2}],
      subtotal:2998, tax:150, total:3148, method:"upi" },
    { id:"R-1040", date:"2026-09-07 18:05", customer:"Neha Kapoor",
      items:[{name:"Ribbed Knit Sweater",price:1899,qty:1},{name:"Wool Beanie",price:499,qty:2}],
      subtotal:2897, tax:145, total:3042, method:"card" },
    { id:"R-1039", date:"2026-09-07 16:32", customer:"Kabir Menon",
      items:[{name:"Classic Denim Jacket",price:2499,qty:1}],
      subtotal:2499, tax:125, total:2624, method:"cash" },
    { id:"R-1038", date:"2026-09-07 12:10", customer:"Walk-in",
      items:[{name:"Leather Belt",price:799,qty:2},{name:"Structured Cap",price:699,qty:1}],
      subtotal:2297, tax:115, total:2412, method:"upi" },
    { id:"R-1037", date:"2026-09-06 15:45", customer:"Tara Batra",
      items:[{name:"Court Sneakers",price:3299,qty:1}],
      subtotal:3299, tax:165, total:3464, method:"card" },
    { id:"R-1036", date:"2026-09-06 11:28", customer:"Rohan Verma",
      items:[{name:"Canvas High-Tops",price:2199,qty:1}],
      subtotal:2199, tax:110, total:2309, method:"cash" },
    { id:"R-1035", date:"2026-09-05 19:22", customer:"Devansh Rao",
      items:[{name:"Premium Oversized Tee",price:999,qty:1},{name:"Crossbody Bag",price:1799,qty:1}],
      subtotal:2798, tax:140, total:2938, method:"upi" },
    { id:"R-1034", date:"2026-09-05 13:05", customer:"Kabir Menon",
      items:[{name:"Classic Denim Jacket",price:2499,qty:1},{name:"Leather Belt",price:799,qty:1}],
      subtotal:3298, tax:165, total:3463, method:"card" },
    { id:"R-1033", date:"2026-09-04 17:50", customer:"Neha Kapoor",
      items:[{name:"Urban Cargo Pants",price:1499,qty:1},{name:"Court Sneakers",price:3299,qty:1}],
      subtotal:4798, tax:240, total:5038, method:"split" },
  ];

  let nextReceipt = 1043;
  let nextCustomerId = 8;

  return {
    products,
    categories,
    paymentMethods,
    customers,
    users,
    sales,
    TAX_RATE:0.05,
    get nextReceipt(){ return nextReceipt; },
    bumpReceipt(){ return nextReceipt++; },
    get nextCustomerId(){ return nextCustomerId++; },
  };

})();
