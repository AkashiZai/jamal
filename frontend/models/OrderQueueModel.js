const VALID_STATUSES = ['pending', 'in_progress', 'ready', 'completed'];

class OrderQueueModel {
  constructor(initialOrders = [], initialSequence = 5) {
    this.orders = initialOrders.map((ord) => ({ ...ord }));
    this.queueSequence = initialSequence;
  }

  getAll() {
    return this.orders;
  }
}

module.exports = OrderQueueModel;
