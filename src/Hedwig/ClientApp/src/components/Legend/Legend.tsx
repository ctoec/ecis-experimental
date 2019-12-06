import React from 'react';

export type LegendItem = {
	text: string;
	textClass?: string;
	symbol?: JSX.Element;
	symbolColor?: string;
	number?: number;
	ratio?: Ratio
};

type LegendProps = {
	items: LegendItem[];
};

export default function Legend({ items }: LegendProps) {
	return (
		<div className="grid-row flex-wrap flex-justify margin-top-4 margin-bottom-6 grid-gap oec-legend">
			{items.map(item => (
				<div key={item.text.split(' ').join('-')}>
					<div className="oec-legend__symbol">
						{item.symbol}
						{!item.symbol && <svg height="1em" width="1em" className="oec-legend__symbol__svg">
							<rect
								width="1em"
								height="1em"
								rx="0.25em"
								ry="0.25em"
								className={`fill-${item.symbolColor}`}
								/>
						</svg>}
					</div>
					<div
						className={`width-fit-content display-inline margin-left-1 margin-bottom-1 ${item.textClass || ''}`}
					>
						{item.number !== undefined && (
							<span className="text-bold">{item.number} </span>
						)}
						<span>{item.text}</span>
					</div>
				</div>)
			})
		}
		</div>
	);
}
