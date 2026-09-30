import React from 'react';
import { Tablet, User, LogOut, Clock, Coffee } from 'lucide-react';

export default function Navbar({ currentUser, onLogout, onNavigate, currentPage }) {
  return (
    <header className="bg-espresso-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between border-b border-espresso-700 text-xs sm:text-sm z-50 sticky top-0 shadow-md print:hidden">
      {/* Brand logo & title */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-terracotta flex items-center justify-center font-bold text-white tracking-wider shadow-sm">
          JM
        </div>
        <div>
          <div className="font-bold tracking-wide flex items-center gap-1.5">
            <span>JAMAL CAFÉ &amp; BAKERY</span>
            <span className="bg-matcha text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
              Figma Spec v1.0
            </span>
          </div>
          <div className="text-warmgray-400 text-[11px] hidden sm:block">
            Point of Sale System / Barista POS System
          </div>
        </div>
      </div>

      {/* View Navigation Tabs matching Figma */}
      <div className="flex items-center bg-espresso-800 p-1 rounded-xl border border-espresso-700 my-1 sm:my-0 space-x-1">
        <button
          onClick={() => onNavigate('pos')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
            currentPage === 'pos'
              ? 'bg-terracotta text-white shadow'
              : 'text-warmgray-400 hover:text-white'
          }`}
        >
          <Tablet className="w-4 h-4" />
          <span>1. Cashier POS (iPad)</span>
        </button>
        <button
          onClick={() => onNavigate('login')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
            currentPage === 'login'
              ? 'bg-terracotta text-white shadow'
              : 'text-warmgray-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>2. เข้าสู่ระบบ (Login)</span>
        </button>
      </div>

      {/* Right side: Device badge & User profile */}
      <div className="flex items-center space-x-3 text-xs">
        <span className="hidden md:inline-flex items-center gap-1.5 bg-espresso-800 px-2.5 py-1 rounded-md border border-espresso-700 text-warmgray-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          POS Online (iPad 11")
        </span>

        {currentUser ? (
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-warmgray-300 font-medium">
              พนักงาน: <strong className="text-white">{currentUser.name}</strong>
            </span>
            <button
              onClick={onLogout}
              title="ออกจากระบบ (Sign Out)"
              className="px-2.5 py-1 rounded-lg bg-espresso-800 hover:bg-espresso-700 text-warmgray-300 hover:text-red-400 border border-espresso-700 transition flex items-center gap-1 font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ออก</span>
            </button>
          </div>
        ) : (
          <span className="text-[11px] text-warmgray-400 bg-espresso-800 px-2.5 py-1 rounded-lg border border-espresso-700">
            Guest
          </span>
        )}
      </div>
    </header>
  );
}
