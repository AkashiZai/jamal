# คู่มือการโยง Prototype ทุกหน้าจอ & เหตุการณ์ใน Figma (Jamal POS Interaction Map)

ไฟล์ SVG ทั้งหมด **39 หน้าจอ/สถานะเหตุการณ์ (Interaction States)** ถูกจัดเก็บไว้ในโฟลเดอร์ `design/figma_import/`

---

## วิธีนำเข้าเข้า Figma ทั้งหมดใน 1 วินาที
1. เปิดโปรแกรม Figma หรือ Figma Web บน Canvas เปล่า
2. เปิด File Explorer ไปที่โฟลเดอร์ `design/figma_import`
3. กด `Ctrl + A` เพื่อเลือกไฟล์ `.svg` ทั้งหมด 39 ไฟล์
4. **ลากโยน (Drag & Drop)** ลงบน Canvas ใน Figma ได้ทันที

---

## ตารางการโยงเส้น Prototype ทุกการกด (Complete Interaction Wire Map)

### 1. กลุ่มหน้าต่าง Login & การเลือกสิทธิ์ (Authentication)
| จากหน้า (Source Frame) | ปุ่ม/จุดที่คลิก (Trigger) | ไปยังหน้า (Destination Frame) | ประเภท Interaction ใน Figma |
| :--- | :--- | :--- | :--- |
| **`00_login_default`** | ช่องกรอก PIN (หรือกดตัวเลข) | **`00_login_pin_entered`** | **On click** -> **Navigate to** |
| **`00_login_default`** | ปุ่มแท็บ **`เจ้าของร้าน`** (Admin) | **`00_login_role_admin`** | **On click** -> **Navigate to** |
| **`00_login_default`** | ปุ่มแท็บ **`บาริสต้า/ครัว`** (Operator) | **`00_login_role_operator`** | **On click** -> **Navigate to** |
| **`00_login_pin_entered`** | ปุ่ม **`เข้าสู่ระบบ (Sign In) ->`** | **`01_pos_empty_cart`** | **On click** -> **Navigate to** |
| **`00_login_default`** | กดปุ่ม Sign In โดยใส่รหัสผิด | **`00_login_error_pin`** | **On click** -> **Navigate to** |
| **`00_login_error_pin`** | ปุ่ม **`ลองใหม่อีกครั้ง`** | **`00_login_default`** | **On click** -> **Navigate to** |
| **`00_login_role_admin`** | ปุ่ม **`เข้าสู่หน้าแผงควบคุม Admin ->`** | **`04_admin_dashboard`** | **On click** -> **Navigate to** |
| **`00_login_role_operator`** | ปุ่ม **`เข้าสู่หน้าคิวครัว KDS ->`** | **`03_kitchen_kds_queue`** | **On click** -> **Navigate to** |

---

### 2. กลุ่มหน้าจอแคชเชียร์ POS & คิดเงิน (Cashier POS & Checkout)
| จากหน้า (Source Frame) | ปุ่ม/จุดที่คลิก (Trigger) | ไปยังหน้า (Destination Frame) | ประเภท Interaction ใน Figma |
| :--- | :--- | :--- | :--- |
| **`01_pos_empty_cart`** | ปุ่มหมวด **`กาแฟสด (Coffee)`** | **`01_pos_category_coffee`** | **On click** -> **Navigate to** |
| **`01_pos_empty_cart`** | ปุ่มหมวด **`ชา & เครื่องดื่ม (Beverages)`** | **`01_pos_category_tea`** | **On click** -> **Navigate to** |
| **`01_pos_empty_cart`** | ปุ่มหมวด **`เบเกอรี่สด`** | **`01_pos_category_bakery`** | **On click** -> **Navigate to** |
| **`01_pos_empty_cart`** | ปุ่มหมวด **`ของหวาน`** | **`01_pos_category_dessert`** | **On click** -> **Navigate to** |
| **`01_pos_category_*`** (ทุกหมวด) | ปุ่มหมวด **`ทั้งหมด (All)`** | **`01_pos_empty_cart`** | **On click** -> **Navigate to** |
| **`01_pos_empty_cart`** | ช่องค้นหา **`ค้นหาเมนู...`** | **`01_pos_search_active`** | **On click** -> **Navigate to** |
| **`01_pos_search_active`** | ปุ่ม **`X`** ในช่องค้นหา | **`01_pos_empty_cart`** | **On click** -> **Navigate to** |
| **`01_pos_category_dessert`** | การ์ด **`บาสก์ชีสเค้ก`** (หมด 0 ชิ้น) | **`01_pos_out_of_stock_alert`** | **On click** -> **Open overlay** (Centered) |
| **`01_pos_out_of_stock_alert`** | ปุ่ม **`X`** หรือคลิกด้านนอก | — | **On click** -> **Close overlay** |
| **`01_pos_empty_cart`** | การ์ด **`เอสเพรสโซ่เย็น (CUSTOM)`** | **`02_custom_modal_overlay`** | **On click** -> **Open overlay** (Centered) |
| **`02_custom_modal_overlay`** | ปุ่มเลือก **`หวาน 50%`** หรือ **`นมโอ๊ต`** | **`02_custom_modal_sweet50_oat`**| **On click** -> **Navigate to** / **Swap overlay** |
| **`02_custom_modal_overlay`** | ปุ่ม **`เพิ่มลงในบิล • ฿65.00`** | **`01_pos_cart_with_espresso`** | **On click** -> **Navigate to** (ปิด Modal แล้วสินค้าลงตะกร้า) |
| **`02_custom_modal_sweet50_oat`**| ปุ่ม **`เพิ่มลงในบิล • ฿80.00`** | **`01_pos_cart_multi_items`** | **On click** -> **Navigate to** |
| **`01_pos_cart_with_espresso`** | ปุ่ม **`คิดเงิน`** (สีส้มอิฐ) | **`02_payment_modal_80mm_slip`** | **On click** -> **Open overlay** (Centered) |
| **`01_pos_cart_multi_items`** | ปุ่ม **`คิดเงิน • ฿235.00`** | **`02_payment_modal_cash_numpad`** | **On click** -> **Open overlay** (Centered) |
| **`02_payment_modal_80mm_slip`** | แท็บ **`PromptPay QR`** | **`03_payment_promptpay_qr`** | **On click** -> **Navigate to** |
| **`03_payment_promptpay_qr`** | แท็บ **`เงินสด (Cash)`** | **`02_payment_modal_80mm_slip`** | **On click** -> **Navigate to** |
| **`02_payment_modal_cash_numpad`**| ปุ่ม **`ยืนยันรับเงิน & พิมพ์สลิป`**| **`01_pos_empty_cart`** | **On click** -> **Navigate to** (เคลียร์บิลเริ่มรอบใหม่) |
| **`01_pos_cart_with_espresso`** | ปุ่ม **`Void บิล (Admin)`** (สีแดง) | **`04_void_admin_modal`** | **On click** -> **Open overlay** (Centered) |
| **`04_void_admin_modal`** | ปุ่ม **`ยืนยัน Void บิล`** | **`04_void_success_toast`** | **On click** -> **Navigate to** |
| **`04_void_success_toast`** | ปุ่ม **`X`** หรือรอ 2 วินาที | **`01_pos_empty_cart`** | **On click** -> **Navigate to** |

---

### 3. กลุ่มหน้าจอคิวครัวบาริสต้า (Kitchen KDS)
| จากหน้า (Source Frame) | ปุ่ม/จุดที่คลิก (Trigger) | ไปยังหน้า (Destination Frame) | ประเภท Interaction ใน Figma |
| :--- | :--- | :--- | :--- |
| **`03_kitchen_kds_queue`** | ปุ่ม **`รับทำออเดอร์นี้ ->`** บนคิว #A04 | **`03_kds_action_started`** | **On click** -> **Navigate to** (ย้ายคิว A04 ไปช่องกำลังชง) |
| **`03_kds_action_started`** | ปุ่ม **`ทำเสร็จแล้ว`** บนคิว #A03 | **`03_kds_action_completed`** | **On click** -> **Navigate to** (ย้ายคิว A03 ไปช่องพร้อมเสิร์ฟ) |
| **`03_kds_action_completed`** | ปุ่ม **`ลูกค้ารับแล้ว (ปิดออเดอร์)`** | **`03_kitchen_kds_queue`** | **On click** -> **Navigate to** (ปิดงานและเคลียร์คิว) |

---

### 4. กลุ่มหน้าจอผู้ดูแลระบบ (Admin Portal)
| จากหน้า (Source Frame) | ปุ่ม/จุดที่คลิก (Trigger) | ไปยังหน้า (Destination Frame) | ประเภท Interaction ใน Figma |
| :--- | :--- | :--- | :--- |
| **`04_admin_dashboard`** | เมนูด้านซ้าย **`สต็อกเบเกอรี่`** | **`04_admin_inventory_tab`** | **On click** -> **Navigate to** |
| **`04_admin_inventory_tab`** | เมนูด้านซ้าย **`แดชบอร์ดภาพรวม`** | **`04_admin_dashboard`** | **On click** -> **Navigate to** |
| **`04_admin_inventory_tab`** | ปุ่ม **`+ 10 ชิ้น`** (เติมสต็อกครัวซองต์) | **`04_admin_restock_modal`** | **On click** -> **Open overlay** (Centered) |
| **`04_admin_restock_modal`** | ปุ่ม **`ยืนยันการเติมสต็อก`** | **`04_admin_inventory_tab`** | **On click** -> **Close overlay** |
| **`04_admin_dashboard`** | เมนูด้านซ้าย **`จัดการเมนู & ราคา`** | **`04_admin_menu_pricing_tab`** | **On click** -> **Navigate to** |
| **`04_admin_menu_pricing_tab`** | เมนูด้านซ้าย **`แดชบอร์ดภาพรวม`** | **`04_admin_dashboard`** | **On click** -> **Navigate to** |
| **`04_admin_menu_pricing_tab`** | ปุ่ม **`แก้ราคา`** บนแถวเมนู | **`04_admin_price_edit_modal`** | **On click** -> **Open overlay** (Centered) |
| **`04_admin_menu_pricing_tab`** | ปุ่ม **`+ เพิ่มเมนูใหม่`** (สีส้มขวาบน) | **`04_admin_add_menu_modal`** | **On click** -> **Open overlay** (Centered) |
| **`04_admin_add_menu_modal`** | ปุ่ม **`บันทึกและเพิ่มเมนู`** / **`ยกเลิก`** | **`04_admin_menu_pricing_tab`** | **On click** -> **Close overlay** |
| **`04_admin_dashboard`** | เมนูด้านซ้าย **`ประวัติการขาย & Void`**| **`04_admin_sales_history_tab`**| **On click** -> **Navigate to** |
| **`04_admin_sales_history_tab`**| เมนูด้านซ้าย **`แดชบอร์ดภาพรวม`** | **`04_admin_dashboard`** | **On click** -> **Navigate to** |
| **`04_admin_dashboard`** | เมนูด้านซ้าย **`จัดการสิทธิ์พนักงาน`** | **`04_admin_staff_roles_tab`** | **On click** -> **Navigate to** |
| **`04_admin_staff_roles_tab`** | เมนูด้านซ้าย **`แดชบอร์ดภาพรวม`** | **`04_admin_dashboard`** | **On click** -> **Navigate to** |
| **`04_admin_staff_roles_tab`** | ปุ่ม **`+ เพิ่มบัญชีพนักงานใหม่`** (สีส้ม) | **`04_admin_add_staff_modal`** | **On click** -> **Open overlay** (Centered) |
| **`04_admin_add_staff_modal`** | ปุ่ม **`บันทึกบัญชีพนักงาน`** / **`ยกเลิก`** | **`04_admin_staff_roles_tab`** | **On click** -> **Close overlay** |

---

### 5. กลุ่มหน้าจอลูกค้าสั่งผ่านมือถือ (Customer Mobile)
| จากหน้า (Source Frame) | ปุ่ม/จุดที่คลิก (Trigger) | ไปยังหน้า (Destination Frame) | ประเภท Interaction ใน Figma |
| :--- | :--- | :--- | :--- |
| **`05_customer_mobile`** | ปุ่ม **`+ สั่ง`** บนการ์ดเอสเพรสโซ่เย็น | **`05_customer_mobile_custom_sheet`**| **On click** -> **Open overlay** (Bottom-center) |
| **`05_customer_mobile_custom_sheet`**| ปุ่ม **`เพิ่มลงในตะกร้า • ฿80.00`**| **`05_customer_mobile`** | **On click** -> **Close overlay** |
| **`05_customer_mobile`** | แถบล่าง **`ดูตะกร้า (2) ->`** | **`05_customer_mobile_cart_drawer`** | **On click** -> **Open overlay** (Bottom-center) |
| **`05_customer_mobile_cart_drawer`**| ปุ่ม **`ยืนยันการสั่งซื้อ`** | **`05_customer_mobile_order_success`**| **On click** -> **Navigate to** |
| **`05_customer_mobile_order_success`**| ปุ่ม **`ดูเมนูเพิ่มเติม ->`** | **`05_customer_mobile`** | **On click** -> **Navigate to** |
| **`05_customer_mobile`** | เมื่อคิว #A03 ในครัวทำเสร็จ | **`05_customer_mobile_queue_ready`** | **After delay** (หรือคลิก) -> **Navigate to** |

---

### 6. การออกจากระบบ (Global Logout Trigger)
- **ทุกหน้าจอ POS / Admin / KDS:**
  - คลิกปุ่ม **`ออก -> (Sign Out)`** บนแถบขวาบน Navbar -> **Navigate to** -> **`00_login_default`**
