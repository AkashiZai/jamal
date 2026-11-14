const { test, expect } = require('@playwright/test');
const app = require('../../server');

let server;
let baseUrl;

test.beforeAll(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const { port } = server.address();
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

test.afterAll(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
});

test('UI Case 1: Login with valid Cashier PIN navigates to POS page', async ({ page }) => {
  await page.goto(baseUrl);
  await page.getByTitle('ออกจากระบบ (Sign Out)').click();
  await expect(page.getByText('เข้าสู่ระบบ JAMAL POS')).toBeVisible();

  await page.getByRole('button', { name: /เข้าสู่ระบบ \(Sign In\)/ }).click();
  await expect(page.getByText('เมนูสินค้าหน้าร้าน (Menu Catalog)')).toBeVisible();
});

test('UI Case 2: Login with invalid PIN displays expected error message', async ({ page }) => {
  await page.goto(baseUrl);
  await page.getByTitle('ออกจากระบบ (Sign Out)').click();

  const pinInput = page.locator('input[type="password"]');
  await pinInput.fill('0000');
  await page.getByRole('button', { name: /เข้าสู่ระบบ \(Sign In\)/ }).click();

  await expect(page.getByText(/รหัสผ่าน PIN ไม่ถูกต้อง/)).toBeVisible();
});
