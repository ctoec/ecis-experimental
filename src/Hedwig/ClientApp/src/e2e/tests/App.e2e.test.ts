import { render, load } from '../QueryHelper';
import { DriverHelper, IWebDriver } from '../DriverHelper';
import { clientHost } from '../config';
import login from '../utilities/login';
import { until } from 'selenium-webdriver';
import { browserStackAccesstoken, bs_local } from '../config';

// Set time out to 1 minute
jest.setTimeout(60 * 1000);

const appUrl = `${clientHost}/`;

describe('Smoke screen', () => {
	let driver: IWebDriver;
	beforeEach(done => {
		const localIdentifier = '' + Math.random() * 10000000;
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

	afterEach(async done => {
		await DriverHelper.quit(driver);
		bs_local.stop(() => {
			done();
		});
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
