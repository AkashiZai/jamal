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
}

module.exports = CartModel;
