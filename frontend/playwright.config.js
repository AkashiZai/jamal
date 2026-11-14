const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/ui',
  testMatch: '**/*.test.js',
  timeout: 30000,
  use: {
    headless: true,
  },
});
