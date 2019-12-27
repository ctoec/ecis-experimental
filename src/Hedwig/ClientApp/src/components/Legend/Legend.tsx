import React from 'react';

export type LegendItem = {
	text: string | JSX.Element;
	symbol?: JSX.Element;
	symbolClass?: string;
	textClass?: string;
};

type LegendProps = {
	items: LegendItem[];
};

const defaultSymbol = (
	<svg height="1em" width="1em" className="oec-legend__symbol__svg">
		<rect width="100%" height="100%" fill="currentColor" />
	</svg>
);

export default function Legend({ items }: LegendProps) {
	return (
		<div className="grid-row flex-wrap margin-top-2 margin-bottom-6 grid-gap oec-legend">
			{items.map((item, index) => (
				<div key={index} className="margin-right-1">
					<div className={`oec-legend__symbol ${item.symbolClass}`}>
						{item.symbol || defaultSymbol}
					</div>
					<div className={`width-fit-content display-inline margin-left-1 ${item.textClass || ''}`}>
						{item.text}
					</div>
				</div>
			))}
		</div>
	);
}
