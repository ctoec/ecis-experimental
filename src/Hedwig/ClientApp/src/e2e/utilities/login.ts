import { until, WebElement } from 'selenium-webdriver';
import { reload, render } from '../QueryHelper';
import { IWebDriver } from '../DriverHelper';
import { username, password } from '../environment_values.json';

export default async function(driver: IWebDriver, root: WebElement) {
	let { queryAllByText } = render(root);

	// Find login button and click it
	const loginBtns = await queryAllByText('Sign in');
	await loginBtns[0].click();

	// Wait for page navigation
	await driver.wait(until.titleIs('IdentityServer4'));
	root = await reload(driver);
	let { findByPlaceholder, findByValue } = render(root);

	// Find username and password fields
	const usernameInput = await findByPlaceholder('Username');
	usernameInput.sendKeys(username);
	const passwordInput = await findByPlaceholder('Password');
	passwordInput.sendKeys(password);

	// Find the login button and click it
	const submitBtn = await findByValue('login');
	await submitBtn.click();

	// Wait for page navigation
	await driver.wait(until.titleIs('ECE Reporter'));
	return await reload(driver);
}
