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
}

module.exports = CartModel;
