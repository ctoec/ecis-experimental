import React from 'react';
import cx from 'classnames';
import { InlineIcon, Icon } from '..';

type SideNavItemTitle = {
	text: string;
	link: string;
};

export type SideNavItemProps = {
	titleLink: SideNavItemTitle;
	description: string;
	active?: boolean;
	icon?: Icon;
	onClick?: () => {};
};

export const SideNavItem = ({
	titleLink,
	description,
	active,
	onClick,
	icon,
}: SideNavItemProps) => {
	return (
		<li className={cx('oec-sidenav__item', { active })}>
			<a href={titleLink.link} onClick={onClick}>
				<div className="oec-sidenav-item__title">
					{titleLink.text}
					{icon && <InlineIcon icon={icon} />}
				</div>
				<div className="oec-sidenav-item__desc">{description}</div>
			</a>
		</li>
	);
};
