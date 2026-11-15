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

  test('sortInventorySmallToLarge sorts base drinks, cakes, and toppings ascending', () => {
    const model = new InventoryModel(seedProducts, seedToppings);
    const sorted = model.sortInventorySmallToLarge();
    expect(sorted.map((x) => x.id)).toEqual(['b1', 't1', 'c1']); // stocks: 2, 5, 20
    expect(sorted.map((x) => x.stock)).toEqual([2, 5, 20]);
    expect(sorted.map((x) => x.group)).toEqual(['cake/bakery', 'topping', 'base-drink']);
  });

  test('sortInventorySmallToLarge skips untracked items and follows stock changes', () => {
    const products = [...seedProducts, { id: 'u1', name: 'Free Water', category: 'non-coffee', price: 0, stock: null }];
    const model = new InventoryModel(products, seedToppings);
    expect(model.sortInventorySmallToLarge().map((x) => x.id)).toEqual(['b1', 't1', 'c1']);

    model.restockItem('b1', 30); // เค้กเหลือ 32 ต้องไปอยู่ท้ายสุด
    model.deductStock([{ id: 'c1', quantity: 19 }]); // เครื่องดื่มเหลือ 1 ต้องขึ้นมาอยู่หัวแถว
    expect(model.sortInventorySmallToLarge().map((x) => x.id)).toEqual(['c1', 't1', 'b1']);
  });

  test('restockItem adds stock to products and toppings and rejects bad input', () => {
    const model = new InventoryModel(seedProducts, seedToppings);
    expect(model.restockItem('t1', 10).item.stock).toBe(15);
    expect(model.restockItem('c1').item.stock).toBe(25); // ค่าเริ่มต้นเติมครั้งละ 5
    expect(model.restockItem('missing', 5).status).toBe(404);
    expect(model.restockItem('c1', 0).status).toBe(400);
    expect(model.restockItem('c1', 'abc').status).toBe(400);
    expect(stockOf(model.getState().products, 'c1')).toBe(25);
  });

  test('createProduct validates input and applies defaults', () => {
    const model = new InventoryModel(seedProducts, seedToppings);
    expect(model.createProduct().status).toBe(400);
    expect(model.createProduct({ name: '  ', price: 50 }).status).toBe(400);
    expect(model.createProduct({ name: 'Free', price: 0 }).status).toBe(400);
    expect(model.createProduct({ name: 'Bad', price: 50, stock: -1 }).status).toBe(400);

    const drink = model.createProduct({ name: 'Matcha', category: 'non-coffee', price: 85, stock: 10 });
    expect(drink.ok).toBe(true);
    expect(drink.status).toBe(201);
    expect(drink.product).toMatchObject({ name: 'Matcha', price: 85, stock: 10, isBakery: false, customizable: true });

    const cake = model.createProduct({ name: ' Tiramisu ', category: 'dessert', price: '120' });
    expect(cake.product).toMatchObject({ name: 'Tiramisu', price: 120, stock: 15, isBakery: true, customizable: false });
    expect(cake.product.id).not.toBe(drink.product.id);
    expect(model.getState().products).toHaveLength(4);
  });

  test('updateProduct edits price and category, keeps the id, and validates input', () => {
    const model = new InventoryModel(seedProducts, seedToppings);
    const updated = model.updateProduct('c1', { id: 'hacked', price: 95, category: 'bakery', name: 'Espresso Plus' });
    expect(updated.ok).toBe(true);
    expect(updated.product).toMatchObject({ id: 'c1', price: 95, name: 'Espresso Plus', isBakery: true });
    expect(model.getState().products.find((p) => p.id === 'hacked')).toBeUndefined();

    expect(model.updateProduct('missing', { price: 10 }).status).toBe(404);
    expect(model.updateProduct('c1', { price: -5 }).status).toBe(400);
    expect(model.updateProduct('c1', { name: '   ' }).status).toBe(400);
    expect(model.updateProduct('c1', { stock: -2 }).status).toBe(400);
    expect(model.updateProduct('c1', { stock: 7, customizable: false }).product).toMatchObject({ stock: 7, customizable: false });
    expect(model.updateProduct('c1').product.price).toBe(95);
  });

  test('deleteProduct removes the product and returns 404 for an unknown id', () => {
    const model = new InventoryModel(seedProducts, seedToppings);
    const created = model.createProduct({ name: 'Matcha', category: 'non-coffee', price: 85, stock: 10 });
    expect(model.deleteProduct(created.product.id).ok).toBe(true);
    expect(model.getState().products.map((p) => p.id)).toEqual(['c1', 'b1']);
    expect(model.deleteProduct('missing').status).toBe(404);
  });

  test('recordSale adds a paid bill and updates the sales stats', () => {
    const model = new InventoryModel(seedProducts, seedToppings, [], { totalSales: 100, totalBills: 4 });
    const record = model.recordSale({
      totalAmount: 150,
      items: [{ name: 'Espresso', quantity: 2 }, { name: 'Croissant' }],
      paymentMethod: 'เงินสด',
      queueNo: 'A05',
      cashierName: 'Zai',
      time: '09:30',
    });
    expect(record).toMatchObject({ status: 'paid', total: 150, queueNo: 'A05', time: '09:30', cashier: 'Zai' });
    expect(record.itemsSummary).toBe('Espresso (x2), Croissant (x1)');
    expect(record.receiptNo).toMatch(/^INV-\d{8}-0005$/);
    expect(model.getState().salesStats).toMatchObject({ totalSales: 250, totalBills: 5 });
    expect(model.getState().salesHistory[0]).toBe(record);

    const defaults = model.recordSale();
    expect(defaults).toMatchObject({ total: 0, paymentMethod: 'PromptPay', queueNo: 'A01', cashier: 'Cashier' });
    expect(defaults.time).toMatch(/^\d{2}:\d{2}$/);
  });

  test('voidSale and getSalesAnalytics calculate min, max, and average bill', () => {
    const model = new InventoryModel(seedProducts, seedToppings, seedSales);
    const analytics = model.getSalesAnalytics();
    expect(analytics.averageBill).toBe(107.5);
    expect(analytics.minBill).toBe(65);
    expect(analytics.maxBill).toBe(150);
    expect(analytics.paidCount).toBe(2);
    expect(analytics.totalPaidRevenue).toBe(215);

    const voided = model.voidSale('INV-1', 'Admin Zai', 'ลูกค้ายกเลิก');
    expect(voided.ok).toBe(true);
    expect(voided.salesHistory.find((s) => s.receiptNo === 'INV-1')).toMatchObject({
      status: 'voided',
      voidBy: 'Admin Zai',
      voidReason: 'ลูกค้ายกเลิก',
    });
    expect(model.getSalesAnalytics()).toMatchObject({ paidCount: 1, averageBill: 65, minBill: 65, maxBill: 65 });

    expect(model.voidSale('INV-1').status).toBe(409);
    expect(model.voidSale('INV-404').status).toBe(404);
    model.voidSale('INV-2');
    expect(model.getSalesAnalytics()).toEqual({ totalPaidRevenue: 0, paidCount: 0, averageBill: 0, minBill: 0, maxBill: 0 });
  });
});
