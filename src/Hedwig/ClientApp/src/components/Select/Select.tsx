import React, { useState, HTMLAttributes } from 'react';
import { FormStatus } from '../FormStatus/FormStatus';
import { FormFieldStatusProps } from '../FormComponents/FormFieldStatus';
import { FieldSet } from '../FieldSet/FieldSet';
import { TextInput } from '../TextInput/TextInput';
import cx from 'classnames';

type SelectOption = {
	text: string;
	value: string;
	expansion?: React.ReactNode;
};

export type SelectProps = {
	id: string;
	label: string;
	hint?: string;
	name?: string;
	defaultValue?: string;
	options: SelectOption[];
	optional?: boolean;
	unselectedText?: string;
	disabled?: boolean;
	onChange: React.ChangeEventHandler<HTMLSelectElement>;
} & Omit<HTMLAttributes<HTMLSelectElement>, 'defaultValue'> &
	FormFieldStatusProps;

/**
 * Component that wraps a native select element.
 * It also provides for expansion support by showing the expansion below the entire
 * select element.
 */
export const Select: React.FC<SelectProps> = ({
	id,
	className,
	label,
	hint,
	name,
	defaultValue = '',
	optional,
	disabled,
	onChange,
	options,
	status,
	unselectedText = '- Select -',
	...props
}) => {
	const [selectedItem, setSelectedItem] = useState(defaultValue);

	// Wrap the supplied onChange to provide for local state management
	const _onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const changedValue = event.target.value;
		setSelectedItem(changedValue);
		onChange(event);
	};

	return (
		<div
			className={cx(
				'usa-form-group',
				{
					[`usa-form-group--${status ? status.type : ''}`]: status,
				},
				className
			)}
			key={`${id}-form-group`}
		>
			{hint && <span className="usa-hint text-italic">{hint}</span>}
			<div className={!label ? 'margin-top-3' : ''}></div>
			{label && (
				<label className={`usa-label${status ? ` usa-label--${status.type}` : ''}`} htmlFor={id}>
					{label}
				</label>
			)}
			{status && status.message && <FormStatus {...status} />}
			<select
				id={id}
				key={`${id}-select`}
				className={`usa-select${status ? ` usa-input--${status.type}` : ''}`}
				name={name || ''}
				onChange={_onChange}
				value={selectedItem}
				disabled={disabled}
				// Using aria-required to avoid default Chrome behavior
				aria-required={!optional}
				aria-describedby={status ? status.id : undefined}
				aria-invalid={status && status.type === 'error'}
				{...props}
			>
				{options.map((option) => (
					<option value={option.value} key={`${id}-${option.value}`}>
						{option.text}
					</option>
				))}
				<option key={`${id}-unselected`} value="">
					{unselectedText || '- Select -'}
				</option>
			</select>
			{options.map((option) => {
				const expansion = option.expansion;
				return (
					<>
						{expansion && selectedItem === option.value && (
							<div className="oec-itemchooser-expansion">{option.expansion}</div>
						)}
					</>
				);
			})}
		</div>
	);
};

type OtherOptionTextInputWrapperProps<T> = {
	legend: string;
	showLegend?: boolean;
	hint?: string;
	optional?: boolean;
	otherInputLabel: string;
	otherInputOnChange: React.ChangeEventHandler;
	otherOptionDisplay: string;
	horizontal?: boolean;
	innerLabel: string;
} & Omit<T, 'label' | 'legend'>;

/**
 * Wraps a Select element in a FieldSet and provides a text input when the user
 * selects "Other"
 */
export const SelectWithOther: React.FC<OtherOptionTextInputWrapperProps<SelectProps>> = ({
	id,
	legend,
	showLegend,
	innerLabel,
	className,
	name,
	hint,
	defaultValue = [],
	optional,
	horizontal = false,
	otherInputLabel,
	otherInputOnChange,
	otherOptionDisplay,
	onChange,
	status,
	options,
	children,
	...props
}) => {
	const OTHER_VALUE = '__other';

	const selectedItemOnInput = Array.isArray(defaultValue) ? defaultValue[0] : defaultValue;
	const [showOther, setShowOther] = useState(selectedItemOnInput === OTHER_VALUE);

	const optionsWithOther = [
		...options,
		{
			text: otherOptionDisplay,
			value: OTHER_VALUE,
		},
	];

	const _onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const changedValue = (e.target as any).value;
		if (changedValue === OTHER_VALUE) {
			setShowOther(true);
		} else {
			setShowOther(false);
		}
		onChange(e);
	};

	const selectElement = (
		<Select
			id={id}
			label={innerLabel}
			defaultValue={selectedItemOnInput}
			status={status}
			onChange={_onChange}
			options={optionsWithOther}
			{...props}
		/>
	);

	return (
		<>
			{showOther ? (
				<FieldSet
					id={`${id}-fieldset`}
					className={className}
					legend={legend}
					showLegend={showLegend}
					status={status}
					aria-describedby={status ? status.id : undefined}
					childrenGroupClassName="margin-top-3"
					hint={hint}
					optional={optional}
					horizontal={horizontal}
				>
					{selectElement}
					<TextInput
						type="input"
						id={`${id}-other`}
						name={name || ''}
						label={otherInputLabel}
						onChange={otherInputOnChange}
					/>
				</FieldSet>
			) : (
				selectElement
			)}
		</>
	);
};
