const { test, expect } = require('@playwright/test');
const app = require('../../server');

let server;
let baseUrl;

test.beforeAll(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

test.afterAll(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
});

// อ่านจำนวนสต็อกของทุกแถวในหน้า Admin Inventory ตามลำดับที่แสดงบนจอ
async function readDisplayedStocks(page) {
  const labels = await page.locator('[data-testid^="inventory-stock-"]').allInnerTexts();
  return labels.map((label) => parseInt(label, 10));
}

test('UI Case 5: Admin sorts inventory small to large and restocks the croissant', async ({ page }) => {
  await page.goto(baseUrl);
  await page.getByRole('button', { name: /3\. Admin Portal/ }).click();
  await expect(page.getByText('ระบบควบคุมและตัดสต็อกเบเกอรี่รายวัน')).toBeVisible();

  await page.getByRole('button', { name: 'จัดการสต็อกทั้งหมด →' }).click();
  const croissantRow = page.locator('div.rounded-xl', { hasText: 'ครัวซองต์เนยสด AOP (Butter Croissant)' }).first();
  await expect(croissantRow).toBeVisible();

  // รายการสต็อกต้องเรียงจากน้อยไปมาก (Base Drink + Cake + Toppings)
  const stocksBefore = await readDisplayedStocks(page);
  expect(stocksBefore.length).toBeGreaterThan(5);
  expect(stocksBefore).toEqual([...stocksBefore].sort((a, b) => a - b));

  await croissantRow.getByRole('button', { name: /เติม 5 ชิ้น/ }).click();
});
