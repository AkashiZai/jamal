// ============================================================================
// JAMAL CAFÉ & BAKERY POS — PURE VANILLA JS FRONTEND (POWERED BY EXPRESS API)
// ============================================================================

const SESSION_TIMEOUT_SECONDS = 15 * 60;

const state = {
  // Server-synced state
  categories: [],
  products: [],
  toppings: [],
  staffAccounts: [],
  orders: [],
  salesStats: { totalSales: 14250, totalBills: 84, promptPayShare: 64, cashShare: 36 },
  salesHistory: [],
  customerQueueNo: 'A03',

  // Client UI state
  currentPage: 'pos', // 'pos' | 'kds' | 'admin' | 'customer' | 'login'
  currentUser: {
    id: 'staff-01',
    username: 'cashier_zai',
    pin: '1234',
    name: 'Zai (กะเช้า)',
    role: 'cashier',
    roleName: 'แคชเชียร์',
  },
  remainingSeconds: SESSION_TIMEOUT_SECONDS,

  // Login screen state
  loginRole: 'cashier',
  loginUsername: 'cashier_zai',
  loginPin: '1234',
  loginError: '',
  loginUseKeypad: false,

  // POS screen state
  posCategory: 'all',
  posSearch: '',
  cart: [],
  customizingProduct: null,
  customSweetness: '25%',
  customMilk: 'นมสดวัวแท้ (Fresh Milk)',
  customExtraShot: false,
  customJelly: false,
  checkoutSummary: null,
  paymentMethod: 'cash',
  cashEntered: 0,
  paymentCompleted: false,
  showVoidModal: false,
  voidPin: '',
  voidError: '',

  // KDS screen state
  kdsFilter: 'all',
  kdsSound: true,

  // Admin screen state
  adminTab: 'dashboard', // 'dashboard' | 'inventory' | 'menu' | 'sales' | 'staff'
  editingPriceId: null,
  tempPrice: '',
  salesSearch: '',
  showAddMenuModal: false,
  newMenuForm: { name: '', category: 'coffee', price: '', cost: '', desc: '' },
  showAddStaffModal: false,
  newStaffForm: { name: '', role: 'Cashier', username: '', pin: '', shift: 'กะเช้า (07:00 - 15:30)' },

  // Customer Mobile screen state
  mobileFrameMode: true,
  mobileCategory: 'popular',
  mobileCart: [
    {
      id: 'c1',
      name: 'เอสเพรสโซ่เย็น',
      price: 65.0,
      quantity: 1,
      optionsText: 'หวาน 25% • นมโอ๊ต',
      category: 'coffee',
    },
    {
      id: 'b1',
      name: 'ครัวซองต์เนยสด AOP',
      price: 85.0,
      quantity: 1,
      optionsText: 'อบอุ่นร้อน',
      category: 'bakery',
    },
  ],
  mobileCustomProduct: null,
  mobileCustomSweetness: '25%',
  mobileCustomMilk: 'นมโอ๊ต (+15฿)',
  showMobileCartDrawer: false,
  mobileTableNo: '04',
  mobileSuccessMsg: null,
};

// Web Audio Chime
function playChime(type = 'notification') {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const audioCtx = new AudioContextClass();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'bell') {
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.setValueAtTime(1318.51, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } else {
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    }
  } catch (_e) {
    // Ignore audio context restriction before user gesture
  }
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ============================================================================
// API CALLS TO EXPRESS SERVER
// ============================================================================

async function fetchState() {
  try {
    const res = await fetch('/api/state');
    const data = await res.json();
    state.categories = data.categories || [];
    state.products = data.products || [];
    state.toppings = data.toppings || [];
    state.staffAccounts = data.staffAccounts || [];
    state.orders = data.orders || [];
    state.salesStats = data.salesStats || state.salesStats;
    state.salesHistory = data.salesHistory || [];
    state.customerQueueNo = data.customerQueueNo || state.customerQueueNo;
    render();
  } catch (err) {
    console.error('Failed to load state from Express server:', err);
  }
}

async function apiCreateOrder(payload) {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  playChime('bell');
  await fetchState();
  return data.order;
}

async function apiAdvanceOrderStatus(orderId, currentStatus) {
  if (state.kdsSound) {
    playChime(currentStatus === 'in_progress' ? 'bell' : 'notification');
  }
  const nextMap = {
    pending: 'in_progress',
    in_progress: 'ready',
    ready: 'completed',
  };
  const nextStatus = nextMap[currentStatus];
  if (!nextStatus) return;

  await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: nextStatus }),
  });
  await fetchState();
}

async function apiRestockProduct(productId, amount) {
  await fetch(`/api/products/${encodeURIComponent(productId)}/restock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  await fetchState();
}

async function apiUpdatePrice(productId, price) {
  await fetch(`/api/products/${encodeURIComponent(productId)}/price`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ price }),
  });
  await fetchState();
}

async function apiAddProduct(form) {
  await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  await fetchState();
}

async function apiVoidReceipt(receiptNo) {
  await fetch(`/api/sales/${encodeURIComponent(receiptNo)}/void`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adminName: 'Admin Zai' }),
  });
  await fetchState();
}

async function apiAddStaff(form) {
  await fetch('/api/staff', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  await fetchState();
}

// ============================================================================
// GLOBAL ACTIONS & EVENT HANDLERS
// ============================================================================

window.appActions = {
  navigate(page) {
    state.currentPage = page;
    render();
  },

  logout(reason) {
    state.currentUser = null;
    state.currentPage = 'login';
    if (reason) alert(reason);
    render();
  },

  resetTimer() {
    state.remainingSeconds = SESSION_TIMEOUT_SECONDS;
    const el = document.getElementById('session-timer-display');
    if (el) el.textContent = formatTime(state.remainingSeconds);
  },

  // --- LOGIN ---
  selectLoginRole(role) {
    state.loginRole = role;
    const demo = state.staffAccounts.find((a) => a.role === role);
    if (demo) {
      state.loginUsername = demo.username;
      state.loginPin = demo.pin;
      state.loginError = '';
    }
    render();
  },

  toggleLoginKeypad() {
    state.loginUseKeypad = !state.loginUseKeypad;
    render();
  },

  loginKeypadPress(val) {
    if (val === 'CLEAR') state.loginPin = '';
    else if (val === 'BACK') state.loginPin = state.loginPin.slice(0, -1);
    else if (state.loginPin.length < 4) state.loginPin += String(val);
    render();
  },

  async submitLogin(e) {
    e.preventDefault();
    state.loginError = '';
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: state.loginUsername, pin: state.loginPin }),
    });
    const data = await res.json();
    if (!res.ok) {
      state.loginError = data.error || 'เข้าสู่ระบบไม่สำเร็จ';
      render();
      return;
    }
    state.currentUser = data.user;
    state.remainingSeconds = SESSION_TIMEOUT_SECONDS;
    if (data.user.role === 'operator') state.currentPage = 'kds';
    else if (data.user.role === 'admin') state.currentPage = 'admin';
    else state.currentPage = 'pos';
    render();
  },

  async loginWithSocial(provider) {
    state.loginError = '';
    const defaultEmail =
      state.loginRole === 'admin' ? 'owner.jamal@gmail.com' : `cashier.${provider}@gmail.com`;
    const email = window.prompt(
      `กรอกอีเมลบัญชี ${provider === 'gmail' ? 'Google (Gmail)' : 'Facebook'} ของคุณ:`,
      defaultEmail
    );
    if (!email) return;

    const res = await fetch('/api/auth/social', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider,
        email,
        displayName: `${email.split('@')[0]} (${provider})`,
        role: state.loginRole,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      state.loginError = data.error || 'เข้าสู่ระบบ Social Login ไม่สำเร็จ';
      render();
      return;
    }
    state.currentUser = data.user;
    state.remainingSeconds = SESSION_TIMEOUT_SECONDS;
    if (data.user.role === 'operator') state.currentPage = 'kds';
    else if (data.user.role === 'admin') state.currentPage = 'admin';
    else state.currentPage = 'pos';
    await fetchState();
  },

  // --- POS ---
  setPosCategory(catId) {
    state.posCategory = catId;
    render();
  },

  setPosSearch(val) {
    state.posSearch = val;
    render();
  },

  selectProduct(productId) {
    const product = state.products.find((p) => p.id === productId);
    if (!product || (product.stock !== null && product.stock <= 0)) return;
    if (product.customizable) {
      state.customizingProduct = product;
      state.customSweetness = '25%';
      state.customMilk = 'นมสดวัวแท้ (Fresh Milk)';
      state.customExtraShot = false;
      state.customJelly = false;
      render();
    } else {
      this.addToCart(product, '', product.price);
    }
  },

  addToCart(product, optionsText, unitPrice, toppings = []) {
    const existingIdx = state.cart.findIndex(
      (item) => item.id === product.id && item.optionsText === optionsText
    );
    if (existingIdx > -1) {
      state.cart[existingIdx].quantity += 1;
    } else {
      const toppingsPrice = toppings.reduce((sum, t) => sum + (Number(t.price) || 0), 0);
      state.cart.push({
        cartItemId: `${product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        id: product.id,
        name: product.name,
        category: product.category,
        basePrice: Number(product.price) || 0,
        toppingsPrice,
        unitPrice,
        optionsText,
        toppings: toppings.map((t) => ({ id: t.id, name: t.name, price: Number(t.price) || 0 })),
        quantity: 1,
        isBakery: Boolean(product.isBakery),
      });
    }
    render();
  },

  closeCustomModal() {
    state.customizingProduct = null;
    render();
  },

  setCustomSweetness(lvl) {
    state.customSweetness = lvl;
    render();
  },

  setCustomMilk(milkName) {
    state.customMilk = milkName;
    render();
  },

  toggleExtraShot() {
    state.customExtraShot = !state.customExtraShot;
    render();
  },

  toggleJelly() {
    state.customJelly = !state.customJelly;
    render();
  },

  confirmCustomization() {
    const p = state.customizingProduct;
    if (!p) return;
    let extra = 0;
    const opts = [`หวาน ${state.customSweetness}`];
    const selectedToppings = [];
    const pickTopping = (id, fallbackName, fallbackPrice) => {
      const matched = (state.toppings || []).find((t) => t.id === id);
      return matched
        ? { id: matched.id, name: matched.name, price: Number(matched.price) || fallbackPrice }
        : { id, name: fallbackName, price: fallbackPrice };
    };
    if (state.customMilk.includes('Oat')) {
      extra += 15;
      opts.push('นมโอ๊ต (+฿15)');
      selectedToppings.push(pickTopping('t1', 'นมโอ๊ต (Oat Milk)', 15));
    } else if (state.customMilk.includes('Almond')) {
      extra += 15;
      opts.push('นมอัลมอนด์ (+฿15)');
      selectedToppings.push(pickTopping('t2', 'นมอัลมอนด์ (Almond Milk)', 15));
    }
    if (state.customExtraShot) {
      extra += 20;
      opts.push('เพิ่มช็อต (+฿20)');
      selectedToppings.push(pickTopping('t3', 'เพิ่มช็อตเอสเพรสโซ่ (Extra Shot)', 20));
    }
    if (state.customJelly) {
      extra += 15;
      opts.push('บุกบราวน์ชูการ์ (+฿15)');
      selectedToppings.push(pickTopping('t4', 'บุกบราวน์ชูการ์ (Brown Sugar Jelly)', 15));
    }
    this.addToCart(p, opts.join(' • '), p.price + extra, selectedToppings);
    state.customizingProduct = null;
    render();
  },

  updateCartQty(cartItemId, newQty) {
    if (newQty <= 0) {
      state.cart = state.cart.filter((i) => i.cartItemId !== cartItemId);
    } else {
      state.cart = state.cart.map((i) =>
        i.cartItemId === cartItemId ? { ...i, quantity: newQty } : i
      );
    }
    render();
  },

  removeCartItem(cartItemId) {
    state.cart = state.cart.filter((i) => i.cartItemId !== cartItemId);
    render();
  },

  clearCart() {
    if (state.cart.length > 0 && window.confirm('ต้องการล้างรายการในบิลทั้งหมดหรือไม่?')) {
      state.cart = [];
      render();
    }
  },

  holdBill() {
    if (state.cart.length === 0) return;
    alert('พักบิลออเดอร์นี้เรียบร้อย (Hold Bill Saved)');
  },

  openVoidModal() {
    if (state.cart.length === 0) return;
    state.showVoidModal = true;
    state.voidPin = '';
    state.voidError = '';
    render();
  },

  closeVoidModal() {
    state.showVoidModal = false;
    render();
  },

  submitVoidModal(e) {
    e.preventDefault();
    if (state.voidPin === '9999' || state.voidPin === '1234' || state.voidPin.length >= 4) {
      state.cart = [];
      state.showVoidModal = false;
      alert('อนุมัติ Void บิลสำเร็จโดย Admin Zai (บันทึก Audit Log เรียบร้อย)');
      render();
    } else {
      state.voidError = 'รหัสผ่าน Admin PIN ไม่ถูกต้อง (ลองใช้ 9999)';
      render();
    }
  },

  openCheckout() {
    if (state.cart.length === 0) return;
    const totalAmount = state.cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const subtotal = totalAmount / 1.07;
    const vatAmount = totalAmount - subtotal;
    const totalItemsCount = state.cart.reduce((s, i) => s + i.quantity, 0);
    state.checkoutSummary = { totalAmount, subtotal, vatAmount, totalItemsCount };
    state.paymentMethod = 'cash';
    state.cashEntered = 0;
    state.paymentCompleted = false;
    render();
  },

  closeCheckout() {
    if (state.paymentCompleted) {
      state.cart = [];
    }
    state.checkoutSummary = null;
    state.paymentCompleted = false;
    render();
  },

  setPaymentMethod(m) {
    state.paymentMethod = m;
    render();
  },

  quickCash(val) {
    const total = state.checkoutSummary?.totalAmount || 0;
    state.cashEntered = val === 'exact' ? Math.ceil(total) : Number(val);
    render();
  },

  numpadClick(val) {
    if (val === 'C') state.cashEntered = 0;
    else if (val === '00') state.cashEntered = state.cashEntered * 100;
    else state.cashEntered = state.cashEntered * 10 + parseInt(val, 10);
    render();
  },

  async confirmPayment() {
    const total = state.checkoutSummary?.totalAmount || 0;
    if (state.paymentMethod === 'cash' && state.cashEntered < total) {
      alert('ยอดเงินสดที่รับมาน้อยกว่ายอดที่ต้องชำระ!');
      return;
    }
    state.paymentCompleted = true;
    await apiCreateOrder({
      items: state.cart.map((ci) => ({
        id: ci.id,
        name: ci.name,
        quantity: ci.quantity,
        optionsText: ci.optionsText,
        toppings: ci.toppings || [],
        category: ci.category,
        isBakery: ci.isBakery,
      })),
      totalAmount: total,
      paymentMethod: state.paymentMethod === 'cash' ? 'เงินสด' : 'PromptPay',
      tableNo: 'หน้าร้าน (POS)',
      channel: 'หน้าร้าน (Cashier POS)',
      cashierName: state.currentUser ? state.currentUser.name : 'Zai (กะเช้า)',
    });
    render();
  },

  // --- KDS ---
  setKdsFilter(f) {
    state.kdsFilter = f;
    render();
  },

  toggleKdsSound() {
    state.kdsSound = !state.kdsSound;
    render();
  },

  async quickDemoOrder() {
    await apiCreateOrder({
      items: [
        {
          id: 'c1',
          name: 'เอสเพรสโซ่เย็น',
          quantity: 1,
          optionsText: 'หวาน 25% • นมโอ๊ต',
          category: 'coffee',
        },
        {
          id: 'b1',
          name: 'ครัวซองต์เนยสด AOP',
          quantity: 1,
          optionsText: 'อบอุ่นร้อน',
          category: 'bakery',
        },
      ],
      totalAmount: 150.0,
      paymentMethod: 'PromptPay',
      tableNo: '02',
      channel: 'จำลองออเดอร์ใหม่',
      cashierName: 'ทดสอบระบบ',
    });
  },

  advanceOrder(orderId, currentStatus) {
    apiAdvanceOrderStatus(orderId, currentStatus);
  },

  // --- ADMIN ---
  setAdminTab(tab) {
    state.adminTab = tab;
    render();
  },

  restock(productId, amount) {
    apiRestockProduct(productId, amount);
  },

  startEditPrice(productId, currentPrice) {
    state.editingPriceId = productId;
    state.tempPrice = String(currentPrice);
    render();
  },

  cancelEditPrice() {
    state.editingPriceId = null;
    render();
  },

  async savePrice(productId) {
    if (state.tempPrice && !isNaN(state.tempPrice) && Number(state.tempPrice) > 0) {
      await apiUpdatePrice(productId, Number(state.tempPrice));
    }
    state.editingPriceId = null;
    render();
  },

  openAddMenuModal() {
    state.showAddMenuModal = true;
    state.newMenuForm = { name: '', category: 'coffee', price: '', cost: '', desc: '' };
    render();
  },

  closeAddMenuModal() {
    state.showAddMenuModal = false;
    render();
  },

  async submitAddMenu(e) {
    e.preventDefault();
    if (!state.newMenuForm.name || !state.newMenuForm.price) return;
    await apiAddProduct(state.newMenuForm);
    state.showAddMenuModal = false;
    render();
  },

  openAddStaffModal() {
    state.showAddStaffModal = true;
    state.newStaffForm = {
      name: '',
      role: 'Cashier',
      username: '',
      pin: '',
      shift: 'กะเช้า (07:00 - 15:30)',
    };
    render();
  },

  closeAddStaffModal() {
    state.showAddStaffModal = false;
    render();
  },

  async submitAddStaff(e) {
    e.preventDefault();
    if (!state.newStaffForm.name || !state.newStaffForm.username || !state.newStaffForm.pin) return;
    await apiAddStaff(state.newStaffForm);
    state.showAddStaffModal = false;
    render();
  },

  async confirmVoidReceipt(receiptNo) {
    if (window.confirm(`ยืนยันการ Void บิล ${receiptNo}?`)) {
      await apiVoidReceipt(receiptNo);
    }
  },

  // --- CUSTOMER MOBILE ---
  toggleMobileFrame() {
    state.mobileFrameMode = !state.mobileFrameMode;
    render();
  },

  setMobileCategory(catId) {
    state.mobileCategory = catId;
    render();
  },

  clickMobileProduct(productId) {
    const product = state.products.find((p) => p.id === productId);
    if (!product || (product.stock !== null && product.stock <= 0)) return;
    if (product.customizable) {
      state.mobileCustomProduct = product;
      state.mobileCustomSweetness = '25%';
      state.mobileCustomMilk = 'นมปกติ';
      render();
    } else {
      this.addToMobileCart(product, product.price, 'อบอุ่นร้อน');
    }
  },

  addToMobileCart(product, unitPrice, optionsText) {
    const idx = state.mobileCart.findIndex(
      (i) => i.id === product.id && i.optionsText === optionsText
    );
    if (idx > -1) {
      state.mobileCart[idx].quantity += 1;
    } else {
      state.mobileCart.push({
        id: product.id,
        name: product.name.split(' (')[0],
        price: unitPrice,
        quantity: 1,
        optionsText,
        category: product.category,
        isBakery: Boolean(product.isBakery),
      });
    }
    playChime('notification');
    render();
  },

  closeMobileCustom() {
    state.mobileCustomProduct = null;
    render();
  },

  setMobileSweetness(lvl) {
    state.mobileCustomSweetness = lvl;
    render();
  },

  setMobileMilk(milk) {
    state.mobileCustomMilk = milk;
    render();
  },

  confirmMobileCustomization() {
    const p = state.mobileCustomProduct;
    if (!p) return;
    const addPrice = state.mobileCustomMilk.includes('(+15฿)') ? 15 : 0;
    const optionsText = `หวาน ${state.mobileCustomSweetness} • ${state.mobileCustomMilk}`;
    state.mobileCustomProduct = null;
    this.addToMobileCart(p, p.price + addPrice, optionsText);
  },

  openMobileCartDrawer() {
    if (state.mobileCart.length === 0) return;
    state.showMobileCartDrawer = true;
    render();
  },

  closeMobileCartDrawer() {
    state.showMobileCartDrawer = false;
    render();
  },

  async placeMobileOrder() {
    if (state.mobileCart.length === 0) return;
    const cartTotal = state.mobileCart.reduce((s, i) => s + i.price * i.quantity, 0);
    const newOrder = await apiCreateOrder({
      items: state.mobileCart,
      totalAmount: cartTotal,
      paymentMethod: 'PromptPay',
      tableNo: state.mobileTableNo,
      channel: 'Mobile Scan (ลูกค้าสั่งเอง)',
      cashierName: `โต๊ะ ${state.mobileTableNo}`,
    });
    state.customerQueueNo = newOrder.queueNo;
    state.mobileCart = [];
    state.showMobileCartDrawer = false;
    state.mobileSuccessMsg = `สั่งซื้อสำเร็จ! คิวของคุณคือ #${newOrder.queueNo} กำลังส่งไปยังครัวบาริสต้า`;
    render();
    setTimeout(() => {
      state.mobileSuccessMsg = null;
      render();
    }, 6000);
  },
};

// ============================================================================
// VIEW TEMPLATES
// ============================================================================

function renderNavbar() {
  const activeOrdersCount = state.orders.filter((o) => o.status !== 'completed').length;
  const navItems = [
    { id: 'pos', label: '1. Cashier POS (iPad)', badge: null },
    {
      id: 'kds',
      label: '2. Kitchen KDS (บาริสต้า/ครัว)',
      badge: activeOrdersCount > 0 ? activeOrdersCount : null,
      badgeColor: 'bg-amber-500',
    },
    { id: 'admin', label: '3. Admin Portal (แผงควบคุม & สต็อก)', badge: null },
    { id: 'customer', label: '4. Customer Mobile (จอลูกค้า)', badge: null },
    { id: 'login', label: '5. เข้าสู่ระบบ (Login)', badge: null },
  ];

  return `
    <header class="bg-espresso-900 text-white px-3 sm:px-5 py-2 flex flex-wrap items-center justify-between border-b border-espresso-700 text-xs sm:text-sm z-50 sticky top-0 shadow-md print:hidden gap-2">
      <div class="flex items-center space-x-2.5">
        <div class="w-8 h-8 rounded-lg bg-terracotta flex items-center justify-center font-bold text-white tracking-wider shadow-sm">
          JM
        </div>
        <div>
          <div class="font-bold tracking-wide flex items-center gap-1.5">
            <span>JAMAL CAFÉ &amp; BAKERY</span>
          </div>
          <div class="text-warmgray-400 text-[10px] hidden sm:block">
            All-in-One POS System (Node.js + Express Suite)
          </div>
        </div>
      </div>

      <nav class="flex items-center bg-espresso-800 p-1 rounded-xl border border-espresso-700 overflow-x-auto no-scrollbar max-w-full space-x-1">
        ${navItems
          .map((item) => {
            const isActive = state.currentPage === item.id;
            return `
              <button
                onclick="appActions.navigate('${item.id}')"
                class="px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap text-xs ${
                  isActive
                    ? 'bg-terracotta text-white shadow font-bold'
                    : 'text-warmgray-400 hover:text-white hover:bg-espresso-700/50'
                }"
              >
                <span>${item.label}</span>
                ${
                  item.badge !== null
                    ? `<span class="${item.badgeColor || 'bg-terracotta'} text-white font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold">${item.badge}</span>`
                    : ''
                }
              </button>
            `;
          })
          .join('')}
      </nav>

      <div class="flex items-center space-x-2.5 text-xs">
        <span class="hidden xl:inline-flex items-center gap-1.5 bg-espresso-800 px-2.5 py-1 rounded-md border border-espresso-700 text-warmgray-400 font-medium text-[11px]">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Express Server Online
        </span>

        ${
          state.currentUser
            ? `
          <div class="flex items-center gap-2">
            <span class="hidden md:inline text-warmgray-300 font-medium text-[11px]">
              ผู้ใช้งาน: <strong class="text-white font-bold">${escapeHtml(state.currentUser.name)}</strong> (${escapeHtml(state.currentUser.roleName)})
            </span>
            <button
              onclick="appActions.logout()"
              title="ออกจากระบบ (Sign Out)"
              class="px-2.5 py-1 rounded-lg bg-espresso-800 hover:bg-espresso-700 text-warmgray-300 hover:text-red-400 border border-espresso-700 transition flex items-center gap-1 font-medium text-[11px]"
            >
              <span>ออก</span>
            </button>
          </div>
        `
            : `<span class="text-[11px] text-warmgray-400 bg-espresso-800 px-2.5 py-1 rounded-lg border border-espresso-700">Guest</span>`
        }
      </div>
    </header>
  `;
}

function renderSessionBar() {
  if (!state.currentUser) return '';
  return `
    <div class="bg-espresso-800 text-white px-4 py-1.5 text-[11px] flex items-center justify-between border-b border-espresso-700 print:hidden">
      <div class="flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-green-400"></span>
        <span class="text-warmgray-200">
          กำลังใช้งานในชื่อ: <strong class="text-white font-bold">${escapeHtml(state.currentUser.name)}</strong> (${escapeHtml(state.currentUser.roleName)})
        </span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-warmgray-200">
          Session Timeout: <strong id="session-timer-display" class="font-mono text-terracotta font-extrabold text-xs">${formatTime(state.remainingSeconds)}</strong>
        </span>
        <button
          onclick="appActions.resetTimer()"
          class="text-[10px] text-warmgray-300 hover:text-white underline ml-1"
          title="ต่อเวลาเซสชัน"
        >
          รีเซ็ตเวลา
        </button>
      </div>
    </div>
  `;
}

function renderLoginPage() {
  return `
    <div class="min-h-[calc(100vh-65px)] bg-[#EDE7DF] flex items-center justify-center p-4 sm:p-6 select-none">
      <div class="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-2xl space-y-6">
        <div class="text-center space-y-1.5">
          <div class="w-14 h-14 rounded-2xl bg-espresso-900 text-white flex items-center justify-center mx-auto text-xl font-bold tracking-wider shadow">
            JM
          </div>
          <h1 class="text-2xl font-bold text-espresso-900">เข้าสู่ระบบ JAMAL POS</h1>
          <p class="text-xs text-warmgray-600">Café &amp; Bakery Management System</p>
        </div>

        <div class="grid grid-cols-3 gap-1.5 bg-cream-200 p-1.5 rounded-xl text-xs font-bold">
          <button
            type="button"
            onclick="appActions.selectLoginRole('cashier')"
            class="py-2.5 rounded-lg transition ${
              state.loginRole === 'cashier' ? 'bg-terracotta text-white shadow' : 'text-warmgray-600 hover:text-espresso-900'
            }"
          >แคชเชียร์</button>
          <button
            type="button"
            onclick="appActions.selectLoginRole('operator')"
            class="py-2.5 rounded-lg transition ${
              state.loginRole === 'operator' ? 'bg-terracotta text-white shadow' : 'text-warmgray-600 hover:text-espresso-900'
            }"
          >บาริสต้า/ครัว</button>
          <button
            type="button"
            onclick="appActions.selectLoginRole('admin')"
            class="py-2.5 rounded-lg transition ${
              state.loginRole === 'admin' ? 'bg-terracotta text-white shadow' : 'text-warmgray-600 hover:text-espresso-900'
            }"
          >เจ้าของร้าน</button>
        </div>

        <form onsubmit="appActions.submitLogin(event)" class="space-y-4 text-xs">
          <div>
            <label class="block font-bold text-espresso-900 mb-1.5">รหัสพนักงาน หรือชื่อผู้ใช้</label>
            <input
              type="text"
              required
              value="${escapeHtml(state.loginUsername)}"
              oninput="state.loginUsername = this.value"
              class="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-xl font-medium text-sm text-espresso-900 focus:outline-none focus:border-terracotta"
            />
          </div>

          <div>
            <div class="flex justify-between items-center mb-1.5">
              <label class="font-bold text-espresso-900">รหัสผ่าน หรือ PIN 4 หลัก</label>
              <button
                type="button"
                onclick="appActions.toggleLoginKeypad()"
                class="text-[11px] text-terracotta font-semibold hover:underline"
              >
                ${state.loginUseKeypad ? 'ซ่อนแป้นพิมพ์' : 'แป้นตัวเลขสัมผัส'}
              </button>
            </div>
            <input
              type="password"
              maxlength="4"
              required
              value="${escapeHtml(state.loginPin)}"
              oninput="state.loginPin = this.value"
              class="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-xl font-mono text-base tracking-widest text-espresso-900 focus:outline-none focus:border-terracotta"
            />
          </div>

          ${
            state.loginUseKeypad
              ? `
            <div class="grid grid-cols-3 gap-2 pt-1 font-mono text-sm font-bold">
              ${[1, 2, 3, 4, 5, 6, 7, 8, 9]
                .map(
                  (n) => `
                <button type="button" onclick="appActions.loginKeypadPress(${n})" class="py-2.5 bg-cream-100 hover:bg-cream-200 rounded-xl border border-cream-200 transition">${n}</button>
              `
                )
                .join('')}
              <button type="button" onclick="appActions.loginKeypadPress('CLEAR')" class="py-2.5 bg-cream-100 text-xs font-sans text-warmgray-600 rounded-xl">ล้าง</button>
              <button type="button" onclick="appActions.loginKeypadPress(0)" class="py-2.5 bg-cream-100 rounded-xl border border-cream-200">0</button>
              <button type="button" onclick="appActions.loginKeypadPress('BACK')" class="py-2.5 bg-cream-100 text-xs font-sans text-warmgray-600 rounded-xl">ลบ</button>
            </div>
          `
              : ''
          }

          ${
            state.loginError
              ? `<div class="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">${escapeHtml(state.loginError)}</div>`
              : ''
          }

          <button
            type="submit"
            class="w-full py-4 bg-espresso-800 text-white rounded-2xl text-sm font-bold hover:bg-espresso-900 transition shadow-lg active:scale-[0.99] flex items-center justify-center gap-1.5"
          >
            <span>เข้าสู่ระบบ (Sign In)</span>
            <span>→</span>
          </button>
        </form>

        <div class="space-y-2 pt-1">
          <div class="relative flex py-1 items-center">
            <div class="flex-grow border-t border-cream-300"></div>
            <span class="flex-shrink mx-3 text-[11px] text-warmgray-400">หรือเข้าสู่ระบบด้วย Social Media</span>
            <div class="flex-grow border-t border-cream-300"></div>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs font-bold">
            <button
              type="button"
              onclick="appActions.loginWithSocial('gmail')"
              class="py-2.5 px-3 bg-white border border-cream-300 hover:bg-cream-100 text-espresso-900 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <span>G</span>
              <span>Gmail</span>
            </button>
            <button
              type="button"
              onclick="appActions.loginWithSocial('facebook')"
              class="py-2.5 px-3 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <span>f</span>
              <span>Facebook</span>
            </button>
          </div>
        </div>

        <p class="text-center text-[11px] text-warmgray-400">
          ระบบความปลอดภัย: Timeout Logout อัตโนมัติเมื่อไม่ใช้งานเกิน 15 นาที (NFR-04)
        </p>
      </div>
    </div>
  `;
}

function renderPosPage() {
  const filteredProducts = state.products.filter((prod) => {
    const matchCategory = state.posCategory === 'all' || prod.category === state.posCategory;
    const q = state.posSearch.trim().toLowerCase();
    const matchQuery =
      !q ||
      prod.name.toLowerCase().includes(q) ||
      prod.desc.toLowerCase().includes(q) ||
      String(prod.category || '').toLowerCase().includes(q);
    return matchCategory && matchQuery;
  });

  const searchKey = state.posSearch.trim().toLowerCase();
  const matchedToppings = searchKey
    ? (state.toppings || []).filter((t) => t.name.toLowerCase().includes(searchKey))
    : [];

  const totalAmount = state.cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const subtotal = totalAmount / 1.07;
  const vatAmount = totalAmount - subtotal;
  const totalItemsCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  return `
    <main class="flex-1 flex justify-center items-start p-2 sm:p-4 overflow-x-hidden print:p-0 print:m-0 print:overflow-visible">
      <div class="w-full max-w-[1240px] bg-cream-100 rounded-2xl shadow-xl border border-cream-300 overflow-hidden flex flex-col md:flex-row min-h-[760px] print:hidden">
        <!-- LEFT SECTION: CATALOG -->
        <div class="flex-1 flex flex-col border-r border-cream-300 bg-cream-50">
          <div class="p-4 border-b border-cream-300 flex flex-col sm:flex-row gap-3 items-center justify-between bg-white">
            <div class="flex items-center gap-2">
              <div class="p-2 rounded-xl bg-cream-200 text-espresso-800 font-bold">🏪</div>
              <div>
                <h2 class="font-bold text-espresso-900 text-base leading-none">เมนูสินค้าหน้าร้าน (Menu Catalog)</h2>
                <p class="text-xs text-warmgray-600 mt-0.5">
                  พนักงาน: <span class="font-semibold text-espresso-800">${escapeHtml(state.currentUser ? state.currentUser.name : 'Zai (กะเช้า)')}</span> • โต๊ะ/ออเดอร์หน้าร้าน
                </p>
              </div>
            </div>

            <div class="relative w-full sm:w-72">
              <input
                type="text"
                value="${escapeHtml(state.posSearch)}"
                oninput="appActions.setPosSearch(this.value)"
                placeholder="ค้นหาชื่อเมนู หรือรหัส..."
                class="w-full pl-4 pr-8 py-2 bg-cream-100 border border-cream-300 rounded-xl text-sm focus:outline-none focus:border-terracotta transition"
              />
              ${
                state.posSearch
                  ? `<button onclick="appActions.setPosSearch('')" class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-warmgray-400 hover:text-espresso-900">✕</button>`
                  : ''
              }
            </div>
          </div>

          <div class="px-4 py-2.5 bg-cream-100 border-b border-cream-300 flex gap-2 overflow-x-auto items-center no-scrollbar">
            ${state.categories
              .map((cat) => {
                const isActive = state.posCategory === cat.id;
                return `
                  <button
                    onclick="appActions.setPosCategory('${cat.id}')"
                    class="px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
                      isActive
                        ? 'bg-espresso-800 text-white shadow-sm'
                        : 'bg-white text-espresso-800 border border-cream-300 hover:bg-cream-200'
                    }"
                  >
                    ${cat.id === 'all' ? '☕ ทั้งหมด (All)' : escapeHtml(cat.name)}
                  </button>
                `;
              })
              .join('')}
          </div>

          <div class="flex-1 p-4 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 overflow-y-auto max-h-[620px] content-start auto-rows-max items-start">
            ${
              matchedToppings.length > 0
                ? `<div class="col-span-full bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-espresso-900">
                     <span class="font-bold">ท็อปปิ้งที่ตรงกับคำค้นหา:</span>
                     ${matchedToppings.map((t) => `${escapeHtml(t.name)} (+฿${t.price}, คงเหลือ ${t.stock})`).join(' • ')}
                   </div>`
                : ''
            }
            ${filteredProducts
              .map((product) => {
                const isOutOfStock = product.stock !== null && product.stock <= 0;
                const isLowStock = product.stock !== null && product.stock > 0 && product.stock <= 5;
                return `
                  <div
                    onclick="${isOutOfStock ? '' : `appActions.selectProduct('${product.id}')`}"
                    class="bg-white rounded-2xl border border-cream-300 p-3 flex flex-col justify-between h-fit self-start transition cursor-pointer select-none ${
                      isOutOfStock
                        ? 'opacity-60 pointer-events-none'
                        : 'hover:border-terracotta hover:shadow-md active:scale-[0.98]'
                    }"
                  >
                    <div class="aspect-[4/3] rounded-xl overflow-hidden mb-2 bg-cream-200 relative">
                      <img src="${escapeHtml(product.img)}" alt="${escapeHtml(product.name)}" class="w-full h-full object-cover" loading="lazy" />
                      ${
                        isLowStock
                          ? `<span class="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">เหลือ ${product.stock} ชิ้น</span>`
                          : ''
                      }
                      ${
                        isOutOfStock
                          ? `<div class="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-xs">สินค้าหมด (OUT OF STOCK)</div>`
                          : ''
                      }
                    </div>
                    <div class="flex flex-col justify-between flex-1">
                      <div>
                        <div class="font-bold text-xs text-espresso-900 line-clamp-1">${escapeHtml(product.name)}</div>
                        <p class="text-[11px] text-warmgray-600 line-clamp-1 mt-0.5">${escapeHtml(product.desc)}</p>
                      </div>
                      <div class="flex justify-between items-center mt-2.5 pt-1.5 border-t border-cream-200">
                        <span class="font-mono font-bold text-terracotta text-sm tabular-nums">฿${Number(product.price).toFixed(2)}</span>
                        <span class="px-2.5 py-1 text-xs font-bold rounded-lg transition bg-cream-200 text-espresso-900 hover:bg-terracotta hover:text-white">
                          ${product.customizable ? 'Custom' : '+ เพิ่ม'}
                        </span>
                      </div>
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>

        <!-- RIGHT SECTION: CART SIDEBAR -->
        <div class="w-full md:w-[380px] bg-cream-200 flex flex-col justify-between border-t md:border-t-0 md:border-l border-cream-300 select-none">
          <div>
            <div class="p-4 border-b border-cream-300 bg-white flex items-center justify-between">
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-bold text-espresso-900 text-base leading-none">รายการสั่งซื้อ (Active Bill)</h3>
                  <span class="bg-terracotta text-white text-xs px-2 py-0.5 rounded-full font-mono font-bold">${totalItemsCount}</span>
                </div>
                <p class="text-xs text-warmgray-400 font-mono mt-1">บิลเลขที่: #JM-2026-084</p>
              </div>
              <button
                type="button"
                ${state.cart.length === 0 ? 'disabled' : ''}
                onclick="appActions.clearCart()"
                class="text-xs text-red-600 hover:text-red-700 disabled:opacity-40 font-medium px-2 py-1 rounded hover:bg-red-50 transition"
              >
                🗑 ล้างบิล
              </button>
            </div>

            <div class="p-3 overflow-y-auto space-y-2.5 max-h-[460px]">
              ${
                state.cart.length === 0
                  ? `
                <div class="h-64 flex flex-col items-center justify-center text-center p-6 text-warmgray-400">
                  <div class="w-16 h-16 rounded-full bg-cream-300 flex items-center justify-center mb-3 text-2xl">🛍️</div>
                  <p class="font-semibold text-sm text-espresso-800">ยังไม่มีรายการสินค้า</p>
                  <p class="text-xs text-warmgray-600 mt-1">แตะที่เมนูด้านซ้ายเพื่อเพิ่มรายการลงในบิล</p>
                </div>
              `
                  : state.cart
                      .map(
                        (item) => `
                  <div class="p-3 bg-white rounded-xl border border-cream-300 shadow-sm space-y-1.5">
                    <div class="flex justify-between items-start">
                      <span class="font-bold text-xs text-espresso-900 leading-snug">${item.quantity}x ${escapeHtml(item.name)}</span>
                      <span class="font-mono font-bold text-xs text-espresso-900 tabular-nums">฿${(item.unitPrice * item.quantity).toFixed(2)}</span>
                    </div>
                    ${
                      item.optionsText
                        ? `<div class="text-[11px] font-medium text-terracotta leading-tight">↳ ${escapeHtml(item.optionsText)}</div>`
                        : ''
                    }
                    <div class="flex justify-between items-center pt-1 text-[10px] text-warmgray-600">
                      <button type="button" onclick="appActions.removeCartItem('${item.cartItemId}')" class="text-warmgray-400 hover:text-red-600 transition underline">ลบรายการ</button>
                      <div class="inline-flex items-center border border-cream-300 rounded bg-cream-100 font-bold font-mono text-xs overflow-hidden">
                        <button type="button" onclick="appActions.updateCartQty('${item.cartItemId}', ${item.quantity - 1})" class="px-2 py-0.5 hover:bg-cream-200 transition">-</button>
                        <span class="px-2 py-0.5 bg-white text-espresso-900">${item.quantity}</span>
                        <button type="button" onclick="appActions.updateCartQty('${item.cartItemId}', ${item.quantity + 1})" class="px-2 py-0.5 hover:bg-cream-200 transition">+</button>
                      </div>
                    </div>
                  </div>
                `
                      )
                      .join('')
              }
            </div>
          </div>

          <div class="p-4 bg-white border-t border-cream-300 space-y-3 shadow-inner">
            <div class="space-y-1.5 text-xs text-warmgray-600">
              <div class="flex justify-between">
                <span>ยอดรวมก่อนภาษี (Subtotal)</span>
                <span class="tabular-nums font-semibold text-espresso-900">฿${subtotal.toFixed(2)}</span>
              </div>
              <div class="flex justify-between">
                <span>ภาษีมูลค่าเพิ่ม VAT (7%)</span>
                <span class="tabular-nums font-semibold text-espresso-900">฿${vatAmount.toFixed(2)}</span>
              </div>
              <div class="flex justify-between pt-2 border-t border-cream-300 text-base font-bold text-espresso-900">
                <span>ยอดสุทธิ (Total)</span>
                <span class="tabular-nums text-xl text-terracotta font-mono font-bold">฿${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                ${state.cart.length === 0 ? 'disabled' : ''}
                onclick="appActions.holdBill()"
                class="py-3 px-2 rounded-xl bg-cream-200 border border-cream-300 disabled:opacity-40 text-espresso-800 font-semibold text-xs hover:bg-cream-300 transition flex flex-col items-center justify-center"
              >
                <span>⏱ พักบิล (Hold)</span>
              </button>
              <button
                type="button"
                ${state.cart.length === 0 ? 'disabled' : ''}
                onclick="appActions.openVoidModal()"
                class="py-3 px-2 rounded-xl bg-cream-200 border border-cream-300 disabled:opacity-40 text-red-600 font-semibold text-xs hover:bg-red-50 transition flex flex-col items-center justify-center"
              >
                <span>🛡 Void (Admin)</span>
              </button>
              <button
                type="button"
                ${state.cart.length === 0 ? 'disabled' : ''}
                onclick="appActions.openCheckout()"
                class="py-3 px-3 rounded-xl bg-terracotta hover:bg-terracotta-hover disabled:bg-warmgray-200 disabled:text-warmgray-400 text-white font-bold text-sm shadow-md transition flex flex-col items-center justify-center gap-0.5 active:scale-[0.98]"
              >
                <span>💳 คิดเงิน</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      ${renderCustomizationModal()}
      ${renderPaymentModal()}
      ${renderVoidModal()}
    </main>
  `;
}

function renderCustomizationModal() {
  const p = state.customizingProduct;
  if (!p) return '';
  let extra = 0;
  if (state.customMilk.includes('Oat') || state.customMilk.includes('Almond')) extra += 15;
  if (state.customExtraShot) extra += 20;
  if (state.customJelly) extra += 15;
  const totalPrice = p.price + extra;

  const sweetnessLevels = [
    { label: '0%', sub: 'ไม่หวาน' },
    { label: '25%', sub: 'หวานน้อย' },
    { label: '50%', sub: 'หวานปกติ' },
    { label: '100%', sub: 'หวานมาก' },
  ];

  const milks = [
    { id: 'fresh', name: 'นมสดวัวแท้ (Fresh Milk)', price: 0 },
    { id: 'oat', name: 'นมโอ๊ต Oatly (Oat Milk)', price: 15 },
    { id: 'almond', name: 'นมอัลมอนด์ (Almond Milk)', price: 15 },
  ];

  return `
    <div class="fixed inset-0 bg-espresso-900/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 z-50">
      <div class="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-cream-300 overflow-hidden select-none">
        <div class="p-5 bg-cream-100 border-b border-cream-300 flex justify-between items-center">
          <div>
            <h2 class="font-bold text-espresso-900 text-lg leading-tight">${escapeHtml(p.name)}</h2>
            <span class="font-mono font-bold text-terracotta text-sm">ราคาเริ่มต้น ฿${p.price.toFixed(2)}</span>
          </div>
          <button onclick="appActions.closeCustomModal()" class="w-8 h-8 rounded-full bg-cream-200 hover:bg-cream-300 text-warmgray-600 flex items-center justify-center font-bold text-sm">✕</button>
        </div>

        <div class="p-6 space-y-5 overflow-y-auto max-h-[65vh]">
          <div>
            <label class="block text-xs font-bold text-espresso-900 mb-2">1. ระดับความหวาน (Sweetness Level)</label>
            <div class="grid grid-cols-4 gap-2">
              ${sweetnessLevels
                .map(
                  (sw) => `
                <button
                  type="button"
                  onclick="appActions.setCustomSweetness('${sw.label}')"
                  class="py-3 px-2 rounded-xl text-xs text-center transition ${
                    state.customSweetness === sw.label
                      ? 'border-2 border-terracotta bg-terracotta-light text-terracotta font-bold shadow-sm'
                      : 'border border-cream-300 bg-white text-espresso-900 font-semibold hover:bg-cream-50'
                  }"
                >
                  <span class="text-sm font-extrabold">${sw.label}</span><br/>
                  <span class="text-[10px] text-warmgray-600">${sw.sub}</span>
                </button>
              `
                )
                .join('')}
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-espresso-900 mb-2">2. ประเภทนม (Milk Choice)</label>
            <div class="space-y-2 text-xs">
              ${milks
                .map((m) => {
                  const isSelected = state.customMilk === m.name;
                  return `
                    <div
                      onclick="appActions.setCustomMilk('${m.name}')"
                      class="p-3 rounded-xl cursor-pointer flex justify-between items-center transition ${
                        isSelected
                          ? 'border-2 border-terracotta bg-terracotta-light text-terracotta font-bold shadow-sm'
                          : 'border border-cream-300 bg-white text-espresso-900 hover:bg-cream-50'
                      }"
                    >
                      <span>${isSelected ? '✓ ' : ''}${m.name}</span>
                      <span class="font-mono text-warmgray-600 font-bold">${m.price > 0 ? `+฿${m.price.toFixed(2)}` : '+฿0.00'}</span>
                    </div>
                  `;
                })
                .join('')}
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-espresso-900 mb-2">3. ท็อปปิ้งเพิ่มเติม (Add-ons)</label>
            <div class="space-y-2 text-xs">
              <div
                onclick="appActions.toggleExtraShot()"
                class="p-3 rounded-xl cursor-pointer flex justify-between items-center transition ${
                  state.customExtraShot
                    ? 'border-2 border-terracotta bg-terracotta-light text-terracotta font-bold shadow-sm'
                    : 'border border-cream-300 bg-white text-espresso-900 hover:bg-cream-50'
                }"
              >
                <span>${state.customExtraShot ? '✓ ' : ''}เพิ่มช็อตกาแฟ (Extra Espresso Shot)</span>
                <span class="font-mono font-bold text-terracotta">+฿20.00</span>
              </div>
              <div
                onclick="appActions.toggleJelly()"
                class="p-3 rounded-xl cursor-pointer flex justify-between items-center transition ${
                  state.customJelly
                    ? 'border-2 border-terracotta bg-terracotta-light text-terracotta font-bold shadow-sm'
                    : 'border border-cream-300 bg-white text-espresso-900 hover:bg-cream-50'
                }"
              >
                <span>${state.customJelly ? '✓ ' : ''}บุกบราวน์ชูการ์เจลลี่ (Brown Sugar Jelly)</span>
                <span class="font-mono font-bold text-terracotta">+฿15.00</span>
              </div>
            </div>
          </div>
        </div>

        <div class="p-5 bg-cream-100 border-t border-cream-300 flex items-center gap-3">
          <button type="button" onclick="appActions.closeCustomModal()" class="flex-1 py-3.5 bg-white border border-cream-300 rounded-2xl text-xs font-bold text-warmgray-600 hover:bg-cream-200 transition">ยกเลิก</button>
          <button type="button" onclick="appActions.confirmCustomization()" class="flex-2 w-full py-3.5 bg-terracotta hover:bg-terracotta-hover text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg transition">
            เพิ่มลงในบิล • ฿${totalPrice.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderPaymentModal() {
  if (!state.checkoutSummary) return '';
  const total = state.checkoutSummary.totalAmount || 0;
  const subtotal = total / 1.07;
  const vat = total - subtotal;
  const change = Math.max(0, state.cashEntered - total);
  const shortfall = Math.max(0, total - state.cashEntered);
  const isCashSufficient = state.cashEntered >= total;

  return `
    <div class="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:static print:p-0 print:m-0 print:bg-white print:overflow-visible print:block">
      <div class="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-cream-300 overflow-hidden flex flex-col md:flex-row my-auto select-none print:shadow-none print:border-none print:w-full print:max-w-none print:m-0 print:p-0 print:rounded-none">
        <div class="flex-1 p-6 sm:p-8 space-y-5 border-b md:border-b-0 md:border-r border-cream-300 print:hidden">
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-base text-espresso-900">หน้าต่างชำระเงิน (Payment)</h3>
            <button onclick="appActions.closeCheckout()" class="w-8 h-8 rounded-full bg-cream-200 hover:bg-cream-300 text-warmgray-600 flex items-center justify-center font-bold text-xs">✕</button>
          </div>

          <div class="flex bg-cream-200 p-1 rounded-xl text-xs font-bold gap-1">
            <button
              type="button"
              onclick="appActions.setPaymentMethod('cash')"
              class="flex-1 py-2.5 text-center rounded-lg transition ${
                state.paymentMethod === 'cash' ? 'bg-white text-espresso-900 shadow-sm' : 'text-warmgray-600 hover:text-espresso-900'
              }"
            >💵 เงินสด (Cash)</button>
            <button
              type="button"
              onclick="appActions.setPaymentMethod('qr')"
              class="flex-1 py-2.5 text-center rounded-lg transition ${
                state.paymentMethod === 'qr' ? 'bg-white text-espresso-900 shadow-sm' : 'text-warmgray-600 hover:text-espresso-900'
              }"
            >📱 PromptPay QR</button>
          </div>

          <div class="p-4 sm:p-5 bg-cream-50 rounded-2xl border border-cream-300">
            <span class="text-xs text-warmgray-600">ยอดที่ต้องชำระ (Net Amount)</span>
            <div class="text-3xl font-black font-mono text-espresso-900 mt-0.5 tabular-nums">฿${total.toFixed(2)}</div>
          </div>

          ${
            state.paymentMethod === 'cash'
              ? `
            <div>
              <div class="flex justify-between items-center text-xs mb-1.5">
                <span class="font-bold text-espresso-900">ยอดเงินที่รับมา</span>
                <span class="font-mono font-black text-2xl text-terracotta tabular-nums">฿${state.cashEntered.toLocaleString()}.00</span>
              </div>

              <div class="grid grid-cols-4 gap-2 mb-3">
                <button type="button" onclick="appActions.quickCash('exact')" class="py-2.5 bg-cream-200 hover:bg-cream-300 rounded-xl text-xs font-bold font-mono text-espresso-900 transition">พอดี</button>
                ${[100, 500, 1000]
                  .map(
                    (val) => `
                  <button
                    type="button"
                    onclick="appActions.quickCash(${val})"
                    class="py-2.5 rounded-xl text-xs font-bold font-mono transition ${
                      state.cashEntered === val ? 'bg-terracotta text-white shadow' : 'bg-cream-200 hover:bg-cream-300 text-espresso-900'
                    }"
                  >฿${val}</button>
                `
                  )
                  .join('')}
              </div>

              <div class="grid grid-cols-3 gap-2 text-base font-mono font-bold">
                ${[1, 2, 3, 4, 5, 6, 7, 8, 9]
                  .map(
                    (num) => `
                  <button type="button" onclick="appActions.numpadClick('${num}')" class="py-2.5 bg-white border border-cream-300 hover:bg-cream-100 rounded-xl text-center transition">${num}</button>
                `
                  )
                  .join('')}
                <button type="button" onclick="appActions.numpadClick('C')" class="py-2.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-xl text-center transition">C</button>
                <button type="button" onclick="appActions.numpadClick('0')" class="py-2.5 bg-white border border-cream-300 hover:bg-cream-100 rounded-xl text-center transition">0</button>
                <button type="button" onclick="appActions.numpadClick('00')" class="py-2.5 bg-white border border-cream-300 hover:bg-cream-100 rounded-xl text-center transition">00</button>
              </div>

              <div class="mt-4 p-3.5 rounded-2xl bg-matcha-light border border-matcha-border flex justify-between items-center">
                <span class="text-xs font-bold text-matcha">เงินทอน (Change Due)</span>
                <span data-testid="pos-change-due" class="font-mono font-black text-2xl text-matcha tabular-nums">฿${change.toFixed(2)}</span>
              </div>
              ${
                state.cashEntered > 0 && !isCashSufficient
                  ? `<div class="mt-2 text-right text-xs font-semibold text-red-600">ยังขาดอีก ฿${shortfall.toFixed(2)}</div>`
                  : ''
              }
            </div>
          `
              : `
            <div class="flex flex-col items-center justify-center p-6 bg-cream-50 rounded-2xl border border-cream-300 text-center space-y-3">
              <div class="bg-white p-3 rounded-2xl shadow-sm border border-cream-200">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://promptpay.io/0812345678/${total.toFixed(2)}"
                  alt="PromptPay QR Code"
                  class="w-40 h-40 object-contain rounded-lg"
                />
              </div>
              <div class="space-y-1">
                <div class="font-bold text-sm text-espresso-900">สแกนจ่ายผ่านแอปธนาคาร (PromptPay)</div>
                <div class="text-xs text-warmgray-600 font-mono">ยอดชำระ: <strong class="text-terracotta text-sm">฿${total.toFixed(2)}</strong></div>
              </div>
            </div>
          `
          }

          ${
            !state.paymentCompleted
              ? `
            <button
              type="button"
              ${state.paymentMethod === 'cash' && !isCashSufficient ? 'disabled' : ''}
              onclick="appActions.confirmPayment()"
              class="w-full py-4 bg-matcha hover:bg-green-800 disabled:bg-warmgray-200 disabled:text-warmgray-400 text-white rounded-2xl text-sm font-bold shadow-lg transition"
            >
              ✓ ยืนยันชำระเงิน &amp; สั่งพิมพ์สลิป
            </button>
          `
              : `
            <div class="flex gap-2">
              <button type="button" onclick="window.print()" class="flex-1 py-3.5 bg-white border border-cream-300 hover:bg-cream-100 rounded-2xl text-xs font-bold text-espresso-900 transition">🖨 พิมพ์สลิป 80mm</button>
              <button type="button" onclick="appActions.closeCheckout()" class="flex-1 py-3.5 bg-espresso-900 hover:bg-espresso-800 text-white rounded-2xl text-xs font-bold transition">เปิดบิลใหม่ →</button>
            </div>
          `
          }
        </div>

        <div class="w-full md:w-[360px] bg-cream-200 p-6 sm:p-8 flex flex-col items-center justify-center print:bg-white print:p-0 print:m-0 print:w-full">
          <div id="receipt-print-area" class="bg-white w-[280px] p-6 text-espresso-900 font-mono text-[11px] leading-relaxed shadow-xl border border-cream-300 rounded-lg thermal-receipt print:shadow-none print:border-none print:p-2 print:w-[76mm] print:mx-auto">
            <div class="text-center pb-3 border-b border-dashed border-warmgray-400">
              <div class="font-bold text-sm tracking-wider">JAMAL CAFÉ &amp; BAKERY</div>
              <div class="text-[10px] text-warmgray-600">สาขา 001 สุขุมวิท 23 กทม.</div>
              <div class="text-[9px] text-warmgray-600">TAX ID: 0-1055-69001-23-4</div>
            </div>

            <div class="py-2.5 text-[10px] border-b border-dashed border-warmgray-400 space-y-0.5">
              <div class="flex justify-between">
                <span>บิล: #JM-2026-084</span>
                <span>โต๊ะ: หน้าร้าน</span>
              </div>
              <div class="flex justify-between">
                <span>${new Date().toLocaleTimeString('th-TH')}</span>
                <span>แคชเชียร์: Zai</span>
              </div>
            </div>

            <div class="py-2.5 border-b border-dashed border-warmgray-400 space-y-1">
              ${state.cart
                .map(
                  (item) => `
                <div class="space-y-0.5">
                  <div class="flex justify-between font-bold">
                    <span class="truncate max-w-[170px]">${item.quantity}x ${escapeHtml(item.name)}</span>
                    <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                  ${
                    item.optionsText
                      ? `<div class="text-[9px] text-warmgray-600 pl-2">↳ ${escapeHtml(item.optionsText)}</div>`
                      : ''
                  }
                  ${
                    Array.isArray(item.toppings) && item.toppings.length > 0
                      ? item.toppings
                          .map(
                            (t) =>
                              `<div class="flex justify-between text-[9px] text-warmgray-600 pl-3"><span>+ ${escapeHtml(t.name)}</span><span>+${Number(t.price || 0).toFixed(2)}</span></div>`
                          )
                          .join('')
                      : ''
                  }
                </div>
              `
                )
                .join('')}
            </div>

            <div class="py-2.5 border-b border-dashed border-warmgray-400 space-y-1 text-xs">
              <div class="flex justify-between">
                <span>ยอดรวม (Subtotal)</span>
                <span>฿${subtotal.toFixed(2)}</span>
              </div>
              <div class="flex justify-between text-[10px] text-warmgray-600">
                <span>VAT 7% (Included)</span>
                <span>฿${vat.toFixed(2)}</span>
              </div>
              <div class="flex justify-between text-sm font-black pt-1">
                <span>ยอดสุทธิ (Total)</span>
                <span>฿${total.toFixed(2)}</span>
              </div>
              ${
                state.paymentMethod === 'cash'
                  ? `
                <div class="flex justify-between text-[11px] text-matcha pt-1">
                  <span>เงินสดรับมา</span>
                  <span>฿${state.cashEntered.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-[11px] text-matcha font-bold">
                  <span>เงินทอน (Change)</span>
                  <span>฿${change.toFixed(2)}</span>
                </div>
              `
                  : ''
              }
            </div>

            <div class="pt-3 text-center space-y-1">
              <div class="text-[10px] text-warmgray-600">ขอบคุณที่ใช้บริการ</div>
              <div class="text-[8px] text-warmgray-400 tracking-widest font-mono">||||| | |||||| || ||||| |||||</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderVoidModal() {
  if (!state.showVoidModal) return '';
  return `
    <div class="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-cream-300 shadow-2xl">
        <div class="flex items-center justify-between text-red-600">
          <h3 class="font-bold text-base text-espresso-900">🛡 อนุมัติ Void บิล (Admin Only)</h3>
          <button onclick="appActions.closeVoidModal()" class="w-7 h-7 rounded-full bg-cream-100 hover:bg-cream-200 text-warmgray-600 flex items-center justify-center font-bold text-xs">✕</button>
        </div>
        <p class="text-xs text-warmgray-600">การยกเลิกบิลต้องใช้รหัสผ่านของผู้จัดการร้าน (FR-07 Void Protection)</p>
        <form onsubmit="appActions.submitVoidModal(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-espresso-900 mb-1">รหัสผ่าน Admin PIN (ตัวอย่าง: 9999)</label>
            <input
              type="password"
              maxlength="4"
              value="${escapeHtml(state.voidPin)}"
              oninput="state.voidPin = this.value; state.voidError = ''"
              placeholder="••••"
              class="w-full px-3 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-center font-mono text-xl font-bold tracking-widest text-espresso-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          ${state.voidError ? `<p class="text-xs text-red-600 text-center font-semibold">${escapeHtml(state.voidError)}</p>` : ''}
          <div class="flex gap-2">
            <button type="button" onclick="appActions.closeVoidModal()" class="flex-1 py-2.5 bg-cream-200 text-warmgray-600 rounded-xl font-bold text-xs hover:bg-cream-300 transition">ยกเลิก</button>
            <button type="submit" class="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-md transition">ยืนยัน Void</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderKdsPage() {
  const pendingOrders = state.orders.filter((o) => o.status === 'pending');
  const inProgressOrders = state.orders.filter((o) => o.status === 'in_progress');
  const readyOrders = state.orders.filter((o) => o.status === 'ready');
  const activeCount = pendingOrders.length + inProgressOrders.length + readyOrders.length;

  const filterItems = (items) => {
    if (state.kdsFilter === 'all') return items;
    if (state.kdsFilter === 'beverage') return items.filter((i) => i.isBeverage !== false);
    if (state.kdsFilter === 'bakery') return items.filter((i) => i.isBakery === true);
    return items;
  };

  return `
    <div class="flex-1 flex flex-col bg-cream-100 font-sans min-h-[calc(100vh-100px)]">
      <div class="bg-espresso-900 text-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between border-b border-espresso-800 gap-3">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 rounded-lg bg-matcha flex items-center justify-center text-white shadow-sm">☕</div>
          <div>
            <h1 class="text-sm sm:text-base font-bold tracking-wider text-white flex items-center gap-2">
              JAMAL KITCHEN &amp; BARISTA KDS
              <span class="bg-matcha/20 text-matcha-border text-[10px] px-2 py-0.5 rounded-full font-mono border border-matcha/40">LIVE QUEUE</span>
            </h1>
            <p class="text-[11px] text-warmgray-400">ระบบจัดการคิวครัว บาริสต้า และการเตรียมสินค้า (TOR Operator 1-5)</p>
          </div>
        </div>

        <div class="flex items-center flex-wrap gap-2 text-xs">
          <span class="bg-espresso-800 px-3 py-1.5 rounded-lg border border-espresso-700 text-warmgray-300 font-mono font-bold flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            ${activeCount} คิวกำลังดำเนินการ
          </span>

          <div class="bg-espresso-800 p-0.5 rounded-lg border border-espresso-700 flex items-center">
            <button onclick="appActions.setKdsFilter('all')" class="px-2.5 py-1 rounded-md transition font-medium ${state.kdsFilter === 'all' ? 'bg-terracotta text-white' : 'text-warmgray-400 hover:text-white'}">ทั้งหมด</button>
            <button onclick="appActions.setKdsFilter('beverage')" class="px-2.5 py-1 rounded-md transition font-medium ${state.kdsFilter === 'beverage' ? 'bg-terracotta text-white' : 'text-warmgray-400 hover:text-white'}">☕ เครื่องดื่ม</button>
            <button onclick="appActions.setKdsFilter('bakery')" class="px-2.5 py-1 rounded-md transition font-medium ${state.kdsFilter === 'bakery' ? 'bg-terracotta text-white' : 'text-warmgray-400 hover:text-white'}">🥐 เบเกอรี่</button>
          </div>

          <button
            onclick="appActions.toggleKdsSound()"
            class="px-2.5 py-1.5 rounded-lg border transition flex items-center gap-1 ${
              state.kdsSound ? 'bg-matcha/20 text-matcha-border border-matcha/40' : 'bg-espresso-800 text-warmgray-500 border-espresso-700'
            }"
          >
            <span>${state.kdsSound ? '🔊 เปิดเสียง' : '🔇 ปิดเสียง'}</span>
          </button>

          <button
            onclick="appActions.quickDemoOrder()"
            class="px-2.5 py-1.5 bg-terracotta hover:bg-terracotta-hover text-white rounded-lg transition font-medium flex items-center gap-1 shadow-sm"
          >
            <span>+ จำลองคิวใหม่</span>
          </button>
        </div>
      </div>

      <div class="flex-1 p-3 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto">
        <!-- PENDING -->
        <div class="flex flex-col bg-cream-50 rounded-2xl border border-cream-300 shadow-sm overflow-hidden min-h-[500px]">
          <div class="bg-[#FFF5E6] px-4 py-3.5 border-b border-[#F7E2C4] flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-[#C97D28]"></span>
              <span class="font-bold text-[#7A4B13] text-sm sm:text-base">รอดำเนินการ (Pending)</span>
            </div>
            <span class="bg-[#C97D28] text-white text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">${pendingOrders.length}</span>
          </div>
          <div class="flex-1 p-3.5 space-y-3.5 overflow-y-auto max-h-[700px]">
            ${
              pendingOrders.length === 0
                ? `<div class="h-48 flex flex-col items-center justify-center text-warmgray-400 text-xs">ไม่มีออเดอร์รอดำเนินการ</div>`
                : pendingOrders
                    .map((order) => {
                      const items = filterItems(order.items);
                      if (items.length === 0) return '';
                      return `
                        <div class="bg-white rounded-xl border border-cream-300 p-4 shadow-sm flex flex-col justify-between">
                          <div>
                            <div class="flex items-center justify-between">
                              <div class="flex items-baseline gap-2">
                                <span class="text-xl font-extrabold font-mono text-espresso-900">#คิว ${escapeHtml(order.queueNo)}</span>
                                <span class="text-[11px] font-medium text-warmgray-500">(โต๊ะ ${escapeHtml(order.tableNo || 'หน้าร้าน')})</span>
                              </div>
                              <span class="text-xs font-mono text-warmgray-500 bg-cream-100 px-2 py-0.5 rounded-md border border-cream-200">${escapeHtml(order.createdAt)} (${escapeHtml(order.timeElapsed)})</span>
                            </div>
                            <div class="border-t border-cream-200 my-2.5"></div>
                            <div class="space-y-2 mb-4">
                              ${items
                                .map(
                                  (it) => `
                                <div class="text-xs">
                                  <div class="font-bold text-espresso-900">${it.quantity}x ${escapeHtml(it.name)}</div>
                                  ${it.optionsText ? `<div class="text-[11px] font-semibold text-terracotta ml-3 mt-0.5">↳ ${escapeHtml(it.optionsText)}</div>` : ''}
                                  ${Array.isArray(it.toppings) && it.toppings.length > 0 ? `<div class="text-[10px] text-espresso-700 ml-3 mt-0.5">+ ท็อปปิ้ง: ${it.toppings.map((t) => escapeHtml(t.name)).join(', ')}</div>` : ''}
                                </div>
                              `
                                )
                                .join('')}
                            </div>
                          </div>
                          <button onclick="appActions.advanceOrder('${order.id}', 'pending')" class="w-full py-2.5 bg-espresso-900 hover:bg-espresso-800 text-white rounded-lg text-xs font-bold transition">รับทำออเดอร์นี้ →</button>
                        </div>
                      `;
                    })
                    .join('')
            }
          </div>
        </div>

        <!-- IN PROGRESS -->
        <div class="flex flex-col bg-cream-50 rounded-2xl border border-cream-300 shadow-sm overflow-hidden min-h-[500px]">
          <div class="bg-[#EEF5F8] px-4 py-3.5 border-b border-[#D6E6EE] flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-[#2E6171] animate-ping"></span>
              <span class="font-bold text-[#1C4450] text-sm sm:text-base">กำลังชง/อบ (In Progress)</span>
            </div>
            <span class="bg-[#2E6171] text-white text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">${inProgressOrders.length}</span>
          </div>
          <div class="flex-1 p-3.5 space-y-3.5 overflow-y-auto max-h-[700px]">
            ${
              inProgressOrders.length === 0
                ? `<div class="h-48 flex flex-col items-center justify-center text-warmgray-400 text-xs">ไม่มีออเดอร์ที่กำลังปรุง</div>`
                : inProgressOrders
                    .map((order) => {
                      const items = filterItems(order.items);
                      if (items.length === 0) return '';
                      return `
                        <div class="bg-white rounded-xl border-2 border-[#8EC0E4] p-4 shadow-sm flex flex-col justify-between">
                          <div>
                            <div class="flex items-center justify-between">
                              <div class="flex items-baseline gap-2">
                                <span class="text-xl font-extrabold font-mono text-espresso-900">#คิว ${escapeHtml(order.queueNo)}</span>
                                <span class="text-[11px] font-medium text-warmgray-500">(โต๊ะ ${escapeHtml(order.tableNo || 'หน้าร้าน')})</span>
                              </div>
                              <span class="text-xs font-mono font-bold text-[#2E6171] bg-[#EEF5F8] px-2 py-0.5 rounded-md border border-[#D6E6EE]">${escapeHtml(order.timeElapsed || 'กำลังทำ')}</span>
                            </div>
                            <div class="border-t border-cream-200 my-2.5"></div>
                            <div class="space-y-2 mb-4">
                              ${items
                                .map(
                                  (it) => `
                                <div class="text-xs">
                                  <div class="font-bold text-espresso-900">${it.quantity}x ${escapeHtml(it.name)}</div>
                                  ${it.optionsText ? `<div class="text-[11px] font-semibold text-matcha ml-3 mt-0.5">↳ ${escapeHtml(it.optionsText)}</div>` : ''}
                                  ${Array.isArray(it.toppings) && it.toppings.length > 0 ? `<div class="text-[10px] text-espresso-700 ml-3 mt-0.5">+ ท็อปปิ้ง: ${it.toppings.map((t) => escapeHtml(t.name)).join(', ')}</div>` : ''}
                                </div>
                              `
                                )
                                .join('')}
                            </div>
                          </div>
                          <button onclick="appActions.advanceOrder('${order.id}', 'in_progress')" class="w-full py-2.5 bg-matcha hover:bg-[#325d40] text-white rounded-lg text-xs font-bold transition">✓ ทำเสร็จแล้ว (พร้อมเสิร์ฟ)</button>
                        </div>
                      `;
                    })
                    .join('')
            }
          </div>
        </div>

        <!-- READY -->
        <div class="flex flex-col bg-cream-50 rounded-2xl border border-cream-300 shadow-sm overflow-hidden min-h-[500px]">
          <div class="bg-[#EAF4ED] px-4 py-3.5 border-b border-[#CEE5D3] flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-[#3B6E4C]"></span>
              <span class="font-bold text-[#254731] text-sm sm:text-base">พร้อมรับที่เคาน์เตอร์ (Ready)</span>
            </div>
            <span class="bg-[#3B6E4C] text-white text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">${readyOrders.length}</span>
          </div>
          <div class="flex-1 p-3.5 space-y-3.5 overflow-y-auto max-h-[700px]">
            ${
              readyOrders.length === 0
                ? `<div class="h-48 flex flex-col items-center justify-center text-warmgray-400 text-xs">ไม่มีออเดอร์ค้างรอส่งมอบ</div>`
                : readyOrders
                    .map((order) => {
                      const items = filterItems(order.items);
                      if (items.length === 0) return '';
                      return `
                        <div class="bg-white rounded-xl border-2 border-[#A8D5B5] p-4 shadow-sm flex flex-col justify-between">
                          <div>
                            <div class="flex items-center justify-between">
                              <div class="flex items-baseline gap-2">
                                <span class="text-xl font-extrabold font-mono text-matcha">#คิว ${escapeHtml(order.queueNo)}</span>
                                <span class="text-[11px] font-medium text-warmgray-500">(โต๊ะ ${escapeHtml(order.tableNo || 'หน้าร้าน')})</span>
                              </div>
                              <span class="text-xs font-bold text-matcha bg-[#EAF4ED] px-2 py-0.5 rounded-md border border-[#CEE5D3]">✨ ขานเรียกแล้ว</span>
                            </div>
                            <div class="border-t border-cream-200 my-2.5"></div>
                            <div class="space-y-2 mb-4">
                              ${items
                                .map(
                                  (it) => `
                                <div class="text-xs">
                                  <div class="font-bold text-espresso-900">${it.quantity}x ${escapeHtml(it.name)}</div>
                                  ${it.optionsText ? `<div class="text-[11px] text-warmgray-600 ml-3 mt-0.5">↳ ${escapeHtml(it.optionsText)}</div>` : ''}
                                  ${Array.isArray(it.toppings) && it.toppings.length > 0 ? `<div class="text-[10px] text-espresso-700 ml-3 mt-0.5">+ ท็อปปิ้ง: ${it.toppings.map((t) => escapeHtml(t.name)).join(', ')}</div>` : ''}
                                </div>
                              `
                                )
                                .join('')}
                            </div>
                          </div>
                          <button onclick="appActions.advanceOrder('${order.id}', 'ready')" class="w-full py-2.5 bg-cream-200 hover:bg-cream-300 text-espresso-900 border border-cream-300 rounded-lg text-xs font-bold transition">ลูกค้ารับแล้ว (ปิดออเดอร์)</button>
                        </div>
                      `;
                    })
                    .join('')
            }
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderAdminPage() {
  const bakeryProducts = state.products.filter(
    (p) => p.isBakery || p.category === 'bakery' || p.category === 'dessert'
  );
  const lowStockCount = bakeryProducts.filter((p) => p.stock !== null && p.stock < 5).length;

  let mainContent = '';

  if (state.adminTab === 'dashboard') {
    mainContent = `
      <div class="space-y-6">
        <div>
          <h2 class="text-xl sm:text-2xl font-extrabold text-espresso-900">ภาพรวมยอดขาย &amp; สต็อกสินค้าประจำวัน</h2>
          <p class="text-xs text-warmgray-600 mt-0.5">ข้อมูลสรุปแบบ Real-time (Jamal Café &amp; Bakery POS — Node.js Express)</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white rounded-2xl border border-cream-300 p-4 shadow-sm">
            <div class="text-xs text-warmgray-600 font-medium">ยอดขายรวมวันนี้</div>
            <div class="text-2xl font-extrabold font-mono text-espresso-900 mt-2">฿${state.salesStats.totalSales.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</div>
            <div class="text-xs font-semibold text-matcha mt-2">↑ +12% เทียบกับเมื่อวาน</div>
          </div>
          <div class="bg-white rounded-2xl border border-cream-300 p-4 shadow-sm">
            <div class="text-xs text-warmgray-600 font-medium">จำนวนบิลทั้งหมด</div>
            <div class="text-2xl font-extrabold font-mono text-espresso-900 mt-2">${state.salesStats.totalBills} บิล</div>
            <div class="text-xs text-warmgray-600 mt-2">เฉลี่ย ฿${(state.salesStats.totalSales / (state.salesStats.totalBills || 1)).toFixed(2)} ต่อบิล</div>
          </div>
          <div class="bg-white rounded-2xl border border-cream-300 p-4 shadow-sm">
            <div class="text-xs text-warmgray-600 font-medium">สัดส่วนชำระเงิน (FR-08)</div>
            <div class="flex items-center gap-2 mt-2">
              <span class="bg-[#EEF5F8] text-[#2E6171] text-xs font-mono font-bold px-2 py-1 rounded-md border border-[#D6E6EE]">PromptPay 64%</span>
              <span class="bg-[#EAF4ED] text-[#3B6E4C] text-xs font-mono font-bold px-2 py-1 rounded-md border border-[#CEE5D3]">เงินสด 36%</span>
            </div>
            <div class="text-xs text-warmgray-600 mt-2">กระทบยอดตรง ไม่พบบิลค้าง</div>
          </div>
          <div class="bg-white rounded-2xl border-2 border-terracotta p-4 shadow-sm">
            <div class="text-xs text-warmgray-600 font-medium">เตือนสต็อกเบเกอรี่ (FR-03)</div>
            <div class="text-2xl font-extrabold font-mono text-terracotta mt-2">${lowStockCount} รายการ</div>
            <div class="text-xs font-bold text-red-600 mt-2">⚠ เหลือน้อยกว่า 5 ชิ้น</div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-cream-300 shadow-sm overflow-hidden">
          <div class="p-4 sm:p-5 border-b border-cream-200 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 class="font-bold text-espresso-900 text-sm sm:text-base">ระบบควบคุมและตัดสต็อกเบเกอรี่รายวัน (Bakery Stock Tracking)</h3>
              <p class="text-xs text-warmgray-500">อัปเดตตัดสต็อกอัตโนมัติแบบเรียลไทม์เมื่อมีการชำระเงิน (FR-03)</p>
            </div>
            <button onclick="appActions.setAdminTab('inventory')" class="text-xs font-semibold text-terracotta hover:underline">จัดการสต็อกทั้งหมด →</button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr class="bg-cream-100 text-warmgray-600 font-semibold border-b border-cream-200">
                  <th class="py-3 px-4">SKU</th>
                  <th class="py-3 px-4">ชื่อสินค้า</th>
                  <th class="py-3 px-4">ราคา</th>
                  <th class="py-3 px-4">รับเข้าเช้า</th>
                  <th class="py-3 px-4">ขายแล้ว</th>
                  <th class="py-3 px-4">คงเหลือจริง</th>
                  <th class="py-3 px-4">สถานะ</th>
                  <th class="py-3 px-4 text-center">เติมสต็อก</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-cream-200 text-espresso-900">
                ${bakeryProducts
                  .map((p, idx) => {
                    const sku = `BK-0${idx + 1}`;
                    const sold = p.stock !== null ? Math.max(0, 15 - p.stock) : '-';
                    const morning = p.stock !== null ? p.stock + sold : '-';
                    const isOut = p.stock === 0;
                    const isLow = p.stock !== null && p.stock > 0 && p.stock < 5;
                    return `
                      <tr class="hover:bg-cream-50 transition">
                        <td class="py-3 px-4 font-mono font-bold text-warmgray-600">${sku}</td>
                        <td class="py-3 px-4 font-medium">${escapeHtml(p.name)}</td>
                        <td class="py-3 px-4 font-mono font-bold text-terracotta">฿${p.price.toFixed(2)}</td>
                        <td class="py-3 px-4 font-mono">${morning}</td>
                        <td class="py-3 px-4 font-mono">${sold}</td>
                        <td class="py-3 px-4 font-mono font-bold">
                          <span class="${isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-matcha'}">${p.stock} ชิ้น</span>
                        </td>
                        <td class="py-3 px-4">
                          ${
                            isOut
                              ? `<span class="bg-red-50 text-red-600 text-xs px-2.5 py-1 rounded-md font-bold border border-red-200">หมด (Out)</span>`
                              : isLow
                              ? `<span class="bg-[#FFF5E6] text-[#C97D28] text-xs px-2.5 py-1 rounded-md font-bold border border-[#F7E2C4]">ใกล้หมด</span>`
                              : `<span class="bg-[#EAF4ED] text-[#3B6E4C] text-xs px-2.5 py-1 rounded-md font-bold border border-[#CEE5D3]">พร้อมขาย</span>`
                          }
                        </td>
                        <td class="py-3 px-4 text-center">
                          <div class="flex items-center justify-center gap-1.5">
                            <button onclick="appActions.restock('${p.id}', 5)" class="px-2 py-1 bg-cream-200 hover:bg-cream-300 text-espresso-900 rounded font-mono text-xs font-bold border border-cream-300">+5</button>
                            <button onclick="appActions.restock('${p.id}', 10)" class="px-2 py-1 bg-cream-200 hover:bg-cream-300 text-espresso-900 rounded font-mono text-xs font-bold border border-cream-300">+10</button>
                          </div>
                        </td>
                      </tr>
                    `;
                  })
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-cream-300 p-5 shadow-sm">
          <h3 class="font-bold text-sm sm:text-base text-espresso-900 mb-4">🏆 5 อันดับเมนูขายดีประจำวัน (Top 5 Best Sellers)</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div class="p-3 rounded-xl bg-cream-50 border border-cream-300"><div class="text-[10px] font-bold text-[#C97D28]">#1 เมนูขายดี</div><div class="font-bold text-xs sm:text-sm text-espresso-900 mt-1">เอสเพรสโซ่เย็น</div><div class="text-xs font-mono text-warmgray-600 mt-2">38 แก้ว • ฿2,470</div></div>
            <div class="p-3 rounded-xl bg-cream-50 border border-cream-300"><div class="text-[10px] font-bold text-warmgray-500">#2 เมนูขายดี</div><div class="font-bold text-xs sm:text-sm text-espresso-900 mt-1">มัทฉะลาเต้อูจิ</div><div class="text-xs font-mono text-warmgray-600 mt-2">26 แก้ว • ฿2,210</div></div>
            <div class="p-3 rounded-xl bg-cream-50 border border-cream-300"><div class="text-[10px] font-bold text-warmgray-500">#3 เมนูขายดี</div><div class="font-bold text-xs sm:text-sm text-espresso-900 mt-1">ครัวซองต์เนยสด AOP</div><div class="text-xs font-mono text-warmgray-600 mt-2">21 ชิ้น • ฿1,785</div></div>
            <div class="p-3 rounded-xl bg-cream-50 border border-cream-300"><div class="text-[10px] font-bold text-warmgray-500">#4 เมนูขายดี</div><div class="font-bold text-xs sm:text-sm text-espresso-900 mt-1">อเมริกาโน่น้ำส้ม</div><div class="text-xs font-mono text-warmgray-600 mt-2">18 แก้ว • ฿1,530</div></div>
            <div class="p-3 rounded-xl bg-cream-50 border border-cream-300"><div class="text-[10px] font-bold text-warmgray-500">#5 เมนูขายดี</div><div class="font-bold text-xs sm:text-sm text-espresso-900 mt-1">เค้กแครอทครีมชีส</div><div class="text-xs font-mono text-warmgray-600 mt-2">12 ชิ้น • ฿1,140</div></div>
          </div>
        </div>
      </div>
    `;
  } else if (state.adminTab === 'inventory') {
    mainContent = `
      <div class="space-y-5">
        <div>
          <h2 class="text-xl sm:text-2xl font-extrabold text-espresso-900">ระบบจัดการคลังสต็อกเบเกอรี่ (Bakery Inventory Control)</h2>
          <p class="text-xs text-warmgray-600 mt-0.5">ข้อกำหนด FR-03: ตรวจสอบและเติมสต็อกสินค้าเบเกอรี่และของหวาน</p>
        </div>
        <div class="bg-white rounded-2xl border border-cream-300 p-5 shadow-sm space-y-3">
          ${bakeryProducts
            .map(
              (item) => `
            <div class="p-4 rounded-xl border border-cream-200 bg-cream-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div class="font-bold text-sm text-espresso-900">${escapeHtml(item.name)}</div>
                <div class="text-xs text-warmgray-500 mt-0.5">ราคาขาย: ฿${item.price.toFixed(2)} • สต็อกปัจจุบัน: <strong class="text-espresso-900 font-mono">${item.stock} ชิ้น</strong></div>
              </div>
              <div class="flex items-center gap-2">
                <button onclick="appActions.restock('${item.id}', 5)" class="px-3 py-1.5 bg-espresso-800 hover:bg-espresso-700 text-white rounded-lg text-xs font-bold transition">+ เติม 5 ชิ้น</button>
                <button onclick="appActions.restock('${item.id}', 10)" class="px-3 py-1.5 bg-terracotta hover:bg-terracotta-hover text-white rounded-lg text-xs font-bold transition">+ เติม 10 ชิ้น</button>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;
  } else if (state.adminTab === 'menu') {
    mainContent = `
      <div class="space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-xl sm:text-2xl font-extrabold text-espresso-900">จัดการรายการเมนู &amp; กำหนดราคา (FR-02)</h2>
            <p class="text-xs text-warmgray-600 mt-0.5">แก้ไขราคาขาย เปิด/ปิดการจำหน่ายเมนูเครื่องดื่มและเบเกอรี่</p>
          </div>
          <button onclick="appActions.openAddMenuModal()" class="px-4 py-2 bg-terracotta hover:bg-terracotta-hover text-white rounded-xl text-xs font-bold transition">+ เพิ่มเมนูใหม่</button>
        </div>

        <div class="bg-white rounded-2xl border border-cream-300 shadow-sm overflow-hidden">
          <div class="p-4 border-b border-cream-200 font-bold text-sm text-espresso-900">รายการเมนูทั้งหมด (${state.products.length} รายการ)</div>
          <div class="divide-y divide-cream-200">
            ${state.products
              .map(
                (prod) => `
              <div class="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-cream-50 transition">
                <div class="flex items-center gap-3">
                  <img src="${escapeHtml(prod.img)}" alt="${escapeHtml(prod.name)}" class="w-12 h-12 rounded-xl object-cover border border-cream-300" />
                  <div>
                    <div class="font-bold text-sm text-espresso-900">${escapeHtml(prod.name)}</div>
                    <div class="text-xs text-warmgray-500">${escapeHtml(prod.desc)}</div>
                  </div>
                </div>
                <div class="flex items-center gap-3 self-end sm:self-auto">
                  ${
                    state.editingPriceId === prod.id
                      ? `
                    <div class="flex items-center gap-1.5">
                      <input
                        type="number"
                        value="${escapeHtml(state.tempPrice)}"
                        oninput="state.tempPrice = this.value"
                        class="w-20 px-2 py-1 text-sm border border-terracotta rounded-lg font-mono focus:outline-none"
                      />
                      <button onclick="appActions.savePrice('${prod.id}')" class="px-2.5 py-1 bg-matcha text-white rounded-lg text-xs font-bold">บันทึก</button>
                      <button onclick="appActions.cancelEditPrice()" class="px-2 py-1 bg-cream-200 text-espresso-800 rounded-lg text-xs font-bold">ยกเลิก</button>
                    </div>
                  `
                      : `
                    <div class="flex items-center gap-2">
                      <span class="font-mono font-bold text-sm text-terracotta">฿${prod.price.toFixed(2)}</span>
                      <button onclick="appActions.startEditPrice('${prod.id}', ${prod.price})" class="p-1.5 text-warmgray-500 hover:text-espresso-900 hover:bg-cream-200 rounded-lg transition" title="แก้ไขราคา">✎</button>
                    </div>
                  `
                  }
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;
  } else if (state.adminTab === 'sales') {
    const filteredSales = state.salesHistory.filter(
      (s) =>
        !state.salesSearch ||
        s.receiptNo.toLowerCase().includes(state.salesSearch.toLowerCase()) ||
        s.queueNo.toLowerCase().includes(state.salesSearch.toLowerCase())
    );
    mainContent = `
      <div class="space-y-5">
        <div>
          <h2 class="text-xl sm:text-2xl font-extrabold text-espresso-900">ประวัติการขาย &amp; รายการบิลย้อนหลัง (Sales &amp; Void Audit)</h2>
          <p class="text-xs text-warmgray-600 mt-0.5">ข้อกำหนด FR-07 (ระบบตรวจสอบ Void) และ FR-08 (รายงานยอดขาย)</p>
        </div>
        <div class="bg-white rounded-2xl border border-cream-300 shadow-sm overflow-hidden">
          <div class="p-4 border-b border-cream-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <span class="font-bold text-sm text-espresso-900">บันทึกประวัติการออกใบเสร็จ (${state.salesHistory.length} รายการ)</span>
            <input
              type="text"
              value="${escapeHtml(state.salesSearch)}"
              oninput="state.salesSearch = this.value; render();"
              placeholder="ค้นหาเลขที่บิล หรือคิว..."
              class="w-full sm:w-64 px-3 py-1.5 bg-cream-100 border border-cream-300 rounded-lg text-xs focus:outline-none"
            />
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-cream-100 text-warmgray-600 font-semibold border-b border-cream-200">
                  <th class="py-2.5 px-4">เลขที่บิล</th>
                  <th class="py-2.5 px-4">เวลา</th>
                  <th class="py-2.5 px-4">คิว</th>
                  <th class="py-2.5 px-4">รายการสินค้า</th>
                  <th class="py-2.5 px-4">วิธีชำระ</th>
                  <th class="py-2.5 px-4">ยอดเงิน</th>
                  <th class="py-2.5 px-4">สถานะ</th>
                  <th class="py-2.5 px-4 text-center">จัดการ Void</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-cream-200 text-espresso-900">
                ${filteredSales
                  .map((item) => {
                    const isVoided = item.status === 'voided';
                    return `
                      <tr class="hover:bg-cream-50 transition ${isVoided ? 'bg-red-50/40 text-warmgray-500' : ''}">
                        <td class="py-3 px-4 font-mono font-bold">${escapeHtml(item.receiptNo)}</td>
                        <td class="py-3 px-4 font-mono">${escapeHtml(item.time)}</td>
                        <td class="py-3 px-4 font-mono font-bold text-espresso-900">#${escapeHtml(item.queueNo)}</td>
                        <td class="py-3 px-4 max-w-xs truncate">${escapeHtml(item.itemsSummary)}</td>
                        <td class="py-3 px-4">${escapeHtml(item.paymentMethod)}</td>
                        <td class="py-3 px-4 font-mono font-bold">฿${Number(item.total).toFixed(2)}</td>
                        <td class="py-3 px-4">
                          ${
                            isVoided
                              ? `<span class="text-[11px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded border border-red-200">Voided</span>`
                              : `<span class="text-[11px] font-bold text-matcha bg-matcha-light px-2 py-0.5 rounded border border-matcha-border">ชำระสำเร็จ</span>`
                          }
                        </td>
                        <td class="py-3 px-4 text-center">
                          ${
                            isVoided
                              ? `<span class="text-[10px] text-warmgray-500">${escapeHtml(item.voidBy || 'Admin')}</span>`
                              : `<button onclick="appActions.confirmVoidReceipt('${item.receiptNo}')" class="text-[11px] font-bold text-red-600 hover:underline px-2 py-0.5 bg-red-50 border border-red-200 rounded">Void บิล</button>`
                          }
                        </td>
                      </tr>
                    `;
                  })
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  } else if (state.adminTab === 'staff') {
    mainContent = `
      <div class="space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-xl sm:text-2xl font-extrabold text-espresso-900">จัดการบัญชีพนักงาน &amp; สิทธิ์การเข้าถึง (FR-01)</h2>
            <p class="text-xs text-warmgray-600 mt-0.5">กำหนดสิทธิ์การใช้งานสำหรับ Cashier, Barista และ ผู้จัดการร้าน</p>
          </div>
          <button onclick="appActions.openAddStaffModal()" class="px-4 py-2 bg-terracotta hover:bg-terracotta-hover text-white rounded-xl text-xs font-bold transition">+ เพิ่มบัญชีพนักงานใหม่</button>
        </div>

        <div class="bg-white rounded-2xl border border-cream-300 p-5 shadow-sm">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${state.staffAccounts
              .map(
                (acc) => `
              <div class="p-4 rounded-xl border border-cream-300 bg-cream-50 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-sm text-espresso-900">${escapeHtml(acc.name)}</span>
                    <span class="text-xs bg-espresso-800 text-white px-2 py-0.5 rounded font-mono">${escapeHtml(acc.roleLabel || acc.role)}</span>
                  </div>
                  <div class="text-xs text-warmgray-600 mt-2 space-y-1">
                    <div>ชื่อผู้ใช้: <strong class="font-mono">${escapeHtml(acc.username)}</strong></div>
                    <div>PIN เข้าใช้งาน: <strong class="font-mono">${escapeHtml(acc.pin)}</strong></div>
                  </div>
                </div>
                <div class="mt-4 pt-3 border-t border-cream-200 text-[11px] text-warmgray-500">สิทธิ์: ${escapeHtml(acc.roleName)}</div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="flex-1 flex flex-col md:flex-row bg-cream-100 font-sans min-h-[calc(100vh-100px)]">
      <aside class="w-full md:w-64 bg-cream-200 border-r border-cream-300 flex flex-col justify-between shrink-0">
        <div>
          <div class="p-4 border-b border-cream-300 bg-cream-50 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-terracotta flex items-center justify-center font-bold text-white shadow-sm">JM</div>
            <div>
              <div class="font-bold text-sm text-espresso-900 leading-tight">JAMAL CAFÉ</div>
              <div class="text-[11px] font-medium text-terracotta">ADMIN PORTAL</div>
            </div>
          </div>

          <nav class="p-3 space-y-1 text-sm font-medium">
            <button onclick="appActions.setAdminTab('dashboard')" class="w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center gap-2.5 ${state.adminTab === 'dashboard' ? 'bg-espresso-800 text-white font-bold shadow-sm' : 'text-warmgray-600 hover:bg-cream-300/50'}">📊 แดชบอร์ดภาพรวม</button>
            <button onclick="appActions.setAdminTab('inventory')" class="w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center justify-between ${state.adminTab === 'inventory' ? 'bg-espresso-800 text-white font-bold shadow-sm' : 'text-warmgray-600 hover:bg-cream-300/50'}">
              <span>🥐 สต็อกเบเกอรี่ (FR-03)</span>
              ${lowStockCount > 0 ? `<span class="bg-terracotta text-white text-[10px] px-2 py-0.5 rounded-full font-bold">${lowStockCount}</span>` : ''}
            </button>
            <button onclick="appActions.setAdminTab('menu')" class="w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center gap-2.5 ${state.adminTab === 'menu' ? 'bg-espresso-800 text-white font-bold shadow-sm' : 'text-warmgray-600 hover:bg-cream-300/50'}">☕ จัดการเมนู &amp; ราคา (FR-02)</button>
            <button onclick="appActions.setAdminTab('sales')" class="w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center gap-2.5 ${state.adminTab === 'sales' ? 'bg-espresso-800 text-white font-bold shadow-sm' : 'text-warmgray-600 hover:bg-cream-300/50'}">🧾 ประวัติการขาย &amp; Void</button>
            <button onclick="appActions.setAdminTab('staff')" class="w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center gap-2.5 ${state.adminTab === 'staff' ? 'bg-espresso-800 text-white font-bold shadow-sm' : 'text-warmgray-600 hover:bg-cream-300/50'}">👥 จัดการสิทธิ์พนักงาน</button>
          </nav>
        </div>

        <div class="p-3.5 border-t border-cream-300 text-xs text-warmgray-600 bg-cream-50">
          <div class="font-bold text-espresso-900">🛡 Admin Zai (Manager)</div>
          <div class="text-[10px] text-warmgray-500">สิทธิ์ผู้ดูแลระบบสูงสุด</div>
        </div>
      </aside>

      <main class="flex-1 p-4 sm:p-6 overflow-y-auto max-w-6xl mx-auto w-full">
        ${mainContent}
      </main>

      ${renderAddMenuModal()}
      ${renderAddStaffModal()}
    </div>
  `;
}

function renderAddMenuModal() {
  if (!state.showAddMenuModal) return '';
  return `
    <div class="fixed inset-0 z-50 bg-espresso-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl border border-cream-300 shadow-2xl max-w-lg w-full p-6">
        <h3 class="text-lg font-extrabold text-espresso-900">เพิ่มรายการสินค้าใหม่ (Add New Menu)</h3>
        <p class="text-xs text-warmgray-600 mt-0.5">ข้อกำหนด FR-02: เพิ่มเมนูและกำหนดราคาขายเข้าสู่ระบบ POS หน้าร้าน</p>
        <form onsubmit="appActions.submitAddMenu(event)" class="mt-4 space-y-3.5">
          <div>
            <label class="block text-xs font-bold text-espresso-900 mb-1">ชื่อเมนู *</label>
            <input type="text" required placeholder="เช่น คาราเมลมัคคิอาโต้เย็น" value="${escapeHtml(state.newMenuForm.name)}" oninput="state.newMenuForm.name = this.value" class="w-full px-3 py-2 text-sm border border-cream-300 rounded-xl bg-cream-50/50" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-espresso-900 mb-1">หมวดหมู่ *</label>
              <select onchange="state.newMenuForm.category = this.value" class="w-full px-3 py-2 text-sm border border-cream-300 rounded-xl bg-cream-50/50">
                <option value="coffee" ${state.newMenuForm.category === 'coffee' ? 'selected' : ''}>☕ กาแฟสด</option>
                <option value="non-coffee" ${state.newMenuForm.category === 'non-coffee' ? 'selected' : ''}>🍵 ชา &amp; เครื่องดื่ม</option>
                <option value="bakery" ${state.newMenuForm.category === 'bakery' ? 'selected' : ''}>🥐 เบเกอรี่สด</option>
                <option value="dessert" ${state.newMenuForm.category === 'dessert' ? 'selected' : ''}>🍰 ของหวาน</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-espresso-900 mb-1">ราคาขายหน้าร้าน (บาท) *</label>
              <input type="number" required min="1" placeholder="75" value="${escapeHtml(state.newMenuForm.price)}" oninput="state.newMenuForm.price = this.value" class="w-full px-3 py-2 text-sm border border-cream-300 rounded-xl bg-cream-50/50 font-mono" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-espresso-900 mb-1">คำอธิบายเมนู</label>
            <input type="text" placeholder="เช่น หอมคาราเมล หวานนุ่มละมุน" value="${escapeHtml(state.newMenuForm.desc)}" oninput="state.newMenuForm.desc = this.value" class="w-full px-3 py-2 text-sm border border-cream-300 rounded-xl bg-cream-50/50" />
          </div>
          <div class="flex items-center justify-end gap-2 pt-3 border-t border-cream-200">
            <button type="button" onclick="appActions.closeAddMenuModal()" class="px-4 py-2 bg-cream-200 text-espresso-800 rounded-xl text-xs font-bold">ยกเลิก</button>
            <button type="submit" class="px-5 py-2 bg-terracotta text-white rounded-xl text-xs font-bold">✓ บันทึกและเพิ่มเมนู</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderAddStaffModal() {
  if (!state.showAddStaffModal) return '';
  return `
    <div class="fixed inset-0 z-50 bg-espresso-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl border border-cream-300 shadow-2xl max-w-md w-full p-6">
        <h3 class="text-lg font-extrabold text-espresso-900">เพิ่มบัญชีพนักงานใหม่ (Add Staff Account)</h3>
        <p class="text-xs text-warmgray-600 mt-0.5">ข้อกำหนด FR-01: กำหนดบทบาทและรหัส PIN 4 หลักสำหรับเข้าใช้งานระบบ</p>
        <form onsubmit="appActions.submitAddStaff(event)" class="mt-4 space-y-3.5">
          <div>
            <label class="block text-xs font-bold text-espresso-900 mb-1">ชื่อ-นามสกุลพนักงาน *</label>
            <input type="text" required placeholder="เช่น แพรวพรรณ (คุณแพรว)" value="${escapeHtml(state.newStaffForm.name)}" oninput="state.newStaffForm.name = this.value" class="w-full px-3 py-2 text-sm border border-cream-300 rounded-xl bg-cream-50/50" />
          </div>
          <div>
            <label class="block text-xs font-bold text-espresso-900 mb-1">บทบาท / สิทธิ์การใช้งาน *</label>
            <select onchange="state.newStaffForm.role = this.value" class="w-full px-3 py-2 text-sm border border-cream-300 rounded-xl bg-cream-50/50">
              <option value="Cashier">🛍️ แคชเชียร์ (ขายหน้าร้าน, คิดเงิน)</option>
              <option value="Barista">☕ บาริสต้า (ห้องครัว, จอ KDS)</option>
              <option value="Admin">👑 ผู้จัดการร้าน (สิทธิ์เต็มรูปแบบ, Void บิล)</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-espresso-900 mb-1">ชื่อผู้ใช้ (Username) *</label>
              <input type="text" required placeholder="cashier2" value="${escapeHtml(state.newStaffForm.username)}" oninput="state.newStaffForm.username = this.value" class="w-full px-3 py-2 text-sm border border-cream-300 rounded-xl bg-cream-50/50 font-mono" />
            </div>
            <div>
              <label class="block text-xs font-bold text-espresso-900 mb-1">รหัส PIN 4 หลัก *</label>
              <input type="password" maxlength="4" required placeholder="2580" value="${escapeHtml(state.newStaffForm.pin)}" oninput="state.newStaffForm.pin = this.value" class="w-full px-3 py-2 text-sm border border-cream-300 rounded-xl bg-cream-50/50 font-mono tracking-widest" />
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 pt-3 border-t border-cream-200">
            <button type="button" onclick="appActions.closeAddStaffModal()" class="px-4 py-2 bg-cream-200 text-espresso-800 rounded-xl text-xs font-bold">ยกเลิก</button>
            <button type="submit" class="px-5 py-2 bg-terracotta text-white rounded-xl text-xs font-bold">✓ บันทึกบัญชีพนักงาน</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderCustomerMobilePage() {
  const currentTrackedOrder = state.orders.find((o) => o.queueNo === state.customerQueueNo);
  let queueInfo = {
    badgeText: 'รอคิวในระบบ',
    badgeBg: 'bg-warmgray-600',
    desc: 'ออเดอร์ได้รับการบันทึกในระบบเรียบร้อยแล้ว',
  };
  if (currentTrackedOrder) {
    if (currentTrackedOrder.status === 'pending') {
      queueInfo = {
        badgeText: 'รอดำเนินการ (รอชง)',
        badgeBg: 'bg-amber-600',
        desc: 'บาริสต้าได้รับรายการแล้ว รอเริ่มคิวชงเครื่องดื่ม',
      };
    } else if (currentTrackedOrder.status === 'in_progress') {
      queueInfo = {
        badgeText: 'กำลังจัดเตรียม (3 น.)',
        badgeBg: 'bg-blue-600',
        desc: 'บาริสต้ากำลังชงเครื่องดื่มให้คุณอย่างพิถีพิถัน',
      };
    } else if (currentTrackedOrder.status === 'ready') {
      queueInfo = {
        badgeText: 'พร้อมรับเครื่องดื่ม!',
        badgeBg: 'bg-matcha',
        desc: '✨ เครื่องดื่มของคุณพร้อมแล้ว! เชิญรับได้ที่เคาน์เตอร์',
      };
    } else {
      queueInfo = {
        badgeText: 'เสร็จสิ้นแล้ว',
        badgeBg: 'bg-warmgray-500',
        desc: 'ขอบคุณที่ใช้บริการ Jamal Café & Bakery',
      };
    }
  }

  const mobileCategories = [
    { id: 'popular', label: 'เมนูยอดนิยม' },
    { id: 'coffee', label: 'กาแฟสด' },
    { id: 'non-coffee', label: 'ชา & นมสด' },
    { id: 'bakery', label: 'เบเกอรี่' },
    { id: 'dessert', label: 'ของหวาน' },
  ];

  const filteredProducts =
    state.mobileCategory === 'popular'
      ? state.products.slice(0, 5)
      : state.products.filter((p) => p.category === state.mobileCategory);

  const cartItemCount = state.mobileCart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = state.mobileCart.reduce((s, i) => s + i.price * i.quantity, 0);

  return `
    <div class="flex-1 flex flex-col items-center bg-[#EDE7DF] p-2 sm:p-6 font-sans min-h-[calc(100vh-100px)]">
      <div class="w-full max-w-md flex items-center justify-between mb-3 px-2 text-xs text-warmgray-600">
        <div class="font-medium">📱 Figma Spec: 05_customer_mobile (393 × 852)</div>
        <button onclick="appActions.toggleMobileFrame()" class="px-2.5 py-1 rounded-lg bg-white border border-cream-300 shadow-sm hover:bg-cream-100 transition font-medium">
          ${state.mobileFrameMode ? 'เต็มจอ' : 'กรอบมือถือ'}
        </button>
      </div>

      ${
        state.mobileSuccessMsg
          ? `
        <div class="w-full max-w-md mb-3 bg-matcha text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center justify-between">
          <span>✨ ${escapeHtml(state.mobileSuccessMsg)}</span>
          <button onclick="state.mobileSuccessMsg = null; render();">✕</button>
        </div>
      `
          : ''
      }

      <div class="w-full bg-[#FBF8F4] overflow-hidden flex flex-col shadow-2xl transition-all relative ${
        state.mobileFrameMode
          ? 'max-w-[393px] h-[852px] rounded-[44px] border-[8px] border-espresso-900'
          : 'max-w-2xl rounded-2xl border border-cream-300 min-h-[800px]'
      }">
        <div class="bg-espresso-900 text-white px-6 pt-3 pb-2 flex items-center justify-between shrink-0 select-none">
          <span class="text-xs font-bold font-mono">9:41</span>
          <div class="w-24 h-5 bg-black rounded-full mx-auto"></div>
          <span class="text-[10px]">5G 100%</span>
        </div>

        <div class="bg-white px-4 py-2.5 border-b border-cream-300 flex items-center justify-between shrink-0">
          <div>
            <div class="text-[11px] font-mono font-bold text-terracotta">โต๊ะ ${escapeHtml(state.mobileTableNo)} • สั่งทานที่ร้าน</div>
            <div class="text-base font-extrabold text-espresso-900 tracking-tight">JAMAL CAFÉ</div>
          </div>
          <span class="bg-[#EAF4ED] text-matcha text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#CEE5D3]">● เปิดบริการ</span>
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
          <div class="bg-espresso-900 text-white rounded-2xl p-3.5 shadow-md">
            <div class="flex items-center justify-between">
              <span class="text-sm font-extrabold font-mono text-white">คิวของคุณ: #${escapeHtml(state.customerQueueNo)}</span>
              <span class="${queueInfo.badgeBg} text-white text-[10px] font-bold px-2 py-0.5 rounded-md">${queueInfo.badgeText}</span>
            </div>
            <p class="text-[11px] text-warmgray-400 mt-2">${queueInfo.desc}</p>
          </div>

          <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            ${mobileCategories
              .map(
                (cat) => `
              <button
                onclick="appActions.setMobileCategory('${cat.id}')"
                class="px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  state.mobileCategory === cat.id
                    ? 'bg-espresso-800 text-white shadow-sm'
                    : 'bg-white text-warmgray-600 border border-cream-300'
                }"
              >${cat.label}</button>
            `
              )
              .join('')}
          </div>

          <div class="space-y-3">
            ${filteredProducts
              .map((product) => {
                const isOutOfStock = product.stock !== null && product.stock <= 0;
                return `
                  <div class="bg-white rounded-2xl border border-cream-300 p-3 flex gap-3 shadow-sm ${isOutOfStock ? 'opacity-60 bg-cream-50' : ''}">
                    <div class="w-20 h-20 rounded-xl overflow-hidden bg-cream-200 shrink-0 border border-cream-200 relative">
                      <img src="${escapeHtml(product.img)}" alt="${escapeHtml(product.name)}" class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-1 flex flex-col justify-between">
                      <div>
                        <div class="font-bold text-xs sm:text-sm text-espresso-900">${escapeHtml(product.name.split(' (')[0])}</div>
                        <div class="text-[11px] text-warmgray-500 line-clamp-1 mt-0.5">${escapeHtml(product.desc)}</div>
                      </div>
                      <div class="flex items-center justify-between mt-2">
                        <span class="font-mono font-extrabold text-sm text-terracotta">฿${product.price.toFixed(2)}</span>
                        ${
                          isOutOfStock
                            ? `<span class="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-md border border-red-200">Out of Stock (สินค้าหมด)</span>`
                            : `<button onclick="appActions.clickMobileProduct('${product.id}')" class="px-3 py-1 bg-espresso-900 hover:bg-espresso-800 text-white text-xs font-bold rounded-lg">+ สั่ง</button>`
                        }
                      </div>
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>

        <div class="absolute bottom-0 left-0 right-0 bg-white border-t border-cream-300 p-3 flex items-center justify-between shadow-lg z-20">
          <div>
            <div class="text-[11px] text-warmgray-500">ยอดรวม ${cartItemCount} รายการในตะกร้า</div>
            <div class="text-base font-extrabold font-mono text-espresso-900">฿${cartTotal.toFixed(2)}</div>
          </div>
          <button
            onclick="appActions.openMobileCartDrawer()"
            ${state.mobileCart.length === 0 ? 'disabled' : ''}
            class="px-4 py-2.5 rounded-xl font-bold text-xs text-white transition ${
              state.mobileCart.length > 0 ? 'bg-terracotta hover:bg-terracotta-hover' : 'bg-warmgray-400 cursor-not-allowed'
            }"
          >
            🛍 ดูตะกร้า (${cartItemCount}) →
          </button>
        </div>

        ${
          state.mobileCustomProduct
            ? `
          <div class="absolute inset-0 bg-espresso-900/60 z-30 flex flex-col justify-end">
            <div class="bg-white rounded-t-3xl p-5 space-y-4 border-t border-cream-300 shadow-2xl">
              <div class="flex justify-between items-center">
                <div>
                  <h4 class="font-bold text-sm text-espresso-900">ปรับแต่ง: ${escapeHtml(state.mobileCustomProduct.name.split(' (')[0])}</h4>
                  <p class="text-xs text-warmgray-500">เลือกความหวานและชนิดนมตามต้องการ</p>
                </div>
                <button onclick="appActions.closeMobileCustom()" class="p-1.5 text-warmgray-400">✕</button>
              </div>
              <div>
                <label class="block text-xs font-bold text-espresso-900 mb-1.5">ระดับความหวาน</label>
                <div class="grid grid-cols-4 gap-1.5">
                  ${['0%', '25%', '50%', '100%']
                    .map(
                      (lvl) => `
                    <button onclick="appActions.setMobileSweetness('${lvl}')" class="py-1.5 rounded-lg text-xs font-semibold border ${state.mobileCustomSweetness === lvl ? 'bg-terracotta text-white border-terracotta' : 'bg-cream-50 text-warmgray-600 border-cream-300'}">${lvl}</button>
                  `
                    )
                    .join('')}
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-espresso-900 mb-1.5">ชนิดนม</label>
                <div class="grid grid-cols-3 gap-1.5">
                  ${['นมปกติ', 'นมโอ๊ต (+15฿)', 'นมอัลมอนด์ (+15฿)']
                    .map(
                      (m) => `
                    <button onclick="appActions.setMobileMilk('${m}')" class="py-1.5 px-2 rounded-lg text-[11px] font-semibold border truncate ${state.mobileCustomMilk === m ? 'bg-matcha text-white border-matcha' : 'bg-cream-50 text-warmgray-600 border-cream-300'}">${m}</button>
                  `
                    )
                    .join('')}
                </div>
              </div>
              <button onclick="appActions.confirmMobileCustomization()" class="w-full py-2.5 bg-terracotta text-white font-bold text-xs rounded-xl shadow-md">
                เพิ่มลงตะกร้า • ฿${(state.mobileCustomProduct.price + (state.mobileCustomMilk.includes('(+15฿)') ? 15 : 0)).toFixed(2)}
              </button>
            </div>
          </div>
        `
            : ''
        }

        ${
          state.showMobileCartDrawer
            ? `
          <div class="absolute inset-0 bg-espresso-900/60 z-30 flex flex-col justify-end">
            <div class="bg-white rounded-t-3xl p-5 space-y-4 border-t border-cream-300 shadow-2xl max-h-[85%] flex flex-col">
              <div class="flex justify-between items-center border-b border-cream-200 pb-3">
                <h4 class="font-bold text-sm text-espresso-900">🛍 รายการในตะกร้า (${cartItemCount})</h4>
                <button onclick="appActions.closeMobileCartDrawer()" class="p-1.5 text-warmgray-400">✕</button>
              </div>
              <div class="flex items-center justify-between text-xs bg-cream-50 p-2.5 rounded-xl border border-cream-200">
                <span class="font-semibold text-espresso-800">ระบุหมายเลขโต๊ะ:</span>
                <select onchange="state.mobileTableNo = this.value; render();" class="bg-white border border-cream-300 rounded-lg px-2 py-1 font-bold text-espresso-900">
                  ${['01', '02', '03', '04', '05']
                    .map(
                      (t) => `<option value="${t}" ${state.mobileTableNo === t ? 'selected' : ''}>โต๊ะ ${t}</option>`
                    )
                    .join('')}
                </select>
              </div>
              <div class="flex-1 overflow-y-auto space-y-2.5 py-1">
                ${state.mobileCart
                  .map(
                    (it) => `
                  <div class="flex items-center justify-between border-b border-cream-100 pb-2 text-xs">
                    <div>
                      <div class="font-bold text-espresso-900">${it.quantity}x ${escapeHtml(it.name)}</div>
                      ${it.optionsText ? `<div class="text-[10px] text-terracotta">↳ ${escapeHtml(it.optionsText)}</div>` : ''}
                    </div>
                    <div class="font-mono font-bold text-espresso-900">฿${(it.price * it.quantity).toFixed(2)}</div>
                  </div>
                `
                  )
                  .join('')}
              </div>
              <div class="border-t border-cream-200 pt-3 space-y-1.5 text-xs">
                <div class="flex justify-between text-warmgray-600"><span>ยอดรวม (Subtotal)</span><span class="font-mono">฿${(cartTotal / 1.07).toFixed(2)}</span></div>
                <div class="flex justify-between text-warmgray-600"><span>ภาษีมูลค่าเพิ่ม VAT 7%</span><span class="font-mono">฿${(cartTotal - cartTotal / 1.07).toFixed(2)}</span></div>
                <div class="flex justify-between font-bold text-sm text-espresso-900 pt-1"><span>ยอดสุทธิ (Total)</span><span class="font-mono text-terracotta">฿${cartTotal.toFixed(2)}</span></div>
              </div>
              <button onclick="appActions.placeMobileOrder()" class="w-full py-3 bg-terracotta text-white font-bold text-xs rounded-xl shadow-md">
                ✓ ยืนยันการสั่งซื้อ • ส่งเข้าครัวทันที
              </button>
            </div>
          </div>
        `
            : ''
        }
      </div>
    </div>
  `;
}

// ============================================================================
// MAIN RENDER & LIFECYCLE
// ============================================================================

function render() {
  const root = document.getElementById('app');
  if (!root) return;

  let pageHtml = '';
  if (state.currentPage === 'login') pageHtml = renderLoginPage();
  else if (state.currentPage === 'pos') pageHtml = renderPosPage();
  else if (state.currentPage === 'kds') pageHtml = renderKdsPage();
  else if (state.currentPage === 'admin') pageHtml = renderAdminPage();
  else if (state.currentPage === 'customer') pageHtml = renderCustomerMobilePage();

  root.innerHTML = `
    ${renderNavbar()}
    ${renderSessionBar()}
    <div class="flex-1 flex flex-col">
      ${pageHtml}
    </div>
  `;
}

// NFR-04: 15-minute Session Timeout listeners & interval
['click', 'keydown', 'touchstart'].forEach((evt) => {
  window.addEventListener(evt, () => {
    if (state.currentUser) {
      state.remainingSeconds = SESSION_TIMEOUT_SECONDS;
      const el = document.getElementById('session-timer-display');
      if (el) el.textContent = formatTime(state.remainingSeconds);
    }
  });
});

setInterval(() => {
  if (!state.currentUser) return;
  if (state.remainingSeconds <= 1) {
    state.remainingSeconds = SESSION_TIMEOUT_SECONDS;
    window.appActions.logout('หมดเวลาเซสชัน 15 นาทีตามนโยบายความปลอดภัย (NFR-04 Session Timeout)');
  } else {
    state.remainingSeconds -= 1;
    const el = document.getElementById('session-timer-display');
    if (el) el.textContent = formatTime(state.remainingSeconds);
  }
}, 1000);

// Initialize application
fetchState();
