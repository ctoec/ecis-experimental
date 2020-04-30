import { IWebDriver } from "../DriverHelper";
import { WebElement } from "selenium-webdriver";
import { render, load, reload } from '../QueryHelper';


export const clickReportsTab = async (driver: IWebDriver, root: WebElement) => {
	const { findByLocator } = render(root);
	const reportsLink = await findByLocator({ xpath: "//nav//*[text()[contains(.,'Reports')]]" });
	await reportsLink.click();
	return await reload(driver);
};

export const clickOct2017Report = async (driver: IWebDriver, root: WebElement) => {
	const { findByLocator } = render(root);

	// Click on the pending report for March 2020
	const pendingReportLink = await findByLocator({
		xpath: "//table//*[text()[contains(.,'October 2017')]]",
	});
	await pendingReportLink.click();
	return await reload(driver);
};

export const enterMissingInfoForAllChildren = async (driver: IWebDriver, root: WebElement) => {
	const { findByLocator, queryAllByLocator, findByText } = render(root);
	// Find the child name with the incomplete marker next to it
	const kidsMissingInfoEls = await queryAllByLocator({
		xpath: "//table//span[text()[contains(.,'incomplete')]]//ancestor::tr//a",
	});
	const kidsMissingInfo: string[] = [];
	kidsMissingInfoEls.forEach(async k => kidsMissingInfo.push(await k.getAttribute('innerHTML')));
	if (kidsMissingInfo.length === 0) {
		// This method modifies what's in the db
		// If there are no incomplete enrollments return
		return await reload(driver);
	}
	// Can't just grab the first value from the array because it gives a stale element reference error
	kidsMissingInfo.forEach(async kid => {
		// const kidName = await kid.getAttribute('innerHTML');
		enterMissingChildInfo(driver, root, kid);
	});
	return await reload(driver);
};

export const enterMissingChildInfo = async (driver: IWebDriver, root: WebElement, kidName: string) => {
	const { findByLocator, queryAllByLocator, findByText } = render(root);
	const kennethBranagh = await findByLocator({
		xpath: `//table//span[text()[contains(.,'incomplete')]]//ancestor::tr//a[text()[contains(.,'${kidName}')]]`,
	});
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
