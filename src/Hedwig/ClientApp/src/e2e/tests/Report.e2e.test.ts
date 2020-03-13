import { until } from 'selenium-webdriver';
import { render, load } from '../QueryHelper';
import { DriverHelper } from '../DriverHelper';
import { clientHost } from '../config';
// import login from '../utilities/login';

// Set time out to 60 seconds
jest.setTimeout(60 * 1000);

const appUrl = `${clientHost}/`;

let driverHelper: DriverHelper;
beforeAll(() => {
	driverHelper = new DriverHelper();
});

// TODO: CREATE THESE UTILS, USE THEM BELOW
const loginNavigateToReports = () => {
	// log in
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

			// root = await login(driver, root);
			// log in
			// navigate to reports tab
			// make sure that it's showing an alert for missing an enrollment
		} finally {
			await driverHelper.quit(driver);
		}
	});

	it('navigates to the roster when a user clicks on the missing enrollment button', async () => {
		const driver = driverHelper.createDriver();
		try {
			let root = await load(driver, appUrl);

			// root = await login(driver, root);
			// log in
			// navigate to reports tab
			// make sure that it's showing an alert for missing an enrollment
			// click on the button to correct that
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
});
