class StaffModel {
  constructor(initialStaff = []) {
    this.staffList = initialStaff.map((item) => ({ ...item }));
  }

  getAll() {
    return this.staffList;
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
