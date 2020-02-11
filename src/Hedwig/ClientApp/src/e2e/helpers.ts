import { Builder, ThenableWebDriver, WebDriver, Locator, until, By } from 'selenium-webdriver';

export type IWebDriver = ThenableWebDriver | WebDriver;
export const clientHost = 'https://backend-for-selenium:5001';
export const gridHost = 'http://selenium-hub:4444/wd/hub';
export const defaultTimeout = 10000;

export const createDriver = () => {
	// If browser not specified, default to any registered firefox
	const builder = new Builder().forBrowser('firefox');
	// Get capabilities for default or user specified browser
	const capabilities = builder.getCapabilities();
	// Override to force accept insecure certs
	// Needed because we use a developer-signed cert in Hedwig
	capabilities.setAcceptInsecureCerts(true);
	return new Builder()
		.withCapabilities(capabilities)
		.usingServer(gridHost)
		.build();
}

export const cleanup = async (driver: ThenableWebDriver | WebDriver) => {
	await driver.quit();
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