const express = require('express');
const path = require('path');
const StaffModel = require('./models/StaffModel');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================================
// IN-MEMORY STORE (Matches Figma Spec & TOR FR-01 to FR-12)
// ============================================================================

const CATEGORIES = [
  { id: 'all', name: 'ทั้งหมด', icon: '☕' },
  { id: 'coffee', name: 'กาแฟสด', icon: '⚡' },
  { id: 'non-coffee', name: 'ชา & เครื่องดื่ม', icon: '🍵' },
  { id: 'bakery', name: '🥐 เบเกอรี่สด', icon: '🥐' },
  { id: 'dessert', name: '🍰 ของหวาน', icon: '🍰' },
];

let products = [
  {
    id: 'c1',
    name: 'เอสเพรสโซ่เย็น (Iced Espresso)',
    category: 'coffee',
    price: 65.0,
    desc: 'เมล็ดคั่วกลาง บราซิล-เชียงราย เข้มข้นกลมกล่อม',
    img: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&q=80',
    customizable: true,
    stock: 20,
  },
  {
    id: 'c2',
    name: 'อเมริกาโน่น้ำส้ม (Orange Americano)',
    category: 'coffee',
    price: 85.0,
    desc: 'ช็อตเอสเพรสโซ่เข้มผสมน้ำส้มคั้นสด สดชื่นตื่นตัว',
    img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80',
    customizable: true,
    stock: 20,
  },
  {
    id: 'c3',
    name: 'คาปูชิโน่ร้อน (Hot Cappuccino)',
    category: 'coffee',
    price: 60.0,
    desc: 'ฟองนมเนียนนุ่ม โรยผงโกโก้พรีเมียม',
    img: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=500&q=80',
    customizable: true,
    stock: 20,
  },
  {
    id: 'c4',
    name: 'มัทฉะลาเต้อูจิ (Uji Matcha Latte)',
    category: 'non-coffee',
    price: 85.0,
    desc: 'ผงมัทฉะเกรดพิธีการแท้จากเกียวโต หอมละมุนเข้มข้น',
    img: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&q=80',
    customizable: true,
    stock: 20,
  },
  {
    id: 'c5',
    name: 'ชาไทยการันต์เย็น (Signature Thai Tea)',
    category: 'non-coffee',
    price: 60.0,
    desc: 'ใบชาคั่วสูตรลับของร้าน หอมกรุ่นหวานมันกำลังดี',
    img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&q=80',
    customizable: true,
    stock: 20,
  },
  {
    id: 'b1',
    name: 'ครัวซองต์เนยสด AOP (Butter Croissant)',
    category: 'bakery',
    price: 85.0,
    desc: 'เนยสดแท้นำเข้าจากฝรั่งเศส กรอบนอกนุ่มฉ่ำเนย',
    img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80',
    customizable: false,
    stock: 4,
    isBakery: true,
  },
  {
    id: 'b2',
    name: 'เดนิชสตรอว์เบอร์รี (Strawberry Danish)',
    category: 'bakery',
    price: 95.0,
    desc: 'แป้งเดนิชกรอบ ซอสคัสตาร์ดวานิลลาและผลสตรอว์เบอร์รีสด',
    img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80',
    customizable: false,
    stock: 3,
    isBakery: true,
  },
  {
    id: 'b3',
    name: 'บาสก์ชีสเค้กหน้าไหม้ (Burnt Cheesecake)',
    category: 'dessert',
    price: 125.0,
    desc: 'ครีมชีสแท้เนื้อเนียนนุ่ม ละลายในปาก หอมคาราเมลไหม้',
    img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80',
    customizable: false,
    stock: 0,
    isBakery: true,
  },
  {
    id: 'b4',
    name: 'เค้กแครอทครีมชีส (Carrot Cake)',
    category: 'dessert',
    price: 95.0,
    desc: 'เนื้อเค้กแครอทนุ่มแน่น หอมเครื่องเทศ ท็อปปิ้งครีมชีสเปรี้ยวหวาน',
    img: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500&q=80',
    customizable: false,
    stock: 8,
    isBakery: true,
  },
  {
    id: 'c6',
    name: 'ลาเต้เย็น (Iced Latte)',
    category: 'coffee',
    price: 70.0,
    desc: 'ช็อตเอสเพรสโซ่ผสมนมสดเย็น หอมละมุนกลมกล่อม',
    img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&q=80',
    customizable: true,
    stock: 25,
  },
  {
    id: 'b5',
    name: 'บราวนี่ดาร์กช็อกโกแลต (Dark Choc Brownie)',
    category: 'dessert',
    price: 75.0,
    desc: 'ดาร์กช็อกโกแลตเข้มข้น 70% เนื้อหนึบฉ่ำ',
    img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80',
    customizable: false,
    stock: 12,
    isBakery: true,
  },
];

let toppings = [
  { id: 't1', name: 'นมโอ๊ต (Oat Milk)', price: 15, stock: 20, category: 'topping' },
  { id: 't2', name: 'นมอัลมอนด์ (Almond Milk)', price: 15, stock: 15, category: 'topping' },
  { id: 't3', name: 'เพิ่มช็อตเอสเพรสโซ่ (Extra Shot)', price: 20, stock: 30, category: 'topping' },
  { id: 't4', name: 'บุกบราวน์ชูการ์ (Brown Sugar Jelly)', price: 15, stock: 18, category: 'topping' },
];
const CartModel = require('./models/CartModel');
const OrderQueueModel = require('./models/OrderQueueModel');
const cartCatalogHelper = new CartModel();

let staffAccounts = [
  {
    id: 'staff-01',
    username: 'cashier_zai',
    pin: '1234',
    name: 'Zai (กะเช้า)',
    role: 'cashier',
    roleName: 'แคชเชียร์',
  },
  {
    id: 'staff-02',
    username: 'barista_kds',
    pin: '5678',
    name: 'อานนท์ (บาริสต้า)',
    role: 'operator',
    roleName: 'บาริสต้า/ครัว',
  },
  {
    id: 'staff-03',
    username: 'admin_boss',
    pin: '9999',
    name: 'ผู้จัดการร้าน (Admin)',
    role: 'admin',
    roleName: 'เจ้าของร้าน',
  },
];
const staffModel = new StaffModel(staffAccounts);

let orders = [
  {
    id: 'ord-a04',
    queueNo: 'A04',
    createdAt: '14:40',
    timeElapsed: '1 นาที',
    status: 'pending',
    tableNo: '04',
    channel: 'หน้าร้าน (POS)',
    cashierName: 'Zai (กะเช้า)',
    items: [
      {
        name: 'เอสเพรสโซ่เย็น',
        quantity: 1,
        optionsText: 'หวาน 25% • นมโอ๊ต',
        isBeverage: true,
      },
      {
        name: 'ครัวซองต์เนยสด AOP',
        quantity: 1,
        optionsText: 'อบอุ่นร้อน',
        isBakery: true,
      },
    ],
    totalAmount: 150.0,
    paymentMethod: 'PromptPay',
  },
  {
    id: 'ord-a03',
    queueNo: 'A03',
    createdAt: '14:37',
    timeElapsed: 'กำลังทำ (3 นาที)',
    status: 'in_progress',
    tableNo: '04',
    channel: 'Mobile Scan',
    cashierName: 'ลูกค้าสั่งเอง',
    items: [
      {
        name: 'มัทฉะลาเต้อูจิ',
        quantity: 2,
        optionsText: 'หวาน 50% • นมสดปกติ',
        isBeverage: true,
      },
    ],
    totalAmount: 170.0,
    paymentMethod: 'PromptPay',
  },
  {
    id: 'ord-a02',
    queueNo: 'A02',
    createdAt: '14:32',
    timeElapsed: 'ขานเรียกแล้ว',
    status: 'ready',
    tableNo: '01',
    channel: 'หน้าร้าน (POS)',
    cashierName: 'Zai (กะเช้า)',
    items: [
      {
        name: 'ชาไทยการันต์เย็น',
        quantity: 1,
        optionsText: 'หวานปกติ 100%',
        isBeverage: true,
      },
    ],
    totalAmount: 60.0,
    paymentMethod: 'เงินสด',
  },
];

let queueSequence = 5;
const orderQueueModel = new OrderQueueModel(orders, queueSequence);

let salesStats = {
  totalSales: 14250.0,
  totalBills: 84,
  promptPayShare: 64,
  cashShare: 36,
};

let salesHistory = [
  {
    receiptNo: 'INV-20260922-0084',
    time: '14:40',
    queueNo: 'A04',
    itemsSummary: 'เอสเพรสโซ่เย็น, ครัวซองต์เนยสด AOP',
    paymentMethod: 'PromptPay',
    total: 150.0,
    status: 'paid',
    cashier: 'Zai (กะเช้า)',
  },
  {
    receiptNo: 'INV-20260922-0083',
    time: '14:37',
    queueNo: 'A03',
    itemsSummary: 'มัทฉะลาเต้อูจิ (x2)',
    paymentMethod: 'PromptPay',
    total: 170.0,
    status: 'paid',
    cashier: 'Mobile Scan',
  },
  {
    receiptNo: 'INV-20260922-0082',
    time: '14:32',
    queueNo: 'A02',
    itemsSummary: 'ชาไทยการันต์เย็น',
    paymentMethod: 'เงินสด',
    total: 60.0,
    status: 'paid',
    cashier: 'Zai (กะเช้า)',
  },
  {
    receiptNo: 'INV-20260922-0081',
    time: '14:15',
    queueNo: 'A01',
    itemsSummary: 'อเมริกาโน่น้ำส้ม, เดนิชสตรอว์เบอร์รี',
    paymentMethod: 'PromptPay',
    total: 180.0,
    status: 'paid',
    cashier: 'Zai (กะเช้า)',
  },
  {
    receiptNo: 'INV-20260922-0080',
    time: '13:58',
    queueNo: 'V99',
    itemsSummary: 'คาปูชิโน่ร้อน, เค้กแครอท',
    paymentMethod: 'เงินสด',
    total: 155.0,
    status: 'voided',
    cashier: 'Zai (กะเช้า)',
    voidBy: 'Admin Zai',
    voidReason: 'ลูกค้าเปลี่ยนใจ (สั่งผิดเมนู)',
  },
];

let customerQueueNo = 'A03';

// ============================================================================
// REST API ENDPOINTS
// ============================================================================

app.get('/api/state', (_req, res) => {
  res.json({
    categories: CATEGORIES,
    products,
    toppings,
    staffAccounts,
    orders,
    salesStats,
    salesHistory,
    customerQueueNo,
  });
});

app.get('/api/catalog/search', (req, res) => {
  const { q = '', category = 'all' } = req.query || {};
  res.json(cartCatalogHelper.searchCatalog(products, toppings, q, category));
});

app.post('/api/auth/login', (req, res) => {
  const { username, pin } = req.body || {};
  const result = staffModel.authenticatePin(username, pin);
  if (!result.ok) {
    return res.status(result.status).json({ error: result.error });
  }
  res.json({ user: result.user });
});

app.post('/api/auth/social', (req, res) => {
  const { provider, email, displayName, role } = req.body || {};
  const result = staffModel.authenticateSocial({ provider, email, displayName, role });
  if (!result.ok) {
    return res.status(result.status).json({ error: result.error });
  }
  staffAccounts = staffModel.getAll();
  res.json({ user: result.user });
});

app.post('/api/orders', (req, res) => {
  const payload = req.body || {};
  const items = payload.items || [];

  // เช็ก Out-of-Stock ก่อนสร้างออเดอร์ (Issue #8 & #12)
  for (const item of items) {
    const prod = products.find((p) => p.id === item.id);
    const qty = Number(item.quantity) || 1;
    if (prod && prod.stock !== null && prod.stock < qty) {
      return res.status(400).json({ error: `สินค้า "${prod.name}" หมดสต็อก (Out of Stock)` });
    }
  }

  const newOrder = orderQueueModel.enqueueOrder(payload);
  orders = orderQueueModel.getAll();

  // ตัดสต็อกอัตโนมัติ (FR-03)
  products = products.map((p) => {
    const itemInCart = items.find((it) => it.id === p.id);
    if (itemInCart && p.stock !== null) {
      return {
        ...p,
        stock: Math.max(0, p.stock - (Number(itemInCart.quantity) || 1)),
      };
    }
    return p;
  });

  // Update sales stats & history (FR-08)
  const totalAmount = Number(payload.totalAmount) || 0;
  const paymentMethod = payload.paymentMethod || 'PromptPay';
  const cashierName = payload.cashierName || 'Cashier';

  salesStats = {
    ...salesStats,
    totalSales: salesStats.totalSales + totalAmount,
    totalBills: salesStats.totalBills + 1,
  };

  const now = new Date();
  const receiptNo = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate()
  ).padStart(2, '0')}-${String(salesStats.totalBills).padStart(4, '0')}`;

  salesHistory = [
    {
      receiptNo,
      time: newOrder.createdAt,
      queueNo: newOrder.queueNo,
      itemsSummary: items.map((i) => `${i.name} (x${i.quantity || 1})`).join(', '),
      paymentMethod,
      total: totalAmount,
      status: 'paid',
      cashier: cashierName,
    },
    ...salesHistory,
  ];

  if (String(payload.channel || '').includes('Mobile')) {
    customerQueueNo = newOrder.queueNo;
  }

  res.status(201).json({ order: newOrder, customerQueueNo });
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  const result = orderQueueModel.advanceOrderStatus(id, status);
  if (!result.ok) {
    return res.status(result.status).json({ error: result.error });
  }
  orders = result.orders;
  res.json({ ok: true, orders: result.orders });
});

app.post('/api/products', (req, res) => {
  const { name, category = 'coffee', price, cost = 0, desc } = req.body || {};
  if (!name || !price) {
    return res.status(400).json({ error: 'กรุณาระบุชื่อเมนูและราคา' });
  }
  const isBakery = category === 'bakery' || category === 'dessert';
  const newProduct = {
    id: `p-${Date.now()}`,
    name,
    category,
    price: Number(price),
    cost: Number(cost || 0),
    desc: desc || 'เมนูใหม่ประจำร้าน',
    img: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&q=80',
    customizable: category === 'coffee' || category === 'non-coffee',
    isBakery,
    stock: isBakery ? 10 : null,
  };
  products.push(newProduct);
  res.status(201).json({ product: newProduct, products });
});

app.patch('/api/products/:id/price', (req, res) => {
  const { id } = req.params;
  const { price } = req.body || {};
  products = products.map((p) => (p.id === id ? { ...p, price: Number(price) } : p));
  res.json({ ok: true, products });
});

app.post('/api/products/:id/restock', (req, res) => {
  const { id } = req.params;
  const { amount = 5 } = req.body || {};
  products = products.map((p) => {
    if (p.id === id) {
      return { ...p, stock: (p.stock ?? 0) + Number(amount) };
    }
    return p;
  });
  res.json({ ok: true, products });
});

app.post('/api/sales/:receiptNo/void', (req, res) => {
  const { receiptNo } = req.params;
  const { adminName = 'Admin Zai', reason = 'ยกเลิกโดยผู้จัดการ' } = req.body || {};
  salesHistory = salesHistory.map((item) => {
    if (item.receiptNo === receiptNo) {
      return {
        ...item,
        status: 'voided',
        voidBy: adminName,
        voidReason: reason,
      };
    }
    return item;
  });
  res.json({ ok: true, salesHistory });
});

app.post('/api/staff', (req, res) => {
  const result = staffModel.addStaff(req.body || {});
  if (!result.ok) {
    return res.status(result.status).json({ error: result.error });
  }
  staffAccounts = result.staffAccounts;
  res.status(201).json({ staff: result.staff, staffAccounts: result.staffAccounts });
});

app.get('/api/queue/stats', (req, res) => {
  const { status = 'all' } = req.query || {};
  res.json({
    orders: orderQueueModel.findOrdersByStatus(status),
    stats: orderQueueModel.getQueueStats(),
  });
});

// Fallback to index.html for SPA navigation
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`☕ Jamal Café & Bakery POS (Node.js + Express) running at http://localhost:${PORT}`);
  });
}

module.exports = app;
