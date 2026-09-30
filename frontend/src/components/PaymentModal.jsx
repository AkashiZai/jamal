import React, { useState } from 'react';
import { X, Check, QrCode, Banknote, Printer, ArrowRight } from 'lucide-react';

export default function PaymentModal({ orderSummary, cart, orderType, onClose, onPaymentSuccess }) {
  const [method, setMethod] = useState('qr'); // 'qr' | 'cash'
  const [cashReceived, setCashReceived] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const total = orderSummary?.totalAmount || 0;
  const cashNum = parseFloat(cashReceived) || 0;
  const change = Math.max(0, cashNum - total);
  const isCashSufficient = cashNum >= total;

  const handleCompleteOrder = () => {
    setIsCompleted(true);
    if (onPaymentSuccess) {
      onPaymentSuccess({
        method,
        total,
        change: method === 'cash' ? change : 0,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-cream-300 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-espresso-900 text-white flex justify-between items-center">
          <div>
            <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
              <span>ชำระเงินคำสั่งซื้อ (Checkout)</span>
              <span className="text-xs font-mono bg-terracotta px-2 py-0.5 rounded-full">
                {orderType === 'dine-in' ? 'ทานที่ร้าน' : 'สั่งกลับบ้าน'}
              </span>
            </h3>
            <span className="text-xs text-warmgray-300">
              ยอดชำระสุทธิ:{' '}
              <strong className="text-terracotta-light text-sm font-mono">
                ฿{total.toFixed(2)}
              </strong>
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-espresso-800 hover:bg-espresso-700 text-warmgray-300 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {!isCompleted ? (
          <div className="p-5 sm:p-6 space-y-5">
            {/* Method Tabs */}
            <div className="grid grid-cols-2 p-1 bg-cream-200 rounded-2xl gap-1">
              <button
                type="button"
                onClick={() => setMethod('qr')}
                className={`py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
                  method === 'qr'
                    ? 'bg-white text-espresso-900 shadow-sm'
                    : 'text-warmgray-600 hover:text-espresso-900'
                }`}
              >
                <QrCode className="w-4 h-4 text-terracotta" />
                <span>PromptPay QR</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('cash')}
                className={`py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
                  method === 'cash'
                    ? 'bg-white text-espresso-900 shadow-sm'
                    : 'text-warmgray-600 hover:text-espresso-900'
                }`}
              >
                <Banknote className="w-4 h-4 text-green-700" />
                <span>เงินสด (Cash)</span>
              </button>
            </div>

            {/* PromptPay View */}
            {method === 'qr' && (
              <div className="flex flex-col items-center justify-center p-6 bg-cream-50 rounded-2xl border border-cream-300 text-center space-y-3">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-cream-200">
                  {/* Generated QR Placeholder using SVG */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://promptpay.io/0812345678/${total.toFixed(2)}`}
                    alt="PromptPay QR Code"
                    className="w-44 h-44 object-contain rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <div className="font-extrabold text-sm text-espresso-900">
                    สแกน QR เพื่อจ่ายผ่าน PromptPay
                  </div>
                  <div className="text-xs text-warmgray-500 font-mono">
                    จำนวนเงิน: <strong className="text-terracotta font-extrabold text-base">฿{total.toFixed(2)}</strong>
                  </div>
                  <div className="text-[11px] text-green-700 font-medium">
                    ● รองรับทุกแอปพลิเคชันธนาคารในไทย
                  </div>
                </div>
              </div>
            )}

            {/* Cash View */}
            {method === 'cash' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-espresso-900 mb-1.5">
                    จำนวนเงินที่รับจากลูกค้า (Cash Received)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warmgray-400 font-bold">
                      ฿
                    </span>
                    <input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={cashReceived}
                      onChange={(e) => setCashReceived(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 bg-cream-50 border border-cream-300 rounded-2xl font-mono text-lg font-bold text-espresso-900 focus:outline-none focus:ring-2 focus:ring-terracotta"
                    />
                  </div>
                </div>

                {/* Preset quick cash buttons */}
                <div className="flex items-center gap-2">
                  {[
                    Math.ceil(total),
                    100,
                    500,
                    1000,
                  ]
                    .filter((val, idx, arr) => arr.indexOf(val) === idx && val >= total)
                    .slice(0, 4)
                    .map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setCashReceived(String(preset))}
                        className="flex-1 py-2 rounded-xl bg-cream-200 hover:bg-terracotta hover:text-white font-mono text-xs font-bold transition text-espresso-900 border border-cream-300"
                      >
                        ฿{preset}
                      </button>
                    ))}
                </div>

                {/* Change Calculation Box (FR-05) */}
                <div className="p-4 bg-cream-100 rounded-2xl border border-cream-300 flex items-center justify-between">
                  <span className="font-bold text-xs text-espresso-900">เงินทอน (Change Due):</span>
                  <span className={`font-mono font-black text-xl tabular-nums ${
                    isCashSufficient ? 'text-green-700' : 'text-warmgray-400'
                  }`}>
                    ฿{change.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Payment Success & Receipt View (FR-06) */
          <div className="p-6 space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <div>
              <h4 className="font-extrabold text-lg text-espresso-900">ชำระเงินสำเร็จแล้ว!</h4>
              <p className="text-xs text-warmgray-600 mt-1">
                ตัดสต็อกสินค้าและบันทึกบิลลงในระบบเรียบร้อย
              </p>
            </div>

            {/* Thermal Receipt Mock */}
            <div className="bg-cream-100 p-4 rounded-2xl border border-dashed border-cream-300 text-left font-mono text-xs space-y-1.5 text-espresso-900">
              <div className="text-center font-bold pb-2 border-b border-dashed border-cream-300">
                JAMAL CAFÉ & BAKERY
                <div className="text-[10px] font-normal text-warmgray-500">
                  TAX INVOICE / RECEIPT (ABB)
                </div>
              </div>
              <div className="flex justify-between text-[11px] text-warmgray-600">
                <span>บิลเลขที่: #JM-{Date.now().toString().slice(-6)}</span>
                <span>{new Date().toLocaleTimeString('th-TH')}</span>
              </div>
              <div className="pt-2 border-t border-dashed border-cream-300 space-y-1">
                {cart.map((it) => (
                  <div key={it.cartItemId} className="flex justify-between text-[11px]">
                    <span className="truncate max-w-[200px]">
                      {it.name} x{it.quantity}
                    </span>
                    <span>฿{(it.unitPrice * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-dashed border-cream-300 flex justify-between font-bold text-sm">
                <span>ยอดสุทธิ (รวม VAT)</span>
                <span>฿{total.toFixed(2)}</span>
              </div>
              {method === 'cash' && (
                <div className="flex justify-between text-[11px] text-warmgray-600">
                  <span>รับเงินสด / เงินทอน</span>
                  <span>฿{cashNum.toFixed(2)} / ฿{change.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-cream-100 border-t border-cream-300 flex items-center gap-3">
          {!isCompleted ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-white border border-cream-300 hover:bg-cream-200 rounded-2xl text-xs font-bold text-warmgray-600 transition"
              >
                ย้อนกลับ
              </button>
              <button
                type="button"
                disabled={method === 'cash' && !isCashSufficient}
                onClick={handleCompleteOrder}
                className="flex-2 w-full py-3.5 bg-matcha hover:bg-matcha-dark disabled:bg-warmgray-300 text-white rounded-2xl text-xs sm:text-sm font-extrabold shadow-md transition flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>ยืนยันการรับเงิน</span>
              </button>
            </>
          ) : (
            <div className="w-full flex gap-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-3 bg-white border border-cream-300 hover:bg-cream-200 text-espresso-900 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Printer className="w-4 h-4" />
                <span>พิมพ์ใบเสร็จ</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-espresso-900 hover:bg-espresso-800 text-white rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <span>เปิดบิลใหม่ (New Order)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
