class StaffModel {
  constructor(initialStaff = []) {
    this.staffList = initialStaff.map((item) => ({ ...item }));
  }

  getAll() {
    return this.staffList;
  }
}

module.exports = StaffModel;
