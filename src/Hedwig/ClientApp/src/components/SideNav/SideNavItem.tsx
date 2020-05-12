import React from 'react';
import cx from 'classnames';

type SideNavItemTitle = {
	text: string,
	link: string,
	onClick?: () => {},
	icon?: React.FC,
}

export type SideNavItemProps = {
	titleLink: SideNavItemTitle,
	description: string,
	active?: boolean,
}

export const SideNavItem = ({
	titleLink, description, active = false
}: SideNavItemProps) => {
	return (
		<li className={cx('oec-sidenav__item', { active })}>
			<a href={titleLink.link} onClick={titleLink.onClick}>
				<div className="oec-sidenav-item__title">
					{titleLink.text}
					<span>{titleLink.icon}</span>
				</div>
				<div className="oec-sidenav-item__desc">{description}</div>
			</a>
		</li>
	);
};
