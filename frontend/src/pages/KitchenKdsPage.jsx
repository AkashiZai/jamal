import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Coffee,
  CheckCircle,
  Clock,
  Volume2,
  VolumeX,
  PlusCircle,
  Sparkles,
  RotateCcw,
  CheckCheck,
  UtensilsCrossed,
} from 'lucide-react';

export default function KitchenKdsPage() {
  const { orders, updateOrderStatus, createOrder, playChime } = useApp();
  const [filterType, setFilterType] = useState('all'); // 'all' | 'beverage' | 'bakery'
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Group active orders by Kanban stage
  const pendingOrders = useMemo(
    () => orders.filter((o) => o.status === 'pending'),
    [orders]
  );
  const inProgressOrders = useMemo(
    () => orders.filter((o) => o.status === 'in_progress'),
    [orders]
  );
  const readyOrders = useMemo(
    () => orders.filter((o) => o.status === 'ready'),
    [orders]
  );
  const activeCount = pendingOrders.length + inProgressOrders.length + readyOrders.length;

  // Filter items inside a ticket if user chose beverage or bakery filter
  const filterTicketItems = (items) => {
    if (filterType === 'all') return items;
    if (filterType === 'beverage') return items.filter((i) => i.isBeverage !== false);
    if (filterType === 'bakery') return items.filter((i) => i.isBakery === true);
    return items;
  };

  const handleAdvanceStatus = (orderId, currentStatus) => {
    if (soundEnabled) {
      playChime(currentStatus === 'in_progress' ? 'bell' : 'notification');
    }
    if (currentStatus === 'pending') {
      updateOrderStatus(orderId, 'in_progress');
    } else if (currentStatus === 'in_progress') {
      updateOrderStatus(orderId, 'ready');
    } else if (currentStatus === 'ready') {
      updateOrderStatus(orderId, 'completed');
    }
  };

  // Quick helper to simulate an incoming order for demonstration
  const handleQuickDemoOrder = () => {
    createOrder({
      items: [
        {
          id: 'c1',
          name: 'เอสเพรสโซ่เย็น',
          quantity: 1,
          optionsText: 'หวาน 25% • นมโอ๊ต',
          category: 'coffee',
        },
        {
          id: 'b1',
          name: 'ครัวซองต์เนยสด AOP',
          quantity: 1,
          optionsText: 'อบอุ่นร้อน',
          category: 'bakery',
        },
      ],
      totalAmount: 150.0,
      paymentMethod: 'PromptPay',
      tableNo: '02',
      channel: 'จำลองออเดอร์ใหม่',
      cashierName: 'ทดสอบระบบ',
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-cream-100 font-sans min-h-[calc(100vh-100px)]">
      {/* ========================================================================= */}
      {/* TOP KDS HEADER BAR (Matches Figma 03_kitchen_kds_queue.svg)              */}
      {/* ========================================================================= */}
      <div className="bg-espresso-900 text-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between border-b border-espresso-800 gap-3">
        {/* Title & Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-matcha flex items-center justify-center text-white shadow-sm">
            <Coffee className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold tracking-wider text-white flex items-center gap-2">
              JAMAL KITCHEN &amp; BARISTA KDS
              <span className="bg-matcha/20 text-matcha-border text-[10px] px-2 py-0.5 rounded-full font-mono border border-matcha/40">
                LIVE QUEUE
              </span>
            </h1>
            <p className="text-[11px] text-warmgray-400">
              ระบบจัดการคิวครัว บาริสต้า และการเตรียมสินค้า (TOR Operator 1-5)
            </p>
          </div>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Active order badge */}
          <span className="bg-espresso-800 px-3 py-1.5 rounded-lg border border-espresso-700 text-warmgray-300 font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            {activeCount} คิวกำลังดำเนินการ
          </span>

          {/* Filter Pills */}
          <div className="bg-espresso-800 p-0.5 rounded-lg border border-espresso-700 flex items-center">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md transition font-medium ${
                filterType === 'all'
                  ? 'bg-terracotta text-white'
                  : 'text-warmgray-400 hover:text-white'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setFilterType('beverage')}
              className={`px-2.5 py-1 rounded-md transition font-medium ${
                filterType === 'beverage'
                  ? 'bg-terracotta text-white'
                  : 'text-warmgray-400 hover:text-white'
              }`}
            >
              ☕ เครื่องดื่ม
            </button>
            <button
              onClick={() => setFilterType('bakery')}
              className={`px-2.5 py-1 rounded-md transition font-medium ${
                filterType === 'bakery'
                  ? 'bg-terracotta text-white'
                  : 'text-warmgray-400 hover:text-white'
              }`}
            >
              🥐 เบเกอรี่
            </button>
          </div>

          {/* Sound Alert Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'ปิดเสียงแจ้งเตือน' : 'เปิดเสียงแจ้งเตือน'}
            className={`p-1.5 rounded-lg border transition flex items-center gap-1 ${
              soundEnabled
                ? 'bg-matcha/20 text-matcha-border border-matcha/40'
                : 'bg-espresso-800 text-warmgray-500 border-espresso-700'
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            <span className="hidden sm:inline text-[11px]">
              {soundEnabled ? 'เปิดเสียง' : 'ปิดเสียง'}
            </span>
          </button>

          {/* Quick Demo incoming order */}
          <button
            onClick={handleQuickDemoOrder}
            className="px-2.5 py-1.5 bg-terracotta hover:bg-terracotta-hover text-white rounded-lg transition font-medium flex items-center gap-1 shadow-sm"
            title="จำลองออเดอร์ใหม่เข้ามาที่หน้าจอครัว"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ จำลองคิวใหม่</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3-COLUMN KANBAN BOARD (Matches Figma 03_kitchen_kds_queue.svg)           */}
      {/* ========================================================================= */}
      <div className="flex-1 p-3 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto">
        {/* ========================================================= */}
        {/* COLUMN 1: รอดำเนินการ (Pending)                            */}
        {/* ========================================================= */}
        <div className="flex flex-col bg-cream-50 rounded-2xl border border-cream-300 shadow-sm overflow-hidden min-h-[500px]">
          {/* Header */}
          <div className="bg-[#FFF5E6] px-4 py-3.5 border-b border-[#F7E2C4] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C97D28]"></span>
              <span className="font-bold text-[#7A4B13] text-sm sm:text-base">
                รอดำเนินการ (Pending)
              </span>
            </div>
            <span className="bg-[#C97D28] text-white text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
              {pendingOrders.length}
            </span>
          </div>

          {/* Orders List */}
          <div className="flex-1 p-3.5 space-y-3.5 overflow-y-auto max-h-[700px]">
            {pendingOrders.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-warmgray-400 text-xs">
                <UtensilsCrossed className="w-8 h-8 stroke-1 text-warmgray-300 mb-2" />
                <span>ไม่มีออเดอร์รอดำเนินการ</span>
              </div>
            ) : (
              pendingOrders.map((order) => {
                const visibleItems = filterTicketItems(order.items);
                if (visibleItems.length === 0) return null;

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl border border-cream-300 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      {/* Ticket Top: Queue & Elapsed Time */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-extrabold font-mono text-espresso-900 tracking-tight">
                            #คิว {order.queueNo}
                          </span>
                          <span className="text-[11px] font-medium text-warmgray-500">
                            (โต๊ะ {order.tableNo || 'หน้าร้าน'})
                          </span>
                        </div>
                        <span className="text-xs font-mono text-warmgray-500 bg-cream-100 px-2 py-0.5 rounded-md border border-cream-200 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-warmgray-400" />
                          {order.createdAt} ({order.timeElapsed})
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-cream-200 my-2.5"></div>

                      {/* Items */}
                      <div className="space-y-2 mb-4">
                        {visibleItems.map((item, idx) => (
                          <div key={idx} className="text-xs">
                            <div className="font-bold text-espresso-900 flex items-center justify-between">
                              <span>
                                {item.quantity}x {item.name}
                              </span>
                            </div>
                            {item.optionsText && (
                              <div className="text-[11px] font-semibold text-terracotta ml-3 mt-0.5">
                                ↳ {item.optionsText}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button: Start Order */}
                    <button
                      onClick={() => handleAdvanceStatus(order.id, 'pending')}
                      className="w-full py-2.5 bg-espresso-900 hover:bg-espresso-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
                    >
                      <span>รับทำออเดอร์นี้</span>
                      <span>→</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMN 2: กำลังชง/อบ (In Progress)                         */}
        {/* ========================================================= */}
        <div className="flex flex-col bg-cream-50 rounded-2xl border border-cream-300 shadow-sm overflow-hidden min-h-[500px]">
          {/* Header */}
          <div className="bg-[#EEF5F8] px-4 py-3.5 border-b border-[#D6E6EE] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E6171] animate-ping"></span>
              <span className="font-bold text-[#1C4450] text-sm sm:text-base">
                กำลังชง/อบ (In Progress)
              </span>
            </div>
            <span className="bg-[#2E6171] text-white text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
              {inProgressOrders.length}
            </span>
          </div>

          {/* Orders List */}
          <div className="flex-1 p-3.5 space-y-3.5 overflow-y-auto max-h-[700px]">
            {inProgressOrders.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-warmgray-400 text-xs">
                <Coffee className="w-8 h-8 stroke-1 text-warmgray-300 mb-2" />
                <span>ไม่มีออเดอร์ที่กำลังปรุง</span>
              </div>
            ) : (
              inProgressOrders.map((order) => {
                const visibleItems = filterTicketItems(order.items);
                if (visibleItems.length === 0) return null;

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl border-2 border-[#8EC0E4] p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      {/* Ticket Top */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-extrabold font-mono text-espresso-900 tracking-tight">
                            #คิว {order.queueNo}
                          </span>
                          <span className="text-[11px] font-medium text-warmgray-500">
                            (โต๊ะ {order.tableNo || 'หน้าร้าน'})
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#2E6171] bg-[#EEF5F8] px-2 py-0.5 rounded-md border border-[#D6E6EE] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#2E6171]" />
                          {order.timeElapsed || 'กำลังทำ'}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-cream-200 my-2.5"></div>

                      {/* Items */}
                      <div className="space-y-2 mb-4">
                        {visibleItems.map((item, idx) => (
                          <div key={idx} className="text-xs">
                            <div className="font-bold text-espresso-900 flex items-center justify-between">
                              <span>
                                {item.quantity}x {item.name}
                              </span>
                            </div>
                            {item.optionsText && (
                              <div className="text-[11px] font-semibold text-matcha ml-3 mt-0.5">
                                ↳ {item.optionsText}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button: Finish Order */}
                    <button
                      onClick={() => handleAdvanceStatus(order.id, 'in_progress')}
                      className="w-full py-2.5 bg-matcha hover:bg-[#325d40] text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>✓ ทำเสร็จแล้ว (พร้อมเสิร์ฟ)</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMN 3: พร้อมรับที่เคาน์เตอร์ (Ready)                     */}
        {/* ========================================================= */}
        <div className="flex flex-col bg-cream-50 rounded-2xl border border-cream-300 shadow-sm overflow-hidden min-h-[500px]">
          {/* Header */}
          <div className="bg-[#EAF4ED] px-4 py-3.5 border-b border-[#CEE5D3] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3B6E4C]"></span>
              <span className="font-bold text-[#254731] text-sm sm:text-base">
                พร้อมรับที่เคาน์เตอร์ (Ready)
              </span>
            </div>
            <span className="bg-[#3B6E4C] text-white text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
              {readyOrders.length}
            </span>
          </div>

          {/* Orders List */}
          <div className="flex-1 p-3.5 space-y-3.5 overflow-y-auto max-h-[700px]">
            {readyOrders.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-warmgray-400 text-xs">
                <CheckCheck className="w-8 h-8 stroke-1 text-warmgray-300 mb-2" />
                <span>ไม่มีออเดอร์ค้างรอส่งมอบ</span>
              </div>
            ) : (
              readyOrders.map((order) => {
                const visibleItems = filterTicketItems(order.items);
                if (visibleItems.length === 0) return null;

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl border-2 border-[#A8D5B5] p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      {/* Ticket Top */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-extrabold font-mono text-matcha tracking-tight">
                            #คิว {order.queueNo}
                          </span>
                          <span className="text-[11px] font-medium text-warmgray-500">
                            (โต๊ะ {order.tableNo || 'หน้าร้าน'})
                          </span>
                        </div>
                        <span className="text-xs font-bold text-matcha bg-[#EAF4ED] px-2 py-0.5 rounded-md border border-[#CEE5D3] flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-matcha" />
                          ขานเรียกแล้ว
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-cream-200 my-2.5"></div>

                      {/* Items */}
                      <div className="space-y-2 mb-4">
                        {visibleItems.map((item, idx) => (
                          <div key={idx} className="text-xs">
                            <div className="font-bold text-espresso-900 flex items-center justify-between">
                              <span>
                                {item.quantity}x {item.name}
                              </span>
                            </div>
                            {item.optionsText && (
                              <div className="text-[11px] text-warmgray-600 ml-3 mt-0.5">
                                ↳ {item.optionsText}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button: Close / Archive Order */}
                    <button
                      onClick={() => handleAdvanceStatus(order.id, 'ready')}
                      className="w-full py-2.5 bg-cream-200 hover:bg-cream-300 text-espresso-900 border border-cream-300 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-98"
                    >
                      <span>ลูกค้ารับแล้ว (ปิดออเดอร์)</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
