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

  test('advanceOrderStatus transitions valid statuses and rejects invalid input', async () => {
    const queue = new OrderQueueModel(seed, 5);
    const ok = queue.advanceOrderStatus('ord-1', 'in_progress');
    expect(ok.ok).toBe(true);
    expect(ok.order.status).toBe('in_progress');

    expect(queue.advanceOrderStatus('ord-1', 'ready').order.timeElapsed).toBe('พร้อมเสิร์ฟแล้ว');
    expect(queue.advanceOrderStatus('ord-1', 'pending').order.timeElapsed).toBe('เพิ่งสั่ง (0 นาที)');
    expect(queue.advanceOrderStatus('ord-1', 'completed').order.timeElapsed).toBe('เสร็จสิ้น');
    expect(queue.advanceOrderStatus('ord-1', 'bad_status').status).toBe(400);
    expect(queue.advanceOrderStatus('not-found', 'ready').status).toBe(404);

    const patchOk = await request(app)
      .patch('/api/orders/ord-a04/status')
      .send({ status: 'in_progress' });
    expect(patchOk.statusCode).toBe(200);
    expect(patchOk.body.ok).toBe(true);

    const patchBad = await request(app)
      .patch('/api/orders/ord-a04/status')
      .send({ status: 'invalid_state' });
    expect(patchBad.statusCode).toBe(400);
  });
});
