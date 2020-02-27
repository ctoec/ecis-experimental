import initStoryshots from '@storybook/addon-storyshots';

jest.mock('react-dates', () => ({
	// https://github.com/airbnb/react-dates/issues/528
	DayPickerSingleDateController: ({ ...props }) =>
		`<DayPickerSingleDateController" ${JSON.stringify(props)}/>`,
}));

initStoryshots();

jest.resetAllMocks();
