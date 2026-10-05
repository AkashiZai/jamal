import React from 'react';
import {
  Tablet,
  User,
  LogOut,
  Coffee,
  BarChart3,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar({ currentUser, onLogout, onNavigate, currentPage }) {
  const app = useApp();
  const activeOrdersCount = app?.orders?.filter((o) => o.status !== 'completed').length || 0;

  const navItems = [
    {
      id: 'pos',
      label: '1. Cashier POS (iPad)',
      icon: Tablet,
      badge: null,
    },
    {
      id: 'kds',
      label: '2. Kitchen KDS (บาริสต้า/ครัว)',
      icon: Coffee,
      badge: activeOrdersCount > 0 ? activeOrdersCount : null,
      badgeColor: 'bg-amber-500',
    },
    {
      id: 'admin',
      label: '3. Admin Portal (แผงควบคุม & สต็อก)',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'customer',
      label: '4. Customer Mobile (จอลูกค้า)',
      icon: Smartphone,
      badge: null,
    },
    {
      id: 'login',
      label: '5. เข้าสู่ระบบ (Login)',
      icon: User,
      badge: null,
    },
  ];

  return (
    <header className="bg-espresso-900 text-white px-3 sm:px-5 py-2 flex flex-wrap items-center justify-between border-b border-espresso-700 text-xs sm:text-sm z-50 sticky top-0 shadow-md print:hidden gap-2">
      {/* Brand logo & title */}
      <div className="flex items-center space-x-2.5">
        <div className="w-8 h-8 rounded-lg bg-terracotta flex items-center justify-center font-bold text-white tracking-wider shadow-sm">
          JM
        </div>
        <div>
          <div className="font-bold tracking-wide flex items-center gap-1.5">
            <span>JAMAL CAFÉ &amp; BAKERY</span>
          </div>
          <div className="text-warmgray-400 text-[10px] hidden sm:block">
            All-in-One POS System (Figma Spec Suite)
          </div>
        </div>
      </div>

      {/* View Navigation Tabs matching all Figma Screens */}
      <nav className="flex items-center bg-espresso-800 p-1 rounded-xl border border-espresso-700 overflow-x-auto no-scrollbar max-w-full space-x-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap text-xs ${
                isActive
                  ? 'bg-terracotta text-white shadow font-bold'
                  : 'text-warmgray-400 hover:text-white hover:bg-espresso-700/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {item.badge !== null && (
                <span
                  className={`${
                    item.badgeColor || 'bg-terracotta'
                  } text-white font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right side: Device badge & User profile */}
      <div className="flex items-center space-x-2.5 text-xs">
        <span className="hidden xl:inline-flex items-center gap-1.5 bg-espresso-800 px-2.5 py-1 rounded-md border border-espresso-700 text-warmgray-400 font-medium text-[11px]">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          System Online
        </span>

        {currentUser ? (
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-warmgray-300 font-medium text-[11px]">
              ผู้ใช้งาน: <strong className="text-white font-bold">{currentUser.name}</strong> ({currentUser.roleName})
            </span>
            <button
              onClick={onLogout}
              title="ออกจากระบบ (Sign Out)"
              className="px-2.5 py-1 rounded-lg bg-espresso-800 hover:bg-espresso-700 text-warmgray-300 hover:text-red-400 border border-espresso-700 transition flex items-center gap-1 font-medium text-[11px]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>ออก</span>
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
