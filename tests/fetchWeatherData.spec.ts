import { test, expect, APIRequestContext } from '@playwright/test';
import { FetchWeatherData } from './pages/fetchWeatherData';

const webhookUrl = 'https://discord.com/api/webhooks/your_webhook_id/your_webhook_token';
const apiKey = 'your_openweathermap_api_key';

const cities = ["London, GB", "New York City, US", "Paris, FR", "Japan, JP"];

test.describe.parallel('Advanced Weather Validation for Multiple Cities with Discord Notification', () => {
  let fetchWeatherData: FetchWeatherData;
  let apiRequest: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    // Set up API request context
    apiRequest = await playwright.request.newContext({
      baseURL: 'https://api.openweathermap.org/data/2.5',
    });
  });

  test.beforeEach(async ({ page }) => {
    fetchWeatherData = new FetchWeatherData(page);
    await fetchWeatherData.goto();
  });

  cities.forEach((cityName) => {
    test(`Validate weather data for ${cityName} and send Discord notification`, async ({ page }) => {
      const fetchWeatherData = new FetchWeatherData(page);

      // Fetch weather data from API
      const apiResponse = await apiRequest.get(`/weather`,, {
        params: {
          q: cityName,
          appid: apiKey,
          units: 'metric',
        },
      });

    // Log response for debugging
    console.log(`API Response Status: ${apiResponse.status()}`);
    const apiBody = await apiResponse.text();
    console.log(`API Response Body: ${apiBody}`);

    expect(apiResponse.ok(), `API request failed with status ${apiResponse.status()}`).toBeTruthy();
    const apiData = JSON.parse(apiBody);

    // Extract data from API response
    const apiTemperature = apiData.main.temp;
    const apiConditions = apiData.weather[0].description;

    // Perform the search operation
    await fetchWeatherData.enterCityName(cityName);
    await fetchWeatherData.clickSearchButton();
    await page.locator('ul.search-dropdown-menu > li').nth(0).click();

    // Wait for the weather details to load
    const temperatureSelector = 'span.heading';
    const conditionsSelector = 'div.current-container.mobile-padding > div > div.bold';

    const uiTemperature = parseFloat(await page.locator(temperatureSelector).innerText());
    const uiConditions = await page.locator(conditionsSelector).innerText();

     // Log data for debugging
     console.log(`API Temperature: ${apiTemperature}, UI Temperature: ${uiTemperature}`);
     console.log(`API Conditions: ${apiConditions}, UI Conditions: ${uiConditions}`);
 
     // Validate temperature (allow ±2°C difference for rounding)
     expect(
       Math.abs(uiTemperature - apiTemperature),
       `Temperature mismatch: API=${apiTemperature}, UI=${uiTemperature}`
     ).toBeLessThanOrEqual(2);
 
     // Validate weather conditions
     expect(
       uiConditions.toLowerCase(),
       `Conditions mismatch: API=${apiConditions}, UI=${uiConditions}`
     ).toContain(apiConditions.toLowerCase());

      // Format and send Discord notification
    const message = formatWeatherMessage(cityName, apiData);
    await sendDiscordNotification(webhookUrl, message);
    });
});
 
   test.afterAll(async () => {
     await apiRequest.dispose();
   });
 });

 // Helper Functions
function formatWeatherMessage(cityName: string, weatherData: any): string {
    const temperature = weatherData.main.temp;
    const condition = weatherData.weather[0].description;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;
  
    return `🌤️ **Weather Update for ${cityName}:**
  - **Temperature**: ${temperature}°C
  - **Condition**: ${condition.charAt(0).toUpperCase() + condition.slice(1)}
  - **Humidity**: ${humidity}%
  - **Wind Speed**: ${windSpeed} m/s`;
  }
  
  async function sendDiscordNotification(webhookUrl: string, message: string) {
    const payload = {
      content: message,
    };
  
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  
    if (!response.ok) {
      console.error(`Failed to send Discord notification: ${response.statusText}`);
    } else {
      console.log('Discord notification sent successfully.');
    }
  }
  
