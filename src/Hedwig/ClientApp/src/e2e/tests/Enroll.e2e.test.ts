import { until } from 'selenium-webdriver';
import { render, load } from '../QueryHelper';
import { DriverHelper } from '../DriverHelper';
import { clientHost } from '../config';
import login from '../utilities/login';
import { beginEnroll, enterChildInfo } from '../utilities/enroll';

// Set time out to 60 seconds
jest.setTimeout(60 * 1000);

const appUrl = `${clientHost}/`;

let driverHelper: DriverHelper;
beforeAll(() => {
	driverHelper = new DriverHelper();
});

describe('during an Enroll workflow', () => {
	it('shows an alert when missing first and last name', async () => {
		const driver = driverHelper.createDriver();
		try {
			let root = await load(driver, appUrl);

			root = await login(driver, root);
			root = await beginEnroll(driver, root);

			const { queryAllByText, findByText } = render(root);

			const saveBtn = await findByText('Save');
			await saveBtn.click();

			const alerts = await queryAllByText('This information is required for enrollment');
			expect(alerts.length).not.toBeLessThan(1);
			expect(alerts[0]).not.toBeNull();
		} finally {
			await driverHelper.quit(driver);
		}
	});

	it('moves to the next section when first and last name are supplied', async () => {
		const driver = driverHelper.createDriver();
		try {
			let root = await load(driver, appUrl);

			root = await login(driver, root);
			root = await beginEnroll(driver, root);
			root = await enterChildInfo(driver, root);

			const { queryAllByText } = render(root);

			const alerts = await queryAllByText('This information is required for enrollment');
			expect(alerts.length).toBe(0);
			const currentUrl = await driver.getCurrentUrl();
			expect(currentUrl).toMatch(/family-information/);
		} finally {
			await driverHelper.quit(driver);
		}
	});

	it('moves to the next section if no family info is entered', async () => {
		const driver = driverHelper.createDriver();
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
		} finally {
			await driverHelper.quit(driver);
		}
	});

	it('moves to the next section if no family income is entered', async () => {
		const driver = driverHelper.createDriver();
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
		} finally {
			await driverHelper.quit(driver);
		}
	});

	// TODO: FIX THIS ONE
	xit('shows all valid funding options in enrollment and funding section before and after save', async () => {
		const driver = driverHelper.createDriver();
		try {
			let root = await load(driver, appUrl);

			root = await login(driver, root);
			root = await beginEnroll(driver, root);
			root = await enterChildInfo(driver, root);

			const { findByText, findByValue, findByLocator, queryAllByLocator, queryAllByText } = render(
				root
			);

			let saveBtn = await findByText('Save');
			await saveBtn.click();
			await driver.wait(until.urlMatches(/family-income/));

			saveBtn = await findByValue('Save');
			await saveBtn.click();
			await driver.wait(until.urlMatches(/enrollment-funding/));

			let fundingDropdown = await findByLocator({ css: '#fundingType' });
			await fundingDropdown.click();

			let fundingOptions = await queryAllByLocator({ css: '#fundingType option' });
			expect(fundingOptions.length).toBe(2);

			const infantToddler = await findByLocator({ css: '#InfantToddler' });
			// Idk why this just can't invoke click on infantToddler
			await driver.executeScript((argument: any) => argument.click(), infantToddler);

			fundingOptions = await queryAllByLocator({ css: '#fundingType option' });
			expect(fundingOptions.length).toBe(3);

			const selectedFundingOption = await fundingOptions[1].getAttribute('value');
			await fundingOptions[1].click();

			let reportingPeriodDropdown = await findByLocator({ css: '#firstReportingPeriod' });
			await reportingPeriodDropdown.click();

			let reportingPeriodsOptions = await queryAllByLocator({
				css: '#firstReportingPeriod option',
			});
			const selectedReportingPeriod = await reportingPeriodsOptions[1].getAttribute('value');
			await reportingPeriodsOptions[1].click();

			saveBtn = await findByText('Save');
			await saveBtn.click();
			await driver.wait(until.urlMatches(/review/));

			const currentUrl = await driver.getCurrentUrl();
			expect(currentUrl).toMatch(/review/);

			const missingInfos = await queryAllByText('Missing information');
			expect(missingInfos.length).toBe(4);

			const enrollmentFundingInlineMissingInfo = await queryAllByLocator({
				css: '.EnrollmentFundingSummary .oec-inline-icon--incomplete',
			});
			expect(enrollmentFundingInlineMissingInfo.length).toBe(1);

			const steps = await queryAllByLocator({ css: '.oec-step-list li a' });
			const enrollmentFundingStep = steps[3];
			await enrollmentFundingStep.click();

			fundingDropdown = await findByLocator({ css: '#fundingType' });
			const newSelectedFundingOption = await fundingDropdown.getAttribute('value');
			expect(newSelectedFundingOption).toBe(selectedFundingOption);

			reportingPeriodDropdown = await findByLocator({ css: '#firstReportingPeriod' });
			const newSelectedReportingPeriod = await reportingPeriodDropdown.getAttribute('value');
			expect(newSelectedReportingPeriod).toBe(selectedReportingPeriod);
		} finally {
			await driverHelper.quit(driver);
		}
	});

	it('shows all a success alert after finishing the enrollment', async () => {
		const driver = driverHelper.createDriver();
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
		} finally {
			await driverHelper.quit(driver);
		}
	});
});

afterAll(() => {
	driverHelper.cleanup();
});
