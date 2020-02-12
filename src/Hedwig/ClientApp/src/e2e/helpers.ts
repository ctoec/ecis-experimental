import { Builder, ThenableWebDriver, WebDriver, Locator, until, By } from 'selenium-webdriver';

export type IWebDriver = ThenableWebDriver | WebDriver;
export const clientHost = 'https://backend-for-selenium:5001';
export const gridHost = 'http://selenium-hub:4444/wd/hub';
export const defaultTimeout = 10000;

export class DriverHelper {
	__drivers: IWebDriver[] = [];

	createDriver = () => {
		// If browser not specified, default to any registered chrome
		const builder = new Builder().forBrowser('chrome');
		// Get capabilities for default or user specified browser
		const capabilities = builder.getCapabilities();
		// Override to force accept insecure certs
		// Needed because we use a developer-signed cert in Hedwig
		capabilities.setAcceptInsecureCerts(true);
		const driver = new Builder()
			.withCapabilities(capabilities)
			.usingServer(gridHost)
			.build();
		this.__drivers.push(driver);
		return driver;
	}

	quit = async (driver: ThenableWebDriver | WebDriver) => {
		try {
			await driver.quit();
		} catch {
			// Already closed
		}
	}

	cleanup = async () => {
		this.__drivers.forEach(async driver => {
			try {
				await driver.quit();
			} catch {
				// Already closed
			}
		});
	}
}
export const loadAndWaitFor = async (driver: IWebDriver, selector: Locator) => {
	await driver.get(clientHost);
	return await waitFor(driver, selector);
}

export const waitFor = async (driver: IWebDriver, selector: Locator) => {
	await driver.wait(until.elementLocated(selector));
	return driver.findElement(selector);
}

export const selectorByText = (text: string) => {
	return By.xpath(`//*[text()=\"${text}\"]`);
}

export const selectorByPlaceholder = (text: string) => {
	return By.xpath(`//*[@placeholder=\"${text}\"]`);
}

export const selectorByValue = (text: string) => {
	return By.xpath(`//*[@value=\"${text}\"]`);
}