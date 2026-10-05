import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  Package,
  Coffee,
  Receipt,
  Users,
  TrendingUp,
  AlertTriangle,
  Plus,
  Edit2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Search,
  RefreshCw,
} from 'lucide-react';
import { DEMO_ACCOUNTS } from './LoginPage';

export default function AdminDashboardPage() {
  const {
    products,
    addProduct,
    salesStats,
    salesHistory,
    restockProduct,
    updateProductPrice,
    voidOrder,
  } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'inventory' | 'menu' | 'sales' | 'staff'
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [tempPrice, setTempPrice] = useState('');
  const [salesSearch, setSalesSearch] = useState('');

  // Add menu modal state
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [newMenuForm, setNewMenuForm] = useState({
    name: '',
    category: 'coffee',
    price: '',
    cost: '',
    desc: '',
  });

  // Add staff modal state
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [staffAccounts, setStaffAccounts] = useState(DEMO_ACCOUNTS);
  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    role: 'Cashier',
    username: '',
    pin: '',
    shift: 'กะเช้า (07:00 - 15:30)',
  });

  // Bakery items for Inventory section
  const bakeryProducts = products.filter(
    (p) => p.isBakery || p.category === 'bakery' || p.category === 'dessert'
  );

  // Calculate low stock items count (< 5 pieces)
  const lowStockCount = bakeryProducts.filter(
    (p) => p.stock !== null && p.stock < 5
  ).length;

  const handlePriceSave = (id) => {
    if (tempPrice && !isNaN(tempPrice) && Number(tempPrice) > 0) {
      updateProductPrice(id, Number(tempPrice));
    }
    setEditingPriceId(null);
  };

  const handleQuickRestock = (productId, count) => {
    restockProduct(productId, count);
  };

  const handleAddMenuSubmit = (e) => {
    e.preventDefault();
    if (!newMenuForm.name || !newMenuForm.price) return;
    addProduct({
      name: newMenuForm.name,
      category: newMenuForm.category,
      price: Number(newMenuForm.price),
      cost: Number(newMenuForm.cost || 0),
      desc: newMenuForm.desc || 'เมนูใหม่ประจำร้าน',
      img: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&q=80',
      customizable: newMenuForm.category === 'coffee' || newMenuForm.category === 'non-coffee',
      isBakery: newMenuForm.category === 'bakery' || newMenuForm.category === 'dessert',
      stock: newMenuForm.category === 'bakery' || newMenuForm.category === 'dessert' ? 10 : null,
    });
    setShowAddMenuModal(false);
    setNewMenuForm({
      name: '',
      category: 'coffee',
      price: '',
      cost: '',
      desc: '',
    });
  };

  const handleAddStaffSubmit = (e) => {
    e.preventDefault();
    if (!newStaffForm.name || !newStaffForm.username || !newStaffForm.pin) return;
    const roleNameMap = {
      Admin: 'ผู้ดูแลระบบ (เข้าถึงได้ทุกส่วนงาน)',
      Cashier: 'แคชเชียร์ (ขายหน้าร้าน, คิดเงิน, ปิดกะ)',
      Barista: 'บาริสต้า (จอคิวครัว KDS, ทำเครื่องดื่ม)',
    };
    const newAcc = {
      id: `staff-${Date.now()}`,
      name: newStaffForm.name,
      role: newStaffForm.role,
      roleName: roleNameMap[newStaffForm.role] || newStaffForm.role,
      username: newStaffForm.username,
      pin: newStaffForm.pin,
      shift: newStaffForm.shift,
    };
    setStaffAccounts((prev) => [...prev, newAcc]);
    setShowAddStaffModal(false);
    setNewStaffForm({
      name: '',
      role: 'Cashier',
      username: '',
      pin: '',
      shift: 'กะเช้า (07:00 - 15:30)',
    });
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-cream-100 font-sans min-h-[calc(100vh-100px)]">
      {/* ========================================================================= */}
      {/* SIDEBAR NAVIGATION (Matches Figma 04_admin_dashboard.svg 240px)          */}
      {/* ========================================================================= */}
      <aside className="w-full md:w-64 bg-cream-200 border-r border-cream-300 flex flex-col justify-between shrink-0">
        <div>
          {/* Admin Tag */}
          <div className="p-4 border-b border-cream-300 bg-cream-50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-terracotta flex items-center justify-center font-bold text-white shadow-sm">
              JM
            </div>
            <div>
              <div className="font-bold text-sm text-espresso-900 leading-tight">
                JAMAL CAFÉ
              </div>
              <div className="text-[11px] font-medium text-terracotta">
                ADMIN PORTAL
              </div>
            </div>
          </div>

          {/* Menu links matching Figma */}
          <nav className="p-3 space-y-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center gap-2.5 ${
                activeTab === 'dashboard'
                  ? 'bg-espresso-800 text-white font-bold shadow-sm'
                  : 'text-warmgray-600 hover:bg-cream-300/50 hover:text-espresso-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>📊 แดชบอร์ดภาพรวม</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center justify-between ${
                activeTab === 'inventory'
                  ? 'bg-espresso-800 text-white font-bold shadow-sm'
                  : 'text-warmgray-600 hover:bg-cream-300/50 hover:text-espresso-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>🥐 สต็อกเบเกอรี่ (FR-03)</span>
              </div>
              {lowStockCount > 0 && (
                <span className="bg-terracotta text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {lowStockCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center gap-2.5 ${
                activeTab === 'menu'
                  ? 'bg-espresso-800 text-white font-bold shadow-sm'
                  : 'text-warmgray-600 hover:bg-cream-300/50 hover:text-espresso-900'
              }`}
            >
              <Coffee className="w-4 h-4" />
              <span>☕ จัดการเมนู &amp; ราคา (FR-02)</span>
            </button>

            <button
              onClick={() => setActiveTab('sales')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center gap-2.5 ${
                activeTab === 'sales'
                  ? 'bg-espresso-800 text-white font-bold shadow-sm'
                  : 'text-warmgray-600 hover:bg-cream-300/50 hover:text-espresso-900'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>🧾 ประวัติการขาย &amp; Void</span>
            </button>

            <button
              onClick={() => setActiveTab('staff')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center gap-2.5 ${
                activeTab === 'staff'
                  ? 'bg-espresso-800 text-white font-bold shadow-sm'
                  : 'text-warmgray-600 hover:bg-cream-300/50 hover:text-espresso-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>👥 จัดการสิทธิ์พนักงาน</span>
            </button>
          </nav>
        </div>

        {/* Footer profile */}
        <div className="p-3.5 border-t border-cream-300 text-xs text-warmgray-600 bg-cream-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-matcha" />
            <div>
              <div className="font-bold text-espresso-900">Admin Zai (Manager)</div>
              <div className="text-[10px] text-warmgray-500">สิทธิ์ผู้ดูแลระบบสูงสุด</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN ADMIN CONTENT AREA (Matches Figma 04_admin_dashboard.svg)            */}
      {/* ========================================================================= */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-6xl mx-auto w-full">
        {/* ===================================================================== */}
        {/* VIEW 1: DASHBOARD OVERVIEW                                            */}
        {/* ===================================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Title Header */}
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-espresso-900">
                ภาพรวมยอดขาย &amp; สต็อกสินค้าประจำวัน
              </h2>
              <p className="text-xs text-warmgray-600 mt-0.5">
                ข้อมูลสรุปแบบ Real-time ณ วันที่ 22 กันยายน 2569 (Jamal Café &amp; Bakery POS)
              </p>
            </div>

            {/* 4 KPI Cards (Matches Figma 04_admin_dashboard.svg 100%) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Sales */}
              <div className="bg-white rounded-2xl border border-cream-300 p-4 shadow-sm">
                <div className="text-xs text-warmgray-600 font-medium">ยอดขายรวมวันนี้</div>
                <div className="text-2xl font-extrabold font-mono text-espresso-900 mt-2">
                  ฿{salesStats.totalSales.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs font-semibold text-matcha flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>↑ +12% เทียบกับเมื่อวาน</span>
                </div>
              </div>

              {/* Card 2: Total Bills */}
              <div className="bg-white rounded-2xl border border-cream-300 p-4 shadow-sm">
                <div className="text-xs text-warmgray-600 font-medium">จำนวนบิลทั้งหมด</div>
                <div className="text-2xl font-extrabold font-mono text-espresso-900 mt-2">
                  {salesStats.totalBills} บิล
                </div>
                <div className="text-xs text-warmgray-600 mt-2">
                  เฉลี่ย ฿
                  {(salesStats.totalSales / (salesStats.totalBills || 1)).toFixed(2)}{' '}
                  ต่อบิล
                </div>
              </div>

              {/* Card 3: Payment Split (FR-08) */}
              <div className="bg-white rounded-2xl border border-cream-300 p-4 shadow-sm">
                <div className="text-xs text-warmgray-600 font-medium">สัดส่วนชำระเงิน (FR-08)</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-[#EEF5F8] text-[#2E6171] text-xs font-mono font-bold px-2 py-1 rounded-md border border-[#D6E6EE]">
                    PromptPay 64%
                  </span>
                  <span className="bg-[#EAF4ED] text-[#3B6E4C] text-xs font-mono font-bold px-2 py-1 rounded-md border border-[#CEE5D3]">
                    เงินสด 36%
                  </span>
                </div>
                <div className="text-xs text-warmgray-600 mt-2">
                  กระทบยอดตรง ไม่พบบิลค้าง
                </div>
              </div>

              {/* Card 4: Bakery Low Stock (FR-03) */}
              <div className="bg-white rounded-2xl border-2 border-terracotta p-4 shadow-sm">
                <div className="text-xs text-warmgray-600 font-medium">
                  เตือนสต็อกเบเกอรี่ (FR-03)
                </div>
                <div className="text-2xl font-extrabold font-mono text-terracotta mt-2">
                  {lowStockCount} รายการ
                </div>
                <div className="text-xs font-bold text-red-600 flex items-center gap-1 mt-2">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>เหลือน้อยกว่า 5 ชิ้น</span>
                </div>
              </div>
            </div>

            {/* Bakery Inventory Table (FR-03) */}
            <div className="bg-white rounded-2xl border border-cream-300 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-cream-200 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-espresso-900 text-sm sm:text-base">
                    ระบบควบคุมและตัดสต็อกเบเกอรี่รายวัน (Bakery Stock Tracking)
                  </h3>
                  <p className="text-xs text-warmgray-500">
                    อัปเดตตัดสต็อกอัตโนมัติแบบเรียลไทม์เมื่อมีการชำระเงิน (FR-03)
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className="text-xs font-semibold text-terracotta hover:underline"
                >
                  จัดการสต็อกทั้งหมด →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-cream-100 text-warmgray-600 font-semibold border-b border-cream-200">
                      <th className="py-3 px-4">SKU</th>
                      <th className="py-3 px-4">ชื่อสินค้า</th>
                      <th className="py-3 px-4">ราคา</th>
                      <th className="py-3 px-4">รับเข้าเช้า</th>
                      <th className="py-3 px-4">ขายแล้ว</th>
                      <th className="py-3 px-4">คงเหลือจริง</th>
                      <th className="py-3 px-4">สถานะ</th>
                      <th className="py-3 px-4 text-center">เติมสต็อก</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200 text-espresso-900">
                    {bakeryProducts.map((p, idx) => {
                      const sku = `BK-0${idx + 1}`;
                      const sold = p.stock !== null ? Math.max(0, 15 - p.stock) : '-';
                      const morningStock = p.stock !== null ? p.stock + sold : '-';
                      const isOutOfStock = p.stock === 0;
                      const isLowStock = p.stock !== null && p.stock > 0 && p.stock < 5;

                      return (
                        <tr key={p.id} className="hover:bg-cream-50 transition">
                          <td className="py-3 px-4 font-mono font-bold text-warmgray-600">
                            {sku}
                          </td>
                          <td className="py-3 px-4 font-medium">{p.name}</td>
                          <td className="py-3 px-4 font-mono font-bold text-terracotta">
                            ฿{p.price.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 font-mono">{morningStock}</td>
                          <td className="py-3 px-4 font-mono">{sold}</td>
                          <td className="py-3 px-4 font-mono font-bold">
                            <span
                              className={
                                isOutOfStock
                                  ? 'text-red-600'
                                  : isLowStock
                                  ? 'text-amber-600'
                                  : 'text-matcha'
                              }
                            >
                              {p.stock} ชิ้น
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {isOutOfStock ? (
                              <span className="bg-red-50 text-red-600 text-xs px-2.5 py-1 rounded-md font-bold border border-red-200 inline-block">
                                หมด (Out)
                              </span>
                            ) : isLowStock ? (
                              <span className="bg-[#FFF5E6] text-[#C97D28] text-xs px-2.5 py-1 rounded-md font-bold border border-[#F7E2C4] inline-block">
                                ใกล้หมด
                              </span>
                            ) : (
                              <span className="bg-[#EAF4ED] text-[#3B6E4C] text-xs px-2.5 py-1 rounded-md font-bold border border-[#CEE5D3] inline-block">
                                พร้อมขาย
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleQuickRestock(p.id, 5)}
                                className="px-2 py-1 bg-cream-200 hover:bg-cream-300 text-espresso-900 rounded font-mono text-xs font-bold transition border border-cream-300"
                                title="เติม 5 ชิ้น"
                              >
                                +5
                              </button>
                              <button
                                onClick={() => handleQuickRestock(p.id, 10)}
                                className="px-2 py-1 bg-cream-200 hover:bg-cream-300 text-espresso-900 rounded font-mono text-xs font-bold transition border border-cream-300"
                                title="เติม 10 ชิ้น"
                              >
                                +10
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top 5 Best Sellers Row (Matches Figma 04_admin_dashboard.svg) */}
            <div className="bg-white rounded-2xl border border-cream-300 p-5 shadow-sm">
              <h3 className="font-bold text-sm sm:text-base text-espresso-900 mb-4">
                🏆 5 อันดับเมนูขายดีประจำวัน (Top 5 Best Sellers)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {/* #1 */}
                <div className="p-3 rounded-xl bg-cream-50 border border-cream-300 flex flex-col justify-between">
                  <div className="text-[10px] font-bold text-[#C97D28]">#1 เมนูขายดี</div>
                  <div className="font-bold text-xs sm:text-sm text-espresso-900 mt-1">
                    เอสเพรสโซ่เย็น
                  </div>
                  <div className="text-xs font-mono text-warmgray-600 mt-2">
                    38 แก้ว • ฿2,470
                  </div>
                </div>

                {/* #2 */}
                <div className="p-3 rounded-xl bg-cream-50 border border-cream-300 flex flex-col justify-between">
                  <div className="text-[10px] font-bold text-warmgray-500">#2 เมนูขายดี</div>
                  <div className="font-bold text-xs sm:text-sm text-espresso-900 mt-1">
                    มัทฉะลาเต้อูจิ
                  </div>
                  <div className="text-xs font-mono text-warmgray-600 mt-2">
                    26 แก้ว • ฿2,210
                  </div>
                </div>

                {/* #3 */}
                <div className="p-3 rounded-xl bg-cream-50 border border-cream-300 flex flex-col justify-between">
                  <div className="text-[10px] font-bold text-warmgray-500">#3 เมนูขายดี</div>
                  <div className="font-bold text-xs sm:text-sm text-espresso-900 mt-1">
                    ครัวซองต์เนยสด AOP
                  </div>
                  <div className="text-xs font-mono text-warmgray-600 mt-2">
                    21 ชิ้น • ฿1,785
                  </div>
                </div>

                {/* #4 */}
                <div className="p-3 rounded-xl bg-cream-50 border border-cream-300 flex flex-col justify-between">
                  <div className="text-[10px] font-bold text-warmgray-500">#4 เมนูขายดี</div>
                  <div className="font-bold text-xs sm:text-sm text-espresso-900 mt-1">
                    อเมริกาโน่น้ำส้ม
                  </div>
                  <div className="text-xs font-mono text-warmgray-600 mt-2">
                    18 แก้ว • ฿1,530
                  </div>
                </div>

                {/* #5 */}
                <div className="p-3 rounded-xl bg-cream-50 border border-cream-300 flex flex-col justify-between">
                  <div className="text-[10px] font-bold text-warmgray-500">#5 เมนูขายดี</div>
                  <div className="font-bold text-xs sm:text-sm text-espresso-900 mt-1">
                    เค้กแครอทครีมชีส
                  </div>
                  <div className="text-xs font-mono text-warmgray-600 mt-2">
                    12 ชิ้น • ฿1,140
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VIEW 2: INVENTORY MANAGEMENT                                          */}
        {/* ===================================================================== */}
        {activeTab === 'inventory' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-espresso-900">
                ระบบจัดการคลังสต็อกเบเกอรี่ (Bakery Inventory Control)
              </h2>
              <p className="text-xs text-warmgray-600 mt-0.5">
                ข้อกำหนด FR-03: ตรวจสอบและเติมสต็อกสินค้าเบเกอรี่และของหวาน
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-cream-300 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-sm text-espresso-900">
                  รายการสินค้าในคลัง ({bakeryProducts.length} รายการ)
                </span>
                <span className="text-xs text-warmgray-500">
                  เตือนเมื่อสต็อก &lt; 5 ชิ้น
                </span>
              </div>

              <div className="space-y-3">
                {bakeryProducts.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-cream-200 bg-cream-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-sm text-espresso-900">
                        {item.name}
                      </div>
                      <div className="text-xs text-warmgray-500 mt-0.5">
                        ราคาขาย: ฿{item.price.toFixed(2)} • สต็อกปัจจุบัน:{' '}
                        <strong className="text-espresso-900 font-mono">
                          {item.stock} ชิ้น
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuickRestock(item.id, 5)}
                        className="px-3 py-1.5 bg-espresso-800 hover:bg-espresso-700 text-white rounded-lg text-xs font-bold transition"
                      >
                        + เติม 5 ชิ้น
                      </button>
                      <button
                        onClick={() => handleQuickRestock(item.id, 10)}
                        className="px-3 py-1.5 bg-terracotta hover:bg-terracotta-hover text-white rounded-lg text-xs font-bold transition"
                      >
                        + เติม 10 ชิ้น
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VIEW 3: MENU MANAGEMENT & PRICING (FR-02)                             */}
        {/* ===================================================================== */}
        {activeTab === 'menu' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-espresso-900">
                  จัดการรายการเมนู &amp; กำหนดราคา (FR-02)
                </h2>
                <p className="text-xs text-warmgray-600 mt-0.5">
                  แก้ไขราคาขาย เปิด/ปิดการจำหน่ายเมนูเครื่องดื่มและเบเกอรี่
                </p>
              </div>
              <button
                onClick={() => setShowAddMenuModal(true)}
                className="px-4 py-2 bg-terracotta hover:bg-terracotta-hover text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>+ เพิ่มเมนูใหม่</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-cream-300 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-cream-200 font-bold text-sm text-espresso-900">
                รายการเมนูทั้งหมด ({products.length} รายการ)
              </div>
              <div className="divide-y divide-cream-200">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-cream-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.img}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover border border-cream-300"
                      />
                      <div>
                        <div className="font-bold text-sm text-espresso-900">
                          {prod.name}
                        </div>
                        <div className="text-xs text-warmgray-500">{prod.desc}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      {editingPriceId === prod.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            className="w-20 px-2 py-1 text-sm border border-terracotta rounded-lg font-mono focus:outline-none"
                            placeholder="ราคา"
                            autoFocus
                          />
                          <button
                            onClick={() => handlePriceSave(prod.id)}
                            className="px-2.5 py-1 bg-matcha text-white rounded-lg text-xs font-bold"
                          >
                            บันทึก
                          </button>
                          <button
                            onClick={() => setEditingPriceId(null)}
                            className="px-2 py-1 bg-cream-200 text-espresso-800 rounded-lg text-xs font-bold"
                          >
                            ยกเลิก
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-terracotta">
                            ฿{prod.price.toFixed(2)}
                          </span>
                          <button
                            onClick={() => {
                              setEditingPriceId(prod.id);
                              setTempPrice(prod.price.toString());
                            }}
                            className="p-1.5 text-warmgray-500 hover:text-espresso-900 hover:bg-cream-200 rounded-lg transition"
                            title="แก้ไขราคา"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VIEW 4: SALES HISTORY & VOID AUDIT (FR-07, FR-08)                     */}
        {/* ===================================================================== */}
        {activeTab === 'sales' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-espresso-900">
                ประวัติการขาย &amp; รายการบิลย้อนหลัง (Sales &amp; Void Audit)
              </h2>
              <p className="text-xs text-warmgray-600 mt-0.5">
                ข้อกำหนด FR-07 (ระบบตรวจสอบ Void) และ FR-08 (รายงานยอดขาย)
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-cream-300 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-cream-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <span className="font-bold text-sm text-espresso-900">
                  บันทึกประวัติการออกใบเสร็จ ({salesHistory.length} รายการ)
                </span>
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-warmgray-400" />
                  <input
                    type="text"
                    value={salesSearch}
                    onChange={(e) => setSalesSearch(e.target.value)}
                    placeholder="ค้นหาเลขที่บิล หรือคิว..."
                    className="w-full pl-8 pr-3 py-1.5 bg-cream-100 border border-cream-300 rounded-lg text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-cream-100 text-warmgray-600 font-semibold border-b border-cream-200">
                      <th className="py-2.5 px-4">เลขที่บิล</th>
                      <th className="py-2.5 px-4">เวลา</th>
                      <th className="py-2.5 px-4">คิว</th>
                      <th className="py-2.5 px-4">รายการสินค้า</th>
                      <th className="py-2.5 px-4">วิธีชำระ</th>
                      <th className="py-2.5 px-4">ยอดเงิน</th>
                      <th className="py-2.5 px-4">สถานะ</th>
                      <th className="py-2.5 px-4 text-center">จัดการ Void</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200 text-espresso-900">
                    {salesHistory
                      .filter(
                        (s) =>
                          !salesSearch ||
                          s.receiptNo.toLowerCase().includes(salesSearch.toLowerCase()) ||
                          s.queueNo.toLowerCase().includes(salesSearch.toLowerCase())
                      )
                      .map((item) => {
                        const isVoided = item.status === 'voided';
                        return (
                          <tr
                            key={item.receiptNo}
                            className={`hover:bg-cream-50 transition ${
                              isVoided ? 'bg-red-50/40 text-warmgray-500' : ''
                            }`}
                          >
                            <td className="py-3 px-4 font-mono font-bold">
                              {item.receiptNo}
                            </td>
                            <td className="py-3 px-4 font-mono">{item.time}</td>
                            <td className="py-3 px-4 font-mono font-bold text-espresso-900">
                              #{item.queueNo}
                            </td>
                            <td className="py-3 px-4 max-w-xs truncate">
                              {item.itemsSummary}
                            </td>
                            <td className="py-3 px-4">{item.paymentMethod}</td>
                            <td className="py-3 px-4 font-mono font-bold">
                              ฿{item.total.toFixed(2)}
                            </td>
                            <td className="py-3 px-4">
                              {isVoided ? (
                                <span className="text-[11px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded border border-red-200">
                                  Voided
                                </span>
                              ) : (
                                <span className="text-[11px] font-bold text-matcha bg-matcha-light px-2 py-0.5 rounded border border-matcha-border">
                                  ชำระสำเร็จ
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {isVoided ? (
                                <span className="text-[10px] text-warmgray-500">
                                  {item.voidBy || 'Admin'}
                                </span>
                              ) : (
                                <button
                                  onClick={() => {
                                    if (window.confirm(`ยืนยันการ Void บิล ${item.receiptNo}?`)) {
                                      voidOrder(item.receiptNo, 'Admin Zai');
                                    }
                                  }}
                                  className="text-[11px] font-bold text-red-600 hover:underline px-2 py-0.5 bg-red-50 border border-red-200 rounded"
                                >
                                  Void บิล
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VIEW 5: STAFF & PERMISSIONS (FR-01)                                   */}
        {/* ===================================================================== */}
        {activeTab === 'staff' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-espresso-900">
                  จัดการบัญชีพนักงาน &amp; สิทธิ์การเข้าถึง (FR-01)
                </h2>
                <p className="text-xs text-warmgray-600 mt-0.5">
                  กำหนดสิทธิ์การใช้งานสำหรับ Cashier, Barista และ ผู้จัดการร้าน
                </p>
              </div>
              <button
                onClick={() => setShowAddStaffModal(true)}
                className="px-4 py-2 bg-terracotta hover:bg-terracotta-hover text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>+ เพิ่มบัญชีพนักงานใหม่</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-cream-300 p-5 shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {staffAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="p-4 rounded-xl border border-cream-300 bg-cream-50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-espresso-900">
                          {acc.name}
                        </span>
                        <span className="text-xs bg-espresso-800 text-white px-2 py-0.5 rounded font-mono">
                          {acc.role}
                        </span>
                      </div>
                      <div className="text-xs text-warmgray-600 mt-2 space-y-1">
                        <div>
                          ชื่อผู้ใช้: <strong className="font-mono">{acc.username}</strong>
                        </div>
                        <div>
                          PIN เข้าใช้งาน: <strong className="font-mono">{acc.pin}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-cream-200 text-[11px] text-warmgray-500">
                      สิทธิ์: {acc.roleName}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Role Permission Matrix & Audit */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-cream-300 p-5 shadow-sm">
                <h3 className="font-bold text-sm text-espresso-900 mb-1">
                  ตารางเมทริกซ์กำหนดสิทธิ์ตามบทบาท (Role Permission Matrix)
                </h3>
                <p className="text-xs text-warmgray-500 mb-4">
                  ระบบควบคุมสิทธิ์ระดับฟังก์ชัน (RBAC) ป้องกันการเข้าถึงโดยไม่ได้รับอนุญาต
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-cream-100 text-warmgray-600 border-b border-cream-200">
                        <th className="py-2.5 px-3">ฟังก์ชัน / สิทธิ์การใช้งาน</th>
                        <th className="py-2.5 px-3 text-center">Cashier</th>
                        <th className="py-2.5 px-3 text-center">Barista</th>
                        <th className="py-2.5 px-3 text-center">Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-100 text-espresso-900">
                      <tr>
                        <td className="py-2.5 px-3">1. ขายหน้าร้าน &amp; รับชำระเงิน (Cash/QR)</td>
                        <td className="py-2.5 px-3 text-center font-bold text-matcha">✓</td>
                        <td className="py-2.5 px-3 text-center font-bold text-red-500">✕</td>
                        <td className="py-2.5 px-3 text-center font-bold text-matcha">✓</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3">2. รับงานชง &amp; อัปเดตคิวครัว (KDS)</td>
                        <td className="py-2.5 px-3 text-center font-bold text-red-500">✕</td>
                        <td className="py-2.5 px-3 text-center font-bold text-matcha">✓</td>
                        <td className="py-2.5 px-3 text-center font-bold text-matcha">✓</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3">3. ดูรายงานยอดขาย &amp; รายได้ (FR-08)</td>
                        <td className="py-2.5 px-3 text-center font-bold text-red-500">✕</td>
                        <td className="py-2.5 px-3 text-center font-bold text-red-500">✕</td>
                        <td className="py-2.5 px-3 text-center font-bold text-matcha">✓</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3">4. จัดการเมนู &amp; กำหนดราคาขาย (FR-02)</td>
                        <td className="py-2.5 px-3 text-center font-bold text-red-500">✕</td>
                        <td className="py-2.5 px-3 text-center font-bold text-red-500">✕</td>
                        <td className="py-2.5 px-3 text-center font-bold text-matcha">✓</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3">5. อนุมัติการ Void / ยกเลิกบิล (FR-07)</td>
                        <td className="py-2.5 px-3 text-center text-terracotta font-medium">ร้องขอได้</td>
                        <td className="py-2.5 px-3 text-center font-bold text-red-500">✕</td>
                        <td className="py-2.5 px-3 text-center font-bold text-matcha">✓ (PIN ผู้จัดการ)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3">6. ตัดสต็อก &amp; เติมสต็อกเบเกอรี่ (FR-03)</td>
                        <td className="py-2.5 px-3 text-center font-bold text-red-500">✕</td>
                        <td className="py-2.5 px-3 text-center font-bold text-red-500">✕</td>
                        <td className="py-2.5 px-3 text-center font-bold text-matcha">✓</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-cream-300 p-5 shadow-sm">
                <h3 className="font-bold text-sm text-espresso-900 mb-1">
                  ประวัติการเข้าสู่ระบบล่าสุด
                </h3>
                <p className="text-xs text-warmgray-500 mb-4">
                  Audit Trail บันทึกการเข้าใช้งานระบบ
                </p>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-cream-50 rounded-xl border border-cream-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-espresso-900">👑 Zai (Admin)</span>
                      <span className="font-mono text-warmgray-500">07:45</span>
                    </div>
                    <div className="text-[11px] text-warmgray-600 mt-0.5">เข้าสู่ระบบผ่าน iPad 11" หน้าร้าน</div>
                  </div>
                  <div className="p-3 bg-cream-50 rounded-xl border border-cream-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-espresso-900">🛍️ Nook (Cashier)</span>
                      <span className="font-mono text-warmgray-500">08:00</span>
                    </div>
                    <div className="text-[11px] text-warmgray-600 mt-0.5">เริ่มกะขายหน้าร้าน (เปิดลิ้นชัก)</div>
                  </div>
                  <div className="p-3 bg-cream-50 rounded-xl border border-cream-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-espresso-900">☕ View (Barista)</span>
                      <span className="font-mono text-warmgray-500">08:02</span>
                    </div>
                    <div className="text-[11px] text-warmgray-600 mt-0.5">เปิดหน้าจอ KDS คิวครัว Station 1</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal: เพิ่มเมนูใหม่ (FR-02) */}
      {showAddMenuModal && (
        <div className="fixed inset-0 z-50 bg-espresso-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-cream-300 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-extrabold text-espresso-900">
              เพิ่มรายการสินค้าใหม่ (Add New Menu)
            </h3>
            <p className="text-xs text-warmgray-600 mt-0.5">
              ข้อกำหนด FR-02: เพิ่มเมนูและกำหนดราคาขายเข้าสู่ระบบ POS หน้าร้าน
            </p>

            <form onSubmit={handleAddMenuSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-espresso-900 mb-1">
                  ชื่อเมนู *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น คาราเมลมัคคิอาโต้เย็น"
                  value={newMenuForm.name}
                  onChange={(e) =>
                    setNewMenuForm({ ...newMenuForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-cream-300 rounded-xl bg-cream-50/50 focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-espresso-900 mb-1">
                    หมวดหมู่ *
                  </label>
                  <select
                    value={newMenuForm.category}
                    onChange={(e) =>
                      setNewMenuForm({ ...newMenuForm, category: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-cream-300 rounded-xl bg-cream-50/50 focus:outline-none focus:border-terracotta"
                  >
                    <option value="coffee">☕ กาแฟสด</option>
                    <option value="non-coffee">🍵 ชา &amp; เครื่องดื่ม</option>
                    <option value="bakery">🥐 เบเกอรี่สด</option>
                    <option value="dessert">🍰 ของหวาน</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-espresso-900 mb-1">
                    ราคาขายหน้าร้าน (บาท) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="75"
                    value={newMenuForm.price}
                    onChange={(e) =>
                      setNewMenuForm({ ...newMenuForm, price: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-cream-300 rounded-xl bg-cream-50/50 font-mono focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-espresso-900 mb-1">
                  คำอธิบายเมนู
                </label>
                <input
                  type="text"
                  placeholder="เช่น หอมคาราเมล หวานนุ่มละมุน"
                  value={newMenuForm.desc}
                  onChange={(e) =>
                    setNewMenuForm({ ...newMenuForm, desc: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-cream-300 rounded-xl bg-cream-50/50 focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setShowAddMenuModal(false)}
                  className="px-4 py-2 bg-cream-200 hover:bg-cream-300 text-espresso-800 rounded-xl text-xs font-bold transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-terracotta hover:bg-terracotta-hover text-white rounded-xl text-xs font-bold transition"
                >
                  ✓ บันทึกและเพิ่มเมนู
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: เพิ่มบัญชีพนักงานใหม่ (FR-01) */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-espresso-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-cream-300 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-extrabold text-espresso-900">
              เพิ่มบัญชีพนักงานใหม่ (Add Staff Account)
            </h3>
            <p className="text-xs text-warmgray-600 mt-0.5">
              ข้อกำหนด FR-01: กำหนดบทบาทและรหัส PIN 4 หลักสำหรับเข้าใช้งานระบบ
            </p>

            <form onSubmit={handleAddStaffSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-espresso-900 mb-1">
                  ชื่อ-นามสกุลพนักงาน *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น แพรวพรรณ (คุณแพรว)"
                  value={newStaffForm.name}
                  onChange={(e) =>
                    setNewStaffForm({ ...newStaffForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-cream-300 rounded-xl bg-cream-50/50 focus:outline-none focus:border-terracotta"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-espresso-900 mb-1">
                  บทบาท / สิทธิ์การใช้งาน *
                </label>
                <select
                  value={newStaffForm.role}
                  onChange={(e) =>
                    setNewStaffForm({ ...newStaffForm, role: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-cream-300 rounded-xl bg-cream-50/50 focus:outline-none focus:border-terracotta"
                >
                  <option value="Cashier">🛍️ แคชเชียร์ (ขายหน้าร้าน, คิดเงิน)</option>
                  <option value="Barista">☕ บาริสต้า (ห้องครัว, จอ KDS)</option>
                  <option value="Admin">👑 ผู้จัดการร้าน (สิทธิ์เต็มรูปแบบ, Void บิล)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-espresso-900 mb-1">
                    ชื่อผู้ใช้ (Username) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="cashier2"
                    value={newStaffForm.username}
                    onChange={(e) =>
                      setNewStaffForm({ ...newStaffForm, username: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-cream-300 rounded-xl bg-cream-50/50 font-mono focus:outline-none focus:border-terracotta"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-espresso-900 mb-1">
                    รหัส PIN 4 หลัก *
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    placeholder="2580"
                    value={newStaffForm.pin}
                    onChange={(e) =>
                      setNewStaffForm({ ...newStaffForm, pin: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-cream-300 rounded-xl bg-cream-50/50 font-mono tracking-widest focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 bg-cream-200 hover:bg-cream-300 text-espresso-800 rounded-xl text-xs font-bold transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-terracotta hover:bg-terracotta-hover text-white rounded-xl text-xs font-bold transition"
                >
                  ✓ บันทึกบัญชีพนักงาน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
