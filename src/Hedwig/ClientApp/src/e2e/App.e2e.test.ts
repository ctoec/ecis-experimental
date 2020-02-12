import { until } from 'selenium-webdriver';
import { render, load, reload } from './QueryHelper';
import { DriverHelper } from './DriverHelper';
import { clientHost } from './config';

// Set time out to 30 seconds
jest.setTimeout(30 * 1000);

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
			const title = await driver.getTitle()
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
			const header = await getByLocator({css: 'header em'});
			expect(await header.getText()).toBe('ECE Reporter');
		} finally {
			await driverHelper.quit(driver);
		}
	});

	it('Logs in', async () => {
		const driver = driverHelper.createDriver();
		try {
			let root = await load(driver, appUrl);
			let { findByLocator, findByPlaceholder, findByText, findByValue } = render(root);

			// Find login button and click it
			const loginBtn = await findByText('Log in');
			await loginBtn.click();

			// Wait for page navigation
			await driver.wait(until.titleIs('IdentityServer4'));
			root = await reload(driver);
			({ findByPlaceholder, findByValue } = render(root));

			// Find username and password fields
			const usernameInput = await findByPlaceholder('Username');
			usernameInput.sendKeys('voldemort');
			const passwordInput = await findByPlaceholder('Password');
			passwordInput.sendKeys('thechosenone');

			// Find the login button and click it
			const submitBtn = await findByValue('login');
			await submitBtn.click();

			// Wait for page navigation
			await driver.wait(until.titleIs('ECE Reporter'));
			root = await reload(driver);
			({ findByLocator } = render(root));

			// Wait for welcome header text to display
			const name = await findByLocator({ css: '.oec-logged-in-user' });
			await driver.wait(until.elementTextMatches(name, /Hi/i));

			expect(await name.getText()).toBe('Hi, Chris.');
		} finally {
			await driverHelper.quit(driver);
		}
	});
});

afterAll(() => {
	driverHelper.cleanup();
});
