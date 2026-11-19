# Test & Code Quality Reports — Jamal POS

โฟลเดอร์นี้รวบรวมรายงานผลการทดสอบคุณภาพโค้ด การวิเคราะห์ความซับซ้อนเชิงสถิติ (Static Complexity) และรายงาน Maintainability ด้วย **Plato**

---

## ลิงก์เข้าสู่รายงาน (Quick Links)

- **Plato HTML Dashboard**: [เปิดดู `reports/plato/index.html`](./plato/index.html)
- **Plato Report Data JSON**: [`reports/plato/report.json`](./plato/report.json)

---

## วิธีการรันรายงาน Plato และ Unit Test

จากโฟลเดอร์ Root หรือโฟลเดอร์ `frontend/`:

```bash
# 1. รัน Plato Static Analysis สร้างรายงานความซับซ้อนและ Maintainability
npm run plato

# 2. รัน Jest Unit Test พร้อมตรวจ Coverage และสร้างรายงาน Plato พร้อมกัน
npm run test:plato
```

---

## สรุปผลการวิเคราะห์ด้วย Plato (Plato Code Complexity & Maintainability Metrics)

ผลการวิเคราะห์ครอบคลุมทั้งไฟล์ Core Models (`models/`), ชุดทดสอบ Unit Tests (`tests/`), ชุดทดสอบ UI Tests (`tests/ui/`), ฝั่ง Backend (`server.js`) และฝั่ง Frontend UI (`public/app.js`):

| ไฟล์โมดูล / การทดสอบ | Maintainability Index (0-100) | Physical SLOC | Cyclomatic Complexity | Halstead Effort | การประเมินคุณภาพ |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **`models/CartModel.js`** | **72.7** | 111 | 26 | 234,860 | ผ่านเกณฑ์: Maintainability สูง, โครงสร้างอ่านง่าย |
| **`models/InventoryModel.js`** | **69.1** | 287 | 58 | 866,194 | ผ่านเกณฑ์: Business logic ครบถ้วน แยกหมวดชัดเจน |
| **`models/OrderQueueModel.js`** | **64.5** | 119 | 22 | 147,367 | ผ่านเกณฑ์: คิวออเดอร์และการเปลี่ยนสถานะมีเสถียรภาพ |
| **`models/StaffModel.js`** | **63.0** | 122 | 27 | 188,631 | ผ่านเกณฑ์ความซับซ้อน (<= 10 ต่อเมธอด) |
| **`tests/cart.test.js`** | **57.5** | 82 | 1 | 60,229 | ผ่านเกณฑ์: Unit Test คลุม 100% Statements |
| **`tests/inventory.test.js`** | **60.5** | 193 | 1 | 428,007 | ผ่านเกณฑ์: Unit Test 12 เคสครอบคลุมการตัดสต็อก & Void |
| **`tests/orderQueue.test.js`** | **55.2** | 85 | 1 | 53,729 | ผ่านเกณฑ์: Unit Test การจัดลำดับคิวและสถานะ |
| **`tests/staff.test.js`** | **54.7** | 130 | 1 | 113,862 | ผ่านเกณฑ์: Unit Test การยืนยันตัวตน PIN และ Session |
| **`tests/ui/admin.ui.test.js`** | **76.0** | 50 | 2 | 27,031 | ผ่านเกณฑ์: Playwright UI Test สต็อกเรียงน้อยไปมาก |
| **`tests/ui/kds.ui.test.js`** | **78.0** | 31 | 2 | 9,397 | ผ่านเกณฑ์: Playwright UI Test คิวห้องครัว |
| **`tests/ui/login.ui.test.js`** | **77.4** | 40 | 2 | 11,463 | ผ่านเกณฑ์: Playwright UI Test ตรวจสอบสิทธิ์ผู้ใช้ |
| **`tests/ui/pos.ui.test.js`** | **72.9** | 39 | 2 | 13,646 | ผ่านเกณฑ์: Playwright UI Test การสั่งซื้อและทอนเงิน |
| **`server.js`** | **66.0** | 525 | 52 | 892,191 | ผ่านเกณฑ์: REST API 16 Endpoints เชื่อมโยงโมเดล |
| **`public/app.js`** | **71.3** | 2,684 | 287 | 5,564,791 | ผ่านเกณฑ์: SPA Client logic จัดการหน้าจอและเสียงเตือน |
| **ค่าเฉลี่ยทั้งโปรเจกต์** | **67.07** | **321** | **-** | **-** | **ผ่านเกณฑ์มาตรฐานการบำรุงรักษาโค้ด (> 65)** |
