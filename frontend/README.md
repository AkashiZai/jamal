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

---

## การ Deploy บน Render (Deploy on Render)

### วิธีที่ 1: Render Blueprint (แนะนำ)
1. เข้า [Render Dashboard](https://dashboard.render.com/) → กด **New +** → เลือก **Blueprint**
2. เชื่อมต่อ Repository นี้ Render จะอ่านไฟล์ `render.yaml` ที่ Root อัตโนมัติ (ตั้งค่า `rootDir: frontend`, `buildCommand: npm ci --omit=dev`, `startCommand: node server.js`, `healthCheckPath: /healthz`, `plan: free`, `region: singapore`)
3. กด **Apply** เพื่อ Deploy

### วิธีที่ 2: สร้าง Web Service เอง (Manual)
1. กด **New +** → เลือก **Web Service** → เชื่อมต่อ Repository นี้
2. ใช้ค่าเริ่มต้นจาก Root (`Build Command: npm install`, `Start Command: npm start`) หรือกำหนด `Root Directory: frontend` พร้อม `Build Command: npm ci --omit=dev` และ `Start Command: node server.js`
3. ตั้งค่า Health Check Path เป็น `/healthz` (ไม่บังคับ) และ `NODE_ENV=production`

