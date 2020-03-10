import '@testing-library/jest-dom/extend-expect';
import 'react-dates/initialize';
import { toHaveNoViolations } from 'jest-axe';


// JS-DOM does not implement window.scroll
// @ts-ignore
global.scroll = () => {};

expect.extend(toHaveNoViolations);

