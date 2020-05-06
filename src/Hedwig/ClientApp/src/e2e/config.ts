import BrowserStack from 'browserstack-local';

export const browserStackLocal = !!process.env.BROWSERSTACK_LOCAL;
export const clientHost = process.env.E2E_CLIENT_URL;
export const gridHost = process.env.E2E_GRID_URL;
export const browserStackUsername = process.env.BROWSERSTACK_USERNAME;
export const browserStackAccesstoken = process.env.BROWSERSTACK_ACCESS_KEY;
export const bs_local = new BrowserStack.Local();
