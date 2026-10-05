import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Smartphone,
  Maximize2,
  Minimize2,
  Clock,
  Sparkles,
  ShoppingBag,
  Check,
  X,
  Plus,
  Minus,
  AlertCircle,
  Coffee,
} from 'lucide-react';

export default function CustomerMobilePage() {
  const {
    products,
    orders,
    createOrder,
    customerQueueNo,
    setCustomerQueueNo,
    playChime,
  } = useApp();

  const [isFrameMode, setIsFrameMode] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('popular');
  const [mobileCart, setMobileCart] = useState([
    {
      id: 'c1',
      name: 'เอสเพรสโซ่เย็น',
      price: 65.0,
      quantity: 1,
      optionsText: 'หวาน 25% • นมโอ๊ต',
      category: 'coffee',
    },
    {
      id: 'b1',
      name: 'ครัวซองต์เนยสด AOP',
      price: 85.0,
      quantity: 1,
      optionsText: 'อบอุ่นร้อน',
      category: 'bakery',
    },
  ]);
  const [customizingProduct, setCustomizingProduct] = useState(null);
  const [customSweetness, setCustomSweetness] = useState('25%');
  const [customMilk, setCustomMilk] = useState('นมโอ๊ต (+15฿)');
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [tableNumber, setTableNumber] = useState('04');
  const [orderSuccessMessage, setOrderSuccessMessage] = useState(null);

  // Find tracked order status from Kitchen KDS
  const currentTrackedOrder = useMemo(() => {
    return orders.find((o) => o.queueNo === customerQueueNo);
  }, [orders, customerQueueNo]);

  // Categories matching Figma 05_customer_mobile.svg
  const categories = [
    { id: 'popular', label: 'เมนูยอดนิยม' },
    { id: 'coffee', label: 'กาแฟสด' },
    { id: 'non-coffee', label: 'ชา & นมสด' },
    { id: 'bakery', label: 'เบเกอรี่' },
    { id: 'dessert', label: 'ของหวาน' },
  ];

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'popular') {
      return products.slice(0, 5);
    }
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  // Cart calculations
  const cartItemCount = mobileCart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = mobileCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Add product to cart handler
  const handleItemClick = (product) => {
    if (product.stock === 0) return; // Out of stock
    if (product.customizable) {
      setCustomizingProduct(product);
      setCustomSweetness('25%');
      setCustomMilk('นมปกติ');
    } else {
      addToMobileCart(product, product.price, 'อบอุ่นร้อน');
    }
  };

  const addToMobileCart = (product, unitPrice, optionsText) => {
    setMobileCart((prev) => {
      const idx = prev.findIndex(
        (i) => i.id === product.id && i.optionsText === optionsText
      );
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name.split(' (')[0],
          price: unitPrice,
          quantity: 1,
          optionsText,
          category: product.category,
          isBakery: product.isBakery || false,
        },
      ];
    });
    playChime('notification');
  };

  const handleConfirmCustomization = () => {
    if (!customizingProduct) return;
    let addPrice = 0;
    if (customMilk.includes('นมโอ๊ต')) addPrice = 15;
    if (customMilk.includes('นมอัลมอนด์')) addPrice = 15;

    const finalPrice = customizingProduct.price + addPrice;
    const optionsText = `หวาน ${customSweetness} • ${customMilk}`;
    addToMobileCart(customizingProduct, finalPrice, optionsText);
    setCustomizingProduct(null);
  };

  // Place order from customer mobile
  const handlePlaceMobileOrder = () => {
    if (mobileCart.length === 0) return;

    const newOrder = createOrder({
      items: mobileCart,
      totalAmount: cartTotal,
      paymentMethod: 'PromptPay',
      tableNo: tableNumber,
      channel: 'Mobile Scan (ลูกค้าสั่งเอง)',
      cashierName: `โต๊ะ ${tableNumber}`,
    });

    setCustomerQueueNo(newOrder.queueNo);
    setMobileCart([]);
    setShowCartDrawer(false);
    setOrderSuccessMessage(
      `สั่งซื้อสำเร็จ! คิวของคุณคือ #${newOrder.queueNo} กำลังส่งไปยังครัวบาริสต้า`
    );
    setTimeout(() => setOrderSuccessMessage(null), 6000);
  };

  // Status mapping for the live tracking banner
  const getQueueStatusDisplay = () => {
    if (!currentTrackedOrder) {
      return {
        badgeText: 'รอคิวในระบบ',
        badgeBg: 'bg-warmgray-600',
        badgeColor: 'text-white',
        desc: 'ออเดอร์ได้รับการบันทึกในระบบเรียบร้อยแล้ว',
      };
    }

    if (currentTrackedOrder.status === 'pending') {
      return {
        badgeText: 'รอดำเนินการ (รอชง)',
        badgeBg: 'bg-amber-600',
        badgeColor: 'text-white',
        desc: 'บาริสต้าได้รับรายการแล้ว รอเริ่มคิวชงเครื่องดื่ม',
      };
    } else if (currentTrackedOrder.status === 'in_progress') {
      return {
        badgeText: 'กำลังจัดเตรียม (3 น.)',
        badgeBg: 'bg-blue-600',
        badgeColor: 'text-white',
        desc: 'บาริสต้ากำลังชงเครื่องดื่มให้คุณอย่างพิถีพิถัน',
      };
    } else if (currentTrackedOrder.status === 'ready') {
      return {
        badgeText: 'พร้อมรับเครื่องดื่ม!',
        badgeBg: 'bg-matcha',
        badgeColor: 'text-white',
        desc: '✨ เครื่องดื่มของคุณพร้อมแล้ว! เชิญรับได้ที่เคาน์เตอร์',
      };
    } else {
      return {
        badgeText: 'เสร็จสิ้นแล้ว',
        badgeBg: 'bg-warmgray-500',
        badgeColor: 'text-white',
        desc: 'ขอบคุณที่ใช้บริการ Jamal Café & Bakery',
      };
    }
  };

  const queueInfo = getQueueStatusDisplay();

  return (
    <div className="flex-1 flex flex-col items-center bg-[#EDE7DF] p-2 sm:p-6 font-sans min-h-[calc(100vh-100px)]">
      {/* Viewport Control Bar */}
      <div className="w-full max-w-md flex items-center justify-between mb-3 px-2 text-xs text-warmgray-600">
        <div className="flex items-center gap-1.5 font-medium">
          <Smartphone className="w-4 h-4 text-espresso-900" />
          <span>Figma Spec: 05_customer_mobile (393 × 852)</span>
        </div>
        <button
          onClick={() => setIsFrameMode(!isFrameMode)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-cream-300 shadow-sm hover:bg-cream-100 transition font-medium"
        >
          {isFrameMode ? (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span>เต็มจอ</span>
            </>
          ) : (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span>กรอบมือถือ</span>
            </>
          )}
        </button>
      </div>

      {/* Success Notification Banner */}
      {orderSuccessMessage && (
        <div className="w-full max-w-md mb-3 bg-matcha text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{orderSuccessMessage}</span>
          </div>
          <button onClick={() => setOrderSuccessMessage(null)}>✕</button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHONE CONTAINER (Matches Figma 05_customer_mobile.svg 393x852)             */}
      {/* ========================================================================= */}
      <div
        className={`w-full bg-[#FBF8F4] overflow-hidden flex flex-col shadow-2xl transition-all relative ${
          isFrameMode
            ? 'max-w-[393px] h-[852px] rounded-[44px] border-[8px] border-espresso-900'
            : 'max-w-2xl rounded-2xl border border-cream-300 min-h-[800px]'
        }`}
      >
        {/* ================= PHONE STATUS BAR ================= */}
        <div className="bg-espresso-900 text-white px-6 pt-3 pb-2 flex items-center justify-between shrink-0 select-none">
          <span className="text-xs font-bold font-mono tracking-tight">9:41</span>
          {/* Dynamic Island Notch */}
          <div className="w-24 h-5 bg-black rounded-full mx-auto"></div>
          <div className="flex items-center space-x-1.5 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            <div className="w-4 h-2 border border-white rounded-sm flex items-center p-0.5">
              <div className="w-full h-full bg-white rounded-xs"></div>
            </div>
          </div>
        </div>

        {/* ================= HEADER BAR ================= */}
        <div className="bg-white px-4 py-2.5 border-b border-cream-300 flex items-center justify-between shrink-0">
          <div>
            <div className="text-[11px] font-mono font-bold text-terracotta">
              โต๊ะ {tableNumber} • สั่งทานที่ร้าน
            </div>
            <div className="text-base font-extrabold text-espresso-900 tracking-tight">
              JAMAL CAFÉ
            </div>
          </div>
          <span className="bg-[#EAF4ED] text-matcha text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#CEE5D3] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-matcha animate-pulse"></span>
            เปิดบริการ
          </span>
        </div>

        {/* ================= SCROLLABLE CONTENT BODY ================= */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
          {/* ================= LIVE QUEUE TRACKING BANNER ================= */}
          {/* (Matches Figma 05_customer_mobile.svg lines 18-24) */}
          <div className="bg-espresso-900 text-white rounded-2xl p-3.5 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold font-mono text-white tracking-wide">
                คิวของคุณ: #{customerQueueNo}
              </span>
              <span
                className={`${queueInfo.badgeBg} ${queueInfo.badgeColor} text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1`}
              >
                <Clock className="w-3 h-3" />
                {queueInfo.badgeText}
              </span>
            </div>
            <p className="text-[11px] text-warmgray-400 mt-2">
              {queueInfo.desc}
            </p>
          </div>

          {/* ================= CATEGORY PILLS BAR ================= */}
          {/* (Matches Figma 05_customer_mobile.svg lines 27-39) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    isSelected
                      ? 'bg-espresso-800 text-white shadow-sm'
                      : 'bg-white text-warmgray-600 border border-cream-300 hover:bg-cream-100'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* ================= PRODUCT LIST ================= */}
          {/* (Matches Figma 05_customer_mobile.svg lines 42-90) */}
          <div className="space-y-3">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.stock === 0;

              return (
                <div
                  key={product.id}
                  className={`bg-white rounded-2xl border border-cream-300 p-3 flex gap-3 shadow-sm transition ${
                    isOutOfStock ? 'opacity-60 bg-cream-50' : 'hover:border-terracotta/40'
                  }`}
                >
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-cream-200 shrink-0 border border-cream-200 relative">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.customizable && !isOutOfStock && (
                      <span className="absolute bottom-1 left-1 bg-espresso-900 text-white text-[9px] font-bold px-1.5 py-0.2 rounded font-mono">
                        CUSTOM
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-espresso-900 leading-snug">
                        {product.name.split(' (')[0]}
                      </div>
                      <div className="text-[11px] text-warmgray-500 line-clamp-1 mt-0.5">
                        {product.desc}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-mono font-extrabold text-sm text-terracotta">
                        ฿{product.price.toFixed(2)}
                      </span>

                      {isOutOfStock ? (
                        <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-md border border-red-200">
                          สินค้าหมด
                        </span>
                      ) : (
                        <button
                          onClick={() => handleItemClick(product)}
                          className="px-3 py-1 bg-espresso-900 hover:bg-espresso-800 text-white text-xs font-bold rounded-lg transition active:scale-95 flex items-center gap-1 shadow-sm"
                        >
                          <Plus className="w-3 h-3" />
                          <span>สั่ง</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= STICKY BOTTOM CART BAR ================= */}
        {/* (Matches Figma 05_customer_mobile.svg lines 93-100) */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-cream-300 p-3 flex items-center justify-between shadow-lg z-20">
          <div>
            <div className="text-[11px] text-warmgray-500">
              ยอดรวม {cartItemCount} รายการในตะกร้า
            </div>
            <div className="text-base font-extrabold font-mono text-espresso-900">
              ฿{cartTotal.toFixed(2)}
            </div>
          </div>

          <button
            onClick={() => setShowCartDrawer(true)}
            disabled={mobileCart.length === 0}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs text-white transition flex items-center gap-1.5 shadow-sm ${
              mobileCart.length > 0
                ? 'bg-terracotta hover:bg-terracotta-hover active:scale-95'
                : 'bg-warmgray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>ดูตะกร้า ({cartItemCount}) →</span>
          </button>
        </div>

        {/* ================= MOBILE CUSTOMIZATION MODAL ================= */}
        {customizingProduct && (
          <div className="absolute inset-0 bg-espresso-900/60 backdrop-blur-xs z-30 flex flex-col justify-end">
            <div className="bg-white rounded-t-3xl p-5 space-y-4 border-t border-cream-300 shadow-2xl animate-in slide-in-from-bottom duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm text-espresso-900">
                    ปรับแต่ง: {customizingProduct.name.split(' (')[0]}
                  </h4>
                  <p className="text-xs text-warmgray-500">
                    เลือกความหวานและชนิดนมตามต้องการ
                  </p>
                </div>
                <button
                  onClick={() => setCustomizingProduct(null)}
                  className="p-1.5 text-warmgray-400 hover:text-espresso-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sweetness */}
              <div>
                <label className="block text-xs font-bold text-espresso-900 mb-1.5">
                  ระดับความหวาน (Sweetness Level)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['0%', '25%', '50%', '100%'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setCustomSweetness(lvl)}
                      className={`py-1.5 rounded-lg text-xs font-semibold border transition ${
                        customSweetness === lvl
                          ? 'bg-terracotta text-white border-terracotta shadow-sm'
                          : 'bg-cream-50 text-warmgray-600 border-cream-300'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Milk Option */}
              <div>
                <label className="block text-xs font-bold text-espresso-900 mb-1.5">
                  ชนิดนม (Milk Option)
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['นมปกติ', 'นมโอ๊ต (+15฿)', 'นมอัลมอนด์ (+15฿)'].map((milk) => (
                    <button
                      key={milk}
                      onClick={() => setCustomMilk(milk)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition text-center truncate ${
                        customMilk === milk
                          ? 'bg-matcha text-white border-matcha shadow-sm'
                          : 'bg-cream-50 text-warmgray-600 border-cream-300'
                      }`}
                    >
                      {milk}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Button */}
              <button
                onClick={handleConfirmCustomization}
                className="w-full py-2.5 bg-terracotta hover:bg-terracotta-hover text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                เพิ่มลงตะกร้า • ฿
                {(
                  customizingProduct.price +
                  (customMilk.includes('(+15฿)') ? 15 : 0)
                ).toFixed(2)}
              </button>
            </div>
          </div>
        )}

        {/* ================= MOBILE CART / CHECKOUT DRAWER ================= */}
        {showCartDrawer && (
          <div className="absolute inset-0 bg-espresso-900/60 backdrop-blur-xs z-30 flex flex-col justify-end">
            <div className="bg-white rounded-t-3xl p-5 space-y-4 border-t border-cream-300 shadow-2xl max-h-[85%] flex flex-col">
              <div className="flex justify-between items-center border-b border-cream-200 pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-terracotta" />
                  <h4 className="font-bold text-sm text-espresso-900">
                    รายการในตะกร้า ({cartItemCount})
                  </h4>
                </div>
                <button
                  onClick={() => setShowCartDrawer(false)}
                  className="p-1.5 text-warmgray-400 hover:text-espresso-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Table No selector */}
              <div className="flex items-center justify-between text-xs bg-cream-50 p-2.5 rounded-xl border border-cream-200">
                <span className="font-semibold text-espresso-800">
                  ระบุหมายเลขโต๊ะ:
                </span>
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="bg-white border border-cream-300 rounded-lg px-2 py-1 font-bold text-espresso-900"
                >
                  <option value="01">โต๊ะ 01</option>
                  <option value="02">โต๊ะ 02</option>
                  <option value="03">โต๊ะ 03</option>
                  <option value="04">โต๊ะ 04</option>
                  <option value="05">โต๊ะ 05</option>
                </select>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto space-y-2.5 py-1">
                {mobileCart.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border-b border-cream-100 pb-2 text-xs"
                  >
                    <div>
                      <div className="font-bold text-espresso-900">
                        {item.quantity}x {item.name}
                      </div>
                      {item.optionsText && (
                        <div className="text-[10px] text-terracotta">
                          ↳ {item.optionsText}
                        </div>
                      )}
                    </div>
                    <div className="font-mono font-bold text-espresso-900">
                      ฿{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="border-t border-cream-200 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-warmgray-600">
                  <span>ยอดรวม (Subtotal)</span>
                  <span className="font-mono">
                    ฿{(cartTotal / 1.07).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-warmgray-600">
                  <span>ภาษีมูลค่าเพิ่ม VAT 7%</span>
                  <span className="font-mono">
                    ฿{(cartTotal - cartTotal / 1.07).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm text-espresso-900 pt-1">
                  <span>ยอดสุทธิ (Total)</span>
                  <span className="font-mono text-terracotta">
                    ฿{cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Submit Order */}
              <button
                onClick={handlePlaceMobileOrder}
                className="w-full py-3 bg-terracotta hover:bg-terracotta-hover text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>ยืนยันการสั่งซื้อ • ส่งเข้าครัวทันที</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
