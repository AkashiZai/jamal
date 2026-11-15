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
        isBeverage: it.category === 'coffee' || it.category === 'non-coffee',
        isBakery: Boolean(it.isBakery || it.category === 'bakery' || it.category === 'dessert'),
      })),
      totalAmount: Number(totalAmount) || 0,
      paymentMethod,
    };

    this.orders = [newOrder, ...this.orders];
    return newOrder;
  }
}

module.exports = OrderQueueModel;
