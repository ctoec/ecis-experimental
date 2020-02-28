import '@testing-library/jest-dom/extend-expect';
import 'react-dates/initialize';

// JS-DOM does not implement window.scroll
// @ts-ignore
global.scroll = () => {};
