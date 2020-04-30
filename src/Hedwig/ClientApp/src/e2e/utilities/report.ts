import { IWebDriver } from '../DriverHelper';
import { WebElement, until } from 'selenium-webdriver';
import { render, reload } from '../QueryHelper';
import { getTextInputByLabelSelector } from './componentUtils';

export const clickReportsTab = async (driver: IWebDriver, root: WebElement) => {
	const { findByLocator } = render(root);
	const reportsLink = await findByLocator({ xpath: "//nav//*[text()[contains(.,'Reports')]]" });
	await reportsLink.click();
	await driver.wait(until.urlMatches(/reports/));
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
	await driver.wait(until.urlMatches(/reports\/d*/));
	return await reload(driver);
};

export const enterMissingChildInfo = async (driver: IWebDriver, _root: WebElement) => {
	let root = _root;
	const { findByLocator, queryByLocator, findByText } = render(root);
	let kennethBranagh = await queryByLocator({
		xpath: `(//table)[1]//span[text()[contains(.,'incomplete')]]//ancestor::tr//a`,
	});
	if (!kennethBranagh) {
		console.log('Did not enter missing child info');
		return root;
	}
	// I have no idea why this is necessary
	kennethBranagh = await findByLocator({
		xpath: `(//table)[1]//span[text()[contains(.,'incomplete')]]//ancestor::tr//a`,
	});
	await kennethBranagh.click();
	root = await reload(driver);

	const updateMissingInfoSectionLink = await findByLocator({
		xpath: "//*[text()[contains(.,'Missing information')]]//following-sibling::a",
	});
	await updateMissingInfoSectionLink.click();
	root = await reload(driver);

	// Enter birth cert id, town, state
	const birthCertInput = await findByLocator({
		xpath: getTextInputByLabelSelector('Birth certificate ID'),
	});
	await birthCertInput.sendKeys('8675309');

	const birthTownInput = await findByLocator({
		xpath: getTextInputByLabelSelector('Town'),
	});
	await birthTownInput.sendKeys('Philadelphia');

	const birthStateInput = await findByLocator({
		xpath: getTextInputByLabelSelector('State'),
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
		xpath: getTextInputByLabelSelector('Family Fees'),
	});
	await familyFeesInput.debug();
	await familyFeesInput.sendKeys('8675');
	return root;
};
