# 🎨 Design & UI Assets — Jamal POS

โฟลเดอร์นี้รวบรวมไฟล์งานออกแบบ, Design Tokens, หน้าจอ Interactive Prototypes และไฟล์ Vector SVG สำหรับนำเข้า Figma

---

## 📁 โครงสร้างโฟลเดอร์ในหมวด Design

| รายการ | รายละเอียด | ลิงก์ตรง |
| :--- | :--- | :--- |
| **figma_pages/** | หน้าจอจำลอง Prototype HTML (6 หน้าจอ) และข้อกำหนด UI Spec / ไดอะแกรม | [เปิดดู figma_pages/](./figma_pages) |
| **figma_import/** | ไฟล์ Vector SVG แท้ 39 หน้าจอ สำหรับ Drag-and-drop เข้า Figma Canvas | [เปิดดู figma_import/](./figma_import) |
| **tokens.json** | ค่า Design Tokens (โทนสีอุ่นคาเฟ่, ฟอนต์ Prompt/Inter, ระยะ Spacing, Shadow) | [เปิดดู tokens.json](./tokens.json) |

---

## 🖥️ หน้าจอจำลอง Prototype HTML (`design/figma_pages/`)
- [`01_login.html`](./figma_pages/01_login.html) — หน้าเข้าสู่ระบบและระบุ PIN
- [`05_kitchen_kds.html`](./figma_pages/05_kitchen_kds.html) — จอแสดงคิวออเดอร์ในครัว/บาริสต้า (KDS)
- [`06_admin_dashboard.html`](./figma_pages/06_admin_dashboard.html) — แผงควบคุมผู้จัดการ สรุปยอดขาย
- [`07_customer_mobile.html`](./figma_pages/07_customer_mobile.html) — หน้าจอมือถือสำหรับลูกค้าสั่งและติดตามคิว
- [`08_admin_menu_management.html`](./figma_pages/08_admin_menu_management.html) — จัดการเมนู ราคา และสต็อกสินค้า
- [`09_admin_sales_history_void.html`](./figma_pages/09_admin_sales_history_void.html) — ประวัติการขายและการอนุมัติ Void บิล

## 📐 ข้อกำหนดและ Flow Diagrams
- [`FIGMA_SPEC.md`](./figma_pages/FIGMA_SPEC.md) — รายละเอียดโทเคนและขนาดหน้าจอ
- [`auth_flow_diagram.md`](./figma_pages/auth_flow_diagram.md) — ไดอะแกรมยืนยันตัวตน
- [`order_lifecycle_diagram.md`](./figma_pages/order_lifecycle_diagram.md) — วงจรออเดอร์ตั้งแต่สั่งจนถึงเสิร์ฟ
- [`admin_portal_diagram.md`](./figma_pages/admin_portal_diagram.md) — สิทธิ์และฟังก์ชันของ Admin
