class CartModel {
  constructor(initialCart = []) {
    this.cart = initialCart.map((item) => ({ ...item }));
  }

  getItems() {
    return this.cart;
  }

  clear() {
    this.cart = [];
    return this.cart;
  }

  // Data Structure Method 1: เพิ่มสินค้าเข้าตะกร้าพร้อมท็อปปิ้ง
  addItem(product, optionsText = '', unitPrice = null, toppings = []) {
    if (!product || !product.id) return this.cart;
    const toppingsSum = toppings.reduce((sum, t) => sum + (Number(t.price) || 0), 0);
    const resolvedUnitPrice =
      unitPrice !== null ? Number(unitPrice) : (Number(product.price) || 0) + toppingsSum;

    const existingIdx = this.cart.findIndex(
      (item) => item.id === product.id && item.optionsText === optionsText
    );
    if (existingIdx > -1) {
      this.cart[existingIdx].quantity += 1;
    } else {
      this.cart.push({
        cartItemId: `${product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        id: product.id,
        name: product.name,
        category: product.category,
        basePrice: Number(product.price) || 0,
        toppingsPrice: toppingsSum,
        unitPrice: resolvedUnitPrice,
        optionsText,
        toppings: toppings.map((t) => ({ id: t.id, name: t.name, price: Number(t.price) || 0 })),
        quantity: 1,
        isBakery: Boolean(product.isBakery),
      });
    }
    return this.cart;
  }

  // Data Structure Method 2: อัปเดตจำนวนสินค้าในตะกร้า (ถ้า <= 0 ลบออก)
  updateItemQuantity(cartItemId, newQty) {
    if (Number(newQty) <= 0) {
      this.cart = this.cart.filter((item) => item.cartItemId !== cartItemId);
    } else {
      this.cart = this.cart.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: Number(newQty) } : item
      );
    }
    return this.cart;
  }

  // Calculation Method (ตาม Google Doc): คำนวณ Drink + Toppings, VAT 7% และเงินทอน
  calculateBill(cashReceived = 0) {
    const totalAmount = this.cart.reduce(
      (sum, item) => sum + Number(item.unitPrice) * Number(item.quantity),
      0
    );
    const toppingsTotal = this.cart.reduce(
      (sum, item) => sum + (Number(item.toppingsPrice) || 0) * Number(item.quantity),
      0
    );
    const totalItemsCount = this.cart.reduce((sum, item) => sum + Number(item.quantity), 0);
    const subtotal = Number((totalAmount / 1.07).toFixed(2));
    const vatAmount = Number((totalAmount - subtotal).toFixed(2));
    const paid = Number(cashReceived) || 0;
    const changeDue = paid >= totalAmount ? Number((paid - totalAmount).toFixed(2)) : 0;

    return {
      totalAmount: Number(totalAmount.toFixed(2)),
      toppingsTotal: Number(toppingsTotal.toFixed(2)),
      subtotal,
      vatAmount,
      totalItemsCount,
      cashReceived: paid,
      changeDue,
      isEnoughCash: paid >= totalAmount,
    };
  }

  // Search Method (ตาม Google Doc & Issue #12): ค้นหา Drink, Bakery และ Topping ด้วย keyword
  searchCatalog(products = [], toppings = [], keyword = '', category = 'all') {
    const q = String(keyword || '').trim().toLowerCase();
    const matchedProducts = products.filter((prod) => {
      const matchCat = category === 'all' || prod.category === category;
      const matchKey =
        !q ||
        String(prod.name || '').toLowerCase().includes(q) ||
        String(prod.desc || '').toLowerCase().includes(q) ||
        String(prod.category || '').toLowerCase().includes(q);
      return matchCat && matchKey;
    });

    const matchedToppings = toppings.filter((top) => {
      return !q || String(top.name || '').toLowerCase().includes(q);
    });

    return {
      products: matchedProducts,
      toppings: matchedToppings,
      totalMatches: matchedProducts.length + matchedToppings.length,
    };
  }
}

module.exports = CartModel;
