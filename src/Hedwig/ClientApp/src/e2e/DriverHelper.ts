import { ThenableWebDriver, WebDriver, Builder } from 'selenium-webdriver';

import {
	gridHost,
	browserStackAccesstoken,
	browserStackUsername,
	browserStackLocal,
} from './config';

export type IWebDriver = ThenableWebDriver | WebDriver;

export class DriverHelper {
	static createDriver = (localIdentifier?: string, build?: string, project?: string) => {
		// Ensure grid url is set
		if (!gridHost) {
			throw new Error('Grid Host URL not set');
		}
		// If browser not specified, default to any registered chrome
		const builder = new Builder().forBrowser('chrome');
		// Get capabilities for default or user specified browser
		const capabilities = builder.getCapabilities();
		// Override to force accept insecure certs
		// Needed because we use a developer-signed cert in Hedwig
		capabilities.setAcceptInsecureCerts(true);
		capabilities.set('acceptSslCerts', true);
		// Set up browser stack
		capabilities.set('browserstack.user', browserStackUsername);
		capabilities.set('browserstack.key', browserStackAccesstoken);
		capabilities.set('browserstack.local', browserStackLocal);
		capabilities.set('browserstack.debug', false);
		capabilities.set('browserstack.video', false);
		capabilities.set('resolution', '1920x1080');
		if (localIdentifier) {
			capabilities.set('browserstack.localIdentifier', localIdentifier);
		}
		if (build) {
			capabilities.set('build', build);
		}
		if (project) {
			capabilities.set('project', project);
		}
		return new Builder().withCapabilities(capabilities).usingServer(gridHost).build() as IWebDriver;
	};

	static quit = async (driver: IWebDriver) => {
		await driver.quit();
	};
}
