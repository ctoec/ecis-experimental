import React, { useState } from 'react';
import cx from 'classnames';

type TabItemProps = {
	text: JSX.Element | string;
	content: JSX.Element;
	default?: boolean;
};

type TabNavProps = {
	items: TabItemProps[];
};

export const TabNav: React.FC<TabNavProps> = ({ items }) => {
	const indexOfDefault = items.findIndex((item) => item.default);
	const defaultActiveIndex = indexOfDefault < 0 ? 0 : indexOfDefault;
	const [activeTabIndex, setActiveTabIndex] = useState(defaultActiveIndex);

	const onClick = (index: number) => {
		setActiveTabIndex(index);
	};

	const tabs = items.map(({ text }, index) => (
		<button
			key={index}
			className={cx('oec-tab-nav--tab', { 'oec-tab-nav--tab__active': index === activeTabIndex })}
			onClick={() => onClick(index)}
		>
			{text}
		</button>
	));

	const activeTab = items[activeTabIndex];

	return (
		<div className="oec-tab-nav">
			<div className="oec-tab-nav--header">{tabs}</div>
			<div className="oec-tab-nav--divider"></div>
			<div className="oec-tab-nav--content">{activeTab.content}</div>
		</div>
	);
};
