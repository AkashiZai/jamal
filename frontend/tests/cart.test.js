const request = require('supertest');
const CartModel = require('../models/CartModel');
const app = require('../server');

describe('CartModel Unit Tests', () => {
  const sampleProducts = [
    { id: 'c1', name: 'เอสเพรสโซ่เย็น (Iced Espresso)', category: 'coffee', price: 65, desc: 'เมล็ดคั่วกลาง' },
    { id: 'b1', name: 'ครัวซองต์เนยสด AOP', category: 'bakery', price: 85, desc: 'เนยสดฝรั่งเศส', isBakery: true },
  ];
  const sampleToppings = [
    { id: 't1', name: 'นมโอ๊ต (Oat Milk)', price: 15, stock: 20 },
    { id: 't3', name: 'เพิ่มช็อตเอสเพรสโซ่ (Extra Shot)', price: 20, stock: 30 },
  ];

  test('addItem adds drink with toppings, ignores invalid items, and merges identical option lines', () => {
    const cart = new CartModel([{ cartItemId: 'seed-1', id: 'b1', unitPrice: 85, quantity: 1 }]);
    expect(cart.clear()).toEqual([]);

    expect(cart.addItem(null)).toEqual([]);
    cart.addItem(sampleProducts[0], 'หวาน 25% • นมโอ๊ต', null, [sampleToppings[0]]);
    cart.addItem(sampleProducts[0], 'หวาน 25% • นมโอ๊ต', null, [sampleToppings[0]]);
    cart.addItem(sampleProducts[1], '', 85);

    expect(cart.getItems()).toHaveLength(2);
    expect(cart.getItems()[0].quantity).toBe(2);
    expect(cart.getItems()[0].unitPrice).toBe(80);
  });

  test('updateItemQuantity updates qty and removes item when qty <= 0', () => {
    const cart = new CartModel();
    cart.addItem(sampleProducts[0], 'หวาน 25%', 65, []);
    cart.addItem(sampleProducts[1], '', 85, []);
    const itemId = cart.getItems()[1].cartItemId;

    cart.updateItemQuantity(itemId, 3);
    expect(cart.getItems()[1].quantity).toBe(3);

    cart.updateItemQuantity(itemId, 0);
    expect(cart.getItems()).toHaveLength(1);
  });

  test('calculateBill computes drink+toppings, VAT 7%, and change due correctly', () => {
    const cart = new CartModel();
    cart.addItem(sampleProducts[0], 'หวาน 25% • เพิ่มช็อต', null, [sampleToppings[1]]);
    cart.addItem(sampleProducts[1], '', 85, []);

    const bill = cart.calculateBill(200);
    expect(bill.totalAmount).toBe(170); // (65+20) + 85
    expect(bill.toppingsTotal).toBe(20);
    expect(bill.changeDue).toBe(30);
    expect(bill.isEnoughCash).toBe(true);
    expect(bill.vatAmount).toBeGreaterThan(0);

    const shortBill = cart.calculateBill(100);
    expect(shortBill.isEnoughCash).toBe(false);
    expect(shortBill.changeDue).toBe(0);
  });

  test('searchCatalog and GET /api/catalog/search match drinks, bakery, and toppings by keyword', async () => {
    const cart = new CartModel();
    const res1 = cart.searchCatalog(sampleProducts, sampleToppings, 'โอ๊ต');
    expect(res1.toppings).toHaveLength(1);
    expect(res1.toppings[0].id).toBe('t1');

    const res2 = cart.searchCatalog(sampleProducts, sampleToppings, 'ครัวซองต์', 'bakery');
    expect(res2.products).toHaveLength(1);
    expect(res2.products[0].id).toBe('b1');

    const allRes = cart.searchCatalog(sampleProducts, sampleToppings);
    expect(allRes.totalMatches).toBe(4);

    const stateRes = await request(app).get('/api/state');
    expect(stateRes.statusCode).toBe(200);
    expect(stateRes.body.products.length).toBeGreaterThanOrEqual(11);
    expect(stateRes.body.toppings.length).toBeGreaterThanOrEqual(4);

    const apiSearch = await request(app).get('/api/catalog/search').query({ q: 'โอ๊ต' });
    expect(apiSearch.statusCode).toBe(200);
    expect(apiSearch.body.toppings.length).toBe(1);
  });
});
