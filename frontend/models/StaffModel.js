class StaffModel {
  constructor(initialStaff = []) {
    this.staffList = initialStaff.map((item) => ({ ...item }));
  }

  getAll() {
    return this.staffList;
  }

  // Data Structure Method 1: เพิ่มบัญชีพนักงานพร้อมตรวจสอบข้อมูลซ้ำ
  addStaff({ name, role = 'Cashier', username, pin, shift = 'กะเช้า (07:00 - 15:30)' }) {
    if (!name || !username || !pin) {
      return { ok: false, status: 400, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' };
    }
    const cleanUsername = String(username).trim().toLowerCase();
    if (this.staffList.find((acc) => acc.username.trim().toLowerCase() === cleanUsername)) {
      return { ok: false, status: 409, error: 'ชื่อผู้ใช้งานนี้มีอยู่ในระบบแล้ว' };
    }

    const roleNameMap = {
      Admin: 'ผู้ดูแลระบบ (เข้าถึงได้ทุกส่วนงาน)',
      Cashier: 'แคชเชียร์ (ขายหน้าร้าน, คิดเงิน, ปิดกะ)',
      Barista: 'บาริสต้า (จอคิวครัว KDS, ทำเครื่องดื่ม)',
    };
    const lowerRole = String(role).toLowerCase();
    const normalizedRole =
      lowerRole === 'admin'
        ? 'admin'
        : lowerRole === 'barista' || lowerRole === 'operator'
        ? 'operator'
        : 'cashier';

    const newAcc = {
      id: `staff-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: String(name).trim(),
      role: normalizedRole,
      roleLabel: role,
      roleName: roleNameMap[role] || role,
      username: String(username).trim(),
      pin: String(pin),
      shift,
      authProvider: 'local',
    };
    this.staffList.push(newAcc);
    return { ok: true, status: 201, staff: newAcc, staffAccounts: this.staffList };
  }

  // Data Structure Method 2: ตรวจสอบสิทธิ์ด้วย Username + PIN
  authenticatePin(username, pin) {
    const key = String(username || '').trim().toLowerCase();
    const matched = key
      ? this.staffList.find((acc) => acc.username.trim().toLowerCase() === key) || null
      : null;
    if (!matched) {
      return { ok: false, status: 404, error: 'ไม่พบชื่อผู้ใช้งานนี้ในระบบ' };
    }
    if (matched.pin !== String(pin || '')) {
      return {
        ok: false,
        status: 401,
        error: 'รหัสผ่าน PIN ไม่ถูกต้อง (ลองใช้: ' + matched.pin + ')',
      };
    }
    return { ok: true, status: 200, user: matched };
  }

  // Data Structure Method 3: เข้าสู่ระบบด้วย Social Media (Gmail / Facebook) ตาม Issue #12
  authenticateSocial({ provider, email, displayName, role = 'cashier' }) {
    const cleanProvider = String(provider || '').trim().toLowerCase();
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!['gmail', 'google', 'facebook'].includes(cleanProvider) || !cleanEmail) {
      return { ok: false, status: 400, error: 'ข้อมูลบัญชี Social Login ไม่ถูกต้อง' };
    }

    let user =
      this.staffList.find((acc) => acc.username.trim().toLowerCase() === cleanEmail) || null;
    if (!user) {
      const normalizedRole = String(role).toLowerCase() === 'admin' ? 'admin' : 'cashier';
      user = {
        id: `social-${Date.now()}`,
        username: cleanEmail,
        pin: '0000',
        name: displayName || cleanEmail.split('@')[0],
        role: normalizedRole,
        roleName: normalizedRole === 'admin' ? 'เจ้าของร้าน (Social)' : 'แคชเชียร์ (Social)',
        authProvider: cleanProvider === 'google' ? 'gmail' : cleanProvider,
      };
      this.staffList.push(user);
    }
    return { ok: true, status: 200, user };
  }
}

module.exports = StaffModel;
