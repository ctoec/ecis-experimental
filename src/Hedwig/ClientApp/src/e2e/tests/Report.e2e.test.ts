import { until, WebElement } from 'selenium-webdriver';
import { render, load, reload } from '../QueryHelper';
import { DriverHelper, IWebDriver } from '../DriverHelper';
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

const clickReportsTab = async (driver: IWebDriver, root: WebElement) => {
	const { findByLocator } = render(root);
	const reportsLink = await findByLocator({ xpath: "//nav//*[text()[contains(.,'Reports')]]" });
	await reportsLink.click();
	return await reload(driver);
};

const clickOct2017Report = async (driver: IWebDriver, root: WebElement) => {
	const { findByLocator } = render(root);

	// Click on the pending report for March 2020
	const pendingReportLink = await findByLocator({
		xpath: "//table//*[text()[contains(.,'October 2017')]]",
	});
	await pendingReportLink.click();
	return await reload(driver);
};

const enterMissingChildInfo = async (driver: IWebDriver, root: WebElement) => {
	// find the kid with the missing info
	// enter the info that's missing
	// go to the report tab
	const { findByLocator, queryAllByLocator, findByText } = render(root);
	// Find the child name with the incomplete marker next to it
	const kidsMissingInfo = await queryAllByLocator({
		xpath: "//table//span[text()[contains(.,'incomplete')]]//ancestor::tr//a",
	});
	if (kidsMissingInfo.length === 0) {
		// This method modifies what's in the db
		// If there are no incomplete enrollments return
		return root;
	}
	expect(kidsMissingInfo.length).toBe(1);
	// Can't just grab the first value from the array because it gives a stale element reference error
	const kennethBranagh = await findByLocator({
		xpath: "//table//span[text()[contains(.,'incomplete')]]//ancestor::tr//a",
	});;
	await kennethBranagh.click();
	const updateMissingInfoSectionLink = await findByLocator({
		xpath: "//*[text()[contains(.,'Missing information')]]//following-sibling::a",
	});
	await updateMissingInfoSectionLink.click();

	// Enter birth cert id, town, state
	const birthCertInput = await findByLocator({
		xpath: "//*/label[text()='Birth certificate ID #']//following-sibling::input",
	});
	await birthCertInput.sendKeys('8675309');

	const birthTownInput = await findByLocator({
		xpath: "//*/label[text()='Town']//following-sibling::input",
	});
	await birthTownInput.sendKeys('Philadelphia');

	const birthStateInput = await findByLocator({
		xpath: "//*/label[text()='State']//following-sibling::input",
	});
	await birthStateInput.sendKeys('PA');

	// Click save
	const saveBtn = await findByText('Save');
	await saveBtn.click();

	return await reload(driver);
};

describe('when trying to submit a report', () => {
	it('shows an alert for missing enrollments', async () => {
		const driver = driverHelper.createDriver();
		try {
			let root = await load(driver, appUrl);
			root = await login(driver, root);
			root = await clickReportsTab(driver, root);
			root = await clickOct2017Report(driver, root);

			const { findByLocator } = render(root);

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
			root = await login(driver, root);
			root = await enterMissingChildInfo(driver, root);
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
