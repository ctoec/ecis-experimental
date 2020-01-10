import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Header, HeaderProps } from './Header';

const headerProps: HeaderProps = {
	title: 'Header test',
	navItems: [
		{ type: 'primary', title: 'Active section', path: '/first' },
		{ type: 'primary', title: 'Another section', path: '/another' },
		{ type: 'primary', title: 'Attention needed', attentionNeeded: true, path: '/attention' },
		{ type: 'secondary', title: 'Secondary item', path: '/secondary' },
		{ type: 'secondary', title: 'Another secondary item', path: '/secondary2' },
	],
	loginPath: '/login',
	logoutPath: '/logout',
};

it('shows first section as active when at the root path', () => {
	const wrapper = mount(
		<MemoryRouter>
			<Header {...headerProps} />
		</MemoryRouter>
	);

	const navLinks = wrapper.find('a.usa-nav__link');

	expect(navLinks.first().hasClass('usa-current')).toBe(true);
	expect(navLinks.at(1).hasClass('usa-current')).toBe(false);
});

it('shows the path as active when matching', () => {
	const wrapper = mount(
		<MemoryRouter initialEntries={['/another/nested/path']}>
			<Header {...headerProps} />
		</MemoryRouter>
	);

	const navLinks = wrapper.find('a.usa-nav__link');

	expect(navLinks.first().hasClass('usa-current')).toBe(false);
	expect(navLinks.at(1).hasClass('usa-current')).toBe(true);
});

it('opens menu when menu clicked', () => {
	const wrapper = mount(
		<MemoryRouter>
			<Header {...headerProps} />
		</MemoryRouter>
	);

	expect(wrapper.find('div.usa-overlay').hasClass('is-visible')).toBe(false);
	expect(wrapper.find('nav.usa-nav').hasClass('is-visible')).toBe(false);
	wrapper.find('button.usa-menu-btn').simulate('click');
	expect(wrapper.find('div.usa-overlay').hasClass('is-visible')).toBe(true);
	expect(wrapper.find('nav.usa-nav').hasClass('is-visible')).toBe(true);
});

it('closes menu when close button clicked', () => {
	const wrapper = mount(
		<MemoryRouter>
			<Header {...headerProps} />
		</MemoryRouter>
	);

	wrapper.find('button.usa-menu-btn').simulate('click');
	wrapper.find('button.usa-nav__close').simulate('click');
	expect(wrapper.find('div.usa-overlay').hasClass('is-visible')).toBe(false);
	expect(wrapper.find('nav.usa-nav').hasClass('is-visible')).toBe(false);
});

it('closes menu when location changed', () => {
	// Not quite sure how to test this one.
});

it('closes menu when clicking elsewhere', () => {
	const wrapper = mount(
		<MemoryRouter>
			<Header {...headerProps} />
		</MemoryRouter>
	);

	wrapper.find('button.usa-menu-btn').simulate('click');
	wrapper.find('div.usa-overlay').simulate('click');
	expect(wrapper.find('div.usa-overlay').hasClass('is-visible')).toBe(false);
	expect(wrapper.find('nav.usa-nav').hasClass('is-visible')).toBe(false);
});
