# 🎨 Figma Architecture & Design System Specification
**Project**: Café & Bakery POS (Jamal)  
**Target Devices**: iPad / Tablet Landscape (1194 × 834), Desktop (1440 × 900), Mobile (393 × 852)  
**Design Philosophy**: Human-Centered, Artisanal Warm Modernist, High-Contrast Ergonomic POS (Strictly Non-AI-Slop)

---

## 1. การจัดโครงสร้างหน้าใน Figma (Page Structure)

ตั้งชื่อ Page ในไฟล์ Figma ตามโครงสร้างโมดูลาร์ ดังนี้:

```
📁 Jamal_POS_Figma
├── 📄 00_Cover & Overview          (หน้าปก, ข้อมูลกลุ่ม, Versioning, ลิงก์ GitHub)
├── 📄 01_Design Tokens & Styles    (Color, Typography, Spacing, Shadows, Radii)
├── 📄 02_Component Library (Atoms) (Buttons, Inputs, Badges, Numpad, Status Pills)
├── 📄 03_Component Library (Molecules & Organisms) (Product Card, Cart Item, Slip, Modals)
├── 📄 04_Screens: Cashier POS (iPad) (หน้าจอขายหน้าร้าน, ปรับแต่ง Option, ชำระเงิน, สลิป)
├── 📄 05_Screens: Operator KDS (หน้าจอคิวบาริสต้า/ห้องครัว Real-time)
├── 📄 06_Screens: Admin Portal (Dashboard, สต็อกเบเกอรี่, รายการสินค้า, ประวัติการขาย)
└── 📄 07_Screens: Customer Mobile (สั่งผ่านมือถือ, ตรวจสอบสถานะคิว)
```

---

## 2. Design Tokens (โทนสีและ Typography แบบ Anti-AI-Slop)

### 2.1 Color Tokens
หลีกเลี่ยงการใช้สีนีออนม่วง/ฟ้า (Cyberpunk/Neon Purple) หรือเกรเดียนท์โปร่งแสงที่อ่านยาก ให้ใช้สีที่ให้ความรู้สึกของคาเฟ่จริง อบอุ่น สบายตา และมี Contrast ผ่านเกณฑ์ WCAG AA สำหรับงานหน้าร้าน:

| Token Name | Hex Code | บทบาทการใช้งาน |
| :--- | :--- | :--- |
| `color-surface-bg` | `#FBF8F4` | พื้นหลังหลัก (Warm Alabaster / Cream) ไม่แสบตาเมื่อมองนาน |
| `color-surface-card` | `#FFFFFF` | การ์ดสินค้าและพาเนลทำงาน |
| `color-surface-sidebar` | `#F5EFEB` | พื้นหลัง Sidebar ตะกร้าสินค้า |
| `color-border-subtle` | `#EAE3D8` | เส้นขอบและเส้นแบ่งส่วน |
| `color-text-primary` | `#1E1B18` | ข้อความหลัก สีดำถ่านคั่วเข้ม คอนทราสต์สูง อ่านง่าย |
| `color-text-secondary` | `#635C54` | ข้อความรอง คำอธิบาย รายละเอียด Option |
| `color-text-muted` | `#968E85` | วันที่, รหัสบิล, ตัวเลข placeholder |
| `color-brand-primary` | `#231710` | สีหลัก Espresso Roast (ปุ่มหลัก, Header สำคัญ) |
| `color-brand-accent` | `#C85A32` | สี Terracotta Cinnamon (ปุ่ม Call-to-action, จุดเน้นสำคัญ) |
| `color-status-success` | `#3B6E4C` | สี Sage Matcha (สถานะ "Ready", "Paid", ยอดเงินทอน) |
| `color-status-warning` | `#C97D28` | สี Honey Caramel (สถานะ "Brewing", สต็อกใกล้หมด < 5) |
| `color-status-danger` | `#BA3C34` | สี Berry Crimson (สถานะ "Out of Stock", "Void", ล้างบิล) |

### 2.2 Typography Scale
- **Primary Font**: `Plus Jakarta Sans` หรือ `Inter` สำหรับภาษาอังกฤษ / ตัวเลข
- **Thai Font**: `Sarabun` หรือ `Noto Sans Thai` หรือ `Sukhumvit`
- **Monospaced Font (สำหรับบิลและตัวเลข)**: `JetBrains Mono` หรือ `Roboto Mono`

| Style Name | Size / Line Height | Weight | การใช้งาน |
| :--- | :--- | :--- | :--- |
| `Display-POS` | 32px / 40px | Bold (700) | ยอดรวมเงินสุทธิ, ตัวเลขเงินทอน |
| `Heading-1` | 24px / 32px | Bold (700) | หัวข้อหน้า, ชื่อนวมินทร์ร้าน |
| `Heading-2` | 20px / 28px | SemiBold (600) | หัวข้อ Modal, หมายเลขคิว |
| `Heading-3` | 16px / 24px | SemiBold (600) | ชื่อสินค้าบนการ์ด, ชื่อหมวดหมู่ |
| `Body-Large` | 16px / 24px | Regular/Medium | รายการในตะกร้า, ปุ่มกดหลัก |
| `Body-Medium` | 14px / 20px | Regular/Medium | รายละเอียด Option, ข้อความทั่วไป |
| `Caption` | 12px / 16px | Regular/SemiBold | Badge สต็อก, เวลาออเดอร์ |
| `Mono-Receipt` | 13px / 18px | Regular/Medium | รายการในสลิป 80mm, รหัสบิล |

### 2.3 Ergonomics & Touch Targets (NFR-02)
- **Minimum Target Size**: 48 × 48 px สำหรับปุ่มทั่วไป
- **POS Action Buttons**: 56 × 56 px หรือ 64px สำหรับปุ่มคิดเงินและ Numpad บน iPad
- **Corner Radius**: `8px` (เล็ก/ปุ่ม), `12px` (การ์ดสินค้า), `16px` (Modal & Sheet)
- **Shadows**: Soft Ambient Shadow (`0px 2px 8px rgba(35, 23, 16, 0.06)`) ไม่มีขอบเบลอหลอกตา

---

## 3. รายการ Components ใน Figma (Modular Component Library)

### 3.1 Atoms & Molecules
1. `Button/Primary`: พื้นหลัง Dark Espresso `#231710` ตัวหนังสือสีขาว
2. `Button/Accent`: พื้นหลัง Terracotta `#C85A32` สำหรับปุ่ม "ชำระเงิน"
3. `Button/Numpad`: ปุ่มแป้นตัวเลข 0-9, C, Backspace (ขนาด 64×64px สำหรับหน้าชำระเงิน)
4. `Badge/Status`:
   - `Pending` (เหลืองอำพัน `#FFF5E6` ขอบ `#F2C078`)
   - `Processing` (ฟ้าคราม `#EBF3FB` ขอบ `#8EC0E4`)
   - `Ready` (เขียวมัทฉะ `#EAF4ED` ขอบ `#7BC38E`)
   - `Low Stock` (ส้มคาราเมล แจ้งเตือนของเหลือน้อย)
   - `Out of Stock` (เทาหม่น ปิดการเลือก)
5. `Form/OptionSelector`:
   - Sweetness Radio Group (0%, 25%, 50%, 100%)
   - Milk Choice Pill Selector (Fresh Milk, Oat Milk +15, Almond +15)
   - Extra Shot Checkbox (+20)

### 3.2 Organisms
1. `Card/Product`:
   - Image 1:1 Aspect ratio
   - ชื่อภาษาไทย & อังกฤษ
   - ราคา (฿)
   - Badge สต็อกคงเหลือ (เช่น "เหลือ 3 ชิ้น") หรือ Overlay "สินค้าหมด"
2. `Cart/Sidebar`:
   - Header พร้อมจำนวนชิ้นรวม
   - Order Item Row: ชื่อ, รายการ Option ที่เลือก (ความหวาน, นม), ปุ่มลด/เพิ่มจำนวน (+/-), ราคารวม
   - Order Notes Input
   - Financial Summary (Subtotal, VAT 7%, Total)
   - Dual Action: "พักบิล" + "ชำระเงิน (฿...)"
3. `Receipt/80mm`:
   - ความกว้างเทียบเท่าเครื่องพิมพ์ความร้อน 80mm (ความกว้างสลิปใน Figma: 360px)
   - ลายน้ำหรือเส้นปรุบน-ล่าง
   - หัวบิล: ชื่อร้าน, ที่อยู่, เลขประจำตัวผู้เสียภาษี, วันที่/เวลา, พนักงานแคชเชียร์
   - ตารางรายการสินค้า, ราคารวม, ยอดรับเงิน, เงินทอน
   - PromptPay Reference / Barcode

---

## 4. แผนผังหน้าจอหลัก (Screens Specifications)

### [Screen 1] iPad POS Cashier Screen (1194 × 834)
- **Layout**: 2-Column Split View
  - Left Column (70%): Search Bar + Category Pills + Product Cards Grid (3 คอลัมน์บน iPad)
  - Right Column (30%): Order Cart Sidebar ขอบสีอบอุ่น มีปุ่ม Checkout ด้านล่าง
- **Auto-layout settings**:
  - Horizontal Hug/Fill, Gap 16px, Padding 20px

### [Screen 2] Product Customization Drawer / Modal (560 × 640)
- แสดงเมื่อแตะสินค้าที่มีตัวเลือก เช่น กาแฟ หรือชา
- ส่วนเลือกความหวาน (Sweetness Level): ปุ่มกดแบบสัมผัสง่าย 4 ระดับ
- ส่วนเลือกประเภทนม (Milk Option)
- ส่วนท็อปปิ้งเพิ่มเติม (Toppings)
- ปุ่มล่างสุด: "เพิ่มลงในบิล • ฿..."

### [Screen 3] Payment & Cash Calculator Screen (800 × 600)
- หน้าจอแยก 2 แท็บ: "เงินสด (Cash)" และ "สแกน PromptPay"
- **แท็บเงินสด**:
  - ยอดที่ต้องชำระ (ตัวเลขใหญ่)
  - ยอดเงินที่รับมา
  - แป้น Numpad พร้อมปุ่มลัดธนบัตร (พอดี, ฿100, ฿500, ฿1,000)
  - ช่องแสดง "เงินทอน" อัตโนมัติสีเขียวชัดเจน
- **แท็บ PromptPay**:
  - แสดง Dynamic QR Code ที่ฝังยอดเงินสุทธิ
  - ปุ่ม "ตรวจสอบยอดเงิน / พิมพ์ใบเสร็จ"

### [Screen 4] Barista & Kitchen Order Board (1194 × 834)
- แบ่ง 3 คอลัมน์ Kanban:
  - **รอจัดเตรียม (Pending)**: การ์ดออเดอร์สีครีมพร้อมตัวจับเวลา
  - **กำลังชง/อบ (Brewing / In Progress)**: มีปุ่ม "ทำเสร็จแล้ว"
  - **พร้อมเสิร์ฟ (Ready to Pick Up)**: มีเลขคิวตัวใหญ่สำหรับขานเรียก
- มีปุ่มกรองเฉพาะ "เครื่องดื่ม" หรือ "เบเกอรี่"

### [Screen 5] Admin Dashboard & Bakery Stock Manager (1440 × 900)
- **Top Row**: 4 Summary Cards (ยอดขายรวมวันนี้, จำนวนบิล, ยอดเฉลี่ยต่อบิล, สินค้าขายดีอันดับ 1)
- **Middle Row**: กราฟแท่งยอดขายรายชั่วโมง + ตาราง Top 5 เมนูขายดี
- **Bottom Section**: Bakery Real-time Inventory Table (มีปุ่ม Quick +/- สต็อก, ป้ายเตือน Low Stock, และปุ่มเปิด-ปิดการขาย)
