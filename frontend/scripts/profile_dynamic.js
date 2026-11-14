const { performance } = require('perf_hooks');
const request = require('supertest');
const app = require('../server');
const CartModel = require('../models/CartModel');

async function runDynamicProfile() {
  const results = [];

  // 1. Structural Timing: CartModel 1,000 iterations
  const t0 = performance.now();
  const cart = new CartModel();
  for (let i = 0; i < 1000; i += 1) {
    cart.addItem({ id: `p-${i}`, name: 'Espresso', category: 'coffee', price: 65 }, '25%', 65, [
      { id: 't1', name: 'Oat', price: 15 },
    ]);
    cart.calculateBill(100000);
  }
  const t1 = performance.now();
  results.push({ target: 'CartModel (1000 addItem + calculateBill)', durationMs: (t1 - t0).toFixed(2) });

  // 2. HTTP Route Timing: GET /api/state (50 requests)
  const t2 = performance.now();
  for (let i = 0; i < 50; i += 1) {
    await request(app).get('/api/state');
  }
  const t3 = performance.now();
  results.push({ target: 'GET /api/state (50 reqs)', durationMs: (t3 - t2).toFixed(2) });

  // 3. Memory Snapshot
  const mem = process.memoryUsage();
  results.push({
    target: 'Heap Used (MB)',
    durationMs: (mem.heapUsed / 1024 / 1024).toFixed(2),
  });

  console.table(results);
}

runDynamicProfile();
