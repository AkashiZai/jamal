# Jamal Café & Bakery - POS System (Node.js + Express)

เว็บแอปพลิเคชันระบบแคชเชียร์และจัดการร้าน (Point of Sale) พัฒนาด้วย **Node.js + Express** ล้วน (`server.js` + `public/app.js`) ออกแบบตรงตาม Figma Design Tokens & SVGs ครบถ้วนทุกหน้าจอ 100%

## วิธีการเปิดใช้งาน (How to run)

1. ติดตั้ง Dependencies:
```bash
npm install
```

2. เริ่มต้น Express Server:
```bash
npm start
```

เปิด Browser ไปที่: [http://localhost:3000](http://localhost:3000)

---

## โครงสร้างไฟล์ (Project Structure)

- `server.js` — Node.js + Express Backend Server พร้อม REST API (`/api/state`, `/api/auth/login`, `/api/orders`, `/api/products`, `/api/sales/:receiptNo/void`, `/api/staff`)
- `public/index.html` — หน้าเว็บหลักและชุดสี Design Tokens
- `public/app.js` — ระบบหน้าบ้าน Vanilla JavaScript ครบทั้ง 5 โมดูล (Cashier POS, Kitchen KDS, Admin Dashboard, Customer Mobile, Login)
- `public/style.css` — สไตล์เพิ่มเติมและระบบพิมพ์ใบเสร็จความร้อน 80mm (`@media print`)
