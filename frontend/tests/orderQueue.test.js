const request = require('supertest');
const OrderQueueModel = require('../models/OrderQueueModel');
const app = require('../server');

describe('OrderQueueModel Unit Tests', () => {
  const seed = [
    { id: 'ord-1', queueNo: 'A01', status: 'pending', totalAmount: 100, items: [] },
    { id: 'ord-2', queueNo: 'A02', status: 'in_progress', totalAmount: 200, items: [] },
  ];

  test('enqueueOrder generates sequential queue numbers and sets status to pending', async () => {
    const queue = new OrderQueueModel(seed, 5);
    const created = queue.enqueueOrder({
      items: [{ name: 'เอสเพรสโซ่เย็น', quantity: 1, category: 'coffee' }],
      totalAmount: 65,
      paymentMethod: 'PromptPay',
    });

    expect(created.queueNo).toBe('A05');
    expect(created.status).toBe('pending');
    expect(queue.getAll()).toHaveLength(3);

    const apiRes = await request(app)
      .post('/api/orders')
      .send({
        items: [{ id: 'c1', name: 'เอสเพรสโซ่เย็น', quantity: 1, category: 'coffee' }],
        totalAmount: 65,
        paymentMethod: 'PromptPay',
      });
    expect(apiRes.statusCode).toBe(201);
    expect(apiRes.body.order.queueNo).toBe('A05');

    const oosRes = await request(app)
      .post('/api/orders')
      .send({
        items: [{ id: 'b1', name: 'ครัวซองต์เนยสด AOP', quantity: 999, category: 'bakery' }],
        totalAmount: 85,
      });
    expect(oosRes.statusCode).toBe(400);
  });
});
