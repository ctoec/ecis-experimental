import React from 'react';
import { storiesOf } from '@storybook/react';
import { TabNav } from './TabNav';

storiesOf('Tab nav', module).add('Default', () => {
	return (
		<TabNav
			items={[
				{
					id: 'one',
					text: 'Tab One',
					content: <p>Tab 1 content</p>,
				},
			]}
		></TabNav>
	);
});
