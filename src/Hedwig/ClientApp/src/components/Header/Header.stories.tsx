import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, object } from '@storybook/addon-knobs';

import { Header } from './Header';
import { NavItemProps } from './NavItem';

const defaultTitle = 'Hello world!';
const defaultName = 'Chris';
const defaultNavItems: NavItemProps[] = [
	{ type: 'primary', title: 'Active section', path: '/' },
	{ type: 'primary', title: 'Another section', path: '/another' },
	{ type: 'primary', title: 'Attention needed', attentionNeeded: true, path: '/attention' },
	{ type: 'secondary', title: 'Secondary item', path: '/secondary' },
	{ type: 'secondary', title: 'Another secondary item', path: '/secondary2' },
];

storiesOf('Header', module)
	.addDecorator(withKnobs)
	.add('Logged in', () => {
		const customTitle = text('Title', defaultTitle);
		const customName = text('Name', defaultName);
		const customNavItems = object('Items', defaultNavItems);
		return (
			<Header
				primaryTitle={customTitle}
				navItems={customNavItems}
				loginPath="/login"
				logoutPath="/logout"
				userFirstName={customName}
			/>
		);
	})
	.add('Logged out', () => {
		const customTitle = text('Title', defaultTitle);
		const customNavItems = object('Items', defaultNavItems);
		return (
			<Header
				primaryTitle={customTitle}
				navItems={customNavItems}
				loginPath="/login"
				logoutPath="/logout"
			/>
		);
	});
