import { test, expect } from '@playwright/test';
import { OpenWeatherMapPage } from './pages/openWeatherMap';

test.describe('Test OpenWeatherMap functionality', () => {
  let openWeatherMapPage: OpenWeatherMapPage;

  test.beforeEach(async ({ page }) => {
    openWeatherMapPage = new OpenWeatherMapPage(page);
    await openWeatherMapPage.goto();
  });

  test('Enter OpenWeatherMap site', async ({ page }) => {

    // Verify the search bar is visible
    await openWeatherMapPage.searchBar.isVisible();

    // Verify the search bar is functional and search for city
    await page.getByPlaceholder('Search city').fill('London');
    await page.locator('button:has-text("Search")').click();
    await page.locator('ul.search-dropdown-menu > li').nth(1).click();

    // Validate the structure of the weather data
    await expect(page.locator('div.current-temp > span.heading')).toContainText(['' + '°C']);
    await expect(page.locator('div.current-container > div > div.bold')).toContainText(['']);
    await page.locator('ul.weather-items > li > div.wind-line').isVisible;
    await expect(page.locator('ul.weather-items > li > span.symbol')).toContainText(['Humidity']);
  });
});