import { Page, Locator } from '@playwright/test';

export class OpenWeatherMapPage {
  public page: Page;
  public searchBar: Locator;

  // Set locators
  constructor(page: Page) {
    this.page = page;
    this.searchBar = page.locator('.search-container');
  }
  
  // Go to login page
  async goto(): Promise<void> {
    await this.page.goto('https://openweathermap.org/');
  }
}
