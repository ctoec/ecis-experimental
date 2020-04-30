import { IWebDriver } from '../DriverHelper';
import { WebElement } from 'selenium-webdriver';
import { render, reload } from '../QueryHelper';

export const clickReportsTab = async (driver: IWebDriver, root: WebElement) => {
	const { findByLocator } = render(root);
	const reportsLink = await findByLocator({ xpath: "//nav//*[text()[contains(.,'Reports')]]" });
	await reportsLink.click();
	return await reload(driver);
};

export const clickReportByTitle = async (
	driver: IWebDriver,
	root: WebElement,
	reportTitle: string
) => {
	const { findByLocator } = render(root);

	// Click on the pending report for March 2020
	const pendingReportLink = await findByLocator({
		xpath: `//table//*[text()[contains(.,'${reportTitle}')]]`,
	});
	await pendingReportLink.click();
	return await reload(driver);
};

export const enterMissingChildInfo = async (driver: IWebDriver, _root: WebElement) => {
	let root = _root;
	const { findByLocator, queryByLocator, findByText } = render(root);
	const kennethBranagh = await queryByLocator({
		xpath: `//table//span[text()[contains(.,'incomplete')]]//ancestor::tr//a`,
	});
	if (!kennethBranagh) {
		return root;
	}
	await kennethBranagh.click();
	root = await reload(driver);

	const updateMissingInfoSectionLink = await findByLocator({
		xpath: "//*[text()[contains(.,'Missing information')]]//following-sibling::a",
	});
	await updateMissingInfoSectionLink.click();
	root = await reload(driver);

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

export const enterFamilyFeesRevenue = async (driver: IWebDriver, root: WebElement) => {
	const { findByLocator } = render(root);
	const familyFeesInput = await findByLocator({
		xpath: "//*/label[text()[contains(.,'Family Fees')]]//following-sibling::input",
	});
	await familyFeesInput.debug();
	await familyFeesInput.sendKeys('8675');
	return root;
};
