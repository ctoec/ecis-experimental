import React from 'react';
import cx from 'classnames';

export type LegendItem = {
	text: string | JSX.Element;
	symbol?: JSX.Element;
	symbolClass?: string;
	textClass?: string;
	hidden?: boolean | null;
};

type LegendProps = {
	items: LegendItem[];
	vertical?: boolean;
};

const defaultSymbol = (
	<svg height="1em" width="1em" className="oec-legend__symbol__svg">
		<rect width="100%" height="100%" fill="currentColor" />
	</svg>
);

export function Legend({ items, vertical = false }: LegendProps) {
	return (
		<ul
			className={cx('margin-y-2 oec-legend add-list-reset', {
				'grid-col': vertical,
				'grid-row grid-gap': !vertical,
			})}
		>
			{items
				.filter((item) => !item.hidden)
				.map((item, index) => (
					<li
						key={index}
						className={cx('oec-legend__item oec-legend-item', {
							'margin-y-1': vertical,
							'margin-right-1': !vertical,
						})}
					>
						<div className={`oec-legend-item__symbol ${item.symbolClass}`}>
							{item.symbol || defaultSymbol}
						</div>
						<div
							className={`oec-legend-item__text width-fit-content display-inline margin-left-1 ${
								item.textClass || ''
							}`}
						>
							{item.text}
						</div>
					</li>
				))}
		</ul>
	);
}
