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

test('UI Case 3: POS searches menu, customizes topping, and verifies cart total', async ({ page }) => {
  await page.goto(baseUrl);
  const searchBox = page.getByPlaceholder('ค้นหาชื่อเมนู หรือรหัส...');
  await searchBox.fill('เอสเพรสโซ่เย็น');

  await page.getByText('เอสเพรสโซ่เย็น (Iced Espresso)').first().click();
  await expect(page.getByText('1. ระดับความหวาน (Sweetness Level)')).toBeVisible();
  await page.getByText('เพิ่มช็อตกาแฟ (Extra Espresso Shot)').click();
  await page.getByRole('button', { name: /เพิ่มลงในบิล/ }).click();

  await expect(page.getByText('฿85.00').first()).toBeVisible();
});
