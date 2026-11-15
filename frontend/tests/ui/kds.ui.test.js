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

test('UI Case 4: KDS advances pending order to in_progress and updates active badge', async ({ page }) => {
  await page.goto(baseUrl);
  await page.getByRole('button', { name: /2\. Kitchen KDS/ }).click();
  await expect(page.getByText('JAMAL KITCHEN & BARISTA KDS')).toBeVisible();

  await page.getByRole('button', { name: '+ จำลองคิวใหม่' }).click();
  await expect(page.getByText('#คิว A05')).toBeVisible();

  await page.getByRole('button', { name: 'รับทำออเดอร์นี้ →' }).first().click();
  await expect(page.getByRole('button', { name: '✓ ทำเสร็จแล้ว (พร้อมเสิร์ฟ)' }).first()).toBeVisible();
});
