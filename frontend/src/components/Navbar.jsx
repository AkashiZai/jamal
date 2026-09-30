import React from 'react';
import { Coffee, LogOut, Clock, ShieldCheck, User } from 'lucide-react';

export default function Navbar({ currentUser, onLogout, onNavigate, currentPage }) {
  return (
    <header className="bg-espresso-900 text-white px-4 py-3 flex flex-wrap items-center justify-between border-b border-espresso-700 shadow-md sticky top-0 z-40">
      {/* Brand */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-terracotta flex items-center justify-center font-extrabold text-white text-base shadow-sm">
          JM
        </div>
        <div>
          <div className="font-bold tracking-wide flex items-center gap-2 text-sm sm:text-base">
            JAMAL CAFÉ &amp; BAKERY
            <span className="bg-matcha text-white text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold">
              POS v1.0
            </span>
          </div>
          <div className="text-warmgray-400 text-xs hidden sm:block">
            Point of Sale Web Application (iPad Touchscreen Ready)
          </div>
        </div>
      </div>

      {/* Center Nav Link */}
      <div className="flex items-center gap-1.5 bg-espresso-800 p-1 rounded-xl border border-espresso-700 text-xs">
        <button
          onClick={() => onNavigate('pos')}
          className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
            currentPage === 'pos'
              ? 'bg-terracotta text-white shadow'
              : 'text-warmgray-400 hover:text-white'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          <span>หน้าขาย (POS)</span>
        </button>
        <button
          onClick={() => onNavigate('login')}
          className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
            currentPage === 'login'
              ? 'bg-terracotta text-white shadow'
              : 'text-warmgray-400 hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>เข้าสู่ระบบ (Login)</span>
        </button>
      </div>

      {/* User Info & Actions */}
      <div className="flex items-center space-x-3">
        {currentUser ? (
          <>
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-white flex items-center gap-1 justify-end">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                {currentUser.name}
              </span>
              <span className="text-[11px] text-warmgray-400 font-mono">
                สิทธิ์: <strong className="text-terracotta-light">{currentUser.roleName}</strong>
              </span>
            </div>

            <button
              onClick={onLogout}
              title="ออกจากระบบ (Logout)"
              className="p-2 rounded-xl bg-espresso-800 hover:bg-espresso-700 text-warmgray-200 hover:text-red-400 border border-espresso-700 transition flex items-center gap-1 text-xs font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">ออกจากระบบ</span>
            </button>
          </>
        ) : (
          <span className="text-xs text-warmgray-400 font-mono bg-espresso-800 px-3 py-1.5 rounded-xl border border-espresso-700">
            Guest (ยังไม่เข้าสู่ระบบ)
          </span>
        )}
      </div>
    </header>
  );
}
