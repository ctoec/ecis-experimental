import { createDriver, cleanup } from './helpers';
import { app, clickLogin, waitForLoginWelcome, waitForHeader } from './pages/App';

// Set time out to 30 seconds
jest.setTimeout(30 * 1000);

describe('Smoke screen', () => {
	it('Browser Title renders', async () => {
		const driver = createDriver();
		try {
			await app(driver);
			const title = await driver.getTitle()
			expect(title).toBe('ECE Reporter');
		} finally {
			await cleanup(driver);
		}
	});
	
	it('HTML Title renders', async () => {
		const driver = createDriver();
		try {
			await app(driver);
			const header = await waitForHeader(driver);
			expect(await header.getText()).toBe('ECE Reporter');
		} finally {
			await cleanup(driver);
		}
	});

	it('Logs in', async () => {
		const driver = createDriver();
		try {
			await app(driver);
			await clickLogin(driver);
			const name = await waitForLoginWelcome(driver);
			expect(await name.getText()).toBe('Hi, Chris.');
		} finally {
			await cleanup(driver);
		}
	});
});
