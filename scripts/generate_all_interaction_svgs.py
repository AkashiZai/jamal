"""
generate_all_interaction_svgs.py
Generates Figma-ready SVG frames for all user interaction and event states across the Jamal POS Suite.
"""

import os
import re

OUTPUT_DIR = "design/figma_import"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Common SVG Defs
DEFS = """  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="12" flood-color="#231710" flood-opacity="0.08"/>
    </filter>
    <filter id="modalShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#1A120B" flood-opacity="0.3"/>
    </filter>
  </defs>"""

# ==============================================================================
# 1. LOGIN INTERACTIONS
# ==============================================================================

# 1.1 Login with wrong PIN error shake
LOGIN_ERROR_PIN = f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1194 834" width="1194" height="834" style="background:#EDE7DF; font-family:'Plus Jakarta Sans','Sarabun',sans-serif;">
{DEFS}
  <!-- Top App Bar -->
  <rect x="0" y="0" width="1194" height="56" fill="#1A120B"/>
  <rect x="20" y="12" width="32" height="32" rx="8" fill="#C85A32"/>
  <text x="27" y="34" font-size="14" font-weight="900" fill="#FFFFFF">JM</text>
  <text x="64" y="34" font-size="15" font-weight="800" fill="#FFFFFF">JAMAL CAFÉ &amp; BAKERY</text>
  <text x="1080" y="34" font-size="11" fill="#968E85">ระบบความปลอดภัย (FR-01)</text>

  <!-- Centered Login Card -->
  <g transform="translate(377, 85)" filter="url(#shadow)">
    <rect x="0" y="0" width="440" height="660" rx="24" fill="#FFFFFF" stroke="#BA3C34" stroke-width="2"/>

    <!-- Brand Logo JM -->
    <rect x="188" y="35" width="64" height="64" rx="16" fill="#1A120B"/>
    <text x="204" y="75" font-size="22" font-weight="900" fill="#FFFFFF" letter-spacing="1">JM</text>

    <!-- Header Titles -->
    <text x="220" y="130" font-size="20" font-weight="800" fill="#1E1B18" text-anchor="middle">เข้าสู่ระบบ JAMAL POS</text>
    <text x="220" y="152" font-size="12" font-weight="500" fill="#635C54" text-anchor="middle">Café &amp; Bakery Management System</text>

    <!-- ERROR BANNER (SHAKE) -->
    <g transform="translate(32, 170)">
      <rect x="0" y="0" width="376" height="42" rx="10" fill="#FDF0EF" stroke="#BA3C34" stroke-width="1.5"/>
      <text x="16" y="26" font-size="14">⚠️</text>
      <text x="42" y="26" font-size="12" font-weight="700" fill="#BA3C34">รหัส PIN ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง</text>
    </g>

    <!-- Role Selector Tabs -->
    <g transform="translate(32, 226)">
      <rect x="0" y="0" width="376" height="42" rx="12" fill="#F5EFEB"/>
      <!-- Active Tab: แคชเชียร์ -->
      <rect x="4" y="4" width="120" height="34" rx="8" fill="#C85A32"/>
      <text x="64" y="26" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">แคชเชียร์</text>
      <text x="188" y="26" font-size="12" font-weight="600" fill="#635C54" text-anchor="middle">บาริสต้า/ครัว</text>
      <text x="312" y="26" font-size="12" font-weight="600" fill="#635C54" text-anchor="middle">เจ้าของร้าน</text>
    </g>

    <!-- Staff ID Field -->
    <g transform="translate(32, 288)">
      <text x="0" y="14" font-size="12" font-weight="700" fill="#1E1B18">รหัสพนักงาน หรือชื่อผู้ใช้</text>
      <rect x="0" y="22" width="376" height="44" rx="12" fill="#FDFBF7" stroke="#EAE3D8" stroke-width="1"/>
      <text x="16" y="49" font-size="13" font-weight="600" fill="#1E1B18">cashier_zai</text>
    </g>

    <!-- PIN 4 Digit Field (RED BORDER) -->
    <g transform="translate(32, 370)">
      <text x="0" y="14" font-size="12" font-weight="700" fill="#BA3C34">รหัสผ่าน หรือ PIN 4 หลัก (ผิดพลาด)</text>
      <rect x="0" y="22" width="376" height="48" rx="12" fill="#FDF0EF" stroke="#BA3C34" stroke-width="2"/>
      <text x="16" y="52" font-size="24" font-family="'JetBrains Mono',monospace" font-weight="900" fill="#BA3C34" letter-spacing="8">● ● ● ●</text>
      <text x="360" y="52" font-size="14" font-weight="bold" fill="#BA3C34" text-anchor="end">✕</text>
    </g>

    <!-- Sign In Button -->
    <g transform="translate(32, 465)">
      <rect x="0" y="0" width="376" height="52" rx="16" fill="#1A120B"/>
      <text x="188" y="32" font-size="14" font-weight="700" fill="#FFFFFF" text-anchor="middle">ลองใหม่อีกครั้ง →</text>
    </g>

    <text x="220" y="555" font-size="11" fill="#C85A32" font-weight="bold" text-anchor="middle">กดเลือก "แคชเชียร์ (1234)" เพื่อทดสอบใหม่</text>
  </g>
</svg>"""

# 1.2 Login with Admin Role selected
LOGIN_ROLE_ADMIN = f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1194 834" width="1194" height="834" style="background:#EDE7DF; font-family:'Plus Jakarta Sans','Sarabun',sans-serif;">
{DEFS}
  <!-- Top App Bar -->
  <rect x="0" y="0" width="1194" height="56" fill="#1A120B"/>
  <rect x="20" y="12" width="32" height="32" rx="8" fill="#C85A32"/>
  <text x="27" y="34" font-size="14" font-weight="900" fill="#FFFFFF">JM</text>
  <text x="64" y="34" font-size="15" font-weight="800" fill="#FFFFFF">JAMAL CAFÉ &amp; BAKERY</text>
  <text x="1080" y="34" font-size="11" fill="#968E85">ระบบความปลอดภัย (FR-01)</text>

  <!-- Centered Login Card -->
  <g transform="translate(377, 85)" filter="url(#shadow)">
    <rect x="0" y="0" width="440" height="660" rx="24" fill="#FFFFFF" stroke="#EAE3D8" stroke-width="1"/>

    <!-- Brand Logo JM -->
    <rect x="188" y="35" width="64" height="64" rx="16" fill="#C85A32"/>
    <text x="204" y="75" font-size="22" font-weight="900" fill="#FFFFFF" letter-spacing="1">JM</text>

    <!-- Header Titles -->
    <text x="220" y="130" font-size="20" font-weight="800" fill="#1E1B18" text-anchor="middle">เข้าสู่ระบบผู้ดูแล (Admin Portal)</text>
    <text x="220" y="152" font-size="12" font-weight="500" fill="#635C54" text-anchor="middle">Café &amp; Bakery Management System</text>

    <!-- Role Selector Tabs (Admin Active) -->
    <g transform="translate(32, 185)">
      <rect x="0" y="0" width="376" height="42" rx="12" fill="#F5EFEB"/>
      <text x="64" y="26" font-size="12" font-weight="600" fill="#635C54" text-anchor="middle">แคชเชียร์</text>
      <text x="188" y="26" font-size="12" font-weight="600" fill="#635C54" text-anchor="middle">บาริสต้า/ครัว</text>
      <!-- Active Admin -->
      <rect x="252" y="4" width="120" height="34" rx="8" fill="#C85A32"/>
      <text x="312" y="26" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">เจ้าของร้าน</text>
    </g>

    <!-- Staff ID Field -->
    <g transform="translate(32, 255)">
      <text x="0" y="14" font-size="12" font-weight="700" fill="#1E1B18">รหัสพนักงาน หรือชื่อผู้ใช้</text>
      <rect x="0" y="22" width="376" height="44" rx="12" fill="#FDFBF7" stroke="#EAE3D8" stroke-width="1"/>
      <text x="16" y="49" font-size="13" font-weight="700" fill="#1E1B18">admin_boss (Admin Zai)</text>
    </g>

    <!-- PIN 4 Digit Field (9999 Ready) -->
    <g transform="translate(32, 345)">
      <text x="0" y="14" font-size="12" font-weight="700" fill="#1E1B18">รหัสผ่าน หรือ Master PIN</text>
      <rect x="0" y="22" width="376" height="48" rx="12" fill="#FDFBF7" stroke="#3B6E4C" stroke-width="2"/>
      <text x="16" y="52" font-size="24" font-family="'JetBrains Mono',monospace" font-weight="900" fill="#3B6E4C" letter-spacing="8">● ● ● ●</text>
      <text x="360" y="52" font-size="11" font-weight="bold" fill="#3B6E4C" text-anchor="end">พร้อมเข้าสู่ระบบ</text>
    </g>

    <!-- Sign In Button -->
    <g transform="translate(32, 445)">
      <rect x="0" y="0" width="376" height="52" rx="16" fill="#C85A32"/>
      <text x="188" y="32" font-size="14" font-weight="700" fill="#FFFFFF" text-anchor="middle">เข้าสู่หน้าแผงควบคุม Admin ➔</text>
    </g>

    <!-- Security Policy Footnote -->
    <g transform="translate(220, 545)">
      <text x="0" y="0" font-size="10" fill="#968E85" text-anchor="middle">🔒 สิทธิ์ระดับ Admin: จัดการเมนู, สต็อก และอนุมัติ Void</text>
      <text x="0" y="16" font-size="10" fill="#968E85" text-anchor="middle">(FR-01, FR-02, FR-03, FR-07)</text>
    </g>
  </g>
</svg>"""

# 1.3 Login with Barista / Operator Role selected
LOGIN_ROLE_OPERATOR = f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1194 834" width="1194" height="834" style="background:#EDE7DF; font-family:'Plus Jakarta Sans','Sarabun',sans-serif;">
{DEFS}
  <!-- Top App Bar -->
  <rect x="0" y="0" width="1194" height="56" fill="#1A120B"/>
  <rect x="20" y="12" width="32" height="32" rx="8" fill="#3B6E4C"/>
  <text x="27" y="34" font-size="14" font-weight="900" fill="#FFFFFF">JM</text>
  <text x="64" y="34" font-size="15" font-weight="800" fill="#FFFFFF">JAMAL CAFÉ &amp; BAKERY</text>
  <text x="1080" y="34" font-size="11" fill="#968E85">ระบบบาริสต้า &amp; ครัว (TOR Operator)</text>

  <!-- Centered Login Card -->
  <g transform="translate(377, 85)" filter="url(#shadow)">
    <rect x="0" y="0" width="440" height="660" rx="24" fill="#FFFFFF" stroke="#EAE3D8" stroke-width="1"/>

    <!-- Brand Logo JM -->
    <rect x="188" y="35" width="64" height="64" rx="16" fill="#3B6E4C"/>
    <text x="204" y="75" font-size="22" font-weight="900" fill="#FFFFFF" letter-spacing="1">☕</text>

    <!-- Header Titles -->
    <text x="220" y="130" font-size="20" font-weight="800" fill="#1E1B18" text-anchor="middle">เข้าสู่ระบบครัวบาริสต้า (KDS)</text>
    <text x="220" y="152" font-size="12" font-weight="500" fill="#635C54" text-anchor="middle">Kitchen Display System Portal</text>

    <!-- Role Selector Tabs (Barista Active) -->
    <g transform="translate(32, 185)">
      <rect x="0" y="0" width="376" height="42" rx="12" fill="#F5EFEB"/>
      <text x="64" y="26" font-size="12" font-weight="600" fill="#635C54" text-anchor="middle">แคชเชียร์</text>
      <!-- Active Barista -->
      <rect x="128" y="4" width="120" height="34" rx="8" fill="#3B6E4C"/>
      <text x="188" y="26" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">บาริสต้า/ครัว</text>
      <text x="312" y="26" font-size="12" font-weight="600" fill="#635C54" text-anchor="middle">เจ้าของร้าน</text>
    </g>

    <!-- Staff ID Field -->
    <g transform="translate(32, 255)">
      <text x="0" y="14" font-size="12" font-weight="700" fill="#1E1B18">รหัสพนักงาน หรือชื่อผู้ใช้</text>
      <rect x="0" y="22" width="376" height="44" rx="12" fill="#FDFBF7" stroke="#EAE3D8" stroke-width="1"/>
      <text x="16" y="49" font-size="13" font-weight="700" fill="#1E1B18">barista_kds (อานนท์ บาริสต้า)</text>
    </g>

    <!-- PIN 4 Digit Field (5678 Ready) -->
    <g transform="translate(32, 345)">
      <text x="0" y="14" font-size="12" font-weight="700" fill="#1E1B18">รหัส PIN บาริสต้า (4 หลัก)</text>
      <rect x="0" y="22" width="376" height="48" rx="12" fill="#FDFBF7" stroke="#3B6E4C" stroke-width="2"/>
      <text x="16" y="52" font-size="24" font-family="'JetBrains Mono',monospace" font-weight="900" fill="#3B6E4C" letter-spacing="8">● ● ● ●</text>
      <text x="360" y="52" font-size="11" font-weight="bold" fill="#3B6E4C" text-anchor="end">พร้อมเข้าสู่ระบบ</text>
    </g>

    <!-- Sign In Button -->
    <g transform="translate(32, 445)">
      <rect x="0" y="0" width="376" height="52" rx="16" fill="#3B6E4C"/>
      <text x="188" y="32" font-size="14" font-weight="700" fill="#FFFFFF" text-anchor="middle">เข้าสู่หน้าคิวครัว KDS ➔</text>
    </g>

    <!-- Security Policy Footnote -->
    <g transform="translate(220, 545)">
      <text x="0" y="0" font-size="10" fill="#968E85" text-anchor="middle">☕ หน้าจอแสดงผลสถานะออเดอร์และคิวชงกาแฟสด</text>
      <text x="0" y="16" font-size="10" fill="#968E85" text-anchor="middle">(TOR Operator 1-5)</text>
    </g>
  </g>
</svg>"""

# ==============================================================================
# 2. POS CASHIER INTERACTIONS
# ==============================================================================

# 2.1 POS with Search Query "มัทฉะ" Active
POS_SEARCH_ACTIVE = f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1194 834" width="1194" height="834" style="background:#EDE7DF; font-family:'Plus Jakarta Sans','Sarabun',sans-serif;">
{DEFS}
  <!-- Top App Bar -->
  <rect x="0" y="0" width="1194" height="56" fill="#1A120B"/>
  <rect x="20" y="12" width="32" height="32" rx="8" fill="#C85A32"/>
  <text x="27" y="34" font-size="14" font-weight="900" fill="#FFFFFF">JM</text>
  <text x="64" y="34" font-size="15" font-weight="800" fill="#FFFFFF">JAMAL CAFÉ &amp; BAKERY</text>
  <circle cx="1040" cy="28" r="4" fill="#22C55E"/>
  <text x="1052" y="32" font-size="11" font-weight="600" fill="#968E85">POS Online (iPad 11")</text>

  <!-- MAIN CONTAINER (1154 x 746) -->
  <g transform="translate(20, 68)" filter="url(#shadow)">
    <rect x="0" y="0" width="1154" height="746" rx="20" fill="#FBF8F4" stroke="#EAE3D8" stroke-width="1"/>

    <!-- LEFT CATALOG (774px) -->
    <rect x="0" y="0" width="774" height="64" rx="20" fill="#FFFFFF"/>
    <line x1="0" y1="64" x2="774" y2="64" stroke="#EAE3D8" stroke-width="1"/>
    <text x="24" y="38" font-size="15" font-weight="800" fill="#1E1B18">ผลการค้นหาเมนูสินค้า: "มัทฉะ" (พบ 1 รายการ)</text>

    <!-- Search Input Filled with "มัทฉะ" -->
    <rect x="520" y="16" width="234" height="34" rx="10" fill="#FDF2ED" stroke="#C85A32" stroke-width="1.5"/>
    <text x="536" y="38" font-size="12" font-weight="700" fill="#C85A32">🔍 มัทฉะ</text>
    <circle cx="736" cy="33" r="8" fill="#EAE3D8"/>
    <text x="736" y="37" font-size="10" font-weight="bold" fill="#635C54" text-anchor="middle">✕</text>

    <!-- Filtered Product Card (Matcha Latte) -->
    <g transform="translate(24, 88)">
      <rect x="0" y="0" width="230" height="240" rx="16" fill="#FFFFFF" stroke="#3B6E4C" stroke-width="2"/>
      <rect x="12" y="12" width="206" height="120" rx="12" fill="#EAF4ED"/>
      <text x="115" y="80" font-size="36" text-anchor="middle">🍵</text>
      <rect x="20" y="98" width="56" height="20" rx="6" fill="#3B6E4C"/>
      <text x="48" y="112" font-size="9" font-weight="bold" fill="#FFFFFF" text-anchor="middle">CUSTOM</text>

      <text x="16" y="156" font-size="14" font-weight="700" fill="#1E1B18">มัทฉะลาเต้อูจิ</text>
      <text x="16" y="174" font-size="11" fill="#635C54">ผงมัทฉะแท้เกียวโต เข้มข้น</text>
      <text x="16" y="210" font-size="16" font-family="'JetBrains Mono',monospace" font-weight="800" fill="#C85A32">฿85.00</text>
      <rect x="156" y="190" width="60" height="28" rx="8" fill="#FDF2ED" stroke="#C85A32"/>
      <text x="186" y="208" font-size="11" font-weight="bold" fill="#C85A32" text-anchor="middle">+ เลือก</text>
    </g>

    <!-- RIGHT CART SIDEBAR (380px) -->
    <line x1="774" y1="0" x2="774" y2="746" stroke="#EAE3D8" stroke-width="1"/>
    <rect x="774" y="0" width="380" height="746" rx="20" fill="#FFFFFF"/>
    <text x="798" y="38" font-size="16" font-weight="800" fill="#1E1B18">บิลขายปัจจุบัน (Order #084)</text>
    <text x="798" y="58" font-size="11" fill="#968E85">โต๊ะ 04 • แคชเชียร์: Zai</text>
    <line x1="774" y1="74" x2="1154" y2="74" stroke="#EAE3D8" stroke-width="1"/>

    <!-- 1 Item in Cart -->
    <g transform="translate(798, 94)">
      <rect x="0" y="0" width="332" height="68" rx="12" fill="#FDFBF7" stroke="#EAE3D8"/>
      <text x="16" y="26" font-size="13" font-weight="700" fill="#1E1B18">1x เอสเพรสโซ่เย็น</text>
      <text x="16" y="44" font-size="11" fill="#C85A32">↳ หวาน 25% • นมโอ๊ต</text>
      <text x="316" y="36" font-size="14" font-family="'JetBrains Mono',monospace" font-weight="800" fill="#1E1B18" text-anchor="end">฿65.00</text>
    </g>

    <!-- Bottom Checkout Button -->
    <g transform="translate(798, 660)">
      <rect x="0" y="0" width="332" height="52" rx="16" fill="#C85A32"/>
      <text x="166" y="32" font-size="14" font-weight="800" fill="#FFFFFF" text-anchor="middle">คิดเงิน • ฿65.00 →</text>
    </g>
  </g>
</svg>"""

# 2.2 POS with Out of Stock Alert Toast
POS_OUT_OF_STOCK = f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1194 834" width="1194" height="834" style="background:#EDE7DF; font-family:'Plus Jakarta Sans','Sarabun',sans-serif;">
{DEFS}
  <!-- Base POS Screen -->
  <rect x="0" y="0" width="1194" height="56" fill="#1A120B"/>
  <rect x="20" y="12" width="32" height="32" rx="8" fill="#C85A32"/>
  <text x="27" y="34" font-size="14" font-weight="900" fill="#FFFFFF">JM</text>
  <text x="64" y="34" font-size="15" font-weight="800" fill="#FFFFFF">JAMAL CAFÉ &amp; BAKERY</text>

  <!-- Container -->
  <g transform="translate(20, 68)" opacity="0.6">
    <rect x="0" y="0" width="1154" height="746" rx="20" fill="#FBF8F4" stroke="#EAE3D8"/>
    <text x="40" y="50" font-size="16" font-weight="bold" fill="#1E1B18">หมวดหมู่: ของหวาน &amp; เบเกอรี่</text>
  </g>

  <!-- FLOATING OUT OF STOCK TOAST (CENTER TOP) -->
  <g transform="translate(372, 90)" filter="url(#modalShadow)">
    <rect x="0" y="0" width="450" height="74" rx="18" fill="#FFFFFF" stroke="#BA3C34" stroke-width="2"/>
    <rect x="16" y="17" width="40" height="40" rx="10" fill="#FDF0EF"/>
    <text x="36" y="43" font-size="20" text-anchor="middle">🚫</text>
    
    <text x="68" y="34" font-size="14" font-weight="800" fill="#BA3C34">สินค้าหมดชั่วคราว (Out of Stock)</text>
    <text x="68" y="54" font-size="12" fill="#635C54">บาสก์ชีสเค้กหน้าไหม้ คงเหลือ 0 ชิ้นในระบบ (FR-03)</text>

    <!-- Close button -->
    <circle cx="424" cy="24" r="10" fill="#F5EFEB"/>
    <text x="424" y="28" font-size="10" font-weight="bold" fill="#635C54" text-anchor="middle">✕</text>
  </g>
</svg>"""

# 2.3 POS with Multi Items Cart (Espresso + Croissant + Matcha)
POS_CART_MULTI = f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1194 834" width="1194" height="834" style="background:#EDE7DF; font-family:'Plus Jakarta Sans','Sarabun',sans-serif;">
{DEFS}
  <!-- Top App Bar -->
  <rect x="0" y="0" width="1194" height="56" fill="#1A120B"/>
  <rect x="20" y="12" width="32" height="32" rx="8" fill="#C85A32"/>
  <text x="27" y="34" font-size="14" font-weight="900" fill="#FFFFFF">JM</text>
  <text x="64" y="34" font-size="15" font-weight="800" fill="#FFFFFF">JAMAL CAFÉ &amp; BAKERY</text>
  <circle cx="1040" cy="28" r="4" fill="#22C55E"/>
  <text x="1052" y="32" font-size="11" font-weight="600" fill="#968E85">POS Online (iPad 11")</text>

  <!-- MAIN CONTAINER (1154 x 746) -->
  <g transform="translate(20, 68)" filter="url(#shadow)">
    <rect x="0" y="0" width="1154" height="746" rx="20" fill="#FBF8F4" stroke="#EAE3D8" stroke-width="1"/>

    <!-- LEFT CATALOG (774px) -->
    <rect x="0" y="0" width="774" height="64" rx="20" fill="#FFFFFF"/>
    <line x1="0" y1="64" x2="774" y2="64" stroke="#EAE3D8" stroke-width="1"/>
    <text x="24" y="38" font-size="15" font-weight="800" fill="#1E1B18">เมนูสินค้าหน้าร้าน (Product Catalog)</text>

    <!-- 3 Product Cards Grid Placeholder -->
    <g transform="translate(24, 88)">
      <rect x="0" y="0" width="230" height="230" rx="14" fill="#FFFFFF" stroke="#EAE3D8"/>
      <text x="115" y="70" font-size="32" text-anchor="middle">☕</text>
      <text x="16" y="130" font-size="14" font-weight="bold">เอสเพรสโซ่เย็น</text>
      <text x="16" y="170" font-size="15" font-family="'JetBrains Mono',monospace" font-weight="bold" fill="#C85A32">฿65.00</text>
    </g>

    <!-- RIGHT CART SIDEBAR (380px) WITH 3 ITEMS -->
    <line x1="774" y1="0" x2="774" y2="746" stroke="#EAE3D8" stroke-width="1"/>
    <rect x="774" y="0" width="380" height="746" rx="20" fill="#FFFFFF"/>
    
    <text x="798" y="36" font-size="16" font-weight="800" fill="#1E1B18">บิลขายปัจจุบัน (3 รายการ)</text>
    <text x="798" y="54" font-size="11" fill="#968E85">โต๊ะ 04 • โหมดสั่งทานที่ร้าน</text>
    <line x1="774" y1="68" x2="1154" y2="68" stroke="#EAE3D8"/>

    <!-- Item 1: Espresso -->
    <g transform="translate(798, 80)">
      <rect x="0" y="0" width="332" height="64" rx="12" fill="#FDFBF7" stroke="#EAE3D8"/>
      <text x="14" y="24" font-size="13" font-weight="bold">1x เอสเพรสโซ่เย็น</text>
      <text x="14" y="42" font-size="10" font-weight="bold" fill="#C85A32">↳ หวาน 25% • นมโอ๊ต</text>
      <text x="318" y="34" font-size="13" font-family="'JetBrains Mono',monospace" font-weight="bold" text-anchor="end">฿65.00</text>
    </g>

    <!-- Item 2: Butter Croissant -->
    <g transform="translate(798, 152)">
      <rect x="0" y="0" width="332" height="64" rx="12" fill="#FDFBF7" stroke="#EAE3D8"/>
      <text x="14" y="24" font-size="13" font-weight="bold">1x ครัวซองต์เนยสด AOP</text>
      <text x="14" y="42" font-size="10" fill="#635C54">↳ อบอุ่นร้อน</text>
      <text x="318" y="34" font-size="13" font-family="'JetBrains Mono',monospace" font-weight="bold" text-anchor="end">฿85.00</text>
    </g>

    <!-- Item 3: Matcha Latte -->
    <g transform="translate(798, 224)">
      <rect x="0" y="0" width="332" height="64" rx="12" fill="#FDFBF7" stroke="#EAE3D8"/>
      <text x="14" y="24" font-size="13" font-weight="bold">1x มัทฉะลาเต้อูจิ</text>
      <text x="14" y="42" font-size="10" font-weight="bold" fill="#3B6E4C">↳ หวาน 50% • นมสด</text>
      <text x="318" y="34" font-size="13" font-family="'JetBrains Mono',monospace" font-weight="bold" text-anchor="end">฿85.00</text>
    </g>

    <!-- Totals Summary & Tax Breakdown (FR-05) -->
    <g transform="translate(798, 480)">
      <line x1="0" y1="0" x2="332" y2="0" stroke="#EAE3D8"/>
      <text x="0" y="24" font-size="12" fill="#635C54">ยอดรวมก่อนภาษี (Subtotal)</text>
      <text x="332" y="24" font-size="12" font-family="'JetBrains Mono',monospace" text-anchor="end">฿219.63</text>

      <text x="0" y="48" font-size="12" fill="#635C54">ภาษีมูลค่าเพิ่ม VAT 7%</text>
      <text x="332" y="48" font-size="12" font-family="'JetBrains Mono',monospace" text-anchor="end">฿15.37</text>

      <line x1="0" y1="62" x2="332" y2="62" stroke="#EAE3D8"/>
      <text x="0" y="90" font-size="15" font-weight="800" fill="#1E1B18">ยอดสุทธิ (Total Amount)</text>
      <text x="332" y="90" font-size="20" font-family="'JetBrains Mono',monospace" font-weight="900" fill="#C85A32" text-anchor="end">฿235.00</text>
    </g>

    <!-- Bottom Actions: Void + Pay -->
    <g transform="translate(798, 660)">
      <rect x="0" y="0" width="90" height="52" rx="14" fill="#FDF0EF" stroke="#BA3C34"/>
      <text x="45" y="32" font-size="12" font-weight="bold" fill="#BA3C34" text-anchor="middle">Void บิล</text>

      <rect x="98" y="0" width="234" height="52" rx="14" fill="#C85A32"/>
      <text x="215" y="32" font-size="14" font-weight="800" fill="#FFFFFF" text-anchor="middle">คิดเงิน • ฿235.00 →</text>
    </g>
  </g>
</svg>"""

# 2.4 Customization Modal with Sweet 50% + Oat Milk selected
CUSTOM_MODAL_SELECTED = f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1194 834" width="1194" height="834" style="background:#EDE7DF; font-family:'Plus Jakarta Sans','Sarabun',sans-serif;">
{DEFS}
  <!-- Backdrop Dimmed -->
  <rect x="0" y="0" width="1194" height="834" fill="#1A120B" fill-opacity="0.55"/>

  <!-- Modal Centered (540 x 620) -->
  <g transform="translate(327, 107)" filter="url(#modalShadow)">
    <rect x="0" y="0" width="540" height="620" rx="24" fill="#FFFFFF" stroke="#EAE3D8" stroke-width="1"/>

    <!-- Header -->
    <rect x="0" y="0" width="540" height="74" rx="24" fill="#FBF8F4"/>
    <text x="24" y="38" font-size="17" font-weight="800" fill="#1E1B18">เอสเพรสโซ่เย็น (Iced Espresso)</text>
    <text x="24" y="58" font-size="13" font-weight="700" font-family="'JetBrains Mono',monospace" fill="#C85A32">ราคาเริ่มต้น ฿65.00</text>
    <circle cx="504" cy="37" r="16" fill="#F5EFEB"/>
    <text x="504" y="42" font-size="14" font-weight="700" fill="#635C54" text-anchor="middle">✕</text>

    <!-- 1. Sweetness Level (50% ACTIVE) -->
    <g transform="translate(24, 94)">
      <text x="0" y="14" font-size="12" font-weight="800" fill="#1E1B18">1. ระดับความหวาน (Sweetness Level)</text>
      <!-- 0% -->
      <rect x="0" y="24" width="115" height="54" rx="12" fill="#FFFFFF" stroke="#EAE3D8"/>
      <text x="57" y="54" font-size="14" font-weight="bold" text-anchor="middle">0%</text>
      <!-- 25% -->
      <rect x="125" y="24" width="115" height="54" rx="12" fill="#FFFFFF" stroke="#EAE3D8"/>
      <text x="182" y="54" font-size="14" font-weight="bold" text-anchor="middle">25%</text>
      <!-- 50% ACTIVE -->
      <rect x="250" y="24" width="115" height="54" rx="12" fill="#FDF2ED" stroke="#C85A32" stroke-width="2"/>
      <text x="307" y="48" font-size="14" font-weight="bold" fill="#C85A32" text-anchor="middle">50%</text>
      <text x="307" y="66" font-size="10" font-weight="bold" fill="#C85A32" text-anchor="middle">หวานปกติ</text>
      <!-- 100% -->
      <rect x="375" y="24" width="115" height="54" rx="12" fill="#FFFFFF" stroke="#EAE3D8"/>
      <text x="432" y="54" font-size="14" font-weight="bold" text-anchor="middle">100%</text>
    </g>

    <!-- 2. Milk Choice (OAT MILK ACTIVE +15฿) -->
    <g transform="translate(24, 200)">
      <text x="0" y="14" font-size="12" font-weight="800" fill="#1E1B18">2. ชนิดนม (Milk Options)</text>
      <!-- Regular -->
      <rect x="0" y="24" width="156" height="54" rx="12" fill="#FFFFFF" stroke="#EAE3D8"/>
      <text x="78" y="54" font-size="13" font-weight="bold" text-anchor="middle">นมสดปกติ (+฿0)</text>
      <!-- Oat Milk (ACTIVE) -->
      <rect x="168" y="24" width="156" height="54" rx="12" fill="#FDF2ED" stroke="#C85A32" stroke-width="2"/>
      <text x="246" y="48" font-size="13" font-weight="bold" fill="#C85A32" text-anchor="middle">🌾 นมโอ๊ต Oat</text>
      <text x="246" y="66" font-size="11" font-weight="bold" fill="#C85A32" text-anchor="middle">+ ฿15.00</text>
      <!-- Almond -->
      <rect x="336" y="24" width="156" height="54" rx="12" fill="#FFFFFF" stroke="#EAE3D8"/>
      <text x="414" y="54" font-size="13" font-weight="bold" text-anchor="middle">นมอัลมอนด์ (+฿15)</text>
    </g>

    <!-- Action Button: Updated to ฿80.00 -->
    <g transform="translate(24, 530)">
      <rect x="0" y="0" width="492" height="54" rx="16" fill="#C85A32"/>
      <text x="246" y="34" font-size="15" font-weight="800" fill="#FFFFFF" text-anchor="middle">เพิ่มลงในบิล • ฿80.00 →</text>
    </g>
  </g>
</svg>"""

# 2.5 Payment Modal with Cash Numpad Entered
PAYMENT_CASH_NUMPAD = f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1194 834" width="1194" height="834" style="background:#EDE7DF; font-family:'Plus Jakarta Sans','Sarabun',sans-serif;">
{DEFS}
  <!-- Backdrop Dimmed -->
  <rect x="0" y="0" width="1194" height="834" fill="#1A120B" fill-opacity="0.55"/>

  <!-- Modal Centered (920 x 640) -->
  <g transform="translate(137, 97)" filter="url(#shadow)">
    <rect x="0" y="0" width="920" height="640" rx="24" fill="#FFFFFF" stroke="#EAE3D8"/>

    <!-- Left: Cash Numpad (526px) -->
    <g transform="translate(32, 32)">
      <text x="0" y="20" font-size="16" font-weight="800">หน้าต่างชำระเงิน (Cash Calculator)</text>
      
      <!-- Net Amount -->
      <rect x="0" y="44" width="526" height="64" rx="14" fill="#FDFBF7" stroke="#EAE3D8"/>
      <text x="20" y="70" font-size="12" fill="#635C54">ยอดที่ต้องชำระ (Total Due)</text>
      <text x="20" y="94" font-size="24" font-family="'JetBrains Mono',monospace" font-weight="800">฿235.00</text>

      <!-- Cash Received (฿500 Entered) -->
      <rect x="0" y="120" width="526" height="64" rx="14" fill="#EEF5F8" stroke="#8EC0E4" stroke-width="2"/>
      <text x="20" y="146" font-size="12" font-weight="bold" fill="#2E6171">เงินสดที่รับมา (Cash Received)</text>
      <text x="20" y="172" font-size="26" font-family="'JetBrains Mono',monospace" font-weight="900" fill="#2E6171">฿500.00</text>

      <!-- Change Due Box -->
      <rect x="0" y="196" width="526" height="54" rx="14" fill="#EAF4ED" stroke="#3B6E4C" stroke-width="2"/>
      <text x="20" y="230" font-size="13" font-weight="bold" fill="#3B6E4C">เงินทอน (Change Due): ฿265.00</text>

      <!-- Confirm Button -->
      <rect x="0" y="510" width="526" height="54" rx="16" fill="#3B6E4C"/>
      <text x="263" y="543" font-size="15" font-weight="800" fill="#FFFFFF" text-anchor="middle">✓ ยืนยันรับเงิน &amp; สั่งพิมพ์สลิป 80mm</text>
    </g>

    <!-- Right: 80mm Thermal Receipt Preview -->
    <line x1="590" y1="0" x2="590" y2="640" stroke="#EAE3D8"/>
    <g transform="translate(620, 32)">
      <rect x="0" y="0" width="270" height="576" rx="8" fill="#FFFFFF" stroke="#EAE3D8" filter="url(#shadow)"/>
      <text x="135" y="40" font-size="14" font-weight="bold" text-anchor="middle">JAMAL CAFÉ</text>
      <text x="135" y="60" font-size="10" fill="#635C54" text-anchor="middle">ใบเสร็จรับเงิน (Tax Receipt)</text>
      <line x1="16" y1="75" x2="254" y2="75" stroke="#EAE3D8"/>
      
      <text x="20" y="100" font-size="10" font-family="'JetBrains Mono',monospace">1x เอสเพรสโซ่เย็น  ฿65.00</text>
      <text x="20" y="125" font-size="10" font-family="'JetBrains Mono',monospace">1x ครัวซองต์ AOP   ฿85.00</text>
      <text x="20" y="150" font-size="10" font-family="'JetBrains Mono',monospace">1x มัทฉะลาเต้    ฿85.00</text>
      
      <line x1="16" y1="170" x2="254" y2="170" stroke="#EAE3D8"/>
      <text x="20" y="195" font-size="12" font-weight="bold" font-family="'JetBrains Mono',monospace">ยอดรวมสุทธิ   ฿235.00</text>
      <text x="20" y="218" font-size="10" font-family="'JetBrains Mono',monospace">รับเงินสด      ฿500.00</text>
      <text x="20" y="238" font-size="11" font-weight="bold" font-family="'JetBrains Mono',monospace" fill="#3B6E4C">เงินทอน       ฿265.00</text>

      <text x="135" y="540" font-size="10" fill="#968E85" text-anchor="middle">ขอบคุณที่ใช้บริการ (FR-06)</text>
    </g>
  </g>
</svg>"""

# 2.6 Void Success Toast
VOID_SUCCESS_TOAST = f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1194 834" width="1194" height="834" style="background:#EDE7DF; font-family:'Plus Jakarta Sans','Sarabun',sans-serif;">
{DEFS}
  <!-- Base POS Screen with Empty Cart -->
  <rect x="0" y="0" width="1194" height="56" fill="#1A120B"/>
  <rect x="20" y="12" width="32" height="32" rx="8" fill="#C85A32"/>
  <text x="27" y="34" font-size="14" font-weight="900" fill="#FFFFFF">JM</text>
  <text x="64" y="34" font-size="15" font-weight="800" fill="#FFFFFF">JAMAL CAFÉ &amp; BAKERY</text>

  <!-- Container -->
  <g transform="translate(20, 68)" opacity="0.6">
    <rect x="0" y="0" width="1154" height="746" rx="20" fill="#FBF8F4" stroke="#EAE3D8"/>
  </g>

  <!-- FLOATING VOID SUCCESS TOAST (CENTER TOP) -->
  <g transform="translate(347, 90)" filter="url(#modalShadow)">
    <rect x="0" y="0" width="500" height="74" rx="18" fill="#FFFFFF" stroke="#3B6E4C" stroke-width="2"/>
    <rect x="16" y="17" width="40" height="40" rx="10" fill="#EAF4ED"/>
    <text x="36" y="43" font-size="20" text-anchor="middle">🛡️</text>
    
    <text x="68" y="34" font-size="14" font-weight="800" fill="#3B6E4C">อนุมัติ Void บิลสำเร็จ (Void Approved)</text>
    <text x="68" y="54" font-size="12" fill="#635C54">ผู้จัดการ Admin Zai ยืนยันรหัสผ่าน • เคลียร์บิลและบันทึก Audit Log แล้ว</text>

    <!-- Close button -->
    <circle cx="474" cy="24" r="10" fill="#F5EFEB"/>
    <text x="474" y="28" font-size="10" font-weight="bold" fill="#635C54" text-anchor="middle">✕</text>
  </g>
</svg>"""

# ==============================================================================
# 3. KITCHEN KDS INTERACTIONS
# ==============================================================================

# 3.1 KDS Action: #A04 Started (Moved from Pending to In Progress)
KDS_ACTION_STARTED = f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1194 834" width="1194" height="834" style="background:#FBF8F4; font-family:'Plus Jakarta Sans','Sarabun',sans-serif;">
  <!-- TOP APP BAR -->
  <rect x="0" y="0" width="1194" height="64" fill="#1A120B"/>
  <rect x="20" y="16" width="32" height="32" rx="8" fill="#3B6E4C"/>
  <text x="28" y="38" font-size="14" font-weight="bold" fill="#FFFFFF">☕</text>
  <text x="64" y="38" font-size="16" font-weight="bold" fill="#FFFFFF">JAMAL KITCHEN &amp; BARISTA KDS</text>
  <text x="1060" y="38" font-size="12" fill="#22C55E">● รับทำออเดอร์ #A04 แล้ว</text>

  <!-- Column 1: Pending (Now Empty / 0) -->
  <g transform="translate(20, 80)">
    <rect x="0" y="0" width="370" height="734" rx="16" fill="#FDFBF7" stroke="#EAE3D8"/>
    <rect x="0" y="0" width="370" height="52" rx="16" fill="#FFF5E6"/>
    <circle cx="25" cy="26" r="5" fill="#C97D28"/>
    <text x="38" y="30" font-size="14" font-weight="bold" fill="#7A4B13">รอดำเนินการ (Pending) • 0</text>
    <text x="185" y="200" font-size="13" fill="#968E85" text-anchor="middle">ไม่มีออเดอร์ค้างรอดำเนินการ</text>
  </g>

  <!-- Column 2: In Progress (Now has 2 tickets: A04 and A03!) -->
  <g transform="translate(412, 80)">
    <rect x="0" y="0" width="370" height="734" rx="16" fill="#FDFBF7" stroke="#8EC0E4" stroke-width="2"/>
    <rect x="0" y="0" width="370" height="52" rx="16" fill="#EEF5F8"/>
    <circle cx="25" cy="26" r="5" fill="#2E6171"/>
    <text x="38" y="30" font-size="14" font-weight="bold" fill="#1C4450">กำลังชง/อบ (In Progress) • 2</text>

    <!-- Ticket A04 (Newly Moved) -->
    <g transform="translate(16, 68)">
      <rect x="0" y="0" width="338" height="170" rx="12" fill="#FFFFFF" stroke="#8EC0E4" stroke-width="2"/>
      <text x="16" y="28" font-size="18" font-family="'JetBrains Mono',monospace" font-weight="800" fill="#1E1B18">#คิว A04</text>
      <rect x="210" y="12" width="112" height="22" rx="6" fill="#EEF5F8"/>
      <text x="218" y="27" font-size="10" font-family="'JetBrains Mono',monospace" font-weight="bold" fill="#2E6171">เพิ่งเริ่มทำ</text>
      <line x1="16" y1="40" x2="322" y2="40" stroke="#F5EFEB"/>
      <text x="16" y="64" font-size="13" font-weight="700">1x เอสเพรสโซ่เย็น (หวาน 25% • นมโอ๊ต)</text>
      <text x="16" y="88" font-size="13" font-weight="700">1x ครัวซองต์เนยสด AOP (อบอุ่นร้อน)</text>
      <rect x="16" y="116" width="306" height="38" rx="8" fill="#3B6E4C"/>
      <text x="95" y="140" font-size="12" font-weight="bold" fill="#FFFFFF">✓ ทำเสร็จแล้ว (พร้อมเสิร์ฟ)</text>
    </g>

    <!-- Ticket A03 -->
    <g transform="translate(16, 252)">
      <rect x="0" y="0" width="338" height="150" rx="12" fill="#FFFFFF" stroke="#EAE3D8"/>
      <text x="16" y="28" font-size="18" font-family="'JetBrains Mono',monospace" font-weight="800">#คิว A03</text>
      <text x="16" y="64" font-size="13" font-weight="700">2x มัทฉะลาเต้อูจิ (หวาน 50%)</text>
      <rect x="16" y="96" width="306" height="38" rx="8" fill="#3B6E4C"/>
      <text x="95" y="120" font-size="12" font-weight="bold" fill="#FFFFFF">✓ ทำเสร็จแล้ว (พร้อมเสิร์ฟ)</text>
    </g>
  </g>

  <!-- Column 3: Ready (1) -->
  <g transform="translate(804, 80)">
    <rect x="0" y="0" width="370" height="734" rx="16" fill="#FDFBF7" stroke="#EAE3D8"/>
    <rect x="0" y="0" width="370" height="52" rx="16" fill="#EAF4ED"/>
    <circle cx="25" cy="26" r="5" fill="#3B6E4C"/>
    <text x="38" y="30" font-size="14" font-weight="bold" fill="#254731">พร้อมรับที่เคาน์เตอร์ (Ready) • 1</text>
  </g>
</svg>"""

# 3.2 KDS Action: #A03 Completed (Moved to Ready)
KDS_ACTION_COMPLETED = f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1194 834" width="1194" height="834" style="background:#FBF8F4; font-family:'Plus Jakarta Sans','Sarabun',sans-serif;">
  <!-- TOP APP BAR -->
  <rect x="0" y="0" width="1194" height="64" fill="#1A120B"/>
  <rect x="20" y="16" width="32" height="32" rx="8" fill="#3B6E4C"/>
  <text x="28" y="38" font-size="14" font-weight="bold" fill="#FFFFFF">☕</text>
  <text x="64" y="38" font-size="16" font-weight="bold" fill="#FFFFFF">JAMAL KITCHEN &amp; BARISTA KDS</text>
  <rect x="940" y="16" width="230" height="32" rx="8" fill="#3B6E4C"/>
  <text x="1055" y="37" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">🔔 ขานเรียกคิว #A03 แล้ว</text>

  <!-- Column 1: Pending -->
  <g transform="translate(20, 80)">
    <rect x="0" y="0" width="370" height="734" rx="16" fill="#FDFBF7" stroke="#EAE3D8"/>
    <rect x="0" y="0" width="370" height="52" rx="16" fill="#FFF5E6"/>
    <text x="38" y="30" font-size="14" font-weight="bold" fill="#7A4B13">รอดำเนินการ • 1</text>
  </g>

  <!-- Column 2: In Progress (Now 0) -->
  <g transform="translate(412, 80)">
    <rect x="0" y="0" width="370" height="734" rx="16" fill="#FDFBF7" stroke="#EAE3D8"/>
    <rect x="0" y="0" width="370" height="52" rx="16" fill="#EEF5F8"/>
    <text x="38" y="30" font-size="14" font-weight="bold" fill="#1C4450">กำลังชง/อบ • 0</text>
    <text x="185" y="200" font-size="13" fill="#968E85" text-anchor="middle">ไม่มีเครื่องดื่มค้างชง</text>
  </g>

  <!-- Column 3: Ready (Now 2 Tickets: A03 and A02!) -->
  <g transform="translate(804, 80)">
    <rect x="0" y="0" width="370" height="734" rx="16" fill="#FDFBF7" stroke="#A8D5B5" stroke-width="2"/>
    <rect x="0" y="0" width="370" height="52" rx="16" fill="#EAF4ED"/>
    <circle cx="25" cy="26" r="5" fill="#3B6E4C"/>
    <text x="38" y="30" font-size="14" font-weight="bold" fill="#254731">พร้อมรับที่เคาน์เตอร์ (Ready) • 2</text>

    <!-- Ticket A03 (Newly Ready) -->
    <g transform="translate(16, 68)">
      <rect x="0" y="0" width="338" height="150" rx="12" fill="#FFFFFF" stroke="#A8D5B5" stroke-width="2"/>
      <text x="16" y="28" font-size="18" font-family="'JetBrains Mono',monospace" font-weight="800" fill="#3B6E4C">#คิว A03</text>
      <rect x="220" y="12" width="102" height="22" rx="6" fill="#EAF4ED"/>
      <text x="230" y="27" font-size="10" font-weight="bold" fill="#3B6E4C">✨ พร้อมเสิร์ฟ</text>
      <text x="16" y="64" font-size="13" font-weight="700">2x มัทฉะลาเต้อูจิ</text>
      <rect x="16" y="96" width="306" height="38" rx="8" fill="#F5EFEB" stroke="#EAE3D8"/>
      <text x="90" y="120" font-size="12" font-weight="bold" fill="#1E1B18">ลูกค้ารับแล้ว (ปิดออเดอร์)</text>
    </g>

    <!-- Ticket A02 -->
    <g transform="translate(16, 232)">
      <rect x="0" y="0" width="338" height="150" rx="12" fill="#FFFFFF" stroke="#EAE3D8"/>
      <text x="16" y="28" font-size="18" font-family="'JetBrains Mono',monospace" font-weight="800">#คิว A02</text>
      <text x="16" y="64" font-size="13" font-weight="700">1x ชาไทยการันต์เย็น</text>
      <rect x="16" y="96" width="306" height="38" rx="8" fill="#F5EFEB" stroke="#EAE3D8"/>
      <text x="90" y="120" font-size="12" font-weight="bold" fill="#1E1B18">ลูกค้ารับแล้ว (ปิดออเดอร์)</text>
    </g>
  </g>
</svg>"""

# ==============================================================================
# 4. ADMIN PORTAL INTERACTIONS
# ==============================================================================

# 4.1 Admin Bakery Inventory Tab (Active)
ADMIN_INVENTORY_TAB = f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1440 900" width="1440" height="900" style="background:#FBF8F4; font-family:'Plus Jakarta Sans','Sarabun',sans-serif;">
  <!-- TOP ADMIN BAR -->
  <rect x="0" y="0" width="1440" height="64" fill="#1A120B"/>
  <rect x="24" y="16" width="32" height="32" rx="8" fill="#C85A32"/>
  <text x="31" y="38" font-size="14" font-weight="bold" fill="#FFFFFF">JM</text>
  <text x="68" y="38" font-size="16" font-weight="bold" fill="#FFFFFF">JAMAL CAFÉ — ADMIN PORTAL</text>
  <text x="1260" y="38" font-size="13" fill="#968E85">ผู้ดูแลระบบ (Admin Zai)</text>

  <!-- SIDEBAR NAVIGATION (Bakery Inventory Tab ACTIVE) -->
  <g transform="translate(0, 64)">
    <rect x="0" y="0" width="240" height="836" fill="#F5EFEB" stroke="#EAE3D8"/>
    <text x="48" y="50" font-size="13" font-weight="500" fill="#635C54">📊 แดชบอร์ดภาพรวม</text>
    <!-- ACTIVE TAB: Inventory -->
    <rect x="16" y="74" width="208" height="42" rx="10" fill="#231710"/>
    <text x="48" y="100" font-size="13" font-weight="700" fill="#FFFFFF">🥐 สต็อกเบเกอรี่ (Inventory)</text>
    <text x="48" y="146" font-size="13" font-weight="500" fill="#635C54">☕ จัดการเมนู &amp; ราคา</text>
    <text x="48" y="190" font-size="13" font-weight="500" fill="#635C54">🧾 ประวัติการขาย &amp; Void</text>
    <text x="48" y="234" font-size="13" font-weight="500" fill="#635C54">👥 จัดการสิทธิ์พนักงาน</text>
  </g>

  <!-- MAIN INVENTORY VIEW (1152px) -->
  <g transform="translate(264, 88)">
    <text x="0" y="20" font-size="20" font-weight="800" fill="#1E1B18">ระบบควบคุมและเติมสต็อกเบเกอรี่รายวัน (FR-03)</text>
    <text x="0" y="40" font-size="12" fill="#635C54">ตัดสต็อกอัตโนมัติเมื่อขายออก และบล็อกการขายทันทีเมื่อของหมด</text>

    <!-- Table Container -->
    <rect x="0" y="60" width="1144" height="480" rx="16" fill="#FFFFFF" stroke="#EAE3D8"/>
    <rect x="24" y="80" width="1096" height="40" rx="8" fill="#F5EFEB"/>
    <text x="40" y="105" font-size="12" font-weight="bold">SKU</text>
    <text x="140" y="105" font-size="12" font-weight="bold">ชื่อสินค้า</text>
    <text x="400" y="105" font-size="12" font-weight="bold">ราคา</text>
    <text x="520" y="105" font-size="12" font-weight="bold">รับเข้าเช้า</text>
    <text x="640" y="105" font-size="12" font-weight="bold">คงเหลือจริง</text>
    <text x="760" y="105" font-size="12" font-weight="bold">สถานะ</text>
    <text x="920" y="105" font-size="12" font-weight="bold">ปุ่มเติมสต็อกด่วน</text>

    <!-- Row 1: Croissant -->
    <g transform="translate(24, 130)">
      <text x="16" y="24" font-size="13" font-family="'JetBrains Mono',monospace">BK-01</text>
      <text x="116" y="24" font-size="13" font-weight="600">ครัวซองต์เนยสด AOP</text>
      <text x="376" y="24" font-size="13" font-family="'JetBrains Mono',monospace" font-weight="bold" fill="#C85A32">฿85.00</text>
      <text x="506" y="24" font-size="13" font-family="'JetBrains Mono',monospace">15 ชิ้น</text>
      <text x="626" y="24" font-size="14" font-family="'JetBrains Mono',monospace" font-weight="bold" fill="#C97D28">4 ชิ้น</text>
      <rect x="736" y="8" width="80" height="24" rx="6" fill="#FFF5E6"/>
      <text x="746" y="24" font-size="10" font-weight="bold" fill="#C97D28">ใกล้หมด</text>

      <!-- Restock Buttons -->
      <rect x="896" y="6" width="60" height="28" rx="6" fill="#C85A32"/>
      <text x="926" y="24" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">+ 5 ชิ้น</text>
      <rect x="964" y="6" width="64" height="28" rx="6" fill="#231710"/>
      <text x="996" y="24" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">+ 10 ชิ้น</text>
      <line x1="0" y1="44" x2="1096" y2="44" stroke="#F5EFEB"/>
    </g>

    <!-- Row 2: Burnt Cheesecake (OUT OF STOCK) -->
    <g transform="translate(24, 184)">
      <text x="16" y="24" font-size="13" font-family="'JetBrains Mono',monospace">BK-03</text>
      <text x="116" y="24" font-size="13" font-weight="600">บาสก์ชีสเค้กหน้าไหม้</text>
      <text x="376" y="24" font-size="13" font-family="'JetBrains Mono',monospace" font-weight="bold" fill="#968E85">฿125.00</text>
      <text x="506" y="24" font-size="13" font-family="'JetBrains Mono',monospace">8 ชิ้น</text>
      <text x="626" y="24" font-size="14" font-family="'JetBrains Mono',monospace" font-weight="bold" fill="#BA3C34">0 ชิ้น</text>
      <rect x="736" y="8" width="80" height="24" rx="6" fill="#FDF0EF"/>
      <text x="746" y="24" font-size="10" font-weight="bold" fill="#BA3C34">หมด (Out)</text>

      <!-- Restock Buttons -->
      <rect x="896" y="6" width="60" height="28" rx="6" fill="#C85A32"/>
      <text x="926" y="24" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">+ 5 ชิ้น</text>
      <rect x="964" y="6" width="64" height="28" rx="6" fill="#231710"/>
      <text x="996" y="24" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">+ 10 ชิ้น</text>
    </g>
  </g>
</svg>"""

# 4.2 Admin Restock Modal Overlay
ADMIN_RESTOCK_MODAL = f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1440 900" width="1440" height="900" style="background:#FBF8F4; font-family:'Plus Jakarta Sans','Sarabun',sans-serif;">
{DEFS}
  <!-- Dimmed Backdrop -->
  <rect x="0" y="0" width="1440" height="900" fill="#1A120B" fill-opacity="0.6"/>

  <!-- Modal Centered (480 x 380) -->
  <g transform="translate(480, 260)" filter="url(#modalShadow)">
    <rect x="0" y="0" width="480" height="380" rx="24" fill="#FFFFFF" stroke="#EAE3D8"/>

    <!-- Header -->
    <text x="32" y="44" font-size="18" font-weight="800">เติมสต็อกสินค้า (Restock)</text>
    <text x="32" y="68" font-size="12" fill="#635C54">ครัวซองต์เนยสด AOP (France) • SKU: BK-01</text>
    <line x1="32" y1="84" x2="448" y2="84" stroke="#EAE3D8"/>

    <!-- Current Stock info -->
    <text x="32" y="120" font-size="13" fill="#635C54">สต็อกคงเหลือปัจจุบัน:</text>
    <text x="448" y="120" font-size="14" font-family="'JetBrains Mono',monospace" font-weight="bold" fill="#C97D28" text-anchor="end">4 ชิ้น</text>

    <!-- Quantity to Add -->
    <g transform="translate(32, 140)">
      <text x="0" y="14" font-size="12" font-weight="700">จำนวนที่ต้องการเติมเข้าสต็อก (+ ชิ้น)</text>
      <rect x="0" y="24" width="416" height="52" rx="14" fill="#FDFBF7" stroke="#C85A32" stroke-width="2"/>
      <text x="20" y="58" font-size="22" font-family="'JetBrains Mono',monospace" font-weight="900" fill="#C85A32">+ 10 ชิ้น</text>
    </g>

    <!-- New Expected Total -->
    <text x="32" y="250" font-size="13" font-weight="bold" fill="#3B6E4C">ยอดสต็อกใหม่หลังเติม: 14 ชิ้น (สถานะ: พร้อมขาย)</text>

    <!-- Buttons -->
    <g transform="translate(32, 290)">
      <rect x="0" y="0" width="190" height="48" rx="14" fill="#F5EFEB"/>
      <text x="95" y="29" font-size="13" font-weight="700" fill="#635C54" text-anchor="middle">ยกเลิก</text>

      <rect x="206" y="0" width="210" height="48" rx="14" fill="#3B6E4C"/>
      <text x="311" y="29" font-size="13" font-weight="800" fill="#FFFFFF" text-anchor="middle">✓ ยืนยันการเติมสต็อก</text>
    </g>
  </g>
</svg>"""

# 4.3 Admin Sales History & Void Tab
ADMIN_SALES_HISTORY = f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1440 900" width="1440" height="900" style="background:#FBF8F4; font-family:'Plus Jakarta Sans','Sarabun',sans-serif;">
  <!-- TOP ADMIN BAR -->
  <rect x="0" y="0" width="1440" height="64" fill="#1A120B"/>
  <rect x="24" y="16" width="32" height="32" rx="8" fill="#C85A32"/>
  <text x="31" y="38" font-size="14" font-weight="bold" fill="#FFFFFF">JM</text>
  <text x="68" y="38" font-size="16" font-weight="bold" fill="#FFFFFF">JAMAL CAFÉ — ADMIN PORTAL</text>

  <!-- SIDEBAR NAVIGATION (Sales History Tab ACTIVE) -->
  <g transform="translate(0, 64)">
    <rect x="0" y="0" width="240" height="836" fill="#F5EFEB" stroke="#EAE3D8"/>
    <text x="48" y="50" font-size="13" font-weight="500" fill="#635C54">📊 แดชบอร์ดภาพรวม</text>
    <text x="48" y="98" font-size="13" font-weight="500" fill="#635C54">🥐 สต็อกเบเกอรี่</text>
    <text x="48" y="146" font-size="13" font-weight="500" fill="#635C54">☕ จัดการเมนู &amp; ราคา</text>
    <!-- ACTIVE Sales History -->
    <rect x="16" y="166" width="208" height="42" rx="10" fill="#231710"/>
    <text x="48" y="192" font-size="13" font-weight="700" fill="#FFFFFF">🧾 ประวัติการขาย &amp; Void</text>
    <text x="48" y="238" font-size="13" font-weight="500" fill="#635C54">👥 จัดการสิทธิ์พนักงาน</text>
  </g>

  <!-- MAIN SALES HISTORY VIEW -->
  <g transform="translate(264, 88)">
    <text x="0" y="20" font-size="20" font-weight="800" fill="#1E1B18">รายงานประวัติการขายและบันทึก Void Audit (FR-07, FR-08)</text>
    <text x="0" y="40" font-size="12" fill="#635C54">บันทึกธุรกรรมย้อนหลัง ตรวจสอบสลิป และรายการที่ถูกยกเลิกบิล</text>

    <rect x="0" y="60" width="1144" height="480" rx="16" fill="#FFFFFF" stroke="#EAE3D8"/>
    <rect x="24" y="80" width="1096" height="40" rx="8" fill="#F5EFEB"/>
    <text x="40" y="105" font-size="12" font-weight="bold">เลขที่บิล</text>
    <text x="200" y="105" font-size="12" font-weight="bold">เวลา</text>
    <text x="280" y="105" font-size="12" font-weight="bold">คิว</text>
    <text x="360" y="105" font-size="12" font-weight="bold">รายการสินค้า</text>
    <text x="640" y="105" font-size="12" font-weight="bold">ชำระโดย</text>
    <text x="760" y="105" font-size="12" font-weight="bold">ยอดเงิน</text>
    <text x="880" y="105" font-size="12" font-weight="bold">สถานะ</text>
    <text x="1000" y="105" font-size="12" font-weight="bold">บันทึกผู้อนุมัติ</text>

    <!-- Row 1: Paid -->
    <g transform="translate(24, 130)">
      <text x="16" y="24" font-size="12" font-family="'JetBrains Mono',monospace">INV-20260922-0084</text>
      <text x="176" y="24" font-size="12">14:40</text>
      <text x="256" y="24" font-size="12" font-weight="bold">#A04</text>
      <text x="336" y="24" font-size="12">เอสเพรสโซ่เย็น, ครัวซองต์ AOP</text>
      <text x="616" y="24" font-size="12">PromptPay</text>
      <text x="736" y="24" font-size="13" font-family="'JetBrains Mono',monospace" font-weight="bold">฿150.00</text>
      <rect x="856" y="8" width="70" height="24" rx="6" fill="#EAF4ED"/>
      <text x="866" y="24" font-size="10" font-weight="bold" fill="#3B6E4C">ชำระสำเร็จ</text>
      <text x="976" y="24" font-size="11" fill="#635C54">Zai (แคชเชียร์)</text>
      <line x1="0" y1="44" x2="1096" y2="44" stroke="#F5EFEB"/>
    </g>

    <!-- Row 2: VOIDED BILL (FR-07) -->
    <g transform="translate(24, 184)">
      <text x="16" y="24" font-size="12" font-family="'JetBrains Mono',monospace" fill="#BA3C34">INV-20260922-0080</text>
      <text x="176" y="24" font-size="12">13:58</text>
      <text x="256" y="24" font-size="12" font-weight="bold">#V99</text>
      <text x="336" y="24" font-size="12">คาปูชิโน่ร้อน, เค้กแครอท</text>
      <text x="616" y="24" font-size="12">เงินสด</text>
      <text x="736" y="24" font-size="13" font-family="'JetBrains Mono',monospace" font-weight="bold">฿155.00</text>
      <rect x="856" y="8" width="70" height="24" rx="6" fill="#FDF0EF"/>
      <text x="872" y="24" font-size="10" font-weight="bold" fill="#BA3C34">Voided</text>
      <text x="976" y="24" font-size="11" font-weight="bold" fill="#BA3C34">Admin Zai (FR-07)</text>
    </g>
  </g>
</svg>"""

# ==============================================================================
# 5. CUSTOMER MOBILE INTERACTIONS
# ==============================================================================

# 5.1 Mobile Customization Bottom Sheet
MOBILE_CUSTOM_SHEET = f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 393 852" width="393" height="852" style="background:#FBF8F4; font-family:'Plus Jakarta Sans','Sarabun',sans-serif;">
{DEFS}
  <!-- Dimmed Backdrop -->
  <rect x="0" y="0" width="393" height="852" fill="#1A120B" fill-opacity="0.55"/>

  <!-- Bottom Sheet Drawer (393 x 480) -->
  <g transform="translate(0, 372)" filter="url(#modalShadow)">
    <rect x="0" y="0" width="393" height="480" rx="32" fill="#FFFFFF"/>
    <rect x="165" y="12" width="64" height="5" rx="3" fill="#D8CEC2"/>

    <!-- Product Title -->
    <text x="24" y="52" font-size="17" font-weight="800" fill="#1E1B18">ปรับแต่ง: เอสเพรสโซ่เย็น</text>
    <text x="24" y="74" font-size="13" font-weight="bold" font-family="'JetBrains Mono',monospace" fill="#C85A32">ราคาเริ่มต้น ฿65.00</text>
    <circle cx="355" cy="46" r="14" fill="#F5EFEB"/>
    <text x="355" y="50" font-size="12" font-weight="bold" fill="#635C54" text-anchor="middle">✕</text>

    <!-- Sweetness Level -->
    <g transform="translate(24, 100)">
      <text x="0" y="14" font-size="12" font-weight="700">ระดับความหวาน (Sweetness)</text>
      <!-- Pills -->
      <rect x="0" y="24" width="75" height="38" rx="10" fill="#F5EFEB"/>
      <text x="37" y="48" font-size="12" font-weight="bold" text-anchor="middle">0%</text>

      <rect x="85" y="24" width="75" height="38" rx="10" fill="#FDF2ED" stroke="#C85A32" stroke-width="2"/>
      <text x="122" y="48" font-size="12" font-weight="bold" fill="#C85A32" text-anchor="middle">25%</text>

      <rect x="170" y="24" width="75" height="38" rx="10" fill="#F5EFEB"/>
      <text x="207" y="48" font-size="12" font-weight="bold" text-anchor="middle">50%</text>

      <rect x="255" y="24" width="75" height="38" rx="10" fill="#F5EFEB"/>
      <text x="292" y="48" font-size="12" font-weight="bold" text-anchor="middle">100%</text>
    </g>

    <!-- Milk Options -->
    <g transform="translate(24, 196)">
      <text x="0" y="14" font-size="12" font-weight="700">ชนิดนม (Milk Option)</text>
      <rect x="0" y="24" width="110" height="38" rx="10" fill="#F5EFEB"/>
      <text x="55" y="48" font-size="11" font-weight="bold" text-anchor="middle">นมสดปกติ</text>

      <rect x="118" y="24" width="118" height="38" rx="10" fill="#FDF2ED" stroke="#C85A32" stroke-width="2"/>
      <text x="177" y="48" font-size="11" font-weight="bold" fill="#C85A32" text-anchor="middle">นมโอ๊ต (+15฿)</text>
    </g>

    <!-- Add to Cart Button -->
    <g transform="translate(24, 380)">
      <rect x="0" y="0" width="345" height="52" rx="16" fill="#C85A32"/>
      <text x="172" y="32" font-size="14" font-weight="800" fill="#FFFFFF" text-anchor="middle">เพิ่มลงในตะกร้า • ฿80.00 →</text>
    </g>
  </g>
</svg>"""

# 5.2 Mobile Cart Drawer (Review & Checkout)
MOBILE_CART_DRAWER = f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 393 852" width="393" height="852" style="background:#FBF8F4; font-family:'Plus Jakarta Sans','Sarabun',sans-serif;">
{DEFS}
  <!-- Dimmed Backdrop -->
  <rect x="0" y="0" width="393" height="852" fill="#1A120B" fill-opacity="0.55"/>

  <!-- Cart Drawer (393 x 540) -->
  <g transform="translate(0, 312)" filter="url(#modalShadow)">
    <rect x="0" y="0" width="393" height="540" rx="32" fill="#FFFFFF"/>
    <rect x="165" y="12" width="64" height="5" rx="3" fill="#D8CEC2"/>

    <text x="24" y="52" font-size="17" font-weight="800" fill="#1E1B18">ตะกร้าของคุณ (2 รายการ)</text>
    <text x="24" y="72" font-size="12" font-weight="bold" fill="#C85A32">โต๊ะ 04 • สั่งทานที่ร้าน</text>
    <circle cx="355" cy="46" r="14" fill="#F5EFEB"/>
    <text x="355" y="50" font-size="12" font-weight="bold" fill="#635C54" text-anchor="middle">✕</text>

    <!-- Item 1 -->
    <g transform="translate(24, 96)">
      <rect x="0" y="0" width="345" height="64" rx="14" fill="#FDFBF7" stroke="#EAE3D8"/>
      <text x="14" y="26" font-size="13" font-weight="bold">1x เอสเพรสโซ่เย็น</text>
      <text x="14" y="44" font-size="10" font-weight="bold" fill="#C85A32">↳ หวาน 25% • นมโอ๊ต</text>
      <text x="330" y="36" font-size="13" font-family="'JetBrains Mono',monospace" font-weight="bold" text-anchor="end">฿80.00</text>
    </g>

    <!-- Item 2 -->
    <g transform="translate(24, 170)">
      <rect x="0" y="0" width="345" height="64" rx="14" fill="#FDFBF7" stroke="#EAE3D8"/>
      <text x="14" y="26" font-size="13" font-weight="bold">1x ครัวซองต์เนยสด AOP</text>
      <text x="14" y="44" font-size="10" fill="#635C54">↳ อบอุ่นร้อน</text>
      <text x="330" y="36" font-size="13" font-family="'JetBrains Mono',monospace" font-weight="bold" text-anchor="end">฿85.00</text>
    </g>

    <!-- Totals -->
    <g transform="translate(24, 256)">
      <line x1="0" y1="0" x2="345" y2="0" stroke="#EAE3D8"/>
      <text x="0" y="26" font-size="13" font-weight="bold" fill="#1E1B18">ยอดสุทธิ (Total Amount)</text>
      <text x="345" y="26" font-size="17" font-family="'JetBrains Mono',monospace" font-weight="900" fill="#C85A32" text-anchor="end">฿165.00</text>
    </g>

    <!-- Place Order Button -->
    <g transform="translate(24, 430)">
      <rect x="0" y="0" width="345" height="54" rx="16" fill="#C85A32"/>
      <text x="172" y="34" font-size="15" font-weight="800" fill="#FFFFFF" text-anchor="middle">✓ ยืนยันการสั่งซื้อ • ส่งเข้าครัวทันที</text>
    </g>
  </g>
</svg>"""

# 5.3 Mobile Order Success Confirmation
MOBILE_ORDER_SUCCESS = f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 393 852" width="393" height="852" style="background:#FBF8F4; font-family:'Plus Jakarta Sans','Sarabun',sans-serif;">
{DEFS}
  <!-- Phone Status Bar -->
  <rect x="0" y="0" width="393" height="44" fill="#1A120B"/>
  <text x="32" y="28" font-size="14" font-weight="700" fill="#FFFFFF">9:41</text>
  <rect x="140" y="8" width="113" height="28" rx="14" fill="#000000"/>

  <!-- Success Card -->
  <g transform="translate(20, 80)" filter="url(#shadow)">
    <rect x="0" y="0" width="353" height="480" rx="28" fill="#FFFFFF" stroke="#3B6E4C" stroke-width="2"/>
    
    <circle cx="176" cy="70" r="36" fill="#EAF4ED"/>
    <text x="176" y="80" font-size="32" text-anchor="middle">🎉</text>

    <text x="176" y="140" font-size="20" font-weight="900" fill="#1E1B18" text-anchor="middle">สั่งซื้อสำเร็จแล้ว!</text>
    <text x="176" y="165" font-size="12" fill="#635C54" text-anchor="middle">ออเดอร์ถูกส่งไปยังบาริสต้าเรียบร้อยแล้ว</text>

    <!-- Big Queue Ticket -->
    <g transform="translate(24, 190)">
      <rect x="0" y="0" width="305" height="120" rx="18" fill="#1A120B"/>
      <text x="152" y="36" font-size="12" fill="#968E85" text-anchor="middle">หมายเลขคิวของคุณ</text>
      <text x="152" y="84" font-size="38" font-family="'JetBrains Mono',monospace" font-weight="900" fill="#FFFFFF" text-anchor="middle">#A05</text>
      <rect x="100" y="92" width="105" height="20" rx="6" fill="#C97D28"/>
      <text x="152" y="106" font-size="10" font-weight="bold" fill="#FFFFFF" text-anchor="middle">รอดำเนินการ (รอชง)</text>
    </g>

    <text x="176" y="360" font-size="12" font-weight="600" fill="#635C54" text-anchor="middle">โต๊ะ 04 • สั่งทานที่ร้าน • 2 รายการ</text>

    <!-- Return to Menu Button -->
    <g transform="translate(24, 396)">
      <rect x="0" y="0" width="305" height="50" rx="14" fill="#C85A32"/>
      <text x="152" y="31" font-size="14" font-weight="800" fill="#FFFFFF" text-anchor="middle">ดูเมนูเพิ่มเติม ➔</text>
    </g>
  </g>
</svg>"""

# 5.4 Mobile Queue Ready (Emerald Alert)
MOBILE_QUEUE_READY = f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 393 852" width="393" height="852" style="background:#FBF8F4; font-family:'Plus Jakarta Sans','Sarabun',sans-serif;">
{DEFS}
  <!-- Phone Status Bar -->
  <rect x="0" y="0" width="393" height="44" fill="#1A120B"/>
  <text x="32" y="28" font-size="14" font-weight="700" fill="#FFFFFF">9:41</text>
  <rect x="140" y="8" width="113" height="28" rx="14" fill="#000000"/>

  <!-- Header -->
  <rect x="0" y="44" width="393" height="56" fill="#FFFFFF" stroke="#EAE3D8"/>
  <text x="20" y="70" font-size="11" font-family="'JetBrains Mono',monospace" font-weight="bold" fill="#C85A32">โต๊ะ 04 • สั่งทานที่ร้าน</text>
  <text x="20" y="88" font-size="15" font-weight="800" fill="#1E1B18">JAMAL CAFÉ</text>

  <!-- CALLOUT READY BANNER (EMERALD GREEN PULSE) -->
  <g transform="translate(16, 112)" filter="url(#shadow)">
    <rect x="0" y="0" width="361" height="84" rx="18" fill="#3B6E4C" stroke="#A8D5B5" stroke-width="2"/>
    <text x="20" y="34" font-size="16" font-family="'JetBrains Mono',monospace" font-weight="900" fill="#FFFFFF">✨ คิวของคุณ: #A03 พร้อมรับแล้ว!</text>
    <rect x="250" y="16" width="95" height="24" rx="8" fill="#FFFFFF"/>
    <text x="297" y="32" font-size="11" font-weight="bold" fill="#3B6E4C" text-anchor="middle">พร้อมรับสินค้า</text>
    <text x="20" y="62" font-size="12" fill="#EAF4ED">เชิญรับเครื่องดื่มและเบเกอรี่ได้ที่เคาน์เตอร์บาร์ได้เลยค่ะ</text>
  </g>

  <!-- Product list placeholder -->
  <g transform="translate(16, 216)">
    <rect x="0" y="0" width="361" height="96" rx="14" fill="#FFFFFF" stroke="#EAE3D8"/>
    <text x="96" y="36" font-size="14" font-weight="bold">เอสเพรสโซ่เย็น (Iced Espresso)</text>
    <text x="96" y="68" font-size="15" font-family="'JetBrains Mono',monospace" font-weight="bold" fill="#C85A32">฿65.00</text>
  </g>
</svg>"""

ALL_FILES = {
    # Login Interactions
    "00_login_error_pin.svg": LOGIN_ERROR_PIN,
    "00_login_role_admin.svg": LOGIN_ROLE_ADMIN,
    "00_login_role_operator.svg": LOGIN_ROLE_OPERATOR,
    
    # POS Interactions
    "01_pos_search_active.svg": POS_SEARCH_ACTIVE,
    "01_pos_out_of_stock_alert.svg": POS_OUT_OF_STOCK,
    "01_pos_cart_multi_items.svg": POS_CART_MULTI,
    "02_custom_modal_sweet50_oat.svg": CUSTOM_MODAL_SELECTED,
    "02_payment_modal_cash_numpad.svg": PAYMENT_CASH_NUMPAD,
    "04_void_success_toast.svg": VOID_SUCCESS_TOAST,

    # KDS Interactions
    "03_kds_action_started.svg": KDS_ACTION_STARTED,
    "03_kds_action_completed.svg": KDS_ACTION_COMPLETED,

    # Admin Portal Interactions
    "04_admin_inventory_tab.svg": ADMIN_INVENTORY_TAB,
    "04_admin_restock_modal.svg": ADMIN_RESTOCK_MODAL,
    "04_admin_sales_history_tab.svg": ADMIN_SALES_HISTORY,

    # Customer Mobile Interactions
    "05_customer_mobile_custom_sheet.svg": MOBILE_CUSTOM_SHEET,
    "05_customer_mobile_cart_drawer.svg": MOBILE_CART_DRAWER,
    "05_customer_mobile_order_success.svg": MOBILE_ORDER_SUCCESS,
    "05_customer_mobile_queue_ready.svg": MOBILE_QUEUE_READY,
}

def main():
    print(f"Generating {len(ALL_FILES)} interaction SVGs into {OUTPUT_DIR}...")
    for filename, content in ALL_FILES.items():
        path = os.path.join(OUTPUT_DIR, filename)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content.strip())
        print(f"  [+] Created: {filename}")
    print("\nAll SVG interaction frames created successfully!")

if __name__ == "__main__":
    main()
