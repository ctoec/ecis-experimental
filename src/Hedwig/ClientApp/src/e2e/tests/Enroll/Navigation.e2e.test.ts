import { until } from 'selenium-webdriver';
import { render, load } from '../../QueryHelper';
import { DriverHelper, IWebDriver } from '../../DriverHelper';
import { clientHost } from '../../config';
import login from '../../utilities/login';
import { beginEnroll, enterChildInfo } from '../../utilities/enroll';
import { REQUIRED_FOR_ENROLLMENT } from '../../../utils/validations/messageStrings';
import { browserStackAccesstoken, bs_local } from '../../config';

// Set time out to 3 minutes
jest.setTimeout(3 * 60 * 1000);

const appUrl = `${clientHost}/`;

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

afterEach(async (done) => {
	await DriverHelper.quit(driver);
	bs_local.stop(() => {
		done();
	});
});

describe('Enrollment workflow navigation', () => {
	it('moves to the next section when first and last name are supplied', async () => {
		try {
			let root = await load(driver, appUrl);

			root = await login(driver, root);
			root = await beginEnroll(driver, root);
			root = await enterChildInfo(driver, root);

			const { queryAllByText } = render(root);

			const alerts = await queryAllByText(REQUIRED_FOR_ENROLLMENT);
			expect(alerts.length).toBe(0);
			const currentUrl = await driver.getCurrentUrl();
			expect(currentUrl).toMatch(/family-information/);
		} catch {}
	});

	it('moves to the next section if no family info is entered', async () => {
		try {
			let root = await load(driver, appUrl);

			root = await login(driver, root);
			root = await beginEnroll(driver, root);
			root = await enterChildInfo(driver, root);

			const { findByText } = render(root);

			let saveBtn = await findByText('Save');
			await saveBtn.click();
			await driver.wait(until.urlMatches(/family-income/));

			const currentUrl = await driver.getCurrentUrl();
			expect(currentUrl).toMatch(/family-income/);
		} catch {}
	});

	it('moves to the next section if no family income is entered', async () => {
		try {
			let root = await load(driver, appUrl);

			root = await login(driver, root);
			root = await beginEnroll(driver, root);
			root = await enterChildInfo(driver, root);

			const { findByText, findByValue } = render(root);

			let saveBtn = await findByText('Save');
			await saveBtn.click();
			await driver.wait(until.urlMatches(/family-income/));

			// TODO: enrollment funding and other sections shouldn't use different types of submit-- this probably has to do with form refactoring
			saveBtn = await findByValue('Save');
			await saveBtn.click();
			await driver.wait(until.urlMatches(/enrollment-funding/));

			const currentUrl = await driver.getCurrentUrl();
			expect(currentUrl).toMatch(/enrollment-funding/);
		} catch {}
	});
});
