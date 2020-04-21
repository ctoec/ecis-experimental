import React from 'react';

export type LegendItem = {
	text: string | JSX.Element;
	symbol?: JSX.Element;
	symbolClass?: string;
	textClass?: string;
	hidden?: boolean;
};

type LegendProps = {
	items: LegendItem[];
};

const defaultSymbol = (
	<svg height="1em" width="1em" className="oec-legend__symbol__svg">
		<rect width="100%" height="100%" fill="currentColor" />
	</svg>
);

export function Legend({ items }: LegendProps) {
	return (
		<ul className="grid-row flex-wrap margin-y-2 grid-gap oec-legend">
			{items
				.filter(item => !item.hidden)
				.map((item, index) => (
					<li key={index} className="margin-right-1">
						<div className={`oec-legend__symbol ${item.symbolClass}`}>
							{item.symbol || defaultSymbol}
						</div>
						<div
							className={`width-fit-content display-inline margin-left-1 ${item.textClass || ''}`}
						>
							{item.text}
						</div>
					</li>
				))}
		</ul>
	);
}
