import React, { useState, useMemo } from 'react';
import { Store, Search } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../data/products';
import ProductCard from '../components/ProductCard';
import CustomizationModal from '../components/CustomizationModal';
import CartSidebar from '../components/CartSidebar';
import PaymentModal from '../components/PaymentModal';
import VoidModal from '../components/VoidModal';
import { useApp } from '../context/AppContext';

export default function PosPage({ currentUser }) {
  const app = useApp();
  const productsList = app?.products || PRODUCTS;
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customizingProduct, setCustomizingProduct] = useState(null);
  
  // Cart state
  const [cart, setCart] = useState([]);
  
  // Modals state
  const [activeCheckoutSummary, setActiveCheckoutSummary] = useState(null);
  const [showVoidModal, setShowVoidModal] = useState(false);

  // Filter products by category & search query
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
      addToCart(product, {
        optionsText: '',
        unitPrice: product.price,
      });
    }
  };

  // Add item with options into cart
  const addToCart = (product, { optionsText, unitPrice }) => {
    setCart((prevCart) => {
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

  // Payment completed (FR-03 Inventory Deduction & Forward to Kitchen KDS)
  const handlePaymentSuccess = (paymentDetail) => {
    if (app?.createOrder) {
      const totalAmount = cart.reduce(
        (sum, item) => sum + (item.unitPrice || item.price || 0) * item.quantity,
        0
      );
      app.createOrder({
        items: cart.map((ci) => ({
          id: ci.id,
          name: ci.name,
          quantity: ci.quantity,
          optionsText: ci.optionsText,
          category: ci.category,
          isBakery: ci.isBakery,
        })),
        totalAmount,
        paymentMethod: paymentDetail?.method === 'cash' ? 'เงินสด' : 'PromptPay',
        tableNo: 'หน้าร้าน (POS)',
        channel: 'หน้าร้าน (Cashier POS)',
        cashierName: currentUser ? currentUser.name : 'Zai (กะเช้า)',
      });
    }
    setCart([]);
  };

  // Void Cart Action (FR-07)
  const handleConfirmVoid = () => {
    setCart([]);
    setShowVoidModal(false);
    alert('อนุมัติ Void บิลสำเร็จโดย Admin Zai (บันทึก Audit Log เรียบร้อย)');
  };

  return (
    <main className="flex-1 flex justify-center items-start p-2 sm:p-4 overflow-x-hidden print:p-0 print:m-0 print:overflow-visible">
      {/* Centered iPad Screen Container (1194x834 spec) */}
      <div className="w-full max-w-[1240px] bg-cream-100 rounded-2xl shadow-xl border border-cream-300 overflow-hidden flex flex-col md:flex-row min-h-[760px] print:hidden">
        
        {/* LEFT SECTION: CATALOG & CATEGORIES (70% WIDTH) */}
        <div className="flex-1 flex flex-col border-r border-cream-300 bg-cream-50">
          
          {/* Sub-header & Quick Search */}
          <div className="p-4 border-b border-cream-300 flex flex-col sm:flex-row gap-3 items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cream-200 text-espresso-800">
                <Store className="w-5 h-5 text-espresso-800" />
              </div>
              <div>
                <h2 className="font-bold text-espresso-900 text-base leading-none">
                  เมนูสินค้าหน้าร้าน (Menu Catalog)
                </h2>
                <p className="text-xs text-warmgray-600 mt-0.5">
                  พนักงาน: <span className="font-semibold text-espresso-800">{currentUser ? currentUser.name : 'Zai (กะเช้า)'}</span> • โต๊ะ/ออเดอร์หน้าร้าน
                </p>
              </div>
            </div>

            {/* Search input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-warmgray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อเมนู หรือรหัส..."
                className="w-full pl-9 pr-4 py-2 bg-cream-100 border border-cream-300 rounded-xl text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-warmgray-400 hover:text-espresso-900"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Pills Bar matching Figma */}
          <div className="px-4 py-2.5 bg-cream-100 border-b border-cream-300 flex gap-2 overflow-x-auto items-center no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
                    isActive
                      ? 'bg-espresso-800 text-white shadow-sm'
                      : 'bg-white text-espresso-800 border border-cream-300 hover:bg-cream-200'
                  }`}
                >
                  {cat.id === 'all' ? '☕ ทั้งหมด (All)' : cat.name}
                </button>
              );
            })}
          </div>

          {/* Product Grid matching Figma (max-h-[620px]) */}
          <div className="flex-1 p-4 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 overflow-y-auto max-h-[620px] content-start auto-rows-max items-start">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={handleSelectProduct}
              />
            ))}
          </div>
        </div>

        {/* RIGHT SECTION: ORDER CART SIDEBAR (30% WIDTH) */}
        <CartSidebar
          cart={cart}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onCheckout={(summary) => setActiveCheckoutSummary(summary)}
          onVoidClick={() => setShowVoidModal(true)}
        />
      </div>

      {/* Product Customization Modal */}
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

      {/* Payment & 80mm Receipt Modal */}
      {activeCheckoutSummary && (
        <PaymentModal
          orderSummary={activeCheckoutSummary}
          cart={cart}
          onClose={() => setActiveCheckoutSummary(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Admin Void Approval Modal (FR-07) */}
      {showVoidModal && (
        <VoidModal
          onClose={() => setShowVoidModal(false)}
          onConfirmVoid={handleConfirmVoid}
        />
      )}
    </main>
  );
}
