import { IWebDriver, loadAndWaitFor, selectorByText, selectorByPlaceholder, selectorByValue, waitFor } from '../helpers';
import { until } from 'selenium-webdriver';

const appSelector = { css: '#root > div' };

/**
 * Load the SPA and wait for the App container
 * @param driver Intialized Selenium WebDriver
 */
export const app = async (driver: IWebDriver) => {
  return loadAndWaitFor(driver, appSelector);
}

export const waitForHeader = async (driver: IWebDriver) => {
  const headerSelector = { css: 'header em' }
  return await waitFor(driver, headerSelector);
}

export const waitForLoginWelcome = async (driver: IWebDriver) => {
  const loginWelcomeSelector = { css: '.oec-logged-in-user' };
  const name = await waitFor(driver, loginWelcomeSelector);
  await driver.wait(until.elementTextMatches(name, /Hi/i));
  return name;
}

/**
 * Simulate log in
 * @param page App container
 * @param driver Initialized Selenium WebDriver
 */
export const clickLogin = async (driver: IWebDriver) => {
  // Find login button and click it
  const loginLink = await waitFor(driver, selectorByText('Log in'));
  await loginLink.click();

  // Wait for page navigation
  await driver.wait(until.titleIs('IdentityServer4'));

  // Find username and password fields
  const usernameInput = await waitFor(driver, selectorByPlaceholder('Username'));
  usernameInput.sendKeys('voldemort');
  const passwordInput = await driver.findElement(selectorByPlaceholder('Password'));
  passwordInput.sendKeys('thechosenone');

  // Find the login button and click it
  const submitBtn = await driver.findElement(selectorByValue('login'));
  await submitBtn.click();

  // Wait for page navigation
  await driver.wait(until.titleIs('ECE Reporter'));
  // Wait for app container to load
  await waitFor(driver, appSelector);
}

