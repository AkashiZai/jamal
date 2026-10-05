# แผนผังกระบวนการทำงานของระบบ POS (System Workflow Flowchart)
### ตามการแบ่งส่วนงาน 4 ส่วน (Jamal Café & Bakery POS)

อ้างอิงตามโครงสร้างการแบ่งงานของสมาชิกในกลุ่ม:

| ส่วนที่ | ชื่อส่วนงาน (Module) | ผู้รับผิดชอบ | ข้อกำหนดที่รับผิดชอบ | หน้าจอที่ส่งมอบ (Screens & Assets) |
| :---: | :--- | :--- | :--- | :--- |
| **ส่วนที่ 1** | **ระบบยืนยันตัวตน & โครงสร้างส่วนกลาง**<br/>(Authentication & Foundations) | นาย พิสิษฐ์ เสณีวงศ์ ณ อยุธยา<br/>(`@AkashiZai`) | FR-01, NFR-04, NFR-05,<br/>TOR General 1-4 | • `01_login.html`<br/>• `tokens.json`<br/>• `FIGMA_SPEC.md` |
| **ส่วนที่ 2** | **ระบบขายหน้าร้านแคชเชียร์ & คิดเงิน**<br/>(Cashier POS & Checkout / Receipt) | นาย ธราเทพ ศรีมานนท์<br/>(`@203Tharathep`) | FR-04, FR-05, FR-06,<br/>NFR-01, NFR-02 (iPad POS) | • `02_pos_cashier.html`<br/>• `03_customization_modal.html`<br/>• `04_payment_receipt.html` |
| **ส่วนที่ 3** | **ระบบคิวครัว/บาริสต้า & จอลูกค้า**<br/>(Kitchen KDS & Customer Mobile) | นาย พิชยุตม์ เจียวพงษ์พิพัฒน์<br/>(`@Ctrl-Pichayut`) | TOR Operator 1-5,<br/>TOR User 1-5, NFR-03 | • `05_kitchen_kds.html`<br/>• `07_customer_mobile.html`<br/>• แผนภาพ Order Lifecycle |
| **ส่วนที่ 4** | **ระบบแผงควบคุม, สต็อก & ตรวจสอบ Void**<br/>(Admin Portal, Stock & Audit) | นาย ก้องเกียรติ อมรธรรมคุณ<br/>(`@Kizizi123123`) | FR-02, FR-03, FR-07, FR-08,<br/>TOR Admin 1-5 | • `06_admin_dashboard.html`<br/>• `08_admin_menu_management.html`<br/>• `09_admin_sales_history_void.html` |

---

## Mermaid Flowchart (พร้อมใช้งานบน Mermaid Live Editor)

```mermaid
flowchart TD
    %% ==========================================
    %% Jamal Café & Bakery POS - Work Breakdown Flowchart
    %% ==========================================

    subgraph Part1 ["ส่วนที่ 1: ระบบยืนยันตัวตน & โครงสร้างส่วนกลาง (Authentication & Foundations)<br/>ผู้รับผิดชอบ: นาย พิสิษฐ์ เสณีวงศ์ ณ อยุธยา (@AkashiZai) | FR-01, NFR-04, NFR-05"]
        A1["เริ่มต้นเข้าสู่ระบบ (Start)"] --> A2["โหลด Design Tokens & โครงสร้างกลาง<br/>(tokens.json, FIGMA_SPEC.md)"]
        A2 --> A3["หน้าต่างเข้าสู่ระบบ (01_login.html)<br/>เลือกสิทธิ์: Cashier หรือ Admin"]
        A3 --> A4["กรอกรหัส PIN (4 หลัก)"]
        A4 --> A5{"ตรวจสอบรหัส PIN<br/>(Authentication)"}
        A5 -- "PIN ไม่ถูกต้อง" --> A6["แจ้งเตือนข้อผิดพลาด (Invalid PIN)"]
        A6 --> A4
        A5 -- "สิทธิ์ Cashier" --> A7["กำหนด Session แคชเชียร์"]
        A5 -- "สิทธิ์ Admin" --> A8["กำหนด Session ผู้จัดการ"]
        A9["ระบบตรวจจับ Inactive (15 นาที)<br/>Session Timeout Logout (NFR-04)"] -.-> A3
    end

    subgraph Part2 ["ส่วนที่ 2: ระบบขายหน้าร้านแคชเชียร์ & คิดเงิน (Cashier POS & Checkout / Receipt)<br/>ผู้รับผิดชอบ: นาย ธราเทพ ศรีมานนท์ (@203Tharathep) | FR-04, FR-05, FR-06, NFR-01, NFR-02"]
        B1["หน้าจอขายหน้าร้าน POS iPad (02_pos_cashier.html)"]
        B2["เลือกหมวดหมู่ & ค้นหาเมนู<br/>(กาแฟ, ชา, เบเกอรี่, ของหวาน)"]
        B1 --> B2
        B2 --> B3{"ประเภทสินค้า?"}
        B3 -- "เครื่องดื่ม / ปรับแต่งได้" --> B4["หน้าต่างปรับแต่งเมนู (03_customization_modal.html)<br/>เลือกระดับหวาน / นม / ช็อตกาแฟ"]
        B3 -- "เบเกอรี่ / สินค้ามาตรฐาน" --> B5["ตรวจสอบสต็อกคงเหลือหน้าร้าน"]
        B4 --> B6["เพิ่มรายการลงตะกร้า (Active Bill Cart)"]
        B5 --> B6
        B6 --> B7["คำนวณยอดเงิน Real-time<br/>(Subtotal + VAT 7% = ยอดสุทธิ)"]
        B7 --> B8{"การจัดการบิล"}
        B8 -- "พักบิลชั่วคราว" --> B9["พักบิล (Hold Bill)"]
        B8 -- "ยกเลิกรายการบิล" --> B10["ร้องขอ Void บิล (FR-07)"]
        B8 -- "ดำเนินการชำระเงิน" --> B11["หน้าต่างคิดเงิน (04_payment_receipt.html)"]
        B11 --> B12{"เลือกวิธีชำระเงิน"}
        B12 -- "เงินสด (Cash)" --> B13["รับธนบัตร + แป้น Numpad<br/>คำนวณเงินทอนอัตโนมัติ (Change Due)"]
        B12 -- "PromptPay QR" --> B14["แสดง Dynamic PromptPay QR Code"]
        B13 --> B15["ยืนยันการรับเงิน"]
        B14 --> B15
        B15 --> B16["พิมพ์ใบเสร็จความร้อน 80mm (FR-06)"]
    end

    subgraph Part3 ["ส่วนที่ 3: ระบบคิวครัว/บาริสต้า & จอลูกค้า (Kitchen KDS & Customer Mobile)<br/>ผู้รับผิดชอบ: นาย พิชยุตม์ เจียวพงษ์พิพัฒน์ (@Ctrl-Pichayut) | TOR Operator 1-5, TOR User 1-5, NFR-03"]
        C1["คิวออเดอร์ห้องครัว/บาริสต้า (05_kitchen_kds.html)"]
        C2["แสดงรายละเอียดเมนู & ออปชัน<br/>(เช่น หวาน 25%, นมโอ๊ต, อุ่นร้อน)"]
        C1 --> C2
        C2 --> C3["สถานะ: Pending (รอดำเนินการ)"]
        C3 --> C4["บาริสต้ากดรับออเดอร์<br/>สถานะ: Processing (กำลังปรุง/ชง)"]
        C4 --> C5["ปรุงเสร็จสิ้น<br/>สถานะ: Completed (พร้อมเสิร์ฟ)"]
        C5 --> C6["แจ้งเตือนกระดิ่ง/เสียงเตือน (Order Ready)"]

        C7["หน้าจอจอลูกค้า (07_customer_mobile.html)"]
        C8["สแกน QR โต๊ะดูเมนู & ติดตามสถานะออเดอร์"]
        C7 --> C8
        C8 -.-> C3
        C5 -. "แจ้งลูกค้าออเดอร์พร้อมรับ" .-> C8
    end

    subgraph Part4 ["ส่วนที่ 4: ระบบแผงควบคุม, สต็อก & ตรวจสอบ Void (Admin Portal, Stock & Audit)<br/>ผู้รับผิดชอบ: นาย ก้องเกียรติ อมรธรรมคุณ (@Kizizi123123) | FR-02, FR-03, FR-07, FR-08, TOR Admin 1-5"]
        D1["แผงควบคุมผู้จัดการ (06_admin_dashboard.html)"]
        D2["รายงานยอดขายประจำวัน & ยอดแยกตามประเภทเงินสด/โอน (FR-08)"]
        D3["อันดับสินค้าขายดี Top 5"]
        D1 --> D2
        D1 --> D3

        D4["ระบบจัดการเมนูและสต็อก (08_admin_menu_management.html)"]
        D5["ตรวจสอบสต็อกเบเกอรี่คงเหลือ Real-time (FR-03)"]
        D6{"ระดับสต็อกสินค้า"}
        D4 --> D5 --> D6
        D6 -- "เหลือ < 5 ชิ้น" --> D7["แจ้งเตือน Low Stock (ส้ม)"]
        D6 -- "เหลือ 0 ชิ้น" --> D8["ปรับเป็น Out of Stock (ระงับขาย)"]
        D6 -- "ของเข้าใหม่" --> D9["อัปเดตเพิ่มจำนวนสต็อก (Restock)"]

        D10["ประวัติการขาย & บันทึกตรวจสอบ Void (09_admin_sales_history_void.html)"]
        D11{"ตรวจสอบสิทธิ์ Master PIN (FR-07)"}
        D10 --> D11
        D11 -- "อนุมัติ" --> D12["บันทึกประวัติ Void บิล + คืนสต็อกสินค้า"]
        D11 -- "ไม่อนุมัติ" --> D13["ปฏิเสธการยกเลิกบิล"]
    end

    %% ==========================================
    %% Cross-Module Interconnections (การเชื่อมโยงข้ามส่วนงาน)
    %% ==========================================
    A7 ==> B1
    A8 ==> D1
    
    B10 ==> D11
    D12 ==> B1
    
    B15 ==> C1
    B15 ==> D5
    
    D7 -. "อัปเดต Badge สต็อก" .-> B5
    D8 -. "ปิดปุ่มสั่งซื้อสินค้าหมด" .-> B5
    
    C5 ==> D2

    %% ==========================================
    %% Styling Classes
    %% ==========================================
    classDef part1 fill:#F5EEF8,stroke:#8E44AD,stroke-width:2px,color:#2C3E50;
    classDef part2 fill:#FEF9E7,stroke:#D35400,stroke-width:2px,color:#2C3E50;
    classDef part3 fill:#E8F8F5,stroke:#16A085,stroke-width:2px,color:#2C3E50;
    classDef part4 fill:#EBF5FB,stroke:#2980B9,stroke-width:2px,color:#2C3E50;

    class A1,A2,A3,A4,A5,A6,A7,A8,A9 part1;
    class B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11,B12,B13,B14,B15,B16 part2;
    class C1,C2,C3,C4,C5,C6,C7,C8 part3;
    class D1,D2,D3,D4,D5,D6,D7,D8,D9,D10,D11,D12,D13 part4;
```
