import React, { useState } from "react";

export type RadioOption = {
	render: (
		props: {
			selected: boolean;
			name: string;
			value: string;
			onChange: React.ChangeEventHandler<HTMLInputElement>;
		}
	) => JSX.Element;
	value: string;
	expansion?: React.ReactNode;
	
};

export type RadioButtonGroupProps = {
	id: string;
	defaultValue?: string;
	options: RadioOption[];
	name: string;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
	id,
	defaultValue = '',
	options,
	name,
	onChange = () => {},
}) => {
	const [selectedItem, setSelectedItem] = useState(defaultValue);

	return (
		<div id={id} className="margin-top-3">
			{options.map(({ render: Render, value, expansion}) => {
				console.log('selected item == value', selectedItem === value);
				return (
				<span
					key={`${id}-${value}-${selectedItem}`}
					onChange={() => setSelectedItem(value)}
					>
					<Render
						selected={selectedItem === value}
						value={value}
						name={name}
						onChange={onChange}
					/>
					{expansion && selectedItem === value && (
						<div className="oec-itemchooser-expansion">{expansion}</div>
					)}
				</span>
			)})}
		</div>
	)
}
