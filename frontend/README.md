# Jamal Café & Bakery - POS Frontend

เว็บแอปพลิเคชันระบบแคชเชียร์และจัดการร้าน (Point of Sale) พัฒนาด้วย **React 18 + Vite + Tailwind CSS** ออกแบบเฉพาะสำหรับหน้าจอสัมผัส (Touchscreen / iPad) 

## วิธีการเปิดใช้งาน (How to run)

1. ติดตั้ง Dependencies (ทำครั้งแรก):
```bash
npm install
```

2. เริ่มต้น Dev Server:
```bash
npm run dev
```

เปิด Browser ไปที่: [http://localhost:3000](http://localhost:3000)

## หน้าที่พัฒนาแล้ว (Completed Pages)

1. **Login Page (`/login`)**:
   - ระบบแยกสิทธิ์ผู้ใช้งาน (Cashier, Admin, Barista)
   - แป้นพิมพ์ตัวเลขสัมผัส 4 หลัก (Touch PIN Keypad)
   - มีปุ่ม Demo Auto-fill สำหรับทดสอบ
   - แจ้งเตือน Timeout Logout 15 นาทีตามมาตรฐานความปลอดภัย

2. **Cashier POS Main Screen (`/pos`)**:
   - ออกแบบขนาดปุ่มและช่องสัมผัสสำหรับ iPad (1194×834)
   - เมนูหมวดหมู่ (กาแฟ, ชา, เบเกอรี่, ของหวาน) และช่องค้นหาแบบเรียลไทม์
   - ป๊อปอัปปรับแต่งระดับความหวาน, นม และท็อปปิ้ง
   - ตะกร้าสินค้าด้านข้างพร้อมคำนวณภาษีมูลค่าเพิ่ม (VAT 7%)
   - ระบบชำระเงินรองรับ PromptPay QR Code และเงินสดพร้อมคำนวณเงินทอน
   - ระบบตัดสต็อกเบเกอรี่อัตโนมัติเมื่อชำระเงินสำเร็จ
   - แถบนับถอยหลัง Session Timeout 15 นาทีด้านบน
