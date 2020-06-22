import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { useHistory } from 'react-router';

type TabItemProps = {
	id: string;
	text: JSX.Element | string;
	content: JSX.Element;
};

type TabNavProps = {
	items: TabItemProps[];
	activeId?: string;
};

export const TabNav: React.FC<TabNavProps> = ({ items, activeId }) => {
	const startingIndex = items.findIndex((item) => item.id === activeId);
	const [activeTabIndex, setActiveTabIndex] = useState(startingIndex < 0 ? 0 : startingIndex);
	const history = useHistory();

	useEffect(() => {
		const activeIndex = items.findIndex((item) => item.id === activeId);
		const activeIndexOrCurrent = activeIndex < 0 ? activeTabIndex : activeIndex;
		setActiveTabIndex(activeIndexOrCurrent);
	}, [activeId]);

	useEffect(() => {
		history.push(`#${items[activeTabIndex].id}`);
	}, [activeTabIndex]);

	const onClick = (index: number) => {
		setActiveTabIndex(index);
	};

	const tabs = items.map(({ text }, index) => (
		<li key={index}>
			<button
				type="button"
				className={cx('oec-tab-nav--tab', { 'oec-tab-nav--tab__active': index === activeTabIndex })}
				onClick={() => onClick(index)}
			>
				{text}
			</button>
		</li>
	));

	const activeTab = items[activeTabIndex];

	return (
		<div className="oec-tab-nav">
			<div className="oec-tab-nav--header">
				<nav>
					<ul>{tabs}</ul>
				</nav>
			</div>
			<div className="oec-tab-nav--content">{activeTab.content}</div>
		</div>
	);
};
