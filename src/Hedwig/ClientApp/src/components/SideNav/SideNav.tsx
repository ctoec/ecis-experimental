import React from 'react';
import { SideNavItem, SideNavItemProps } from './SideNavItem';
import styles from './SideNav.module.scss';

export type SideNavProps = {
	items: SideNavItemProps[],
};

export const SideNav = ({ items }: SideNavProps) => {
	return (
		<nav className="oec-sidenav">
			<div className="tablet:grid-col-4">
				<ul>
					{items.map(item => (<SideNavItem {...item} />))}
				</ul>
			</div>
		</nav>
	);
};
