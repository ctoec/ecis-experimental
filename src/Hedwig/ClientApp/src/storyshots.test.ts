import initStoryshots from '@storybook/addon-storyshots';

jest.mock('react-dates', () => ({
	// https://github.com/airbnb/react-dates/issues/528
	DayPickerSingleDateController: ({ ...props }) =>
		`<DayPickerSingleDateController" ${JSON.stringify(props)}/>`,
}));
jest.mock('moment', () => {
	return () => jest.requireActual('moment')('2020-01-01T00:00:00.000Z');
});
initStoryshots();

jest.resetAllMocks();
