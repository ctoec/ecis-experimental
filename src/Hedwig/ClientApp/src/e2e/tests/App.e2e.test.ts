import { render, load } from '../QueryHelper';
import { DriverHelper } from '../DriverHelper';
import { clientHost } from '../config';
import login from '../utilities/login';
import { until } from 'selenium-webdriver';

// Set time out to 60 seconds
jest.setTimeout(60 * 1000);

const appUrl = `${clientHost}/`;

let driverHelper: DriverHelper;
beforeAll(() => {
	driverHelper = new DriverHelper();
});

describe('Smoke screen', () => {
	it('Browser Title renders', async () => {
		const driver = driverHelper.createDriver();
		try {
			await load(driver, appUrl);
			const title = await driver.getTitle();
			expect(title).toBe('ECE Reporter');
		} finally {
			await driverHelper.quit(driver);
		}
	});

	it('HTML Title renders', async () => {
		const driver = driverHelper.createDriver();
		try {
			const root = await load(driver, appUrl);
			const { getByLocator } = render(root);
			const header = await getByLocator({ css: 'header div.primary-title' });
			expect(await header.getText()).toBe('ECE Reporter');
		} finally {
			await driverHelper.quit(driver);
		}
	});

	it('Logs in', async () => {
		const driver = driverHelper.createDriver();
		try {
			let root = await load(driver, appUrl);

			root = await login(driver, root);

			const { findByLocator } = render(root);

			// Wait for welcome header text to display
			const name = await findByLocator({ css: '.oec-logged-in-user' });
			await driver.wait(until.elementTextMatches(name, /Hi/i));

			expect(await name.getText()).toMatch(/Hi, .*/);
		} finally {
			await driverHelper.quit(driver);
		}
	});
});

afterAll(async () => {
	await driverHelper.cleanup();
});
