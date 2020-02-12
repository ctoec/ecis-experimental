import { DriverHelper } from './helpers';
import { app, clickLogin, waitForLoginWelcome, waitForHeader } from './pages/App';

// Set time out to 30 seconds
jest.setTimeout(30 * 1000);

let driverHelper: DriverHelper;
beforeAll(() => {
	driverHelper = new DriverHelper();
});

describe('Smoke screen', () => {
	it('Browser Title renders', async () => {
		const driver = driverHelper.createDriver();
		try {
			await app(driver);
			const title = await driver.getTitle()
			expect(title).toBe('ECE Reporter');
		} finally {
			await driverHelper.quit(driver);
		}
	});
	
	it('HTML Title renders', async () => {
		const driver = driverHelper.createDriver();
		try {
			await app(driver);
			const header = await waitForHeader(driver);
			expect(await header.getText()).toBe('ECE Reporter');
		} finally {
			await driverHelper.quit(driver);
		}
	});

	it('Logs in', async () => {
		const driver = driverHelper.createDriver();
		try {
			await app(driver);
			await clickLogin(driver);
			const name = await waitForLoginWelcome(driver);
			expect(await name.getText()).toBe('Hi, Chris.');
		} finally {
			await driverHelper.quit(driver);
		}
	});
});

afterAll(() => {
	driverHelper.cleanup();
});
