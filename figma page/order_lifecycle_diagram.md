# แผนภาพวงจรชีวิตออเดอร์ (Order Lifecycle Diagram)
## ส่วนที่ 3: ระบบคิวครัว/บาริสต้า & จอลูกค้า (Kitchen KDS & Customer Mobile)

* **ผู้รับผิดชอบ:** นาย พิชยุตม์ เจียวพงษ์พิพัฒน์ (@Ctrl-Pichayut)
* **รหัสนิสิต:** 68102010209
* **ข้อกำหนดที่ครอบคลุม:** TOR Operator 1–5, TOR User 1–5, NFR-03
* **ไฟล์หน้าจอที่เกี่ยวข้องในโฟลเดอร์นี้:**
  * `05_kitchen_kds.html` (หน้าจอคิวครัว/บาริสต้า KDS)
  * `07_customer_mobile.html` (หน้าจอบนมือถือลูกค้า)

---

## 1. แผนภาพ Flowchart วงจรชีวิตออเดอร์ ส่วนที่ 3 (Order Lifecycle Flowchart)

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

## 2. แผนภาพ State Machine แสดงการเปลี่ยนผ่านสถานะ (Order State Machine)

```mermaid
stateDiagram-v2
    [*] --> Pending: แคชเชียร์ POS ยืนยันชำระเงิน / ลูกค้าสั่งผ่าน QR
    
    state Pending {
        [*] --> InQueue: แสดงในคอลัมน์ Pending (รอดำเนินการ)
        InQueue: ส่งเสียงกระดิ่งเตือน Chime Alert
        InQueue: ตัวจับเวลาเริ่มนับเวลารอ
        InQueue: จอมือถือลูกค้าขึ้น 'รับออเดอร์แล้ว'
    }

    Pending --> Processing: บาริสต้ากดปุ่ม 'รับทำออเดอร์นี้ →'
    
    state Processing {
        [*] --> Brewing: ย้ายไปคอลัมน์ In Progress (กำลังทำ)
        Brewing: แสดงสูตรและตัวเลือกหวาน/นม/ท็อปปิ้ง
        Brewing: จอมือถือลูกค้าขึ้น 'กำลังชงเครื่องดื่ม'
    }

    Processing --> Completed: บาริสต้าทำเสร็จ กด '✓ ทำเสร็จแล้ว (พร้อมเสิร์ฟ)'
    
    state Completed {
        [*] --> Ready: ย้ายไปคอลัมน์ Ready (พร้อมเสิร์ฟ)
        Ready: จอมือถือลูกค้าแจ้งเตือน 'เครื่องดื่มพร้อมรับแล้ว!'
    }

    Completed --> [*]: ลูกค้ารับสินค้าแล้ว (ปิดออเดอร์)
```

---

## 3. โค้ดรวมทั้งระบบแบบบูรณาการ 4 ส่วนงาน (All-in-One Integrated Flowchart)

โค้ดสำหรับนำไปเปิดใน [Mermaid Live Editor](https://mermaid.live/) หรือดูบน GitHub เพื่อแสดงการทำงานข้ามกันทั้ง 4 โมดูล:

```mermaid
flowchart TD
    %% ==========================================
    %% Jamal Café & Bakery POS - All 4 Modules Flowchart
    %% ==========================================
    subgraph Part1 ["ส่วนที่ 1: ระบบยืนยันตัวตน & โครงสร้างส่วนกลาง (Authentication & Foundations)<br/>ผู้รับผิดชอบ: พิสิษฐ์ (@AkashiZai) | FR-01, NFR-04, NFR-05"]
        A1(["เริ่มต้นเข้าสู่ระบบ (Start)"]) --> A2["โหลด Design Tokens & โครงสร้างกลาง (tokens.json)"]
        A2 --> A3["หน้าต่างเข้าสู่ระบบ (01_login.html)"]
        A3 --> A4{"ตรวจสอบรหัส PIN"}
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
