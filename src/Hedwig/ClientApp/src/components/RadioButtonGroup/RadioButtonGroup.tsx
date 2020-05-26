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

/**
 * Internal component for managing a group of related RadioButtons
 */
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

	// Wrap the supplied onChange to provide for local state management
	const _onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const changedValue = event.target.value;
		const newSelectedItems = [changedValue];
		setSelectedItems(newSelectedItems);
		onChange(event);
	};

	return (
		<div className={className}>
			{/* Map over the options and invoke the render call back as a React component */}
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

/**
 * Component for displaying a group of related RadioButtons in a FieldSet
 */
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
			<InternalRadioButtonGroup id={id} {...props} />
		</FieldSet>
	);
};
