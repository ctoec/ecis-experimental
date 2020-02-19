import { ThenableWebDriver, WebDriver, Builder } from "selenium-webdriver";

import { gridHost } from "./config";

export type IWebDriver = ThenableWebDriver | WebDriver;

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