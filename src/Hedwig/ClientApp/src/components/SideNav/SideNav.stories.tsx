import React from 'react';
import { storiesOf } from '@storybook/react';

import { SideNav, Button } from '..';
import { action } from '@storybook/addon-actions';
import { SideNavItemProps } from './SideNavItem';

const onClick = action('onChange');
const exampleItems: SideNavItemProps[] = [
	{
		title: 'The default active item',
		onClick,
		description: 'This is the first item',
		content: <div>Some content for the first item</div>,
	},
	{
		title: 'The other item',
		onClick,
		icon: 'complete',
		description: 'This is the third item',
		content: (
			<div>
				<Button text="A Button" />
			</div>
		),
	},
];

storiesOf('SideNav', module).add('Default', () => {
	return <SideNav items={exampleItems} noActiveItemContent={<></>} />;
});
