import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import StoryRouter from 'storybook-react-router';
import requireContext from 'require-context.macro';
import { withA11y } from '@storybook/addon-a11y';

import 'react-dates/lib/css/_datepicker.css';
import '../src/assets/styles/index.scss';

jest.mock('react-dates', () => ({
	DayPickerSingleDateController: ({ ...props }) =>
		`<DayPickerSingleDateController" ${JSON.stringify(props)}/>`,
}));

addDecorator(StoryRouter());
addDecorator(withA11y());

addDecorator(story => <div style={{ padding: '40px' }}>{story()}</div>);

const req = requireContext('../src', true, /\.stories.(jsx|tsx)$/);

function loadStories() {
	req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
