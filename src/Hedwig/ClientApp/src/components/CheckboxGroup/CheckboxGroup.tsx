import React, { useState, PropsWithChildren } from 'react';
import { FieldSet, FieldSetProps } from '../FieldSet/FieldSet';
import { FormFieldSetProps, FormFieldSet } from '../Form_New/FormFieldSet';

export type CheckboxOption = {
	render: (props: {
		id: string;
		selected: boolean;
		onChange?: React.ChangeEventHandler<HTMLInputElement>;
		name: string;
		value: string;
	}) => JSX.Element;
	value: string;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	expansion?: React.ReactNode;
};

type InternalCheckboxGroupProps = {
	id: string;
	className?: string;
	options: CheckboxOption[];
	defaultValue?: string | string[];
	name?: string;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

/**
 * Internal component for managing a group of related checkboxes
 */
const InternalCheckboxGroup: React.FC<InternalCheckboxGroupProps> = ({
	id,
	className,
	options,
	name,
	onChange,
	defaultValue = [],
}) => {
	const selectedItemsOnInput = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
	const [selectedItems, setSelectedItems] = useState(selectedItemsOnInput);

	// Wrap the supplied onChange (from either the option element or CheckboxGroup)
	// to provide for local state management
	const _onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const changedValue = event.target.value;
		let newSelectedItems: string[];
		if (selectedItems.includes(changedValue)) {
			// Uncheck a checkbox if it was already checked
			newSelectedItems = selectedItems.filter((v) => v !== changedValue);
		} else {
			// If it wasn't already selected and it's a checkbox, add it to whatever else is selected
			newSelectedItems = [changedValue, ...selectedItems];
		}
		setSelectedItems(newSelectedItems);
		const option = options.find((option) => option.value === changedValue);
		option && option.onChange ? option.onChange(event) : onChange && onChange(event);
	};

	return (
		<div className={className}>
			{/* Map over the options and invoke the render call back as a React component */}
			{options.map(({ render: Render, value, expansion }) => (
				<>
					<Render
						id={`${id}-${value}`}
						key={`${id}-${value}`}
						selected={selectedItems.includes(value)}
						name={name || ''}
						onChange={_onChange}
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

export type CheckboxGroupProps = InternalCheckboxGroupProps & FieldSetProps;

/**
 * Component for displaying a group of related Checkbox items in a FieldSet
 */
export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
	id,
	className,
	legend,
	showLegend,
	status,
	optional,
	hint,
	horizontal,
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
			<InternalCheckboxGroup id={id} {...props} />
		</FieldSet>
	);
};

export type CheckboxGroupForFormProps<T> = InternalCheckboxGroupProps & FormFieldSetProps<T>;

/**
 * Component for displaying a group of related checkbox items in a FormFieldSet
 */
export const CheckboxGroupForForm = <T extends object>({
	id,
	className,
	legend,
	showLegend,
	status,
	optional,
	hint,
	horizontal,
	disabled,
	...props
}: CheckboxGroupForFormProps<T>) => {
	return (
		<FormFieldSet<T>
			id={`${id}-fieldset`}
			className={className}
			legend={legend}
			showLegend={showLegend}
			status={status}
			optional={optional}
			hint={hint}
			horizontal={horizontal}
			disabled={disabled}
			childrenGroupClassName={'margin-top-3'}
		>
			<InternalCheckboxGroup id={id} {...props} />
		</FormFieldSet>
	);
};
