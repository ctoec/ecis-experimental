import React, { useState } from 'react';
import { FieldSetProps, FieldSet } from '../FieldSet/FieldSet';
import { FormFieldSetProps, FormFieldSet } from '../Form_New/FormFieldSet';

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

type InternalRadioButtonGroupProps = {
	id: string;
	className?: string;
	options: RadioOption[];
	defaultValue?: string;
	name?: string;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
};

/**
 * Internal component for managing a group of related RadioButtons
 */
const InternalRadioButtonGroup: React.FC<InternalRadioButtonGroupProps> = ({
	id,
	className,
	options,
	defaultValue = '',
	onChange,
	name,
}) => {
	const [selectedItems, setSelectedItems] = useState(defaultValue);

	// Wrap the supplied onChange to provide for local state management
	const _onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const changedValue = event.target.value;
		setSelectedItems(changedValue);
		onChange(event);
	};

	return (
		<div className={className}>
			{/* Map over the options and invoke the render call back as a React component */}
			{options.map(({ render: Render, value, expansion }) => (
				<React.Fragment key={`${value}-expansion`}>
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
				</React.Fragment>
			))}
		</div>
	);
};

export type RadioButtonGroupProps = InternalRadioButtonGroupProps & FieldSetProps;

/**
 * Component for displaying a group of related RadioButtons in a FieldSet
 */
export const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
	id,
	className,
	legend,
	showLegend,
	legendStyle,
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
			legendStyle={legendStyle}
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

export type RadioButtonGroupForFormProps<T> = InternalRadioButtonGroupProps & FormFieldSetProps<T>;
/**
 * Component for displaying a group of related radio button items in a FormFieldSet
 */
export const RadioButtonGroupForForm = <T extends object>({
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
}: RadioButtonGroupForFormProps<T>) => {
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
			childrenGroupClassName={`margin-top-3`}
		>
			<InternalRadioButtonGroup id={id} {...props} />
		</FormFieldSet>
	);
};
