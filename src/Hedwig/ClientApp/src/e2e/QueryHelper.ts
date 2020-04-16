import { Locator, until, By, WebElement } from 'selenium-webdriver';
import { IWebDriver } from './DriverHelper';

const rootSelector = { css: 'html' };

/**
 * Load an initial page and wait for the html element to be rendered
 * @param driver Initialized Selenium driver
 * @param url URL to load
 * @param opt_timeout Timeout to wait for html element to render
 * @param opt_message Message to display if timeout is reached
 */
export const load = async (
	driver: IWebDriver,
	url: string,
	opt_timeout?: number,
	opt_message?: string
) => {
	await driver.get(url);
	// This is needed for BrowserStack that does not maximize the browser
	await driver
		.manage()
		.window()
		.maximize();
	return await waitForElement(driver, rootSelector, opt_timeout, opt_message);
};

/**
 * Call after a page navigation to ensure that the html element is rendered on the new page.
 * @param driver Initialized Selenium driver
 * @param opt_timeout Timeout to wait for html element to render
 * @param opt_message Message to display if timeout is reached
 */
export const reload = async (driver: IWebDriver, opt_timeout?: number, opt_message?: string) => {
	return await waitForElement(driver, rootSelector, opt_timeout, opt_message);
};

/**
 * Obtain query methods on the supplied element.
 * Follows the dom-testing-library naming convention
 * @param element A WebDriver element
 */
export const render = (element: WebElement): RenderedWebElement => {
	const extendedWebElement = extendWebElement(element);
	return {
		element: element,
		getByLocator: (locator: Locator) => {
			return extendedWebElement.getByLocator(locator);
		},
		queryByLocator: (locator: Locator) => {
			return extendedWebElement.queryByLocator(locator);
		},
		queryAllByLocator: (locator: Locator) => {
			return extendedWebElement.queryAllByLocator(locator);
		},
		findByLocator: (locator: Locator, opt_timeout?: number, opt_message?: string) => {
			return extendedWebElement.findByLocator(locator, opt_timeout, opt_message);
		},
		getByText: (text: string) => {
			return extendedWebElement.getByText(text);
		},
		queryByText: (text: string) => {
			return extendedWebElement.queryByText(text);
		},
		queryAllByText: (text: string) => {
			return extendedWebElement.queryAllByText(text);
		},
		findByText: (text: string, opt_timeout?: number, opt_message?: string) => {
			return extendedWebElement.findByText(text, opt_timeout, opt_message);
		},
		getByPlaceholder: (text: string) => {
			return extendedWebElement.getByPlaceholder(text);
		},
		queryByPlaceholder: (text: string) => {
			return extendedWebElement.queryByPlaceholder(text);
		},
		findByPlaceholder: (text: string, opt_timeout?: number, opt_message?: string) => {
			return extendedWebElement.findByPlaceholder(text, opt_timeout, opt_message);
		},
		getByValue: (text: string) => {
			return extendedWebElement.getByValue(text);
		},
		queryByValue: (text: string) => {
			return extendedWebElement.queryByValue(text);
		},
		findByValue: (text: string) => {
			return extendedWebElement.findByValue(text);
		},
	};
};

interface WebElementExtension {
	getByLocator(locator: Locator): Promise<ExtendedWebElement>;
	queryByLocator(locator: Locator): Promise<ExtendedWebElement | null>;
	queryAllByLocator(locator: Locator): Promise<ExtendedWebElement[]>;
	findByLocator(
		locator: Locator,
		opt_timeout?: number,
		opt_message?: string
	): Promise<ExtendedWebElement>;
	getByText(text: string): Promise<ExtendedWebElement>;
	queryByText(text: string): Promise<ExtendedWebElement | null>;
	queryAllByText(test: string): Promise<ExtendedWebElement[]>;
	findByText(text: string, opt_timeout?: number, opt_message?: string): Promise<ExtendedWebElement>;
	getByPlaceholder(text: string): Promise<ExtendedWebElement>;
	queryByPlaceholder(text: string): Promise<ExtendedWebElement | null>;
	findByPlaceholder(
		text: string,
		opt_timeout?: number,
		opt_message?: string
	): Promise<ExtendedWebElement>;
	getByValue(text: string): Promise<ExtendedWebElement>;
	queryByValue(text: string): Promise<ExtendedWebElement | null>;
	findByValue(
		text: string,
		opt_timeout?: number,
		opt_message?: string
	): Promise<ExtendedWebElement>;
}

type RenderedWebElement = {
	element: WebElement;
} & WebElementExtension;

class ExtendedWebElement extends WebElement implements WebElementExtension {
	constructor(element: WebElement) {
		super(element.getDriver(), element.getId());
	}
	async debug() {
		// This mimics the behavior of the react testing library function of the same name
		console.log(await this.getAttribute('outerHTML'));
	}
	async getByLocator(locator: Locator) {
		const elements = await this.findElements(locator);
		if (elements.length === 0) {
			throw new Error(`Cannot find element with supplied locator`);
		} else if (elements.length === 1) {
			return extendWebElement(elements[0]);
		} else {
			throw new Error(`More than 1 element was found with supplied locator`);
		}
	}
	async queryByLocator(locator: Locator) {
		const elements = await this.findElements(locator);
		if (elements.length === 0) {
			return null;
		} else if (elements.length === 1) {
			return extendWebElement(elements[0]);
		} else {
			throw new Error(`More than 1 element was found with supplied locator`);
		}
	}
	async queryAllByLocator(locator: Locator) {
		const elements = await this.findElements(locator);
		const extendedElements = elements.map(element => extendWebElement(element));
		return extendedElements;
	}
	async findByLocator(locator: Locator, opt_timeout?: number, opt_message?: string) {
		const driver = this.getDriver();
		await driver.wait(until.elementsLocated(locator), opt_timeout, opt_message);
		const elements = await this.findElements(locator);
		if (elements.length === 1) {
			return extendWebElement(elements[0]);
		} else {
			throw new Error(`More than 1 element was found with supplied locator`);
		}
	}
	async getByText(text: string) {
		return await this.getByLocator(selectorByText(text));
	}
	async queryByText(text: string) {
		return await this.queryByLocator(selectorByText(text));
	}
	async queryAllByText(text: string) {
		return await this.queryAllByLocator(selectorByText(text));
	}
	async findByText(text: string, opt_timeout?: number, opt_message?: string) {
		return await this.findByLocator(selectorByText(text), opt_timeout, opt_message);
	}
	async getByPlaceholder(text: string) {
		return await this.getByLocator(selectorByPlaceholder(text));
	}
	async queryByPlaceholder(text: string) {
		return await this.queryByLocator(selectorByPlaceholder(text));
	}
	async findByPlaceholder(text: string, opt_timeout?: number, opt_message?: string) {
		return await this.findByLocator(selectorByPlaceholder(text), opt_timeout, opt_message);
	}

	// TODO: GET RID OF THESE ONES -- make get by label method instead
	async getByValue(text: string) {
		return await this.getByLocator(selectorByValue(text));
	}
	async queryByValue(text: string) {
		return await this.queryByLocator(selectorByValue(text));
	}
	async findByValue(text: string, opt_timeout?: number, opt_message?: string) {
		return await this.findByLocator(selectorByValue(text), opt_timeout, opt_message);
	}
}

const waitForElement = async (
	driver: IWebDriver,
	selector: Locator,
	opt_timeout?: number,
	opt_message?: string
) => {
	await driver.wait(until.elementLocated(selector), opt_timeout, opt_message);
	return driver.findElement(selector);
};

const extendWebElement = (element: WebElement): ExtendedWebElement => {
	return new ExtendedWebElement(element);
};

// Selectors
const selectorByText = (text: string) => {
	return By.xpath(`//*[text()=\"${text}\"]`);
};

const selectorByPlaceholder = (text: string) => {
	return By.xpath(`//*[@placeholder=\"${text}\"]`);
};

const selectorByValue = (text: string) => {
	return By.xpath(`//*[@value=\"${text}\"]`);
};
