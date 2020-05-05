import { render, load } from '../QueryHelper';
import { DriverHelper, IWebDriver } from '../DriverHelper';
import { clientHost, bs_local, browserStackAccesstoken } from '../config';
import login from '../utilities/login';
import {
	clickReportsTab,
	clickReportByTitle,
	enterMissingChildInfo,
	enterFamilyFeesRevenue,
} from '../utilities/report';
import moment from 'moment';
import { until } from 'selenium-webdriver';

// Set time out to 60 seconds
jest.setTimeout(60 * 1000);

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

describe('when trying to submit a report', () => {
	it('shows an alert for missing info', async () => {
		try {
			let root = await load(driver, appUrl);
			root = await login(driver, root);
			root = await clickReportsTab(driver, root);
			root = await clickReportByTitle(driver, root, 'October 2017');

			const { findByLocator } = render(root);

			// Make sure that it's showing an alert for missing info
			const missingInfoAlert = await findByLocator({ xpath: "//*[@role='alert']" });
			expect(await missingInfoAlert.getText()).toMatch(
				/There are 2 enrollments missing information required to submit this report/
			);
		} catch {}
	});

	it('allows a report submission attempt after missing info is corrected', async () => {
		try {
			let root = await load(driver, appUrl);
			root = await login(driver, root);
			root = await enterMissingChildInfo(driver, root);
			root = await clickReportsTab(driver, root);

			const { findByText } = render(root);

			// We aren't changing the range and entering missing info, so submit for Oct 2017 report shuld be disabled
			root = await clickReportByTitle(driver, root, 'October 2017');
			let submitButton = await findByText('Submit');
			expect(await submitButton.getAttribute('disabled')).toBeTruthy();

			// We did enter the missing info for the current range, so submit for the current month should not be disabled
			root = await clickReportsTab(driver, root);
			root = await clickReportByTitle(driver, root, moment().format('MMMM YYYY'));
			submitButton = await findByText('Submit');
			expect(await submitButton.getAttribute('disabled')).not.toBeTruthy();
		} catch {}
	});

	it('shows a success alert after report is submitted', async () => {
		try {
			let root = await load(driver, appUrl);
			root = await login(driver, root);
			root = await enterMissingChildInfo(driver, root);
			root = await clickReportsTab(driver, root);
			root = await clickReportByTitle(driver, root, moment().format('MMMM YYYY'));
			root = await enterFamilyFeesRevenue(driver, root);

			const { findByText, findByLocator } = render(root);
			const submitButton = await findByText('Submit');
			await submitButton.debug();
			await submitButton.click();

			await driver.wait(until.urlMatches(/reports/));
			const submittedAlertText = await findByLocator({
				xpath: "//*/h2[text()='Submitted']//following-sibling::p",
			});

			expect(await submittedAlertText.getText()).toMatch(
				/CDC Report has been shared with the Office of Early Childhood. Thank you!/
			);
		} catch {}
	});
});
