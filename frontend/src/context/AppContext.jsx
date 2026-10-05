import React, { createContext, useContext, useState, useCallback } from 'react';
import { PRODUCTS } from '../data/products';

const AppContext = createContext(null);

// Initial KDS Queue orders matching Figma 03_kitchen_kds_queue.svg
const INITIAL_ORDERS = [
  {
    id: 'ord-a04',
    queueNo: 'A04',
    createdAt: '14:40',
    timeElapsed: '1 นาที',
    status: 'pending', // 'pending' | 'in_progress' | 'ready' | 'completed'
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

// Initial Sales History matching Figma & TOR FR-08
const INITIAL_SALES_HISTORY = [
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

export function AppProvider({ children }) {
  // 1. Live Products Catalog & Stock (FR-02, FR-03)
  const [products, setProducts] = useState(PRODUCTS);

  // 2. Kitchen KDS Orders (TOR Operator 1-5)
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [queueSequence, setQueueSequence] = useState(5); // Next is A05

  // 3. Sales Stats & Audit History (FR-07, FR-08)
  const [salesStats, setSalesStats] = useState({
    totalSales: 14250.0,
    totalBills: 84,
    promptPayShare: 64, // %
    cashShare: 36, // %
  });
  const [salesHistory, setSalesHistory] = useState(INITIAL_SALES_HISTORY);

  // 4. Customer Mobile Live Queue Tracker
  const [customerQueueNo, setCustomerQueueNo] = useState('A03');

  // Play audio chime when order state changes or new order arrives
  const playChime = useCallback((type = 'notification') => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'bell') {
        // High double chime
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        osc.frequency.setValueAtTime(1318.51, audioCtx.currentTime + 0.15); // E6
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      } else {
        // Success mellow chime
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      }
    } catch {
      // Audio context might be restricted before user gesture
    }
  }, []);

  // Action: Add new order (from Cashier POS or Customer Mobile)
  const createOrder = useCallback(
    ({ items, totalAmount, paymentMethod, tableNo = 'หน้าร้าน', channel = 'หน้าร้าน (POS)', cashierName = 'Cashier' }) => {
      const qNum = `A${String(queueSequence).padStart(2, '0')}`;
      setQueueSequence((prev) => prev + 1);

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newOrder = {
        id: `ord-${Date.now()}`,
        queueNo: qNum,
        createdAt: timeStr,
        timeElapsed: 'เพิ่งสั่ง (0 นาที)',
        status: 'pending',
        tableNo,
        channel,
        cashierName,
        items: items.map((it) => ({
          name: it.name,
          quantity: it.quantity,
          optionsText: it.optionsText || (it.category === 'bakery' ? 'อบอุ่นร้อน' : 'ปกติ'),
          isBeverage: it.category === 'coffee' || it.category === 'non-coffee',
          isBakery: it.isBakery || it.category === 'bakery' || it.category === 'dessert',
        })),
        totalAmount,
        paymentMethod: paymentMethod || 'PromptPay',
      };

      // 1. Add to KDS
      setOrders((prev) => [newOrder, ...prev]);

      // 2. Deduct bakery stock (FR-03)
      setProducts((prevProducts) =>
        prevProducts.map((p) => {
          const itemInCart = items.find((it) => it.id === p.id);
          if (itemInCart && p.stock !== null) {
            return {
              ...p,
              stock: Math.max(0, p.stock - itemInCart.quantity),
            };
          }
          return p;
        })
      );

      // 3. Update Sales Stats & History
      setSalesStats((prev) => ({
        ...prev,
        totalSales: prev.totalSales + totalAmount,
        totalBills: prev.totalBills + 1,
      }));

      const newHistoryItem = {
        receiptNo: `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(salesStats.totalBills + 1).padStart(4, '0')}`,
        time: timeStr,
        queueNo: qNum,
        itemsSummary: items.map((i) => `${i.name} (x${i.quantity})`).join(', '),
        paymentMethod: paymentMethod || 'PromptPay',
        total: totalAmount,
        status: 'paid',
        cashier: cashierName,
      };
      setSalesHistory((prev) => [newHistoryItem, ...prev]);

      // If customer mobile ordered, track this queue
      if (channel.includes('Mobile')) {
        setCustomerQueueNo(qNum);
      }

      playChime('bell');
      return newOrder;
    },
    [queueSequence, salesStats.totalBills, playChime]
  );

  // Action: Advance order status in Kitchen KDS (pending -> in_progress -> ready -> completed)
  const updateOrderStatus = useCallback(
    (orderId, newStatus) => {
      setOrders((prevOrders) =>
        prevOrders.map((ord) => {
          if (ord.id === orderId) {
            return {
              ...ord,
              status: newStatus,
              timeElapsed:
                newStatus === 'in_progress'
                  ? 'กำลังทำ (0 นาที)'
                  : newStatus === 'ready'
                  ? 'พร้อมเสิร์ฟแล้ว'
                  : 'เสร็จสิ้น',
            };
          }
          return ord;
        })
      );
      playChime('notification');
    },
    [playChime]
  );

  // Action: Restock Bakery Item (FR-03)
  const restockProduct = useCallback((productId, amount) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const current = p.stock ?? 0;
          return {
            ...p,
            stock: current + amount,
          };
        }
        return p;
      })
    );
  }, []);

  // Action: Update Product Price (FR-02)
  const updateProductPrice = useCallback((productId, newPrice) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, price: Number(newPrice) } : p))
    );
  }, []);

  // Action: Void Transaction with Admin PIN (FR-07)
  const voidOrder = useCallback((receiptNo, adminName = 'Admin Zai', reason = 'ยกเลิกโดยผู้จัดการ') => {
    setSalesHistory((prev) =>
      prev.map((item) => {
        if (item.receiptNo === receiptNo) {
          return {
            ...item,
            status: 'voided',
            voidBy: adminName,
            voidReason: reason,
          };
        }
        return item;
      })
    );
  }, []);

  // Action: Add New Product (FR-02)
  const addProduct = useCallback((newProduct) => {
    setProducts((prev) => [
      ...prev,
      {
        ...newProduct,
        id: `p-${Date.now()}`,
        stock: newProduct.stock !== undefined ? newProduct.stock : null,
      },
    ]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        addProduct,
        orders,
        setOrders,
        createOrder,
        updateOrderStatus,
        salesStats,
        salesHistory,
        restockProduct,
        updateProductPrice,
        voidOrder,
        customerQueueNo,
        setCustomerQueueNo,
        playChime,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
