import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { SideNavItem, SideNavItemProps } from './SideNavItem';

export type SideNavProps = {
	items: SideNavItemProps[];
	externalActiveItemIndex?: number;
	noActiveItemContent: JSX.Element;
};

export const SideNav = ({ items, externalActiveItemIndex, noActiveItemContent }: SideNavProps) => {
	const [activeItemIndex, setActiveItemIndex] = useState(externalActiveItemIndex);

	useEffect(() => {
		setActiveItemIndex(
			externalActiveItemIndex != undefined && !isNaN(externalActiveItemIndex)
				? externalActiveItemIndex
				: undefined
		);
	}, [externalActiveItemIndex]);

	return (
		<div className="oec-sidenav grid-row">
			<div className="mobile-lg:grid-col-4">
				<nav>
					<ul>
						{items.map((item, idx) => {
							const _onClick = () => {
								setActiveItemIndex(idx);
								item.onClick && item.onClick();
							};
							return (
								<SideNavItem
									{...item}
									key={idx}
									onClick={_onClick}
									active={idx === activeItemIndex}
								/>
							);
						})}
					</ul>
				</nav>
			</div>
			<div
				className={cx(
					'oec-sidenav__content',
					{ 'mobile-lg:grid-col-8': items.length > 0 },
					{ 'mobile-lg:grid-col-12': items.length === 0 }
				)}
			>
				{activeItemIndex !== undefined && activeItemIndex < items.length
					? items[activeItemIndex].content
					: noActiveItemContent}
			</div>
		</div>
	);
};
