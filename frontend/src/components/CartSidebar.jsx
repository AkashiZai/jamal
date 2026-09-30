import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, QrCode, Banknote, PauseCircle, RotateCcw } from 'lucide-react';

export default function CartSidebar({
  cart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onCheckout,
  orderType,
  setOrderType,
}) {
  const [discountPercent, setDiscountPercent] = useState(0);

  // Financial calculations
  const rawSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountAmount = (rawSubtotal * discountPercent) / 100;
  const taxableAmount = Math.max(0, rawSubtotal - discountAmount);
  // VAT 7% included in POS calculation
  const vatAmount = taxableAmount * 0.07;
  const totalAmount = taxableAmount + vatAmount;
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <aside className="w-full lg:w-96 bg-white border-l border-cream-300 flex flex-col h-full shadow-lg select-none">
      {/* Header & Order Type Toggle */}
      <div className="p-4 border-b border-cream-300 bg-cream-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-terracotta" />
            <h2 className="font-extrabold text-espresso-900 text-base">
              รายการคำสั่งซื้อ (Order)
            </h2>
          </div>
          <span className="bg-espresso-800 text-white font-mono text-xs px-2.5 py-1 rounded-full font-bold">
            #{String(Math.floor(rawSubtotal % 99) + 101).padStart(3, '0')}
          </span>
        </div>

        {/* Order Mode: Dine-in / Takeaway */}
        <div className="grid grid-cols-2 p-1 bg-cream-200 rounded-xl gap-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setOrderType('dine-in')}
            className={`py-2 rounded-lg transition text-center ${
              orderType === 'dine-in'
                ? 'bg-espresso-900 text-white shadow'
                : 'text-warmgray-600 hover:text-espresso-900'
            }`}
          >
            🍽️ ทานที่ร้าน (Dine-in)
          </button>
          <button
            type="button"
            onClick={() => setOrderType('takeaway')}
            className={`py-2 rounded-lg transition text-center ${
              orderType === 'takeaway'
                ? 'bg-terracotta text-white shadow'
                : 'text-warmgray-600 hover:text-espresso-900'
            }`}
          >
            🥡 สั่งกลับบ้าน (Takeaway)
          </button>
        </div>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-warmgray-400">
            <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center text-warmgray-400 mb-3">
              <ShoppingBag className="w-8 h-8 stroke-1 text-warmgray-400" />
            </div>
            <p className="font-bold text-espresso-900 text-sm">ยังไม่มีรายการสินค้าในบิล</p>
            <p className="text-xs text-warmgray-500 mt-1 max-w-[200px]">
              แตะเลือกเมนูเครื่องดื่มหรือเบเกอรี่จากรายการทางซ้ายเพื่อเริ่มสั่งซื้อ
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.cartItemId}
              className="p-3 bg-cream-50 hover:bg-cream-100 rounded-2xl border border-cream-200 transition flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className="font-bold text-xs sm:text-sm text-espresso-900 leading-snug">
                    {item.name}
                  </h4>
                  {item.optionsText && (
                    <p className="text-[11px] text-terracotta font-medium mt-0.5 leading-tight">
                      {item.optionsText}
                    </p>
                  )}
                  <span className="text-xs font-mono text-warmgray-500">
                    ฿{item.unitPrice.toFixed(2)} / ชิ้น
                  </span>
                </div>

                {/* Remove single item */}
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.cartItemId)}
                  className="text-warmgray-400 hover:text-red-600 p-1 transition"
                  title="ลบรายการ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Stepper + Line Total */}
              <div className="flex items-center justify-between pt-1 border-t border-cream-200">
                <div className="flex items-center bg-white rounded-xl border border-cream-300 overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.cartItemId, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-espresso-900 hover:bg-cream-200 active:bg-cream-300 font-bold transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-xs tabular-nums text-espresso-900">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.cartItemId, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-espresso-900 hover:bg-cream-200 active:bg-cream-300 font-bold transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="font-mono font-extrabold text-espresso-900 text-sm tabular-nums">
                  ฿{(item.unitPrice * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bill Calculation Summary (FR-05) */}
      <div className="p-4 bg-cream-100 border-t border-cream-300 space-y-2">
        <div className="flex justify-between text-xs text-warmgray-600 font-medium">
          <span>รวมยอดสินค้า ({totalItemsCount} รายการ)</span>
          <span className="font-mono tabular-nums">฿{rawSubtotal.toFixed(2)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-xs text-green-700 font-semibold">
            <span>ส่วนลด ({discountPercent}%)</span>
            <span className="font-mono tabular-nums">-฿{discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-xs text-warmgray-600 font-medium">
          <span>ภาษีมูลค่าเพิ่ม (VAT 7%)</span>
          <span className="font-mono tabular-nums">฿{vatAmount.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-baseline pt-2 border-t border-cream-300 text-espresso-900">
          <span className="font-extrabold text-sm sm:text-base">ยอดชำระสุทธิ (Net Total)</span>
          <span className="font-mono font-black text-xl sm:text-2xl text-terracotta tabular-nums">
            ฿{totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Action Buttons: Hold, Clear, Pay */}
      <div className="p-4 bg-white border-t border-cream-200 space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={cart.length === 0}
            onClick={() => alert('พักบิลออเดอร์นี้เรียบร้อย (Hold Order Saved)')}
            className="py-2.5 px-3 bg-cream-200 hover:bg-cream-300 disabled:opacity-40 text-espresso-900 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <PauseCircle className="w-3.5 h-3.5" />
            <span>พักบิล (Hold)</span>
          </button>

          <button
            type="button"
            disabled={cart.length === 0}
            onClick={onClearCart}
            className="py-2.5 px-3 bg-cream-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 text-warmgray-600 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ล้างบิล (Clear)</span>
          </button>
        </div>

        {/* Primary Checkout Button (NFR-02 Touchscreen Target 56px) */}
        <button
          type="button"
          disabled={cart.length === 0}
          onClick={() => onCheckout({ rawSubtotal, vatAmount, totalAmount, totalItemsCount })}
          className="w-full py-4 bg-terracotta hover:bg-terracotta-hover disabled:bg-warmgray-300 text-white font-extrabold text-base rounded-2xl shadow-lg transition flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          <CreditCard className="w-5 h-5" />
          <span>ชำระเงิน • ฿{totalAmount.toFixed(2)}</span>
        </button>
      </div>
    </aside>
  );
}
