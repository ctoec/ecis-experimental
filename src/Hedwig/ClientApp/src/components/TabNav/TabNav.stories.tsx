import React from 'react';
import { storiesOf } from '@storybook/react';
import { TabNav } from './TabNav';

storiesOf('StepList', module).add('Default', () => {
	return (
		<TabNav
			items={[
				{
					text: 'Tab One',
					content: <p>Tab 1 content</p>,
				},
			]}
		></TabNav>
	);
});
