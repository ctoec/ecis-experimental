import '@testing-library/jest-dom/extend-expect';
import 'react-dates/initialize';
import { toHaveNoViolations } from 'jest-axe';

// JS-DOM does not implement window.scroll
// @ts-ignore
global.scroll = () => {};

expect.extend(toHaveNoViolations);

// if (!process.env.LISTENING_TO_UNHANDLED_REJECTION) {
//   process.on('unhandledRejection', reason => {
//     // throw reason
//   })
//   // Avoid memory leak by adding too many listeners
//   process.env.LISTENING_TO_UNHANDLED_REJECTION = 'true';
// }
