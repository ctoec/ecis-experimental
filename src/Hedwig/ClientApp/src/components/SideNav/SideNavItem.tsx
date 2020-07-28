import React from 'react';
import cx from 'classnames';
import { InlineIcon, Icon, Button } from '..';

export type SideNavItemProps = {
	title: string | JSX.Element;
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
	title,
	description,
	active,
	onClick,
	icon,
}: InternalSideNavItemProps) => {
	return (
		<li className={cx('oec-sidenav__item', { active })}>
			<Button
				onClick={onClick}
				appearance="unstyled"
				text={
					<div>
						<p className="oec-sidenav-item__title">
							{title} {icon && <InlineIcon icon={icon} />}
						</p>
						<p className="oec-sidenav-item__desc">{description}</p>
					</div>
				}
			></Button>
		</li>
	);
};
