import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export const DEMO_ACCOUNTS = [
  {
    id: 'staff-01',
    username: 'cashier_zai',
    pin: '1234',
    name: 'Zai (กะเช้า)',
    role: 'cashier',
    roleName: 'แคชเชียร์',
  },
  {
    id: 'staff-02',
    username: 'barista_kds',
    pin: '5678',
    name: 'อานนท์ (บาริสต้า)',
    role: 'operator',
    roleName: 'บาริสต้า/ครัว',
  },
  {
    id: 'staff-03',
    username: 'admin_boss',
    pin: '9999',
    name: 'ผู้จัดการร้าน (Admin)',
    role: 'admin',
    roleName: 'เจ้าของร้าน',
  },
];

export default function LoginPage({ onLoginSuccess }) {
  const [selectedRole, setSelectedRole] = useState('cashier'); // 'cashier' | 'operator' | 'admin'
  const [username, setUsername] = useState('cashier_zai');
  const [pin, setPin] = useState('1234');
  const [errorMessage, setErrorMessage] = useState('');
  const [useKeypad, setUseKeypad] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    const demo = DEMO_ACCOUNTS.find((a) => a.role === role);
    if (demo) {
      setUsername(demo.username);
      setPin(demo.pin);
      setErrorMessage('');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const matched = DEMO_ACCOUNTS.find(
      (acc) => acc.username.trim().toLowerCase() === username.trim().toLowerCase()
    );

    if (!matched) {
      setErrorMessage('ไม่พบชื่อผู้ใช้งานนี้ในระบบ');
      return;
    }

    if (matched.pin !== pin) {
      setErrorMessage('รหัสผ่าน PIN ไม่ถูกต้อง (ลองใช้: ' + matched.pin + ')');
      return;
    }

    onLoginSuccess(matched);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#EDE7DF] flex items-center justify-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-2xl space-y-6">
        
        {/* Header matching Figma */}
        <div className="text-center space-y-1.5">
          <div className="w-14 h-14 rounded-2xl bg-espresso-900 text-white flex items-center justify-center mx-auto text-xl font-bold tracking-wider shadow">
            JM
          </div>
          <h1 className="text-2xl font-bold text-espresso-900">
            เข้าสู่ระบบ JAMAL POS
          </h1>
          <p className="text-xs text-warmgray-600">
            Café &amp; Bakery Management System
          </p>
        </div>

        {/* Role Selector matching Figma */}
        <div className="grid grid-cols-3 gap-1.5 bg-cream-200 p-1.5 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => handleRoleSelect('cashier')}
            className={`py-2.5 rounded-lg transition ${
              selectedRole === 'cashier'
                ? 'bg-terracotta text-white shadow'
                : 'text-warmgray-600 hover:text-espresso-900'
            }`}
          >
            แคชเชียร์
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('operator')}
            className={`py-2.5 rounded-lg transition ${
              selectedRole === 'operator'
                ? 'bg-terracotta text-white shadow'
                : 'text-warmgray-600 hover:text-espresso-900'
            }`}
          >
            บาริสต้า/ครัว
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('admin')}
            className={`py-2.5 rounded-lg transition ${
              selectedRole === 'admin'
                ? 'bg-terracotta text-white shadow'
                : 'text-warmgray-600 hover:text-espresso-900'
            }`}
          >
            เจ้าของร้าน
          </button>
        </div>

        {/* Form Inputs matching Figma */}
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-espresso-900 mb-1.5">
              รหัสพนักงาน หรือชื่อผู้ใช้
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-xl font-medium text-sm text-espresso-900 focus:outline-none focus:border-terracotta"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-bold text-espresso-900">
                รหัสผ่าน หรือ PIN 4 หลัก
              </label>
              <button
                type="button"
                onClick={() => setUseKeypad(!useKeypad)}
                className="text-[11px] text-terracotta font-semibold hover:underline"
              >
                {useKeypad ? 'ซ่อนแป้นพิมพ์' : 'แป้นตัวเลขสัมผัส'}
              </button>
            </div>
            <input
              type="password"
              maxLength={4}
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-xl font-mono text-base tracking-widest text-espresso-900 focus:outline-none focus:border-terracotta"
            />
          </div>

          {/* Touch Numpad (Optional for iPad touch) */}
          {useKeypad && (
            <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-sm font-bold">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => pin.length < 4 && setPin((p) => p + n)}
                  className="py-2.5 bg-cream-100 hover:bg-cream-200 rounded-xl border border-cream-200 transition"
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPin('')}
                className="py-2.5 bg-cream-100 text-xs font-sans text-warmgray-600 rounded-xl"
              >
                ล้าง
              </button>
              <button
                type="button"
                onClick={() => pin.length < 4 && setPin((p) => p + '0')}
                className="py-2.5 bg-cream-100 rounded-xl border border-cream-200"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => setPin((p) => p.slice(0, -1))}
                className="py-2.5 bg-cream-100 text-xs font-sans text-warmgray-600 rounded-xl"
              >
                ลบ
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Button matching Figma */}
          <button
            type="submit"
            className="w-full py-4 bg-espresso-800 text-white rounded-2xl text-sm font-bold hover:bg-espresso-900 transition shadow-lg active:scale-[0.99] flex items-center justify-center gap-1.5"
          >
            <span>เข้าสู่ระบบ (Sign In)</span>
            <span>→</span>
          </button>
        </form>

        {/* Security Notice matching Figma */}
        <p className="text-center text-[11px] text-warmgray-400">
          ระบบความปลอดภัย: Timeout Logout อัตโนมัติเมื่อไม่ใช้งานเกิน 15 นาที (NFR-04)
        </p>
      </div>
    </div>
  );
}
