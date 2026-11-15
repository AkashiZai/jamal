const VALID_STATUSES = ['pending', 'in_progress', 'ready', 'completed'];

class OrderQueueModel {
  constructor(initialOrders = [], initialSequence = 5) {
    this.orders = initialOrders.map((ord) => ({ ...ord }));
    this.queueSequence = initialSequence;
  }

  getAll() {
    return this.orders;
  }

  // Data Structure Method 1: เพิ่มออเดอร์ใหม่เข้าหัวคิว FIFO พร้อมสร้างเลขคิว
  enqueueOrder({
    items = [],
    totalAmount = 0,
    paymentMethod = 'PromptPay',
    tableNo = 'หน้าร้าน',
    channel = 'หน้าร้าน (POS)',
    cashierName = 'Cashier',
  } = {}) {
    const qNum = `A${String(this.queueSequence).padStart(2, '0')}`;
    this.queueSequence += 1;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder = {
      id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      queueNo: qNum,
      createdAt: timeStr,
      timeElapsed: 'เพิ่งสั่ง (0 นาที)',
      status: 'pending',
      tableNo,
      channel,
      cashierName,
      items: items.map((it) => ({
        name: it.name,
        quantity: Number(it.quantity) || 1,
        optionsText: it.optionsText || (it.category === 'bakery' ? 'อบอุ่นร้อน' : 'ปกติ'),
        toppings: Array.isArray(it.toppings) ? it.toppings : [],
        isBeverage: it.category === 'coffee' || it.category === 'non-coffee',
        isBakery: Boolean(it.isBakery || it.category === 'bakery' || it.category === 'dessert'),
      })),
      totalAmount: Number(totalAmount) || 0,
      paymentMethod,
    };

    this.orders = [newOrder, ...this.orders];
    return newOrder;
  }

  // Data Structure Method 2: เปลี่ยนสถานะออเดอร์ใน KDS
  advanceOrderStatus(orderId, nextStatus) {
    if (!VALID_STATUSES.includes(nextStatus)) {
      return { ok: false, status: 400, error: 'สถานะออเดอร์ไม่ถูกต้อง' };
    }
    const target = this.orders.find((ord) => ord.id === orderId);
    if (!target) {
      return { ok: false, status: 404, error: 'ไม่พบหมายเลขออเดอร์นี้ในคิว' };
    }

    this.orders = this.orders.map((ord) => {
      if (ord.id !== orderId) return ord;
      return {
        ...ord,
        status: nextStatus,
        timeElapsed:
          nextStatus === 'in_progress'
            ? 'กำลังทำ (0 นาที)'
            : nextStatus === 'ready'
              ? 'พร้อมเสิร์ฟแล้ว'
              : nextStatus === 'pending'
                ? 'เพิ่งสั่ง (0 นาที)'
                : 'เสร็จสิ้น',
      };
    });

    const updated = this.orders.find((ord) => ord.id === orderId);
    return { ok: true, status: 200, order: updated, orders: this.orders };
  }

  // Search Method: กรอง/ค้นหาออเดอร์ตามสถานะ
  findOrdersByStatus(status = 'all') {
    if (!status || status === 'all') return this.orders;
    return this.orders.filter((ord) => ord.status === status);
  }

  // Calculation Method: สรุปจำนวนแต่ละสถานะ + avg/min/max ยอดออเดอร์
  getQueueStats() {
    const counts = { pending: 0, in_progress: 0, ready: 0, completed: 0 };
    if (this.orders.length === 0) {
      return { totalOrders: 0, counts, averageAmount: 0, minAmount: 0, maxAmount: 0 };
    }

    let sum = 0;
    let min = Infinity;
    let max = -Infinity;

    for (const ord of this.orders) {
      if (counts[ord.status] !== undefined) counts[ord.status] += 1;
      const amt = Number(ord.totalAmount) || 0;
      sum += amt;
      if (amt < min) min = amt;
      if (amt > max) max = amt;
    }

    return {
      totalOrders: this.orders.length,
      counts,
      averageAmount: Number((sum / this.orders.length).toFixed(2)),
      minAmount: min,
      maxAmount: max,
    };
  }
}

module.exports = OrderQueueModel;
