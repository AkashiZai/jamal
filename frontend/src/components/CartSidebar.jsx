import React from 'react';
import { Trash2, ShoppingBag, Clock, ShieldAlert, CreditCard } from 'lucide-react';

export default function CartSidebar({
  cart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onCheckout,
  onVoidClick,
}) {
  const totalAmount = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const subtotal = totalAmount / 1.07;
  const vatAmount = totalAmount - subtotal;
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="w-full md:w-[380px] bg-cream-200 flex flex-col justify-between border-t md:border-t-0 md:border-l border-cream-300 select-none">
      {/* Top Header */}
      <div>
        <div className="p-4 border-b border-cream-300 bg-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-espresso-900 text-base leading-none">
                รายการสั่งซื้อ (Active Bill)
              </h3>
              <span className="bg-terracotta text-white text-xs px-2 py-0.5 rounded-full font-mono font-bold">
                {totalItemsCount}
              </span>
            </div>
            <p className="text-xs text-warmgray-400 font-mono mt-1">
              บิลเลขที่: #JM-2026-084
            </p>
          </div>
          <button
            type="button"
            disabled={cart.length === 0}
            onClick={onClearCart}
            className="text-xs text-red-600 hover:text-red-700 disabled:opacity-40 font-medium px-2 py-1 rounded hover:bg-red-50 transition flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>ล้างบิล</span>
          </button>
        </div>

        {/* Cart Items List */}
        <div className="p-3 overflow-y-auto space-y-2.5 max-h-[460px]">
          {cart.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-warmgray-400">
              <div className="w-16 h-16 rounded-full bg-cream-300 flex items-center justify-center mb-3 text-warmgray-600">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-semibold text-sm text-espresso-800">
                ยังไม่มีรายการสินค้า
              </p>
              <p className="text-xs text-warmgray-600 mt-1">
                แตะที่เมนูด้านซ้ายเพื่อเพิ่มรายการลงในบิล
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartItemId}
                className="p-3 bg-white rounded-xl border border-cream-300 shadow-sm space-y-1.5"
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-xs text-espresso-900 leading-snug">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-mono font-bold text-xs text-espresso-900 tabular-nums">
                    ฿{(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>

                {item.optionsText && (
                  <div className="text-[11px] font-medium text-terracotta leading-tight">
                    ↳ {item.optionsText}
                  </div>
                )}

                <div className="flex justify-between items-center pt-1 text-[10px] text-warmgray-600">
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.cartItemId)}
                    className="text-warmgray-400 hover:text-red-600 transition underline"
                  >
                    ลบรายการ
                  </button>

                  {/* Stepper matching Figma */}
                  <div className="inline-flex items-center border border-cream-300 rounded bg-cream-100 font-bold font-mono text-xs overflow-hidden">
                    <button
                      type="button"
                      onClick={() => onUpdateQty(item.cartItemId, item.quantity - 1)}
                      className="px-2 py-0.5 hover:bg-cream-200 transition"
                    >
                      -
                    </button>
                    <span className="px-2 py-0.5 bg-white text-espresso-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQty(item.cartItemId, item.quantity + 1)}
                      className="px-2 py-0.5 hover:bg-cream-200 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Financial Calculation & Touch Ergonomic Actions matching Figma */}
      <div className="p-4 bg-white border-t border-cream-300 space-y-3 shadow-inner">
        <div className="space-y-1.5 text-xs text-warmgray-600">
          <div className="flex justify-between">
            <span>ยอดรวมก่อนภาษี (Subtotal)</span>
            <span className="tabular-nums font-semibold text-espresso-900">
              ฿{subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>ภาษีมูลค่าเพิ่ม VAT (7%)</span>
            <span className="tabular-nums font-semibold text-espresso-900">
              ฿{vatAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-cream-300 text-base font-bold text-espresso-900">
            <span>ยอดสุทธิ (Total)</span>
            <span className="tabular-nums text-xl text-terracotta font-mono font-bold">
              ฿{totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* 3 POS Action Buttons (Touch Ergonomic >= 56px) */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            disabled={cart.length === 0}
            onClick={() => alert('พักบิลออเดอร์นี้เรียบร้อย (Hold Bill Saved)')}
            className="py-3 px-2 rounded-xl bg-cream-200 border border-cream-300 disabled:opacity-40 text-espresso-800 font-semibold text-xs hover:bg-cream-300 transition flex flex-col items-center justify-center"
          >
            <Clock className="w-4 h-4 mb-0.5 text-warmgray-600" />
            <span>พักบิล (Hold)</span>
          </button>

          <button
            type="button"
            disabled={cart.length === 0}
            onClick={onVoidClick}
            className="py-3 px-2 rounded-xl bg-cream-200 border border-cream-300 disabled:opacity-40 text-red-600 font-semibold text-xs hover:bg-red-50 transition flex flex-col items-center justify-center"
          >
            <ShieldAlert className="w-4 h-4 mb-0.5 text-red-600" />
            <span>Void (Admin)</span>
          </button>

          <button
            type="button"
            disabled={cart.length === 0}
            onClick={() => onCheckout({ totalAmount, subtotal, vatAmount, totalItemsCount })}
            className="py-3 px-3 rounded-xl bg-terracotta hover:bg-terracotta-hover disabled:bg-warmgray-200 disabled:text-warmgray-400 text-white font-bold text-sm shadow-md transition flex flex-col items-center justify-center gap-0.5 active:scale-[0.98]"
          >
            <CreditCard className="w-4 h-4" />
            <span>คิดเงิน</span>
          </button>
        </div>
      </div>
    </div>
  );
}
