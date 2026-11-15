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
}

module.exports = InventoryModel;
