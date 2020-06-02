import React, { useState } from "react";

export type RadioOption = {
	render: (
		props: {
			selected: boolean;
			name: string;
			value: string;
		}
	) => JSX.Element;
	value: string;
	expansion?: React.ReactNode;
	
};

type RadioButtonGroupProps = {
	id: string;
	defaultValue?: string;
	options: RadioOption[];
	name: string;
}

export const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
	id,
	defaultValue = '',
	options,
	name
}) => {
	const [selectedItem, setSelectedItem] = useState(defaultValue);

	return (
		<div id={id} className="margin-top-3">
			{options.map(({ render: Render, value, expansion}) => (
				<span
					key={`${id}-${value}`}
					onChange={() => setSelectedItem(value)}
				>
					<Render
						selected={selectedItem === value}
						value={value}
						name={name}
					/>
					{expansion && selectedItem === value && (
						<div className="oec-itemchooser-expansion">{expansion}</div>
					)}
				</span>
			))}
		</div>
	)
}
