import React from 'react';

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
		<li className="oec-sidenav__item">
			<a href={titleLink.link} className={active ? "active" : ''} onClick={titleLink.onClick}>
				<span className="text-bold">
					{titleLink.text}
				</span>
				<span>{titleLink.icon}</span>
				<div className="oec-sidenav-item__desc">
					<p>{description}</p>
				</div>
			</a>
		</li>
	);
};
