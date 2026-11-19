// ============================================================================
// JAMAL POS — CLIENT-SIDE STATIC RUNTIME FOR GITHUB PAGES / STATIC HOSTING
// Mirrors frontend/server.js + models/* when Node.js Express is not running.
// ============================================================================
(function initJamalStaticRuntime(globalScope) {
  const STORAGE_KEY = 'jamal_pos_static_state_v1';
  const BAKERY_CATEGORIES = ['bakery', 'dessert'];

  function createSeedState() {
    return {
      categories: [
        { id: 'all', name: 'ทั้งหมด', icon: '☕' },
        { id: 'coffee', name: 'กาแฟสด', icon: '⚡' },
        { id: 'non-coffee', name: 'ชา & เครื่องดื่ม', icon: '🍵' },
        { id: 'bakery', name: '🥐 เบเกอรี่สด', icon: '🥐' },
        { id: 'dessert', name: '🍰 ของหวาน', icon: '🍰' },
      ],
      products: [
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
      ],
      toppings: [
        { id: 't1', name: 'นมโอ๊ต (Oat Milk)', price: 15, stock: 20, category: 'topping' },
        { id: 't2', name: 'นมอัลมอนด์ (Almond Milk)', price: 15, stock: 15, category: 'topping' },
        { id: 't3', name: 'เพิ่มช็อตเอสเพรสโซ่ (Extra Shot)', price: 20, stock: 30, category: 'topping' },
        { id: 't4', name: 'บุกบราวน์ชูการ์ (Brown Sugar Jelly)', price: 15, stock: 18, category: 'topping' },
      ],
      staffAccounts: [
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
      ],
      orders: [
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
            { name: 'เอสเพรสโซ่เย็น', quantity: 1, optionsText: 'หวาน 25% • นมโอ๊ต', isBeverage: true },
            { name: 'ครัวซองต์เนยสด AOP', quantity: 1, optionsText: 'อบอุ่นร้อน', isBakery: true },
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
          items: [{ name: 'มัทฉะลาเต้อูจิ', quantity: 2, optionsText: 'หวาน 50% • นมสดปกติ', isBeverage: true }],
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
          items: [{ name: 'ชาไทยการันต์เย็น', quantity: 1, optionsText: 'หวานปกติ 100%', isBeverage: true }],
          totalAmount: 60.0,
          paymentMethod: 'เงินสด',
        },
      ],
      queueSequence: 5,
      productSequence: 0,
      salesStats: { totalSales: 14250.0, totalBills: 84, promptPayShare: 64, cashShare: 36 },
      salesHistory: [
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
      ],
      customerQueueNo: 'A03',
    };
  }

  function loadStore() {
    try {
      const raw = globalScope.localStorage && globalScope.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_err) {
      // Ignore storage access errors in private mode
    }
    return createSeedState();
  }

  function saveStore(store) {
    try {
      if (globalScope.localStorage) {
        globalScope.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      }
    } catch (_err) {
      // Ignore storage quota errors
    }
  }

  let db = loadStore();

  function jsonResponse(status, payload) {
    return {
      ok: status >= 200 && status < 300,
      status,
      headers: { get: () => 'application/json' },
      json: async () => payload,
    };
  }

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function sortInventorySmallToLarge() {
    const isTracked = (item) => typeof item.stock === 'number';
    const isBakery = (p) => Boolean(p.isBakery) || BAKERY_CATEGORIES.includes(p.category);
    const items = [
      ...db.products.filter(isTracked).map((p) => ({
        id: p.id,
        name: p.name,
        group: isBakery(p) ? 'cake/bakery' : 'base-drink',
        stock: p.stock,
        price: p.price,
      })),
      ...db.toppings.filter(isTracked).map((t) => ({
        id: t.id,
        name: t.name,
        group: 'topping',
        stock: t.stock,
        price: t.price,
      })),
    ];
    return items.sort((a, b) => a.stock - b.stock);
  }

  function computeBill(items, cashReceived) {
    const totalAmount = items.reduce((sum, item) => {
      const unit =
        item.unitPrice !== undefined
          ? Number(item.unitPrice)
          : item.price !== undefined
          ? Number(item.price)
          : 0;
      return sum + unit * Math.max(1, Number(item.quantity) || 1);
    }, 0);
    const subtotal = Number((totalAmount / 1.07).toFixed(2));
    const vatAmount = Number((totalAmount - subtotal).toFixed(2));
    const paid = Number(cashReceived) || 0;
    return {
      totalAmount: Number(totalAmount.toFixed(2)),
      subtotal,
      vatAmount,
      cashReceived: paid,
      changeDue: paid >= totalAmount ? Number((paid - totalAmount).toFixed(2)) : 0,
      isEnoughCash: paid >= totalAmount,
    };
  }

  function deductInventory(items) {
    const prodDemand = new Map();
    const topDemand = new Map();
    for (const item of items) {
      const qty = Number(item.quantity) > 0 ? Number(item.quantity) : 1;
      prodDemand.set(item.id, (prodDemand.get(item.id) || 0) + qty);
      new Set((item.toppings || []).map((t) => t.id)).forEach((id) => {
        topDemand.set(id, (topDemand.get(id) || 0) + qty);
      });
    }
    for (const [id, qty] of prodDemand) {
      const prod = db.products.find((p) => p.id === id);
      if (prod && typeof prod.stock === 'number' && prod.stock < qty) {
        return `สินค้า "${prod.name}" หมดหรือสต็อกไม่พอ (คงเหลือ ${prod.stock})`;
      }
    }
    for (const [id, qty] of topDemand) {
      const top = db.toppings.find((t) => t.id === id);
      if (top && typeof top.stock === 'number' && top.stock < qty) {
        return `ท็อปปิ้ง "${top.name}" หมดหรือสต็อกไม่พอ (คงเหลือ ${top.stock})`;
      }
    }
    db.products = db.products.map((p) => {
      const q = prodDemand.get(p.id);
      return q && typeof p.stock === 'number' ? { ...p, stock: Math.max(0, p.stock - q) } : p;
    });
    db.toppings = db.toppings.map((t) => {
      const q = topDemand.get(t.id);
      return q && typeof t.stock === 'number' ? { ...t, stock: Math.max(0, t.stock - q) } : t;
    });
    return null;
  }

  function handleGet(pathname, searchParams) {
    if (pathname === '/api/state') {
      return jsonResponse(200, {
        categories: db.categories,
        products: db.products,
        toppings: db.toppings,
        staffAccounts: db.staffAccounts,
        orders: db.orders,
        salesStats: db.salesStats,
        salesHistory: db.salesHistory,
        sortedInventory: sortInventorySmallToLarge(),
        customerQueueNo: db.customerQueueNo,
      });
    }
    if (pathname === '/api/inventory/sorted') {
      return jsonResponse(200, { items: sortInventorySmallToLarge() });
    }
    if (pathname === '/api/catalog/search') {
      const q = (searchParams.get('q') || '').trim().toLowerCase();
      const cat = searchParams.get('category') || 'all';
      const products = db.products.filter(
        (p) =>
          (cat === 'all' || p.category === cat) &&
          (!q || `${p.name} ${p.desc} ${p.category}`.toLowerCase().includes(q))
      );
      const toppings = db.toppings.filter((t) => !q || String(t.name).toLowerCase().includes(q));
      return jsonResponse(200, { products, toppings, totalMatches: products.length + toppings.length });
    }
    return jsonResponse(404, { error: 'Not found' });
  }

  function handleAuth(pathname, body) {
    if (pathname === '/api/auth/login') {
      const uname = String(body.username || '').trim().toLowerCase();
      const user = db.staffAccounts.find((a) => a.username.toLowerCase() === uname);
      if (!user) return jsonResponse(404, { error: 'ไม่พบชื่อผู้ใช้งานนี้ในระบบ' });
      if (user.pin !== String(body.pin || '')) {
        return jsonResponse(401, { error: 'รหัสผ่าน PIN ไม่ถูกต้อง' });
      }
      return jsonResponse(200, { user });
    }
    const provider = String(body.provider || '').toLowerCase();
    const email = String(body.email || '').trim().toLowerCase();
    if (!['gmail', 'google', 'facebook'].includes(provider) || !email.includes('@')) {
      return jsonResponse(400, { error: 'ข้อมูล Social Login ไม่ถูกต้อง' });
    }
    let user = db.staffAccounts.find((a) => (a.email || '').toLowerCase() === email);
    if (!user) {
      const safeRole = body.role === 'admin' ? 'admin' : 'cashier';
      user = {
        id: `staff-social-${db.staffAccounts.length + 1}`,
        username: `${provider}_${email.split('@')[0]}`,
        pin: '0000',
        name: body.displayName || email.split('@')[0],
        role: safeRole,
        roleName: safeRole === 'admin' ? 'เจ้าของร้าน' : 'แคชเชียร์',
        authProvider: provider,
        email,
      };
      db.staffAccounts = [...db.staffAccounts, user];
      saveStore(db);
    }
    return jsonResponse(200, { user });
  }

  function handleOrders(body) {
    const items = body.items || [];
    const shortage = deductInventory(items);
    if (shortage) return jsonResponse(400, { error: shortage });

    const now = new Date();
    const timeStr = `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
    const queueNo = `A${pad2(db.queueSequence)}`;
    db.queueSequence += 1;

    const billSummary = computeBill(items, body.cashReceived);
    const resolvedTotal = Number(body.totalAmount) > 0 ? Number(body.totalAmount) : billSummary.totalAmount;

    const newOrder = {
      id: `ord-${Date.now()}`,
      queueNo,
      createdAt: timeStr,
      timeElapsed: 'เมื่อสักครู่',
      status: 'pending',
      tableNo: body.tableNo || 'หน้าร้าน',
      channel: body.channel || 'หน้าร้าน (POS)',
      cashierName: body.cashierName || 'Zai (กะเช้า)',
      items,
      totalAmount: resolvedTotal,
      paymentMethod: body.paymentMethod || 'PromptPay',
    };
    db.orders = [newOrder, ...db.orders];

    db.salesStats.totalSales += resolvedTotal;
    db.salesStats.totalBills += 1;
    const receiptNo = `INV-${now.getFullYear()}${pad2(now.getMonth() + 1)}${pad2(now.getDate())}-${String(
      db.salesStats.totalBills
    ).padStart(4, '0')}`;
    db.salesHistory = [
      {
        receiptNo,
        time: timeStr,
        queueNo,
        itemsSummary: items.map((i) => `${i.name} (x${i.quantity || 1})`).join(', '),
        paymentMethod: newOrder.paymentMethod,
        total: resolvedTotal,
        status: 'paid',
        cashier: newOrder.cashierName,
      },
      ...db.salesHistory,
    ];
    if (String(newOrder.channel).includes('Mobile')) {
      db.customerQueueNo = queueNo;
    }
    saveStore(db);
    return jsonResponse(201, { order: newOrder, billSummary, customerQueueNo: db.customerQueueNo });
  }

  function handleProductsMutation(method, pathname, body) {
    if (method === 'POST' && pathname === '/api/products') {
      if (!String(body.name || '').trim() || !(Number(body.price) > 0)) {
        return jsonResponse(400, { error: 'กรุณากรอกชื่อเมนูและราคา' });
      }
      const category = body.category || 'coffee';
      const isBakery = BAKERY_CATEGORIES.includes(category);
      db.productSequence += 1;
      const product = {
        id: `p-${Date.now()}-${db.productSequence}`,
        name: String(body.name).trim(),
        category,
        price: Number(body.price),
        cost: Number(body.cost) || 0,
        desc: body.desc || 'เมนูใหม่ประจำร้าน',
        img: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&q=80',
        customizable: body.customizable !== undefined ? Boolean(body.customizable) : !isBakery,
        isBakery,
        stock: body.stock !== undefined ? Number(body.stock) : 15,
      };
      db.products = [...db.products, product];
      saveStore(db);
      return jsonResponse(201, { product, products: db.products });
    }

    const restockMatch = pathname.match(/^\/api\/products\/([^/]+)\/restock$/);
    if (method === 'POST' && restockMatch) {
      const id = decodeURIComponent(restockMatch[1]);
      const qty = Number(body.amount !== undefined ? body.amount : 5);
      let found = false;
      const bump = (arr) =>
        arr.map((it) => {
          if (it.id !== id) return it;
          found = true;
          return { ...it, stock: (typeof it.stock === 'number' ? it.stock : 0) + qty };
        });
      db.products = bump(db.products);
      if (!found) db.toppings = bump(db.toppings);
      saveStore(db);
      return found ? jsonResponse(200, { ok: true }) : jsonResponse(404, { error: 'ไม่พบรายการ' });
    }

    const priceMatch = pathname.match(/^\/api\/products\/([^/]+)\/price$/);
    const itemMatch = pathname.match(/^\/api\/products\/([^/]+)$/);
    const id = priceMatch ? decodeURIComponent(priceMatch[1]) : itemMatch ? decodeURIComponent(itemMatch[1]) : null;
    if (!id) return null;

    if (method === 'DELETE') {
      db.products = db.products.filter((p) => p.id !== id);
      saveStore(db);
      return jsonResponse(200, { ok: true, products: db.products });
    }

    const updates = priceMatch ? { price: body.price } : body;
    db.products = db.products.map((p) => {
      if (p.id !== id) return p;
      const nextCat = updates.category || p.category;
      return {
        ...p,
        name: updates.name !== undefined ? String(updates.name).trim() : p.name,
        category: nextCat,
        isBakery: BAKERY_CATEGORIES.includes(nextCat),
        price: updates.price !== undefined ? Number(updates.price) : p.price,
        desc: updates.desc !== undefined ? updates.desc : p.desc,
        stock: updates.stock !== undefined ? Number(updates.stock) : p.stock,
        customizable: updates.customizable !== undefined ? Boolean(updates.customizable) : p.customizable,
      };
    });
    saveStore(db);
    return jsonResponse(200, { ok: true, products: db.products });
  }

  async function request(url, options = {}) {
    const method = String(options.method || 'GET').toUpperCase();
    const parsed = new URL(url, 'https://static.local');
    const body = options.body ? JSON.parse(options.body) : {};

    if (method === 'GET') return handleGet(parsed.pathname, parsed.searchParams);
    if (parsed.pathname === '/api/auth/login' || parsed.pathname === '/api/auth/social') {
      return handleAuth(parsed.pathname, body);
    }
    if (parsed.pathname === '/api/orders' && method === 'POST') {
      return handleOrders(body);
    }

    const orderStatusMatch = parsed.pathname.match(/^\/api\/orders\/([^/]+)\/status$/);
    if (orderStatusMatch && method === 'PATCH') {
      const id = decodeURIComponent(orderStatusMatch[1]);
      const nextStatus = body.status;
      const elapsedMap = { pending: 'รอคิว', in_progress: 'กำลังทำ', ready: 'พร้อมเสิร์ฟ', completed: 'เสร็จสิ้น' };
      db.orders = db.orders.map((o) =>
        o.id === id ? { ...o, status: nextStatus, timeElapsed: elapsedMap[nextStatus] || o.timeElapsed } : o
      );
      saveStore(db);
      return jsonResponse(200, { ok: true, orders: db.orders });
    }

    const voidMatch = parsed.pathname.match(/^\/api\/sales\/([^/]+)\/void$/);
    if (voidMatch && method === 'POST') {
      const manager = db.staffAccounts.find(
        (a) => a.role === 'admin' && (!a.authProvider || a.authProvider === 'local') && a.pin === String(body.pin || '')
      );
      if (!manager) return jsonResponse(403, { error: 'รหัส PIN ผู้จัดการไม่ถูกต้อง ไม่สามารถ Void บิลได้' });
      const rNo = decodeURIComponent(voidMatch[1]);
      db.salesHistory = db.salesHistory.map((s) =>
        s.receiptNo === rNo ? { ...s, status: 'voided', voidBy: manager.name, voidReason: body.reason || 'ลูกค้ายกเลิก' } : s
      );
      saveStore(db);
      return jsonResponse(200, { ok: true, salesHistory: db.salesHistory });
    }

    if (parsed.pathname === '/api/staff' && method === 'POST') {
      const role = body.role === 'Admin' || body.role === 'admin' ? 'admin' : body.role === 'Operator' ? 'operator' : 'cashier';
      const newStaff = {
        id: `staff-${db.staffAccounts.length + 1}`,
        username: String(body.username || '').trim(),
        pin: String(body.pin || '1234'),
        name: String(body.name || '').trim(),
        role,
        roleName: role === 'admin' ? 'เจ้าของร้าน' : role === 'operator' ? 'บาริสต้า/ครัว' : 'แคชเชียร์',
      };
      db.staffAccounts = [...db.staffAccounts, newStaff];
      saveStore(db);
      return jsonResponse(201, { staff: newStaff, staffAccounts: db.staffAccounts });
    }

    const prodResp = handleProductsMutation(method, parsed.pathname, body);
    if (prodResp) return prodResp;

    return jsonResponse(404, { error: 'Endpoint not found in static runtime' });
  }

  function reset() {
    db = createSeedState();
    saveStore(db);
  }

  globalScope.JamalStaticApi = { request, reset };
})(window);
