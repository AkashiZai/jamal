// ============================================================================
// InventoryModel — Data Structure ของส่วนที่ 4 (Admin Portal, สต็อก & ตรวจสอบ Void)
// ผู้รับผิดชอบ: @Kizizi123123 | ตาม Change Request #12 และ User Story #10
// ดูแลสต็อก Base Drink / Cake / Toppings, เรียงสต็อกน้อยไปมาก, Admin CRUD และยอดขาย/Void
// ============================================================================

const BAKERY_CATEGORIES = ['bakery', 'dessert'];
const DEFAULT_RESTOCK_AMOUNT = 5;
const DEFAULT_NEW_PRODUCT_STOCK = 15;

// จำนวนต่อรายการต้องเป็นเลขบวก ถ้าไม่ใช่ให้นับเป็น 1 (กันค่าติดลบไปเพิ่มสต็อกโดยไม่ตั้งใจ)
function toQuantity(value) {
  const qty = Number(value);
  return Number.isFinite(qty) && qty > 0 ? qty : 1;
}

// สต็อกที่เป็นตัวเลขเท่านั้นที่ถูกนับ/ตัดสต็อก (ค่า null = ไม่จำกัดจำนวน)
function isTracked(item) {
  return typeof item.stock === 'number';
}

function isBakeryItem(product) {
  return Boolean(product.isBakery) || BAKERY_CATEGORIES.includes(product.category);
}

class InventoryModel {
  constructor(
    initialProducts = [],
    initialToppings = [],
    initialSalesHistory = [],
    initialSalesStats = { totalSales: 0, totalBills: 0, promptPayShare: 64, cashShare: 36 }
  ) {
    this.products = initialProducts.map((p) => ({ ...p }));
    this.toppings = initialToppings.map((t) => ({ ...t }));
    this.salesHistory = initialSalesHistory.map((s) => ({ ...s }));
    this.salesStats = { ...initialSalesStats };
    this.productSequence = 0;
  }

  getState() {
    return {
      products: this.products,
      toppings: this.toppings,
      salesHistory: this.salesHistory,
      salesStats: this.salesStats,
    };
  }

  // Data Structure Method 1: ตัดสต็อก Base Drink, Cake และ Toppings พร้อมเช็ก Out of Stock
  // รวมจำนวนที่ต้องใช้ของทุกบรรทัดในออเดอร์ก่อน แล้วค่อยตรวจ เพื่อกันกรณีสินค้าเดียวกันอยู่หลายบรรทัด
  deductStock(orderItems = []) {
    const demand = this.collectDemand(orderItems);
    const shortage = this.findShortage(demand);
    if (shortage) return { ok: false, status: 400, error: shortage };

    this.products = this.products.map((p) => this.withDeductedStock(p, demand.products));
    this.toppings = this.toppings.map((t) => this.withDeductedStock(t, demand.toppings));
    return { ok: true, products: this.products, toppings: this.toppings };
  }

  // รวมจำนวนที่ใช้ต่อสินค้า (products) และต่อท็อปปิ้ง (toppings) จากทุกบรรทัดของออเดอร์
  collectDemand(orderItems) {
    const demand = { products: new Map(), toppings: new Map() };
    const add = (map, id, qty) => map.set(id, (map.get(id) || 0) + qty);
    for (const item of orderItems) {
      const qty = toQuantity(item.quantity);
      add(demand.products, item.id, qty);
      const toppingIds = new Set((item.toppings || []).map((t) => t.id));
      toppingIds.forEach((id) => add(demand.toppings, id, qty));
    }
    return demand;
  }

  // คืนข้อความ error ของรายการแรกที่สต็อกไม่พอ (หรือ null ถ้าสต็อกพอทุกรายการ)
  findShortage(demand) {
    for (const [id, qty] of demand.products) {
      const prod = this.products.find((p) => p.id === id);
      if (prod && isTracked(prod) && prod.stock < qty) {
        return `สินค้า "${prod.name}" หมดหรือสต็อกไม่พอ (คงเหลือ ${prod.stock})`;
      }
    }
    for (const [id, qty] of demand.toppings) {
      const top = this.toppings.find((t) => t.id === id);
      if (top && isTracked(top) && top.stock < qty) {
        return `ท็อปปิ้ง "${top.name}" หมดหรือสต็อกไม่พอ (คงเหลือ ${top.stock})`;
      }
    }
    return null;
  }

  withDeductedStock(item, demandMap) {
    const qty = demandMap.get(item.id);
    if (!qty || !isTracked(item)) return item;
    return { ...item, stock: Math.max(0, item.stock - qty) };
  }

  // Data Structure Method 2: เติมสต็อกได้ทั้ง Product และ Topping
  restockItem(id, amount = DEFAULT_RESTOCK_AMOUNT) {
    const qty = Number(amount);
    if (!Number.isFinite(qty) || qty <= 0) {
      return { ok: false, status: 400, error: 'จำนวนที่เติมต้องมากกว่า 0' };
    }
    let updatedItem = null;
    const addStock = (list) =>
      list.map((item) => {
        if (item.id !== id) return item;
        updatedItem = { ...item, stock: (item.stock ?? 0) + qty };
        return updatedItem;
      });

    this.products = addStock(this.products);
    if (!updatedItem) this.toppings = addStock(this.toppings);
    if (!updatedItem) return { ok: false, status: 404, error: 'ไม่พบรายการสินค้า/ท็อปปิ้ง' };
    return { ok: true, item: updatedItem, products: this.products, toppings: this.toppings };
  }
}

module.exports = InventoryModel;
