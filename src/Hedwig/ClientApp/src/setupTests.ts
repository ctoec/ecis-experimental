import '@testing-library/jest-dom/extend-expect';

// JS-DOM does not implement window.scroll
// @ts-ignore
global.scroll = () => {};