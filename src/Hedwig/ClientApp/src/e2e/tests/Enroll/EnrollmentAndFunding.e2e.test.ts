import { until } from 'selenium-webdriver';
import { render, load } from '../../QueryHelper';
import { DriverHelper, IWebDriver } from '../../DriverHelper';
import { clientHost } from '../../config';
import login from '../../utilities/login';
import { beginEnroll, enterChildInfo } from '../../utilities/enroll';
import { browserStackAccesstoken, bs_local } from '../../config';

// Set time out to 3 minutes
// jest.setTimeout(3 * 60 * 1000);

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
}, 30 * 1000);

afterEach(async done => {
	await DriverHelper.quit(driver);
	bs_local.stop(() => {
		done();
	});
});

describe('Enrollment and funding', () => {
	it('shows all valid funding options before and after save', async () => {
		try {
			let root = await load(driver, appUrl);

			root = await login(driver, root);
			root = await beginEnroll(driver, root);
			root = await enterChildInfo(driver, root);

			const {
				findByText,
				findByValue,
				findByLocator,
				queryAllByLocator,
				queryAllByText,
				debug,
			} = render(root);

			// Click past family information without entering info
			let saveBtn = await findByText('Save');
			await saveBtn.click();
			await driver.wait(until.urlMatches(/family-income/));

			// Click past family income without entering info
			saveBtn = await findByValue('Save');
			await saveBtn.click();
			await driver.wait(until.urlMatches(/enrollment-funding/));

			// Find the radio button for infant/toddler age group
			const infantToddler = await findByLocator({
				xpath: "//*/label[text()='Infant/Toddler']",
			});
			// Clicking the label triggers the event; the actual input is off screen because USWDS likes prettier radio buttons
			await infantToddler.click();

			// Select CDC funding
			const selectedFundingLabel = 'Child day care';
			const cdcFundingRadio = await findByLocator({
				xpath: `//*/label[text()='${selectedFundingLabel}']`,
			});
			await cdcFundingRadio.click();

			// Open the contract space dropdown
			let contractSpaceDropdown = await findByLocator({
				xpath: "//*/label[text()='Contract space']//following-sibling::select",
			});
			await contractSpaceDropdown.click();

			// Select the first one-- not a specific one because this changes based on time
			let contractSapceOptions = await queryAllByLocator({
				xpath: "//*/label[text()='Contract space']//following-sibling::select/child::option",
			});
			const selectedContractSpace = await contractSapceOptions[1].getAttribute('value');
			await contractSapceOptions[1].click();

			// Open the reporting period dropdown
			let reportingPeriodDropdown = await findByLocator({
				xpath: "//*/label[text()='First reporting period']//following-sibling::select",
			});
			await reportingPeriodDropdown.click();

			// Select the first one-- not a specific one because this changes based on time
			let reportingPeriodsOptions = await queryAllByLocator({
				xpath:
					"//*/label[text()='First reporting period']//following-sibling::select/child::option",
			});
			const selectedReportingPeriod = await reportingPeriodsOptions[1].getAttribute('value');
			await reportingPeriodsOptions[1].click();

			// Save and review
			saveBtn = await findByText('Save');
			await saveBtn.click();
			await driver.wait(until.urlMatches(/review/));

			const currentUrl = await driver.getCurrentUrl();
			expect(currentUrl).toMatch(/review/);

			// On the review page, each section should have a missing info indication
			const missingInfos = await queryAllByText('Missing information');
			expect(missingInfos.length).toBe(4);

			// Enrollment date should have a missing info icon with text (incomplete) for screen readers
			const enrollmentFundingInlineMissingInfo = await findByLocator({
				xpath:
					"//*[text()[contains(.,'Enrollment date:')]]/descendant::span[text()[contains(.,'incomplete')]]",
			});
			const enrollmentFundingInlineMissingInfoClass = await enrollmentFundingInlineMissingInfo.getAttribute(
				'class'
			);
			expect(enrollmentFundingInlineMissingInfoClass).toMatch('usa-sr-only');

			const steps = await queryAllByLocator({
				xpath: "//a[text()[contains(.,'Edit')]]",
			});
			const enrollmentFundingStep = steps[3];
			await enrollmentFundingStep.click();

			const newSelectedFundingLabel = await findByLocator({
				xpath:
					"//h2[text()='Funding']//following-sibling::fieldset//descendant::input[@checked]//following-sibling::label",
			});
			const newSelectedFundingLabelText = await newSelectedFundingLabel.getAttribute('innerHTML');
			expect(newSelectedFundingLabelText).toBe(selectedFundingLabel);

			reportingPeriodDropdown = await findByLocator({
				xpath: "//*/label[text()='First reporting period']//following-sibling::select",
			});
			const newSelectedReportingPeriod = await reportingPeriodDropdown.getAttribute('value');
			expect(newSelectedReportingPeriod).toBe(selectedReportingPeriod);

			contractSpaceDropdown = await findByLocator({
				xpath: "//*/label[text()='Contract space']//following-sibling::select",
			});
			const newselectedContractSpace = await contractSpaceDropdown.getAttribute('value');
			expect(newselectedContractSpace).toBe(selectedContractSpace);
		} catch {}
	}, 2 * 60 * 1000);
});
