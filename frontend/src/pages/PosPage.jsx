import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, RefreshCw, AlertCircle, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../data/products';
import ProductCard from '../components/ProductCard';
import CustomizationModal from '../components/CustomizationModal';
import CartSidebar from '../components/CartSidebar';
import PaymentModal from '../components/PaymentModal';

export default function PosPage({ currentUser, onTimeoutWarning }) {
  const [productsList, setProductsList] = useState(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customizingProduct, setCustomizingProduct] = useState(null);
  
  // Cart state
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState('dine-in'); // 'dine-in' | 'takeaway'
  
  // Checkout & Payment Modal state
  const [activeCheckoutSummary, setActiveCheckoutSummary] = useState(null);
  const [lastCompletedOrder, setLastCompletedOrder] = useState(null);

  // Filter products by category & search query (instant reactive filter < 1s per NFR-01)
  const filteredProducts = useMemo(() => {
    return productsList.filter((prod) => {
      const matchCategory =
        selectedCategory === 'all' || prod.category === selectedCategory;
      const matchQuery =
        !searchQuery.trim() ||
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [productsList, selectedCategory, searchQuery]);

  // Handle product click
  const handleSelectProduct = (product) => {
    if (product.customizable) {
      setCustomizingProduct(product);
    } else {
      // Add directly to cart
      addToCart(product, {
        optionsText: '',
        unitPrice: product.price,
      });
    }
  };

  // Add item with options into cart
  const addToCart = (product, { optionsText, unitPrice }) => {
    setCart((prevCart) => {
      // Check if identical product + customization already exists in cart
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.optionsText === optionsText
      );

      if (existingIndex > -1) {
        const nextCart = [...prevCart];
        nextCart[existingIndex] = {
          ...nextCart[existingIndex],
          quantity: nextCart[existingIndex].quantity + 1,
        };
        return nextCart;
      }

      // New line item
      return [
        ...prevCart,
        {
          cartItemId: `${product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          id: product.id,
          name: product.name,
          category: product.category,
          unitPrice,
          optionsText,
          quantity: 1,
          isBakery: product.isBakery || false,
        },
      ];
    });
  };

  // Update item quantity
  const handleUpdateQty = (cartItemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  // Remove line item
  const handleRemoveItem = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  // Clear entire cart
  const handleClearCart = () => {
    if (cart.length > 0 && window.confirm('ต้องการล้างรายการในบิลทั้งหมดหรือไม่?')) {
      setCart([]);
    }
  };

  // Trigger Checkout
  const handleInitiateCheckout = (summary) => {
    setActiveCheckoutSummary(summary);
  };

  // Payment completed successfully (FR-03 Inventory Deduction)
  const handlePaymentSuccess = ({ method, total, change }) => {
    // Deduct stock for sold items in inventory
    setProductsList((prevProducts) => {
      return prevProducts.map((p) => {
        // Count how many of this item were in the cart
        const cartQty = cart
          .filter((ci) => ci.id === p.id)
          .reduce((sum, ci) => sum + ci.quantity, 0);

        if (p.stock !== null && cartQty > 0) {
          const newStock = Math.max(0, p.stock - cartQty);
          return {
            ...p,
            stock: newStock,
          };
        }
        return p;
      });
    });

    setLastCompletedOrder({
      orderId: `#JM-${Date.now().toString().slice(-6)}`,
      total,
      time: new Date().toLocaleTimeString('th-TH'),
      itemCount: cart.reduce((s, i) => s + i.quantity, 0),
    });

    // Clear cart after checkout completes
    setCart([]);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-65px)] overflow-hidden bg-cream">
      {/* LEFT SECTION: Catalog & Touch Filters */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Controls: Search Bar & Info */}
        <div className="p-4 sm:p-5 bg-white border-b border-cream-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-warmgray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อสินค้า (เช่น ลาเต้, ครัวซองต์, ชีสเค้ก)..."
              className="w-full pl-10 pr-4 py-2.5 bg-cream-50 border border-cream-300 rounded-2xl text-xs sm:text-sm font-semibold text-espresso-900 focus:outline-none focus:ring-2 focus:ring-terracotta"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-warmgray-400 hover:text-espresso-900"
              >
                ล้าง
              </button>
            )}
          </div>

          {/* Quick Info & Feedback */}
          <div className="flex items-center gap-2 text-xs text-warmgray-500">
            <span className="font-mono bg-cream-200 px-2.5 py-1 rounded-xl text-espresso-900 font-bold">
              พบ {filteredProducts.length} รายการ
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">NFR-01 ตอบสนองทันที (&lt;1s)</span>
          </div>
        </div>

        {/* Category Pills Bar (Touchscreen Optimized NFR-02) */}
        <div className="px-4 sm:px-5 py-3 bg-cream-100 border-b border-cream-300 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition flex items-center gap-1.5 shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-espresso-900 text-white shadow-md'
                  : 'bg-white text-espresso-900 border border-cream-300 hover:bg-cream-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Products Grid (iPad Touchscreen 1194x834 target) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {filteredProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-warmgray-400">
              <AlertCircle className="w-12 h-12 stroke-1 text-warmgray-400 mb-2" />
              <p className="font-bold text-espresso-900 text-sm">ไม่พบสินค้าที่คุณค้นหา</p>
              <p className="text-xs text-warmgray-500 mt-1">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={handleSelectProduct}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* RIGHT SECTION: Cart Sidebar */}
      <CartSidebar
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onCheckout={handleInitiateCheckout}
        orderType={orderType}
        setOrderType={setOrderType}
      />

      {/* Drink Customization Modal (Sweetness, Milk, Add-ons) */}
      {customizingProduct && (
        <CustomizationModal
          product={customizingProduct}
          onClose={() => setCustomizingProduct(null)}
          onConfirm={(product, customization) => {
            addToCart(product, customization);
            setCustomizingProduct(null);
          }}
        />
      )}

      {/* Payment & Receipt Modal */}
      {activeCheckoutSummary && (
        <PaymentModal
          orderSummary={activeCheckoutSummary}
          cart={cart}
          orderType={orderType}
          onClose={() => setActiveCheckoutSummary(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
