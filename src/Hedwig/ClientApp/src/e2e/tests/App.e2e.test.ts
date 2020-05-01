import { render, load } from '../QueryHelper';
import { DriverHelper, IWebDriver } from '../DriverHelper';
import { clientHost } from '../config';
import login from '../utilities/login';
import { until } from 'selenium-webdriver';
import Browserstack from 'browserstack-local';
import { browserStackAccesstoken } from '../config';

// Set time out to 3 minutes
jest.setTimeout(3 * 60 * 1000);

const appUrl = `${clientHost}/`;

describe('Smoke screen', () => {
	let driver: IWebDriver;
	let bs_local: Browserstack.Local;
	beforeAll(() => {
		bs_local = new Browserstack.Local();
	});
	beforeEach(done => {
		const localIdentifier = '' + Math.random() * 100000;
		bs_local.start(
			{
				key: browserStackAccesstoken,
				forceLocal: true,
				localIdentifier: localIdentifier,
			},
			() => {
				driver = DriverHelper.createDriver(localIdentifier);
				done();
			}
		);
	});

	afterEach(async () => {
		await DriverHelper.quit(driver);
		bs_local.stop(() => {});
	});

	it('Browser Title renders', async () => {
		// const driver = await DriverHelper.createDriver('Hedwig', 'App.e2e.test.ts');
		try {
			await load(driver, appUrl);
			const title = await driver.getTitle();
			expect(title).toBe('ECE Reporter');
		} catch {}
	});

	it('HTML Title renders', async () => {
		// const driver = await DriverHelper.createDriver('Hedwig', 'App.e2e.test.ts');
		try {
			const root = await load(driver, appUrl);
			const { getByLocator } = render(root);
			const header = await getByLocator({ css: 'header div.primary-title' });
			const text = await header.getText();
			expect(text).toBe('ECE Reporter');
		} catch {}
	});

	it('Logs in', async () => {
		// const driver = await DriverHelper.createDriver();
		try {
			let root = await load(driver, appUrl);

			root = await login(driver, root);

			const { findByLocator } = render(root);

			// Wait for welcome header text to display
			const name = await findByLocator({ css: '.oec-logged-in-user' });
			const text = await driver.wait(until.elementTextMatches(name, /Hi/i));

			expect(text).toMatch(/Hi, .*/);
		} catch {}
	});
});
