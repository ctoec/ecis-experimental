import { IWebDriver } from '../DriverHelper';
import { WebElement, until } from 'selenium-webdriver';
import { reload, render } from '../QueryHelper';

export async function beginEnroll(driver: IWebDriver, root: WebElement) {
	const { findByText, queryAllByLocator } = render(root);
	const enrollBtn = await findByText('Enroll child');
	await enrollBtn.click();

	const siteDropdowns = await queryAllByLocator({ css: '#enroll-select a' });
	expect(siteDropdowns.length).not.toBeLessThan(1);
	const firstSiteDropdown = siteDropdowns[0];
	await firstSiteDropdown.click();

	await driver.wait(until.urlMatches(/enroll/));

	return await reload(driver);
}

export async function enterChildInfo(driver: IWebDriver, root: WebElement) {
	const { findByText, findByLocator } = render(root);

	const firstNameInput = await findByLocator({ css: '#firstName' });
	await firstNameInput.sendKeys('First name');
	const lastNameInput = await findByLocator({ css: '#lastName' });
	await lastNameInput.sendKeys('Last name');

	const saveBtn = await findByText('Save');
	await saveBtn.click();

	await driver.wait(until.urlMatches(/family-information/));

	return await reload(driver);
}
