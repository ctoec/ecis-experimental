import React from 'react';
import { storiesOf } from '@storybook/react';

import { SideNav } from '..';
import { action } from '@storybook/addon-actions';

const onClick = action('onChange');
const exampleItems = [
	{
		titleLink: {
			text: 'Item title is a link',
			link: '/',
		},
		onClick,
		description: 'This is the first item',
		active: true,
	},
	{
		titleLink: {
			text: 'Item title is also a link',
			link: '/',
		},
		onClick,
		description: 'This is the second item, which has a longer description',
	},
	{
		titleLink: {
			text: 'Look an icon',
			link: '/',
		},
		onClick,
		icon: 'complete',
		description: 'This is the third item',
	},
];

storiesOf('SideNav', module).add('Default', () => {
	return <SideNav items={exampleItems} />;
});
