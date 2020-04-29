import { until } from 'selenium-webdriver';
import { render, load } from '../QueryHelper';
import { DriverHelper } from '../DriverHelper';
import { clientHost } from '../config';
import login from '../utilities/login';
import { findByRole } from '@testing-library/react';
// import login from '../utilities/login';

// Set time out to 60 seconds
jest.setTimeout(60 * 1000);

const appUrl = `${clientHost}/`;

let driverHelper: DriverHelper;
beforeAll(() => {
	driverHelper = new DriverHelper();
});

// TODO: CREATE THESE UTILS, USE THEM BELOW
const loginNavigateToReports = async (driver, root) => {
	root = await login(driver, root);
	// navigate to reports tab
};

const enterMissingInfo = () => {
	// find the kid with the missing info
	// enter the info that's missing
	// go to the report tab
};

describe('when trying to submit a report', () => {
	it('shows an alert for missing enrollments', async () => {
		const driver = driverHelper.createDriver();
		try {
			let root = await load(driver, appUrl);
			root = await login(driver, root);
			const { findByLocator, findByText } = render(root);

			// Navigate to reports tab
			const reportsLink = await findByLocator({ xpath: "//nav//*[text()[contains(.,'Reports')]]" });
			await reportsLink.click();

			// Click on the pending report for March 2020
			const pendingReportLink = await findByLocator({
				xpath: "//table//*[text()[contains(.,'October 2017')]]",
			});
			await pendingReportLink.click();

			// Make sure that it's showing an alert for missing an enrollment
			const missingInfoAlert = await findByLocator({ xpath: "//*[@role='alert']" });
			expect(await missingInfoAlert.getText()).toMatch(
				/There are 2 enrollments missing information required to submit this report/
			);
		} finally {
			await driverHelper.quit(driver);
		}
	});

	it('allows a report submission attempt after enrollment missing info is corrected', async () => {
		const driver = driverHelper.createDriver();
		try {
			let root = await load(driver, appUrl);

			// root = await login(driver, root);
			// log in
			// find the kid with the missing info
			// enter the info that's missing
			// go to the report tab
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
