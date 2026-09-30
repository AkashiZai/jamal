import React, { useState } from 'react';
import { X, Check, Printer, ArrowRight, QrCode } from 'lucide-react';

export default function PaymentModal({ orderSummary, cart, onClose, onPaymentSuccess }) {
  const [method, setMethod] = useState('cash'); // 'cash' | 'qr'
  const [cashEntered, setCashEntered] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const total = orderSummary?.totalAmount || 0;
  const subtotal = total / 1.07;
  const vat = total - subtotal;
  const change = Math.max(0, cashEntered - total);
  const isCashSufficient = cashEntered >= total;

  const handleNumpadClick = (val) => {
    if (val === 'C') {
      setCashEntered(0);
    } else if (val === '00') {
      setCashEntered((prev) => prev * 100);
    } else {
      setCashEntered((prev) => prev * 10 + parseInt(val, 10));
    }
  };

  const handleQuickCash = (amount) => {
    if (amount === 'exact') {
      setCashEntered(Math.ceil(total));
    } else {
      setCashEntered(amount);
    }
  };

  const handleConfirmPayment = () => {
    if (method === 'cash' && !isCashSufficient) {
      alert('ยอดเงินสดที่รับมาน้อยกว่ายอดที่ต้องชำระ!');
      return;
    }
    setIsCompleted(true);
    if (onPaymentSuccess) {
      onPaymentSuccess({
        method,
        total,
        cashEntered: method === 'cash' ? cashEntered : total,
        change: method === 'cash' ? change : 0,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:static print:p-0 print:m-0 print:bg-white print:overflow-visible print:block">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-cream-300 overflow-hidden flex flex-col md:flex-row my-auto select-none print:shadow-none print:border-none print:w-full print:max-w-none print:m-0 print:p-0 print:rounded-none">
        
        {/* LEFT SECTION: Payment & Cash Calculator */}
        <div className="flex-1 p-6 sm:p-8 space-y-5 border-b md:border-b-0 md:border-r border-cream-300 print:hidden">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base text-espresso-900">
              หน้าต่างชำระเงิน (Payment)
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-cream-200 hover:bg-cream-300 text-warmgray-600 flex items-center justify-center font-bold text-xs transition"
            >
              ✕
            </button>
          </div>

          {/* Payment Method Switcher Tabs */}
          <div className="flex bg-cream-200 p-1 rounded-xl text-xs font-bold gap-1">
            <button
              type="button"
              onClick={() => setMethod('cash')}
              className={`flex-1 py-2.5 text-center rounded-lg transition ${
                method === 'cash'
                  ? 'bg-white text-espresso-900 shadow-sm'
                  : 'text-warmgray-600 hover:text-espresso-900'
              }`}
            >
              💵 เงินสด (Cash)
            </button>
            <button
              type="button"
              onClick={() => setMethod('qr')}
              className={`flex-1 py-2.5 text-center rounded-lg transition ${
                method === 'qr'
                  ? 'bg-white text-espresso-900 shadow-sm'
                  : 'text-warmgray-600 hover:text-espresso-900'
              }`}
            >
              📱 PromptPay QR
            </button>
          </div>

          {/* Net Amount Box */}
          <div className="p-4 sm:p-5 bg-cream-50 rounded-2xl border border-cream-300">
            <span className="text-xs text-warmgray-600">
              ยอดที่ต้องชำระ (Net Amount)
            </span>
            <div className="text-3xl font-black font-mono text-espresso-900 mt-0.5 tabular-nums">
              ฿{total.toFixed(2)}
            </div>
          </div>

          {/* Cash Mode View */}
          {method === 'cash' ? (
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-bold text-espresso-900">ยอดเงินที่รับมา</span>
                <span className="font-mono font-black text-2xl text-terracotta tabular-nums">
                  ฿{cashEntered.toLocaleString()}.00
                </span>
              </div>

              {/* Quick Cash Buttons */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => handleQuickCash('exact')}
                  className="py-2.5 bg-cream-200 hover:bg-cream-300 rounded-xl text-xs font-bold font-mono text-espresso-900 transition"
                >
                  พอดี
                </button>
                {[100, 500, 1000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickCash(val)}
                    className={`py-2.5 rounded-xl text-xs font-bold font-mono transition ${
                      cashEntered === val
                        ? 'bg-terracotta text-white shadow'
                        : 'bg-cream-200 hover:bg-cream-300 text-espresso-900'
                    }`}
                  >
                    ฿{val}
                  </button>
                ))}
              </div>

              {/* Touch Numpad */}
              <div className="grid grid-cols-3 gap-2 text-base font-mono font-bold">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleNumpadClick(String(num))}
                    className="py-2.5 bg-white border border-cream-300 hover:bg-cream-100 rounded-xl text-center transition"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleNumpadClick('C')}
                  className="py-2.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-xl text-center transition"
                >
                  C
                </button>
                <button
                  type="button"
                  onClick={() => handleNumpadClick('0')}
                  className="py-2.5 bg-white border border-cream-300 hover:bg-cream-100 rounded-xl text-center transition"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => handleNumpadClick('00')}
                  className="py-2.5 bg-white border border-cream-300 hover:bg-cream-100 rounded-xl text-center transition"
                >
                  00
                </button>
              </div>

              {/* Change Due Box */}
              <div className="mt-4 p-3.5 rounded-2xl bg-matcha-light border border-matcha-border flex justify-between items-center">
                <span className="text-xs font-bold text-matcha">
                  เงินทอน (Change Due)
                </span>
                <span className="font-mono font-black text-2xl text-matcha tabular-nums">
                  ฿{change.toFixed(2)}
                </span>
              </div>
            </div>
          ) : (
            /* PromptPay QR Mode */
            <div className="flex flex-col items-center justify-center p-6 bg-cream-50 rounded-2xl border border-cream-300 text-center space-y-3">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-cream-200">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://promptpay.io/0812345678/${total.toFixed(2)}`}
                  alt="PromptPay QR Code"
                  className="w-40 h-40 object-contain rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-sm text-espresso-900">
                  สแกนจ่ายผ่านแอปธนาคาร (PromptPay)
                </div>
                <div className="text-xs text-warmgray-600 font-mono">
                  ยอดชำระ: <strong className="text-terracotta text-sm">฿{total.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Confirm & Complete Order Action */}
          {!isCompleted ? (
            <button
              type="button"
              disabled={method === 'cash' && !isCashSufficient}
              onClick={handleConfirmPayment}
              className="w-full py-4 bg-matcha hover:bg-green-800 disabled:bg-warmgray-200 disabled:text-warmgray-400 text-white rounded-2xl text-sm font-bold shadow-lg transition flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>✓ ยืนยันชำระเงิน &amp; สั่งพิมพ์สลิป</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3.5 bg-white border border-cream-300 hover:bg-cream-100 rounded-2xl text-xs font-bold text-espresso-900 transition flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>พิมพ์สลิป 80mm</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 bg-espresso-900 hover:bg-espresso-800 text-white rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <span>เปิดบิลใหม่</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SECTION: 80mm Thermal Receipt Slip matching Figma */}
        <div className="w-full md:w-[360px] bg-cream-200 p-6 sm:p-8 flex flex-col items-center justify-center print:bg-white print:p-0 print:m-0 print:w-full">
          <div id="receipt-print-area" className="bg-white w-[280px] p-6 text-espresso-900 font-mono text-[11px] leading-relaxed shadow-xl border border-cream-300 rounded-lg thermal-receipt print:shadow-none print:border-none print:p-2 print:w-[76mm] print:mx-auto">
            {/* Store Header */}
            <div className="text-center pb-3 border-b border-dashed border-warmgray-400">
              <div className="font-bold text-sm tracking-wider">
                JAMAL CAFÉ &amp; BAKERY
              </div>
              <div className="text-[10px] text-warmgray-600">
                สาขา 001 สุขุมวิท 23 กทม.
              </div>
              <div className="text-[9px] text-warmgray-600">
                TAX ID: 0-1055-69001-23-4
              </div>
            </div>

            {/* Bill Meta */}
            <div className="py-2.5 text-[10px] border-b border-dashed border-warmgray-400 space-y-0.5">
              <div className="flex justify-between">
                <span>บิล: #JM-2026-084</span>
                <span>โต๊ะ: หน้าร้าน</span>
              </div>
              <div className="flex justify-between">
                <span>{new Date().toLocaleTimeString('th-TH')}</span>
                <span>แคชเชียร์: Zai</span>
              </div>
            </div>

            {/* Cart Items */}
            <div className="py-2.5 border-b border-dashed border-warmgray-400 space-y-1">
              {cart.map((item) => (
                <div key={item.cartItemId} className="space-y-0.5">
                  <div className="flex justify-between font-bold">
                    <span className="truncate max-w-[170px]">
                      {item.quantity}x {item.name}
                    </span>
                    <span>{(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                  {item.optionsText && (
                    <div className="text-[9px] text-warmgray-600 pl-2">
                      ↳ {item.optionsText}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="py-2.5 border-b border-dashed border-warmgray-400 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>ยอดรวม (Subtotal)</span>
                <span>฿{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-warmgray-600">
                <span>VAT 7% (Included)</span>
                <span>฿{vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-black pt-1">
                <span>ยอดสุทธิ (Total)</span>
                <span>฿{total.toFixed(2)}</span>
              </div>

              {method === 'cash' && (
                <>
                  <div className="flex justify-between text-[11px] text-matcha pt-1">
                    <span>เงินสดรับมา</span>
                    <span>฿{cashEntered.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-matcha font-bold">
                    <span>เงินทอน (Change)</span>
                    <span>฿{change.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Footer & Barcode */}
            <div className="pt-3 text-center space-y-1">
              <div className="text-[10px] text-warmgray-600">ขอบคุณที่ใช้บริการ</div>
              <div className="text-[8px] text-warmgray-400 tracking-widest font-mono">
                ||||| | |||||| || ||||| |||||
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
