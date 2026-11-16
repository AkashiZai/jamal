const request = require('supertest');
const StaffModel = require('../models/StaffModel');
const app = require('../server');

describe('StaffModel Unit Tests', () => {
  const seed = [
    { id: 's1', username: 'cashier_zai', pin: '1234', name: 'Zai', role: 'cashier' },
    { id: 's2', username: 'admin_boss', pin: '9999', name: 'Boss', role: 'admin' },
  ];

  test('authenticatePin returns user for valid credentials and 401/404 on failure', () => {
    const model = new StaffModel(seed);
    expect(model.authenticatePin('cashier_zai', '1234').ok).toBe(true);
    expect(model.authenticatePin('cashier_zai', '0000').status).toBe(401);
    expect(model.authenticatePin('unknown', '1234').status).toBe(404);
    expect(model.authenticatePin('', '1234').status).toBe(404);
  });

  test('authenticateSocial logs in with Gmail/Facebook and rejects invalid provider', () => {
    const model = new StaffModel(seed);
    const res = model.authenticateSocial({
      provider: 'gmail',
      email: 'newstaff@gmail.com',
      displayName: 'New Staff',
      role: 'cashier',
    });
    expect(res.ok).toBe(true);
    expect(res.user.authProvider).toBe('gmail');
    expect(model.findByUsername('newstaff@gmail.com')).not.toBeNull();

    // Existing social account returns the same user without duplicating
    const repeat = model.authenticateSocial({
      provider: 'google',
      email: 'newstaff@gmail.com',
    });
    expect(repeat.ok).toBe(true);
    expect(repeat.user.id).toBe(res.user.id);

    const adminFb = model.authenticateSocial({
      provider: 'facebook',
      email: 'owner@fb.com',
      role: 'admin',
    });
    expect(adminFb.ok).toBe(true);
    expect(adminFb.user.role).toBe('admin');

    const invalid = model.authenticateSocial({ provider: 'twitter', email: '' });
    expect(invalid.ok).toBe(false);
    expect(invalid.status).toBe(400);
  });

  test('POST /api/auth/login returns 200 on valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'cashier_zai', pin: '1234' });
    expect(res.statusCode).toBe(200);
    expect(res.body.user.role).toBe('cashier');
  });

  test('POST /api/auth/social authenticates social user and rejects invalid payload', async () => {
    const okRes = await request(app)
      .post('/api/auth/social')
      .send({ provider: 'gmail', email: 'api.social@gmail.com', role: 'cashier' });
    expect(okRes.statusCode).toBe(200);
    expect(okRes.body.user.authProvider).toBe('gmail');

    const badRes = await request(app)
      .post('/api/auth/social')
      .send({ provider: 'unknown', email: '' });
    expect(badRes.statusCode).toBe(400);

    const badPinRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'cashier_zai', pin: '0000' });
    expect(badPinRes.statusCode).toBe(401);
  });

  test('addStaff, countStaffByRole, and isSessionExpired work accurately', async () => {
    const model = new StaffModel(seed);
    expect(model.addStaff({ name: '', username: '', pin: '' }).ok).toBe(false);
    expect(model.addStaff({ name: 'B', username: 'cashier_zai', pin: '1111' }).status).toBe(409);

    const added = model.addStaff({
      name: 'Barista A',
      role: 'Barista',
      username: 'barista_a',
      pin: '5678',
    });
    expect(added.ok).toBe(true);

    const addedAdmin = model.addStaff({
      name: 'Manager B',
      role: 'Admin',
      username: 'admin_b',
      pin: '8888',
    });
    expect(addedAdmin.ok).toBe(true);

    const addedDefault = model.addStaff({
      name: 'Cashier C',
      username: 'cashier_c',
      pin: '2222',
    });
    expect(addedDefault.ok).toBe(true);
    expect(model.countStaffByRole()).toEqual({ admin: 2, cashier: 2, operator: 1, total: 5 });

    const now = 1000000;
    expect(model.isSessionExpired(0, now)).toBe(false);
    expect(model.isSessionExpired(now + 1000, now)).toBe(false);
    expect(model.isSessionExpired(now - 10 * 60 * 1000, now)).toBe(false);
    expect(model.isSessionExpired(now - 16 * 60 * 1000, now)).toBe(true);

    const staffRes = await request(app).post('/api/staff').send({
      name: 'API Staff',
      role: 'Cashier',
      username: 'api_staff',
      pin: '3333',
    });
    expect(staffRes.statusCode).toBe(201);

    const dupStaffRes = await request(app).post('/api/staff').send({
      name: 'API Staff Dup',
      role: 'Cashier',
      username: 'api_staff',
      pin: '3333',
    });
    expect(dupStaffRes.statusCode).toBe(409);
  });
});
