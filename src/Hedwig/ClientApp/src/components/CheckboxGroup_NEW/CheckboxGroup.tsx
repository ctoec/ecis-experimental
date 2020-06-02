import React, { PropsWithChildren, useState } from "react";

export type CheckboxOption = {
	render: (
		props: {
			selected: boolean;
		}
	) => JSX.Element;
	value: string;
	expansion?: React.ReactNode;
}

export type CheckboxGroupProps = {
	id: string;
	defaultValue?: string | string[];
	options: CheckboxOption[];
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
	id,
	defaultValue,
	options
}) => {
	const [selectedItems, setSelectedItems] = useState(
		Array.isArray(defaultValue) ? defaultValue : [defaultValue]
	);

	return (
		<div id={id} className="margin-top-3">
			{options.map(({ render: Render, value, expansion }) => (
				<span
					key={`${id}-${value}`}
					onChange={(e) => {
						const checked = (e.target as HTMLInputElement).checked;

						if(checked && !selectedItems.includes(value)) {
							setSelectedItems(items => [...items, value]);
						}

						if(!checked) {
							setSelectedItems(items => items.filter(i => i === value))
						}
					}}
				>
					<Render
						selected={selectedItems.includes(value)}
					/>
					{expansion && selectedItems.includes(value) && (
						<div className="oec-itemchoose-expansion">{expansion}</div>
					)}
				</span>
			))}
		</div>
	)
}
