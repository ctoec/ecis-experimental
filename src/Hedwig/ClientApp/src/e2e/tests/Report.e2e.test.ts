import { render, load } from '../QueryHelper';
import { DriverHelper } from '../DriverHelper';
import { clientHost } from '../config';
import login from '../utilities/login';
import { clickReportsTab, clickOct2017Report, enterMissingInfoForAllChildren } from '../utilities/report';

// Set time out to 60 seconds
jest.setTimeout(60 * 1000);

const appUrl = `${clientHost}/`;

let driverHelper: DriverHelper;
beforeAll(() => {
	driverHelper = new DriverHelper();
});

describe('when trying to submit a report', () => {
	it('shows an alert for missing info', async () => {
		const driver = driverHelper.createDriver();
		try {
			let root = await load(driver, appUrl);
			root = await login(driver, root);
			root = await clickReportsTab(driver, root);
			root = await clickOct2017Report(driver, root);

			const { findByLocator } = render(root);

			// Make sure that it's showing an alert for missing info
			const missingInfoAlert = await findByLocator({ xpath: "//*[@role='alert']" });
			expect(await missingInfoAlert.getText()).toMatch(
				/There are 2 enrollments missing information required to submit this report/
			);
		} finally {
			await driverHelper.quit(driver);
		}
	});

	it('allows a report submission attempt after missing info is corrected', async () => {
		const driver = driverHelper.createDriver();
		try {
			let root = await load(driver, appUrl);
			root = await login(driver, root);
			root = await enterMissingInfoForAllChildren(driver, root);
			root = await clickReportsTab(driver, root);
			root = await clickOct2017Report(driver, root);
			const { debug } = render(root);
			await debug();

			// try to submit the report without entering info, run into errors
		} finally {
			await driverHelper.quit(driver);
		}
	});

	it('shows an error if submission is attempted without family fees revenue', async () => {
		const driver = driverHelper.createDriver();
		try {
			let root = await load(driver, appUrl);

			// root = await login(driver, root);
			// log in
			// find the kid with the missing info
			// enter the info that's missing
			// go to the report tab
			// submit the report
		} finally {
			await driverHelper.quit(driver);
		}
	});

	it('shows a success alert after report is submitted', async () => {
		const driver = driverHelper.createDriver();
		try {
			let root = await load(driver, appUrl);

			// root = await login(driver, root);
			// log in
			// find the kid with the missing info
			// enter the info that's missing
			// go to the report tab
			// submit the report
		} finally {
			await driverHelper.quit(driver);
		}
	});
});

afterAll(async () => {
	await driverHelper.cleanup();
});
