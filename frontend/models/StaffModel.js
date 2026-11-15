class StaffModel {
  constructor(initialStaff = []) {
    this.staffList = initialStaff.map((item) => ({ ...item }));
  }

  getAll() {
    return this.staffList;
  }

  _normalizeStaffRole(role) {
    const roleMap = { admin: 'admin', barista: 'operator', operator: 'operator' };
    const key = String(role || '').trim().toLowerCase();
    return roleMap[key] || 'cashier';
  }

  _buildLocalStaffRecord({ name, role = 'Cashier', username, pin, shift = 'กะเช้า (07:00 - 15:30)' }) {
    const roleNameMap = {
      Admin: 'ผู้ดูแลระบบ (เข้าถึงได้ทุกส่วนงาน)',
      Cashier: 'แคชเชียร์ (ขายหน้าร้าน, คิดเงิน, ปิดกะ)',
      Barista: 'บาริสต้า (จอคิวครัว KDS, ทำเครื่องดื่ม)',
    };
    return {
      id: `staff-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: String(name).trim(),
      role: this._normalizeStaffRole(role),
      roleLabel: role,
      roleName: roleNameMap[role] || role,
      username: String(username).trim(),
      pin: String(pin),
      shift,
      authProvider: 'local',
    };
  }

  // Data Structure Method 1: เพิ่มบัญชีพนักงานพร้อมตรวจสอบข้อมูลซ้ำ
  addStaff(staffInput = {}) {
    const { name, username, pin } = staffInput;
    if (!name || !username || !pin) {
      return { ok: false, status: 400, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' };
    }
    const cleanUsername = String(username).trim().toLowerCase();
    if (this.findByUsername(cleanUsername)) {
      return { ok: false, status: 409, error: 'ชื่อผู้ใช้งานนี้มีอยู่ในระบบแล้ว' };
    }

    const newAcc = this._buildLocalStaffRecord(staffInput);
    this.staffList.push(newAcc);
    return { ok: true, status: 201, staff: newAcc, staffAccounts: this.staffList };
  }

  // Data Structure Method 2: ตรวจสอบสิทธิ์ด้วย Username + PIN
  authenticatePin(username, pin) {
    const matched = this.findByUsername(username);
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

  _buildSocialStaffRecord({ cleanProvider, cleanEmail, displayName, role = 'cashier' }) {
    const normalizedRole = String(role).toLowerCase() === 'admin' ? 'admin' : 'cashier';
    return {
      id: `social-${Date.now()}`,
      username: cleanEmail,
      pin: '0000',
      name: displayName || cleanEmail.split('@')[0],
      role: normalizedRole,
      roleName: normalizedRole === 'admin' ? 'เจ้าของร้าน (Social)' : 'แคชเชียร์ (Social)',
      authProvider: cleanProvider === 'google' ? 'gmail' : cleanProvider,
    };
  }

  // Data Structure Method 3: เข้าสู่ระบบด้วย Social Media (Gmail / Facebook) ตาม Issue #12
  authenticateSocial({ provider, email, displayName, role }) {
    const cleanProvider = String(provider || '').trim().toLowerCase();
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!['gmail', 'google', 'facebook'].includes(cleanProvider) || !cleanEmail) {
      return { ok: false, status: 400, error: 'ข้อมูลบัญชี Social Login ไม่ถูกต้อง' };
    }

    let user = this.findByUsername(cleanEmail);
    if (!user) {
      user = this._buildSocialStaffRecord({ cleanProvider, cleanEmail, displayName, role });
      this.staffList.push(user);
    }
    return { ok: true, status: 200, user };
  }

  // Search Method (ตาม Google Doc): ค้นหาพนักงานด้วย Username หรือ Email
  findByUsername(username) {
    const key = String(username || '').trim().toLowerCase();
    if (!key) return null;
    return this.staffList.find((acc) => acc.username.trim().toLowerCase() === key) || null;
  }

  // Calculation Method (ตาม Google Doc): นับจำนวนพนักงานแยกตาม Role
  countStaffByRole() {
    const summary = { admin: 0, cashier: 0, operator: 0, total: this.staffList.length };
    for (const acc of this.staffList) {
      if (acc.role === 'admin') summary.admin += 1;
      else if (acc.role === 'operator') summary.operator += 1;
      else summary.cashier += 1;
    }
    return summary;
  }

  // NFR-04: ตรวจสอบ Session Timeout 15 นาที
  isSessionExpired(lastActiveMs, nowMs = Date.now(), timeoutMs = 15 * 60 * 1000) {
    if (!lastActiveMs || nowMs < lastActiveMs) return false;
    return nowMs - lastActiveMs >= timeoutMs;
  }
}

module.exports = StaffModel;
