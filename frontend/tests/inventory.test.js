const InventoryModel = require('../models/InventoryModel');

describe('InventoryModel Unit Tests', () => {
  // ข้อมูลตั้งต้น: เครื่องดื่ม 1 รายการ, เค้ก/เบเกอรี่ 1 รายการ, ท็อปปิ้ง 1 รายการ และบิลขาย 2 ใบ
  const seedProducts = [
    { id: 'c1', name: 'Espresso', category: 'coffee', price: 65, stock: 20, isBakery: false },
    { id: 'b1', name: 'Croissant', category: 'bakery', price: 85, stock: 2, isBakery: true },
  ];
  const seedToppings = [{ id: 't1', name: 'Oat Milk', price: 15, stock: 5 }];
  const seedSales = [
    { receiptNo: 'INV-1', total: 150, status: 'paid' },
    { receiptNo: 'INV-2', total: 65, status: 'paid' },
  ];

  const stockOf = (list, id) => list.find((x) => x.id === id).stock;

  test('deductStock updates drink, cake, and topping stock and blocks out-of-stock', () => {
    const model = new InventoryModel(seedProducts, seedToppings, seedSales);
    const ok = model.deductStock([
      { id: 'c1', quantity: 2, toppings: [{ id: 't1' }] },
      { id: 'b1', quantity: 1 },
    ]);
    expect(ok.ok).toBe(true);
    expect(stockOf(ok.products, 'c1')).toBe(18);
    expect(stockOf(ok.products, 'b1')).toBe(1);
    expect(stockOf(ok.toppings, 't1')).toBe(3);

    const fail = model.deductStock([{ id: 'b1', quantity: 5 }]);
    expect(fail.ok).toBe(false);
    expect(fail.status).toBe(400);
    expect(fail.error).toContain('Croissant');
    expect(stockOf(model.getState().products, 'b1')).toBe(1);
  });

  test('deductStock blocks the whole order when a topping runs out and keeps stock unchanged', () => {
    const model = new InventoryModel(seedProducts, seedToppings);
    const fail = model.deductStock([
      { id: 'c1', quantity: 6, toppings: [{ id: 't1' }] },
      { id: 'b1', quantity: 1 },
    ]);
    expect(fail.ok).toBe(false);
    expect(fail.error).toContain('Oat Milk');
    expect(stockOf(model.getState().products, 'c1')).toBe(20);
    expect(stockOf(model.getState().products, 'b1')).toBe(2);
    expect(stockOf(model.getState().toppings, 't1')).toBe(5);
  });

  test('deductStock adds up the same item across several cart lines before checking', () => {
    const model = new InventoryModel(seedProducts, seedToppings);
    const fail = model.deductStock([
      { id: 'b1', quantity: 1, toppings: [] },
      { id: 'b1', quantity: 2, toppings: [] },
    ]);
    expect(fail.ok).toBe(false); // 1 + 2 = 3 มากกว่าสต็อก 2

    const ok = model.deductStock([
      { id: 'b1', quantity: 1 },
      { id: 'b1', quantity: 1 },
    ]);
    expect(ok.ok).toBe(true);
    expect(stockOf(ok.products, 'b1')).toBe(0);
  });

  test('deductStock ignores untracked and unknown items and treats a bad quantity as 1', () => {
    const products = [...seedProducts, { id: 'u1', name: 'Free Water', category: 'non-coffee', price: 0, stock: null }];
    const model = new InventoryModel(products, seedToppings);
    const result = model.deductStock([
      { id: 'u1', quantity: 99 },
      { id: 'unknown', quantity: 1, toppings: [{ id: 'no-such-topping' }] },
      { id: 'c1', quantity: -3 },
      { id: 'c1' },
    ]);
    expect(result.ok).toBe(true);
    expect(stockOf(result.products, 'u1')).toBeNull();
    expect(stockOf(result.products, 'c1')).toBe(18);
    expect(model.deductStock().ok).toBe(true);
  });
});
