import React, { useState } from 'react';
import { Coffee, ShieldCheck, Lock, User, KeyRound, AlertCircle, ArrowRight, Clock } from 'lucide-react';

export const DEMO_ACCOUNTS = [
  {
    id: 'staff-01',
    username: 'cashier01',
    pin: '1234',
    name: 'สมศรี มีทรัพย์ (Somsri M.)',
    role: 'cashier',
    roleName: 'Cashier (พนักงานขาย)',
    color: 'bg-terracotta',
  },
  {
    id: 'staff-02',
    username: 'admin01',
    pin: '9999',
    name: 'ผู้จัดการร้าน (Store Admin)',
    role: 'admin',
    roleName: 'Admin (ผู้ดูแลระบบ)',
    color: 'bg-espresso-900',
  },
  {
    id: 'staff-03',
    username: 'barista01',
    pin: '5678',
    name: 'อานนท์ บาริสต้า (Anon B.)',
    role: 'operator',
    roleName: 'Barista (พนักงานชง)',
    color: 'bg-matcha',
  },
];

export default function LoginPage({ onLoginSuccess }) {
  const [selectedRole, setSelectedRole] = useState('cashier'); // 'cashier' | 'admin' | 'operator'
  const [username, setUsername] = useState('cashier01');
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    setTimeout(() => {
      // Find matching user
      const matched = DEMO_ACCOUNTS.find(
        (acc) => acc.username.trim().toLowerCase() === username.trim().toLowerCase()
      );

      if (!matched) {
        setErrorMessage('ไม่พบชื่อผู้ใช้งานนี้ในระบบ');
        setIsLoading(false);
        return;
      }

      if (matched.pin !== pin) {
        setErrorMessage('รหัสผ่าน PIN 4 หลักไม่ถูกต้อง (ลองใช้ PIN ตัวอย่าง)');
        setIsLoading(false);
        return;
      }

      // Login success
      setIsLoading(false);
      onLoginSuccess(matched);
    }, 400);
  };

  const handlePinKeyClick = (val) => {
    if (pin.length < 4) {
      setPin((prev) => prev + val);
    }
  };

  const handlePinBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-cream flex flex-col justify-center items-center p-4 select-none">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-cream-300 overflow-hidden">
        {/* Header Hero Banner */}
        <div className="bg-espresso-900 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-terracotta flex items-center justify-center font-black text-2xl shadow-lg mb-3">
              JM
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-wide">
              JAMAL CAFÉ &amp; BAKERY
            </h1>
            <p className="text-xs text-warmgray-300 mt-1">
              ระบบแคชเชียร์และจัดการร้าน (Web POS Authentication)
            </p>
          </div>
          {/* Subtle decorative glow */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-terracotta/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-matcha/20 rounded-full blur-2xl"></div>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Role Selector Tabs (FR-01) */}
          <div>
            <label className="block text-xs font-bold text-espresso-900 mb-2 uppercase tracking-wider text-center">
              เลือกสิทธิ์การเข้าใช้งาน (Select Role)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cashier', label: 'Cashier', sub: 'พนักงานขาย' },
                { id: 'admin', label: 'Admin', sub: 'ผู้จัดการร้าน' },
                { id: 'operator', label: 'Barista', sub: 'พนักงานชง' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleSelect(r.id)}
                  className={`py-3 px-2 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                    selectedRole === r.id
                      ? 'border-terracotta bg-terracotta-light text-terracotta ring-2 ring-terracotta font-bold'
                      : 'border-cream-300 bg-white text-espresso-900 hover:bg-cream-100 font-semibold'
                  }`}
                >
                  <span className="text-xs sm:text-sm">{r.label}</span>
                  <span className="text-[10px] text-warmgray-500 font-normal">{r.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Demo Autofill Notice */}
          <div className="p-3 bg-cream-100 rounded-2xl border border-cream-300 text-xs flex items-center justify-between">
            <span className="text-warmgray-600">
              บัญชีทดสอบ: <strong className="text-espresso-900">{username}</strong> (PIN: <code className="bg-cream-300 px-1 py-0.5 rounded font-mono">{DEMO_ACCOUNTS.find(a => a.role === selectedRole)?.pin}</code>)
            </span>
            <button
              type="button"
              onClick={() => {
                const demo = DEMO_ACCOUNTS.find((a) => a.role === selectedRole);
                if (demo) {
                  setUsername(demo.username);
                  setPin(demo.pin);
                }
              }}
              className="text-[11px] text-terracotta font-bold hover:underline"
            >
              เติมอัตโนมัติ
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Username / Staff ID */}
            <div>
              <label className="block text-xs font-bold text-espresso-900 mb-1.5">
                รหัสพนักงาน หรือ ชื่อผู้ใช้ (Staff ID)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-warmgray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="เช่น cashier01 หรือ admin01"
                  className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-cream-300 rounded-2xl text-xs sm:text-sm font-semibold text-espresso-900 focus:outline-none focus:ring-2 focus:ring-terracotta"
                />
              </div>
            </div>

            {/* PIN Code Display */}
            <div>
              <label className="block text-xs font-bold text-espresso-900 mb-1.5 flex justify-between items-center">
                <span>รหัส PIN 4 หลัก (Security PIN)</span>
                <span className="text-[11px] text-warmgray-400 font-mono">
                  {pin.length}/4
                </span>
              </label>
              <div className="flex items-center justify-center gap-3 py-2">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`w-12 h-14 rounded-2xl border flex items-center justify-center text-xl font-bold font-mono transition-all ${
                      pin[index]
                        ? 'border-terracotta bg-terracotta-light text-terracotta shadow-sm'
                        : 'border-cream-300 bg-cream-50 text-warmgray-300'
                    }`}
                  >
                    {pin[index] ? '●' : ''}
                  </div>
                ))}
              </div>
            </div>

            {/* Touchpad / Keypad (NFR-02) */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handlePinKeyClick(String(num))}
                  className="py-3 bg-cream-100 hover:bg-cream-200 active:bg-cream-300 rounded-2xl font-mono text-base font-extrabold text-espresso-900 transition border border-cream-200"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPin('')}
                className="py-3 bg-cream-100 hover:bg-cream-200 active:bg-cream-300 rounded-2xl text-xs font-bold text-warmgray-600 transition border border-cream-200"
              >
                ล้าง
              </button>
              <button
                type="button"
                onClick={() => handlePinKeyClick('0')}
                className="py-3 bg-cream-100 hover:bg-cream-200 active:bg-cream-300 rounded-2xl font-mono text-base font-extrabold text-espresso-900 transition border border-cream-200"
              >
                0
              </button>
              <button
                type="button"
                onClick={handlePinBackspace}
                className="py-3 bg-cream-100 hover:bg-cream-200 active:bg-cream-300 rounded-2xl text-xs font-bold text-warmgray-600 transition border border-cream-200"
              >
                ลบ
              </button>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || pin.length < 4}
              className="w-full py-4 bg-terracotta hover:bg-terracotta-hover disabled:bg-warmgray-300 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg transition flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>เข้าสู่ระบบ (Sign In)</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Security Policy Badge (NFR-04) */}
          <div className="pt-2 border-t border-cream-200 flex items-center justify-center gap-2 text-warmgray-500 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-terracotta shrink-0" />
            <span>NFR-04: ระบบจะ Logout อัตโนมัติเมื่อไม่มีการใช้งาน 15 นาที</span>
          </div>
        </div>
      </div>
    </div>
  );
}
