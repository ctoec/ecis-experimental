import React from 'react';

type Ratio = {
	a: number,
	b: number
};

type LegendItem = {
	text: string;
	textClass?: string;
	symbol?: any; // svg or null-- default to box
	symbolColor?: string;
	number?: number;
	ratio?: Ratio
};

type LegendProps = {
	items: LegendItem[];
};

export default function Legend({ items }: LegendProps) {
	return (
		<div className="grid-row flex-wrap margin-top-2 margin-bottom-2 oec-legend">
			{items.map(item => {
				return (
				<div className="grid-col-1 flex-1" key={item.text.split(' ').join('-')}>
					{ item.symbol ? item.symbol :
						<svg height="16" width="20" className="legend-svg">
							<rect
								width="16px"
								height="16px"
								rx="4px"
								ry="4px"
								className={`fill-${item.symbolColor}`}
							/>
						</svg>
          }
					<div
						className={`width-fit-content display-inline margin-left-1 margin-bottom-1 ${item.textClass || ''}`}
					>
						{item.ratio ? (
							<span className="margin-right-1 text-bold">{item.ratio.a}/{item.ratio.b}</span>
						) : 
							item.number !== undefined ? (
								<span className="margin-right-1 text-bold">{item.number}</span>
							) : undefined
						}
						<span>{item.text}</span>
					</div>
				</div>)
			})
		}
		</div>
	);
}
