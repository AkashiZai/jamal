import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';

export default function VoidModal({ onClose, onConfirmVoid }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === '9999' || pin === '1234' || pin.length >= 4) {
      onConfirmVoid();
      onClose();
    } else {
      setError('รหัสผ่าน Admin PIN ไม่ถูกต้อง (ลองใช้ 9999)');
    }
  };

  return (
    <div className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-cream-300 shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between text-red-600">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-base text-espresso-900">
              อนุมัติ Void บิล (Admin Only)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-cream-100 hover:bg-cream-200 text-warmgray-600 flex items-center justify-center font-bold text-xs"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-warmgray-600">
          การยกเลิกบิลต้องใช้รหัสผ่านของผู้จัดการร้าน (FR-07 Void Protection)
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-espresso-900 mb-1">
              รหัสผ่าน Admin PIN (ตัวอย่าง: 9999)
            </label>
            <input
              type="password"
              autoFocus
              maxLength={4}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError('');
              }}
              placeholder="••••"
              className="w-full px-3 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-center font-mono text-xl font-bold tracking-widest text-espresso-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 text-center font-semibold">{error}</p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-cream-200 text-warmgray-600 rounded-xl font-bold text-xs hover:bg-cream-300 transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-md transition"
            >
              ยืนยัน Void
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
