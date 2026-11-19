# คู่มือนำงานออกแบบเข้าสู่ Figma (Figma Import Guide)
**โปรเจกต์**: Jamal Café & Bakery POS  
**Figma Prototype Link**: [https://www.figma.com/design/DSn2mfMqepHiauo2lbwBFV/jamal?node-id=0-1&t=TBf61dXn3PTERRvu-1](https://www.figma.com/design/DSn2mfMqepHiauo2lbwBFV/jamal?node-id=0-1&t=TBf61dXn3PTERRvu-1)

ทางเราได้เตรียมไฟล์ Asset เวกเตอร์แยกตามหน้าจอ และไฟล์ Design Tokens ให้พร้อมนำเข้าสู่ Figma ได้ทันที 3 วิธีตามความสะดวก:

---

## วิธีที่ 1: ลากไฟล์ SVG ลง Figma Canvas ได้ทันที (เร็วที่สุด ไม่ต้องลงปลั๊กอิน)
คุณสามารถเปิดโปรแกรม Figma แล้วลากไฟล์ SVG ในโฟลเดอร์ `design/figma_import/` ไปวางบน Canvas ได้เลย โดย Figma จะแปลงเป็น **Vector Layer & Frame แท้ 100%** ที่แก้ไขตัวหนังสือ สี และปรับขนาดได้ทันที:

| ไฟล์ Artboard SVG | หน้าจอที่ได้ใน Figma | ขนาด Frame |
| :--- | :--- | :--- |
| [`01_pos_ipad_screen.svg`](./01_pos_ipad_screen.svg) | หน้าจอแคชเชียร์ขายหน้าร้าน (Cashier POS) พร้อมตะกร้าและปุ่มคิดเงิน | iPad 11" (1194 × 834) |
| [`02_payment_modal_80mm_slip.svg`](./02_payment_modal_80mm_slip.svg) | หน้าคำนวณเงินสด (Numpad) + ตัวอย่างสลิปความร้อน 80mm | Modal (1000 × 700) |
| [`03_kitchen_kds_queue.svg`](./03_kitchen_kds_queue.svg) | กระดานคิวห้องครัวและบาริสต้า (3 คอลัมน์ Kanban) | iPad 11" (1194 × 834) |
| [`04_admin_dashboard.svg`](./04_admin_dashboard.svg) | แดชบอร์ดเจ้าของร้าน + ตารางควบคุมสต็อกเบเกอรี่รายวัน (FR-03) | Desktop (1440 × 900) |
| [`05_customer_mobile.svg`](./05_customer_mobile.svg) | หน้าจอลูกค้าสแกนสั่งอาหารผ่านมือถือ + ตัวติดตามคิว | Mobile iPhone (393 × 852) |

---

## วิธีที่ 2: ใช้ปลั๊กอิน `html.to.design` ใน Figma (ได้ Auto-layout เต็มรูปแบบ)
หากต้องการให้ Figma จัดกลุ่มเป็น **Auto-layout (Flexbox)** อัตโนมัติ:
1. ใน Figma คลิกขวาเลือก **Plugins** > ค้นหา **`html.to.design`**
2. เลือกแท็บ **HTML** หรือนำไฟล์ในโฟลเดอร์ `design/figma_pages/` ไปวาง
3. ปลั๊กอินจะสร้างหน้าจอที่จัด Auto-layout พร้อมฟอนต์และ Components ให้ทันที

---

## วิธีที่ 3: นำเข้า Color & Spacing Tokens
นำไฟล์ [`design/tokens.json`](../tokens.json) ไป Import ผ่าน:
- ปลั๊กอิน **Tokens Studio for Figma** (เลือก Load Tokens > JSON File)
- หรือใช้เป็นคู่มือตั้งค่า **Local Variables** ใน Figma เพื่อคุมโทนสี Dark Espresso, Warm Cream, Terracotta และ Sage Matcha ให้ตรงกันทั้งทีม
