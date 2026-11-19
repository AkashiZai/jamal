# แผนผังกระบวนการทำงานของระบบ POS (System Workflow Flowchart)
### ตามการแบ่งส่วนงาน 4 ส่วน (Jamal Café & Bakery POS)

เอกสารนี้รวบรวม Flowchart ของระบบ **Jamal Café & Bakery Web POS** โดยแบ่งโครงสร้างตามส่วนงานและผู้รับผิดชอบ 4 ส่วนอย่างชัดเจน พร้อมโค้ด Mermaid ที่สามารถคัดลอกไปใช้งานบน **[Mermaid Live Editor](https://mermaid.live)** หรือแสดงผลบน **GitHub Markdown** ได้ทันที

---

## 1. ตารางการแบ่งส่วนงานและความรับผิดชอบ (Work Breakdown Structure)

| ส่วนที่ | ชื่อส่วนงาน (Module) | ผู้รับผิดชอบ (สมาชิก) | ข้อกำหนดที่รับผิดชอบ | หน้าจอที่ส่งมอบ (Screens & Assets) |
| :---: | :--- | :--- | :--- | :--- |
| **ส่วนที่ 1** | **ระบบยืนยันตัวตน & โครงสร้างส่วนกลาง**<br/>(Authentication & Foundations) | นาย พิสิษฐ์ เสณีวงศ์ ณ อยุธยา<br/>(`@AkashiZai`) | FR-01, NFR-04, NFR-05,<br/>TOR General 1-4 | • `01_login.html`<br/>• `tokens.json`<br/>• `FIGMA_SPEC.md` |
| **ส่วนที่ 2** | **ระบบขายหน้าร้านแคชเชียร์ & คิดเงิน**<br/>(Cashier POS & Checkout / Receipt) | นาย ธราเทพ ศรีมานนท์<br/>(`@203Tharathep`) | FR-04, FR-05, FR-06,<br/>NFR-01, NFR-02 (iPad POS) | • `02_pos_cashier.html`<br/>• `03_customization_modal.html`<br/>• `04_payment_receipt.html` |
| **ส่วนที่ 3** | **ระบบคิวครัว/บาริสต้า & จอลูกค้า**<br/>(Kitchen KDS & Customer Mobile) | นาย พิชยุตม์ เจียวพงษ์พิพัฒน์<br/>(`@Ctrl-Pichayut`) | TOR Operator 1-5,<br/>TOR User 1-5, NFR-03 | • `05_kitchen_kds.html`<br/>• `07_customer_mobile.html`<br/>• แผนภาพ Order Lifecycle |
| **ส่วนที่ 4** | **ระบบแผงควบคุม, สต็อก & ตรวจสอบ Void**<br/>(Admin Portal, Stock & Audit) | นาย ก้องเกียรติ อมรธรรมคุณ<br/>(`@Kizizi123123`) | FR-02, FR-03, FR-07, FR-08,<br/>TOR Admin 1-5 | • `06_admin_dashboard.html`<br/>• `08_admin_menu_management.html`<br/>• `09_admin_sales_history_void.html` |

---

## 2. ส่วนที่ 1: ระบบยืนยันตัวตน & โครงสร้างส่วนกลาง (Authentication & Foundations)
- **ผู้รับผิดชอบ:** นาย พิสิษฐ์ เสณีวงศ์ ณ อยุธยา (`@AkashiZai`)
- **ข้อกำหนด:** FR-01 (Authentication), NFR-04 (15-min Session Timeout), NFR-05 (Responsive), TOR General 1-4
- **สิ่งที่ส่งมอบ:** `01_login.html`, `tokens.json`, `FIGMA_SPEC.md`

```mermaid
flowchart TD
    Start(["เริ่มต้นใช้งานระบบ Jamal Café POS"]) --> Init["โหลด Design Tokens & โครงสร้างส่วนกลาง<br/>(tokens.json / FIGMA_SPEC.md)"]
    Init --> LoginView["หน้าต่างเข้าสู่ระบบ (01_login.html)<br/>(TOR General 1-4, Responsive NFR-05)"]
    
    %% User Role Selection & PIN
    LoginView --> RoleChoice{"เลือกสิทธิ์ผู้ใช้งาน (FR-01)"}
    RoleChoice -->|"1. แคชเชียร์ (Cashier)"| InputCashierPin["กรอกรหัส PIN แคชเชียร์ (4 หลัก)"]
    RoleChoice -->|"2. ผู้ดูแลระบบ (Admin)"| InputAdminPin["กรอกรหัส Master PIN ผู้จัดการ"]
    
    InputCashierPin --> VerifyPin{"ตรวจสอบความถูกต้อง"}
    InputAdminPin --> VerifyPin
    
    VerifyPin -->|"PIN ไม่ถูกต้อง"| LoginFailed["แจ้งเตือนรหัส PIN ไม่ถูกต้อง (ให้ลองใหม่)"]
    LoginFailed --> LoginView
    
    VerifyPin -->|"PIN ถูกต้อง"| SetSession["บันทึก Session การเข้าสู่ระบบ"]
    
    %% Routing to other modules
    SetSession --> RouteRole{"สิทธิ์การใช้งาน"}
    RouteRole -->|"Cashier"| GoPos["ส่งต่อไปหน้าขายหน้าร้าน POS (ส่วนที่ 2)"]
    RouteRole -->|"Admin"| GoAdmin["ส่งต่อไปหน้าแผงควบคุม Admin (ส่วนที่ 4)"]
    
    %% Auto Timeout
    SetSession -.-> InactivityCheck{"ไม่มีการใช้งานเกิน 15 นาที?<br/>(NFR-04 Security Timeout)"}
    InactivityCheck -->|"ใช่ (Timeout)"| AutoLogout["ตัด Session อัตโนมัติ & แจ้งเตือน Timeout"]
    AutoLogout --> LoginView
```

---

## 3. ส่วนที่ 2: ระบบขายหน้าร้านแคชเชียร์ & คิดเงิน (Cashier POS & Checkout / Receipt)
- **ผู้รับผิดชอบ:** นาย ธราเทพ ศรีมานนท์ (`@203Tharathep`)
- **ข้อกำหนด:** FR-04 (Order Processing), FR-05 (Payment Calculation), FR-06 (80mm Slip), NFR-01 (Speed <1s), NFR-02 (Touchscreen UI)
- **สิ่งที่ส่งมอบ:** `02_pos_cashier.html`, `03_customization_modal.html`, `04_payment_receipt.html`

```mermaid
flowchart TD
    PosStart(["แคชเชียร์เปิดหน้าจอ POS iPad (02_pos_cashier.html)<br/>(NFR-01 ตอบสนอง < 1s, NFR-02 Touch UI)"]) --> BrowseMenu["เลือกดูหมวดหมู่สินค้า<br/>(กาแฟ, ชา, เบเกอรี่, ของหวาน)"]
    
    %% Item Selection & Customization
    BrowseMenu --> SelectItem["กดเลือกรายการสินค้าที่ลูกค้าสั่ง"]
    SelectItem --> CheckType{"ประเภทสินค้า (FR-04)"}
    
    CheckType -->|"เครื่องดื่ม (Customizable)"| CustomModal["เปิดหน้าต่างปรับแต่ง (03_customization_modal.html)<br/>- ระดับความหวาน (0%, 25%, 50%, 100%)<br/>- ชนิดนม (นมวัว, นมโอ๊ต, นมอัลมอนด์)<br/>- ท็อปปิ้ง (เพิ่มช็อต, เจลลี่)"]
    CustomModal --> AddToCart["เพิ่มลงบิลสั่งซื้อ (Active Bill Cart)"]
    
    CheckType -->|"เบเกอรี่ / ของหวาน"| CheckStock{"สต็อกคงเหลือหน้าร้าน"}
    CheckStock -->|"มีสินค้าพร้อมขาย"| AddToCart
    CheckStock -->|"สินค้าหมด (Out of Stock)"| StockBlocked["ระบบบล็อกปุ่ม ไม่ให้เพิ่มลงบิล"]
    
    %% Cart Management
    AddToCart --> CalcTotals["ระบบคำนวณเงิน Real-time<br/>- ยอดรวมก่อนภาษี (Subtotal)<br/>- ภาษีมูลค่าเพิ่ม VAT 7%<br/>- ยอดสุทธิ (Total)"]
    
    CalcTotals --> CartActions{"การจัดการรายการบิล"}
    CartActions -->|"พักบิลชั่วคราว"| HoldBill["พักบิล (Hold Bill) เพื่อรับลูกค้ารายอื่น"]
    CartActions -->|"ยกเลิกบิล"| ReqVoid["ส่งคำขอยกเลิกบิลไปยังผู้จัดการ (FR-07)"]
    CartActions -->|"คิดเงิน"| CheckoutView["เปิดหน้าต่างชำระเงิน (04_payment_receipt.html)"]
    
    %% Payment Methods
    CheckoutView --> PayChoice{"เลือกวิธีชำระเงิน (FR-05)"}
    
    PayChoice -->|"1. เงินสด (Cash)"| CashFlow["กดเลือกปุ่มลัดธนบัตร (พอดี/100/500/1,000)<br/>หรือใช้แป้นตัวเลข Numpad 1-9"]
    CashFlow --> CalcChange["ระบบคำนวณเงินทอนอัตโนมัติ (Change Due)"]
    CalcChange --> ConfirmPay["กดปุ่ม 'ยืนยันรับเงิน & สั่งพิมพ์สลิป'"]
    
    PayChoice -->|"2. PromptPay QR"| QRFlow["ระบบสร้าง Dynamic QR Code พร้อมยอดสุทธิ"]
    QRFlow --> CustomerScan["หันหน้าจอให้ลูกค้าสแกนจ่ายผ่านแอปธนาคาร"]
    CustomerScan --> ConfirmPay
    
    %% Receipt & Completion
    ConfirmPay --> PrintSlip["พิมพ์ใบเสร็จความร้อน 80mm Slip (FR-06)<br/>และเคลียร์บิลเริ่มรอบใหม่"]
    ConfirmPay --> SendToKitchen["ส่งออเดอร์เข้าคิวครัว Real-time (ส่งไปส่วนที่ 3)"]
    ConfirmPay --> DeductStock["ตัดสต็อกเบเกอรี่อัตโนมัติ (ส่งไปส่วนที่ 4)"]
```

---

## 4. ส่วนที่ 3: ระบบคิวครัว/บาริสต้า & จอลูกค้า (Kitchen KDS & Customer Mobile)
- **ผู้รับผิดชอบ:** นาย พิชยุตม์ เจียวพงษ์พิพัฒน์ (`@Ctrl-Pichayut`)
- **ข้อกำหนด:** TOR Operator 1-5 (Real-time KDS, สถานะงาน, เสียงเตือน), TOR User 1-5 (จอลูกค้ามือถือ), NFR-03 (ความเสถียร)
- **สิ่งที่ส่งมอบ:** `05_kitchen_kds.html`, `07_customer_mobile.html`, แผนภาพ Order Lifecycle

```mermaid
flowchart TD
    %% Kitchen Display System (KDS)
    KdsStart(["หน้าจอคิวครัว/บาริสต้า KDS (05_kitchen_kds.html)<br/>(TOR Operator 1-5, เสถียรภาพ NFR-03)"]) --> ReceiveOrder["รับออเดอร์ใหม่ Real-time จากหน้า POS"]
    ReceiveOrder --> SoundAlert["ส่งเสียงเตือนกระดิ่ง & ไฮไลท์การ์ดออเดอร์ใหม่"]
    
    SoundAlert --> DisplayCard["แสดงรายละเอียดบนการ์ดออเดอร์:<br/>- เลขที่บิล / โต๊ะ / เวลา<br/>- รายการเมนู & ตัวเลือก Customization ละเอียด<br/>- สเตตัสปัจจุบัน: 'Pending (รอดำเนินการ)'"]
    
    %% Order Lifecycle Transitions
    DisplayCard --> ActionStart["บาริสต้ากดปุ่ม 'เริ่มทำออเดอร์'"]
    ActionStart --> StatusCooking["เปลี่ยนสถานะเป็น: 'Processing (กำลังชง/ปรุง)'"]
    
    StatusCooking --> ActionFinish["บาริสต้าทำเสร็จ กดปุ่ม 'เสร็จสิ้น'"]
    ActionFinish --> StatusCompleted["เปลี่ยนสถานะเป็น: 'Completed (พร้อมเสิร์ฟ)'"]
    
    StatusCompleted --> MoveHistory["ย้ายออเดอร์เข้าประวัติการทำเสร็จ (Order History)"]
    
    %% Customer Mobile Screen
    CustomerStart(["ลูกค้าสแกน QR Code ประจำโต๊ะ"]) --> CustomerView["หน้าจอลูกค้า (07_customer_mobile.html)<br/>(TOR User 1-5)"]
    CustomerView --> ViewMenu["ดูรายการเมนู รายละเอียดราคา และรูปภาพ"]
    CustomerView --> TrackStatus["ติดตามสถานะออเดอร์ของตนเอง (Order Lifecycle)"]
    
    %% Sync Status between KDS and Customer
    StatusCooking -.->|"Sync สถานะ Real-time"| TrackStatus
    StatusCompleted -.->|"แจ้งเตือน: เครื่องดื่มของคุณพร้อมรับแล้ว!"| CustomerAlert["แจ้งเตือนหน้าจอลูกค้าให้มารับสินค้า"]
```

---

## 5. ส่วนที่ 4: ระบบแผงควบคุม, สต็อก & ตรวจสอบ Void (Admin Portal, Stock & Audit)
- **ผู้รับผิดชอบ:** นาย ก้องเกียรติ อมรธรรมคุณ (`@Kizizi123123`)
- **ข้อกำหนด:** FR-02 (จัดการเมนู), FR-03 (ตัดสต็อกอัตโนมัติ), FR-07 (ระบบอนุมัติ Void), FR-08 (รายงานยอดขาย), TOR Admin 1-5
- **สิ่งที่ส่งมอบ:** `06_admin_dashboard.html`, `08_admin_menu_management.html`, `09_admin_sales_history_void.html`

```mermaid
flowchart TD
    AdminStart(["ผู้ดูแลระบบเข้าสู่ระบบ Admin Portal"]) --> AdminMenuChoice{"เลือกเมนูการจัดการ"}
    
    %% Dashboard
    AdminMenuChoice -->|"1. แดชบอร์ดภาพรวม"| DashView["หน้าแผงควบคุม (06_admin_dashboard.html)<br/>- ยอดขายรวมประจำวัน (FR-08)<br/>- สรุปแยกยอด เงินสด vs PromptPay<br/>- กราฟสถิติสินค้าขายดี Top 5"]
    
    %% Inventory
    AdminMenuChoice -->|"2. คุมสต็อกเบเกอรี่"| InvView["ตารางสต็อกเบเกอรี่รายวัน (FR-03)<br/>(08_admin_menu_management.html)"]
    InvView --> CheckStock{"ระดับสต็อกคงเหลือ"}
    CheckStock -->|"เหลือน้อยกว่า 5 ชิ้น"| LowAlert["แจ้งเตือน Low Stock สีส้ม (TOR Admin 5)"]
    CheckStock -->|"เหลือ 0 ชิ้น"| OutAlert["เปลี่ยนสถานะเป็น 'Out of Stock'<br/>และปิดการสั่งซื้อบนจอ POS อัตโนมัติ"]
    CheckStock -->|"ของเข้าเพิ่ม"| RestockAction["กดปุ่มเติมสต็อก (Update Stock)"]
    RestockAction --> InvView
    
    %% Menu Management
    AdminMenuChoice -->|"3. จัดการสินค้า & ราคา"| MenuView["จัดการเมนูและหมวดหมู่ (FR-02)<br/>- เพิ่มเมนูใหม่ / แก้ไขราคา<br/>- กำหนดตัวเลือกความหวาน & ท็อปปิ้ง<br/>- เปิด/ปิดการจำหน่ายเมนู"]
    
    %% Sales History & Void Protection
    AdminMenuChoice -->|"4. ประวัติการขาย & Void"| SalesView["ตรวจสอบประวัติบิลย้อนหลัง (09_admin_sales_history_void.html)<br/>(TOR Admin 4)"]
    SalesView --> VoidReq{"มีการขอยกเลิกบิล (Void/Refund)?"}
    VoidReq -->|"ใช่ (FR-07)"| AdminAuthModal["หน้าต่างยืนยันรหัสผ่าน Admin Passcode<br/>(Void Protection Modal)"]
    AdminAuthModal --> VerifyPin{"รหัสผ่านถูกต้อง?"}
    VerifyPin -->|"ไม่ถูกต้อง"| VoidReject["ปฏิเสธการ Void (ยกเลิกบิลไม่ได้)"]
    VerifyPin -->|"ถูกต้อง"| VoidSuccess["อนุมัติยกเลิกบิล (Void Approved)<br/>- คืนสต็อกสินค้าเข้าคลัง<br/>- บันทึก Audit Log ผู้ทำการ Void"]
```

---

## 6. แผนผังภาพรวมทั้งระบบ (All-in-One Integrated Flowchart)
แผนผังนี้แสดงการเชื่อมต่อข้ามระหว่างทั้ง 4 ส่วนงานเมื่อทำงานร่วมกันในระบบจริง:

```mermaid
flowchart TD
    %% ==========================================
    %% Jamal Café & Bakery POS - All 4 Modules Flowchart
    %% ==========================================

    subgraph Part1 ["ส่วนที่ 1: ระบบยืนยันตัวตน & โครงสร้างส่วนกลาง (Authentication & Foundations)<br/>ผู้รับผิดชอบ: พิสิษฐ์ (@AkashiZai) | FR-01, NFR-04, NFR-05"]
        A1(["เริ่มต้นเข้าสู่ระบบ (Start)"]) --> A2["โหลด Design Tokens & โครงสร้างกลาง (tokens.json)"]
        A2 --> A3["หน้าต่างเข้าสู่ระบบ (01_login.html)"]
        A4{"ตรวจสอบรหัส PIN"}
        A3 --> A4
        A4 -->|"PIN ถูกต้อง (Cashier)"| A5["กำหนด Session แคชเชียร์"]
        A4 -->|"PIN ถูกต้อง (Admin)"| A6["กำหนด Session ผู้จัดการ"]
        A4 -->|"PIN ไม่ถูกต้อง"| A3
        A5 -.->|"Inactive เกิน 15 นาที"| A7["Session Timeout Logout (NFR-04)"] --> A3
    end

    subgraph Part2 ["ส่วนที่ 2: ระบบขายหน้าร้านแคชเชียร์ & คิดเงิน (Cashier POS & Checkout / Receipt)<br/>ผู้รับผิดชอบ: ธราเทพ (@203Tharathep) | FR-04, FR-05, FR-06, NFR-01, NFR-02"]
        B1["หน้าจอขายหน้าร้าน POS iPad (02_pos_cashier.html)"] --> B2["เลือกหมวดหมู่ & รายการสินค้า"]
        B2 --> B3{"ชนิดสินค้า?"}
        B3 -->|"เครื่องดื่ม"| B4["หน้าต่าง Customization (03_customization_modal.html)"]
        B3 -->|"เบเกอรี่"| B5["ตรวจสต็อกหน้าร้าน"]
        B4 --> B6["เพิ่มลงตะกร้า (Active Bill Cart)"]
        B5 --> B6
        B6 --> B7["คำนวณ Subtotal, VAT 7%, ยอดสุทธิ"]
        B7 --> B8{"จัดการบิล"}
        B8 -->|"คิดเงิน"| B9["หน้าต่างชำระเงิน (04_payment_receipt.html)"]
        B8 -->|"ขอยกเลิกบิล"| B10["ส่งคำขอ Void บิล (FR-07)"]
        B9 --> B11{"วิธีชำระเงิน"}
        B11 -->|"เงินสด"| B12["ปุ่มลัดธนบัตร + คำนวณเงินทอน"]
        B11 -->|"PromptPay"| B13["แสดง Dynamic QR Code"]
        B12 --> B14["กดยืนยันการรับเงิน"]
        B13 --> B14
        B14 --> B15["พิมพ์สลิปใบเสร็จ 80mm (FR-06)"]
    end

    subgraph Part3 ["ส่วนที่ 3: ระบบคิวครัว/บาริสต้า & จอลูกค้า (Kitchen KDS & Customer Mobile)<br/>ผู้รับผิดชอบ: พิชยุตม์ (@Ctrl-Pichayut) | TOR Operator 1-5, TOR User 1-5, NFR-03"]
        C1["คิวออเดอร์ในครัว KDS (05_kitchen_kds.html)"] --> C2["สถานะ: Pending (รอดำเนินการ)"]
        C2 --> C3["บาริสต้าเริ่มทำ -> สถานะ: Processing"]
        C3 --> C4["ทำเสร็จสิ้น -> สถานะ: Completed"]
        C4 --> C5["ส่งเสียงเตือนกระดิ่ง (Order Ready)"]
        
        C6["จอลูกค้า (07_customer_mobile.html)"] --> C7["สแกน QR โต๊ะดูเมนู & ติดตามสถานะ"]
        C3 -.->|"Sync สถานะ"| C7
        C4 -.->|"แจ้งเตือนรับสินค้า"| C7
    end

    subgraph Part4 ["ส่วนที่ 4: ระบบแผงควบคุม, สต็อก & ตรวจสอบ Void (Admin Portal, Stock & Audit)<br/>ผู้รับผิดชอบ: ก้องเกียรติ (@Kizizi123123) | FR-02, FR-03, FR-07, FR-08, TOR Admin 1-5"]
        D1["แผงควบคุมผู้จัดการ (06_admin_dashboard.html)"] --> D2["สรุปยอดขายรายวัน & สินค้าขายดี (FR-08)"]
        D3["คลังสต็อกเบเกอรี่ (08_admin_menu_management.html)"] --> D4{"ตรวจเช็กสต็อก (FR-03)"}
        D4 -->|"< 5 ชิ้น"| D5["แจ้งเตือน Low Stock (ส้ม)"]
        D4 -->|"0 ชิ้น"| D6["ปรับเป็น Out of Stock (ระงับขาย)"]
        
        D7["ตรวจสอบประวัติขาย & Void (09_admin_sales_history_void.html)"] --> D8{"ตรวจ Master PIN (FR-07)"}
        D8 -->|"ถูกต้อง"| D9["อนุมัติ Void + คืนสต็อกเข้าคลัง"]
        D8 -->|"ไม่ถูกต้อง"| D10["ปฏิเสธการยกเลิกบิล"]
    end

    %% Cross-Module Links
    A5 ==> B1
    A6 ==> D1
    B14 ==> C1
    B14 ==> D3
    B10 ==> D8
    D9 ==> B1
    D5 -.-> B5
    D6 -.-> B5
    C4 ==> D2
```

---

## 7. คำแนะนำในการใช้งาน
1. **ดูบน GitHub:** ไฟล์ Markdown นี้รองรับการ Render Mermaid Diagram เป็นภาพกราฟิกบน GitHub โดยอัตโนมัติ
2. **แก้ไขบน Mermaid Live:** คัดลอกบล็อกโค้ดในหัวข้อที่ต้องการ แล้วนำไปวางที่ [https://mermaid.live](https://mermaid.live) เพื่อดาวน์โหลดเป็นไฟล์ SVG หรือ PNG คมชัดสูงได้ทันที
