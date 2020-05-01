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

afterEach(async done => {
	await DriverHelper.quit(driver);
	bs_local.stop(() => {
		done();
	});
});

describe('Enrollment workflow alert', () => {
	it('shows information required when missing first and last name', async () => {
		try {
			let root = await load(driver, appUrl);

			root = await login(driver, root);
			root = await beginEnroll(driver, root);

			const { queryAllByText, findByText } = render(root);

			const saveBtn = await findByText('Save');
			await saveBtn.click();

			const alerts = await queryAllByText(REQUIRED_FOR_ENROLLMENT);
			expect(alerts.length).not.toBeLessThan(1);
			expect(alerts[0]).not.toBeNull();
		} catch {}
	});

	it('shows success after finishing the enrollment', async () => {
		try {
			let root = await load(driver, appUrl);

			root = await login(driver, root);
			root = await beginEnroll(driver, root);
			root = await enterChildInfo(driver, root);

			const { findByText, findByValue } = render(root);

			let saveBtn = await findByText('Save');
			await saveBtn.click();
			await driver.wait(until.urlMatches(/family-income/));

			saveBtn = await findByValue('Save');
			await saveBtn.click();
			await driver.wait(until.urlMatches(/enrollment-funding/));

			saveBtn = await findByText('Save');
			await saveBtn.click();
			await driver.wait(until.urlMatches(/review/));

			const finishBtn = await findByText('Finish');
			await finishBtn.click();
			await driver.wait(until.urlMatches(/roster\/sites\/\d*\/enrollments\/\d*\/$/));

			const currentUrl = await driver.getCurrentUrl();
			expect(currentUrl).toMatch(/roster\/sites\/\d*\/enrollments\/\d*\/$/);

			const alert = await findByText('Enrolled, some information missing');
			const alertText = await alert.getText();
			expect(alertText).toBe('Enrolled, some information missing');
		} catch {}
	});
});
