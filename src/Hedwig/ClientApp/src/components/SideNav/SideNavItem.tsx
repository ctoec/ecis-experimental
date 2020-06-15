import React from 'react';
import cx from 'classnames';
import { InlineIcon, Icon } from '..';
import { TextWithIcon } from '../TextWithIcon/TextWithIcon';

type SideNavItemTitle = {
	text: string;
	link: string;
};

export type SideNavItemProps = {
	titleLink: SideNavItemTitle;
	description: string;
	icon?: Icon;
	onClick?: () => any;
	content: JSX.Element;
};

type InternalSideNavItemProps = SideNavItemProps & {
	active: boolean;
	onClick: () => any;
};

export const SideNavItem = ({
	titleLink,
	description,
	active,
	onClick,
	icon,
}: InternalSideNavItemProps) => {
	return (
		<li className={cx('oec-sidenav__item', { active })}>
			<a onClick={onClick}>
				<div>
					<p className="oec-sidenav-item__title">{titleLink.text} {icon && <InlineIcon icon={icon} /> }</p>
					<p className="oec-sidenav-item__desc">{description}</p>
				</div>
			</a>
		</li>
	);
};
