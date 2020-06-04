import React, { useState, HTMLAttributes } from 'react';
import { FormStatus, FormStatusProps } from '../FormStatus/FormStatus';
import { FieldSet, FieldSetProps } from '../FieldSet/FieldSet';
import cx from 'classnames';
import { FormFieldSetProps, FormFieldSet } from '../Form_New';

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
	status?: FormStatusProps;
} & Omit<HTMLAttributes<HTMLSelectElement>, 'defaultValue' | 'onChange'>;

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
					[`usa-form-group--${status && status.type}`]: status,
				},
				className
			)}
			key={`${id}-form-group`}
		>
			{hint && <span className="usa-hint text-italic">{hint}</span>}
			<div className={cx({ 'margin-top-3': !label })}></div>
			{label && (
				<label
					className={cx('usa-label', { [`usa-label--${status && status.type}`]: status })}
					htmlFor={id}
				>
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
				<option key={`${id}-unselected`} value="">
					{unselectedText || '- Select -'}
				</option>
				{options.map((option) => (
					<option value={option.value} key={`${id}-${option.value}-option`}>
						{option.text}
					</option>
				))}
			</select>
			{options.map((option) => {
				const expansion = option.expansion;
				return (
					<React.Fragment key={`${id}-${option.value}-expansion`}>
						{expansion && selectedItem === option.value && (
							<div className="oec-itemchooser-expansion">{option.expansion}</div>
						)}
					</React.Fragment>
				);
			})}
		</div>
	);
};

/**
 * Props for an other option text input wrapped component of type TWrapped,
 * including props for TWrapped
 */
type OtherOptionTextInputWrapperProps<TWrapped> = {
	legend: string;
	showLegend?: boolean;
	hint?: string;
	optional?: boolean;
	otherInputLabel: string;
	otherInputOnChange: React.ChangeEventHandler;
	otherOptionDisplay: string;
	horizontal?: boolean;
	labelForSelect: string;
} & Omit<TWrapped, 'label' | 'legend'>;

/**
 * Wraps a Select element in a FieldSet and provides a text input when the user
 * selects "Other"
 */
export const SelectWithOther: React.FC<OtherOptionTextInputWrapperProps<SelectProps>> = ({
	id,
	labelForSelect,
	name,
	defaultValue = '',
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

	const [showOther, setShowOther] = useState(defaultValue === OTHER_VALUE);

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
			label={labelForSelect}
			defaultValue={defaultValue}
			status={status}
			onChange={_onChange}
			options={optionsWithOther}
			{...props}
		/>
	);

	if (showOther) {
		const useFormFieldSet = (props as unknown) as FormFieldSetProps<any>;
		if (useFormFieldSet) {
			const formFieldSetProps = (props as unknown) as FormFieldSetProps<any>;
			return <FormFieldSet {...formFieldSetProps}>{selectElement}</FormFieldSet>;
		}

		const fieldSetProps = (props as unknown) as FieldSetProps;
		return <FieldSet {...fieldSetProps}>{selectElement}</FieldSet>;
	}

	return selectElement;
};
