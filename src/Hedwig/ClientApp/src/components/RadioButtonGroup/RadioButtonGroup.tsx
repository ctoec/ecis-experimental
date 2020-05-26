import React, { useState } from 'react';
import { FieldSetProps, FieldSet } from '../FieldSet/FieldSet';

export type RadioOption = {
	render: (props: {
		onChange: React.ChangeEventHandler<HTMLInputElement>;
		selected: boolean;
		name: string;
		value: string;
	}) => JSX.Element;
	value: string;
	expansion?: React.ReactNode;
};

export type RadioButtonGroupProps = {
	id: string;
	className?: string;
	options: RadioOption[];
	defaultValue?: string | string[];
	name?: string;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const InternalRadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
	id,
	className,
	options,
	defaultValue = [],
	onChange,
	name,
}) => {
	const selectedItemsOnInput = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
	let processedSelectedItems = selectedItemsOnInput;
	if (selectedItemsOnInput.length === 0) {
		processedSelectedItems = [''];
	}
	const [selectedItems, setSelectedItems] = useState(processedSelectedItems);

	const _onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const changedValue = event.target.value;
		const newSelectedItems = [changedValue];
		setSelectedItems(newSelectedItems);
		onChange(event);
	};

	return (
		<div className={className}>
			{options.map(({ render: Render, value, expansion }) => (
				<>
					<Render
						key={`${id}-${value}-${selectedItems.includes(value)}`}
						onChange={_onChange}
						selected={selectedItems.includes(value)}
						name={name || ''}
						value={value}
					/>
					{expansion && selectedItems.includes(value) && (
						<div className="oec-itemchooser-expansion">{expansion}</div>
					)}
				</>
			))}
		</div>
	);
};

export const RadioButtonGroup: React.FC<RadioButtonGroupProps & FieldSetProps> = ({
	id,
	className,
	legend,
	showLegend,
	status,
	optional,
	hint,
	horizontal = false,
	disabled,
	children,
	...props
}) => {
	return (
		<FieldSet
			id={`${id}-fieldset`}
			className={className}
			legend={legend || ''}
			showLegend={showLegend}
			status={status}
			optional={optional}
			hint={hint}
			horizontal={horizontal}
			disabled={disabled}
			childrenGroupClassName={'margin-top-3'}
		>
			<InternalRadioButtonGroup id={id} {...props}>
				{children}
			</InternalRadioButtonGroup>
		</FieldSet>
	);
};
