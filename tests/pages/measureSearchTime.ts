import { Page, Locator } from '@playwright/test';

export class MeasureSearchTime {
  public page: Page;
  public searchBar: Locator;
  public searchButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Define locators for search input and button
    this.searchBar = page.locator('input[placeholder="Search city"]');
    this.searchButton = page.locator('button', { hasText: 'Search' });
  }

  // Navigate to the OpenWeatherMap website
  async goto(): Promise<void> {
    await this.page.goto('https://openweathermap.org/');
  }

  // Enter the city name in the search bar
  async enterCityName(city: string): Promise<void> {
    await this.searchBar.fill(city);
  }

  // Click the search button
  async clickSearchButton(): Promise<void> {
    await this.searchButton.click();
  }
}