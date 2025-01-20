import { test, expect } from '@playwright/test';
import { MeasureSearchTime } from './pages/measureSearchTime';

test.describe('Measure Search Response Time', () => {
  let measureSearchTime: MeasureSearchTime;

  test.beforeEach(async ({ page }) => {
    measureSearchTime = new MeasureSearchTime(page);
    await measureSearchTime.goto();

    // Preload any necessary data or API responses
    await page.waitForLoadState('networkidle');
  });

  test('Measure response time for search operation', async ({ page }) => {
    const cityName = 'London';

    // Record the start time
    const startTime = performance.now();

    // Perform the search operation
    await measureSearchTime.enterCityName(cityName);
    await measureSearchTime.clickSearchButton();
    await page.locator('ul.search-dropdown-menu > li').nth(0).click();

    // Wait for search results to load
    const resultSelector = 'div.grid-container.grid-4-5';
    await measureSearchTime.page.locator(resultSelector).waitFor();

    // Record the end time
    const endTime = performance.now();

    // Calculate the response time
    const responseTime = endTime - startTime;
    console.log(`Response Time: ${responseTime}ms`);

    // Assert that the response time is within acceptable limits
    expect(responseTime).toBeLessThan(3000);
  });
});