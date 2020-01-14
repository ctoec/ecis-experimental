import React, { useState } from 'react';
import { TextInput, FormStatus, FormStatusProps, FieldSet } from '..';
import Checkbox from './Checkbox';
import RadioButton from './RadioButton';

type Option = {
	text: string;
	value: string;
};

type HTMLChoiceElement = HTMLInputElement | HTMLSelectElement;

type ChoiceListProps = {
	options: Option[];
	id: string;
	onChange: (
		e: React.ChangeEvent<HTMLChoiceElement>,
		selectedValues: string[],
		otherInput?: string
	) => any;
	selected?: string[];
	status?: FormStatusProps;
	disabled?: boolean;
	optional?: boolean;
	className?: string;
	hint?: string;
	otherInputLabel?: string;
};

type RadioOrChecklistProps = ChoiceListProps & {
	type: 'radio' | 'check';
	legend: string;
	horizontal?: boolean;
	label?: never;
	unselectedText?: never;
};

type DropdownProps = ChoiceListProps & {
	type: 'select';
	label: string;
	unselectedText?: string;
	horizontal?: never;
	legend?: never;
};

export function ChoiceList({
	type,
	options: inputOptions,
	id,
	onChange,
	selected = [],
	legend,
	status,
	disabled,
	optional,
	className,
	hint,
	horizontal,
	otherInputLabel,
	label,
	unselectedText,
}: RadioOrChecklistProps | DropdownProps) {
	const [selectedItems, updateSelection] = useState(selected);
	const [otherInput, updateOtherInput] = useState();

	const changeEvent = (event: React.ChangeEvent<HTMLChoiceElement>) => {
		const changedValue = event.target.value;
		if (event.target.type === 'text') {
			// If it's the other text input box
			updateOtherInput(changedValue);
			// Do whatever the dev wants done when things change
			onChange(event, selectedItems, changedValue);
			return;
		}
		let newSelectedItems: string[];
		if (selectedItems.includes(changedValue)) {
			// Uncheck a checkbox if it was already checked
			newSelectedItems = selectedItems.filter(v => v !== changedValue);
		} else if (type === 'check') {
			// If it wasn't already selected and it's a checkbox, add it to whatever else is selected
			newSelectedItems = [changedValue, ...selectedItems];
		} else {
			// If it's a radio or dropdown, only this value is selected now
			newSelectedItems = [changedValue];
		}
		updateSelection(newSelectedItems);
		onChange(event, newSelectedItems, otherInput);
	};

	const options = [...inputOptions];
	if (otherInputLabel !== undefined) {
		options.push({
			text: otherInputLabel,
			value: 'other',
		});
	}

	const showotherInput = selectedItems.includes('other');
	let children: JSX.Element[] = [];

	switch (type) {
		case 'radio':
			if (selectedItems.length > 1) {
				throw new Error('Radio group can only have one selected value at a time.');
			}
			children = options.map(option => (
				<RadioButton
					{...option}
					name={`${id}-group`}
					onChange={changeEvent}
					selected={selectedItems.includes(option.value)}
					key={`${id}-${option.value}`}
				/>
			));
			break;
		case 'check':
			children = options.map(option => (
				<Checkbox
					{...option}
					name={`${id}-${option.value}`}
					onChange={changeEvent}
					selected={selectedItems.includes(option.value)}
					key={`${id}-${option.value}`}
				/>
			));
			break;
		case 'select':
			if (selectedItems.length > 1) {
				throw new Error('Dropdown can only have one selected value at a time.');
			}
			const optionElements = [
				<option key={`${id}-unselected`} value={undefined}>
					{unselectedText || '- Select -'}
				</option>,
			];
			options.forEach(option => {
				optionElements.push(
					<option value={option.value} key={`${id}-${option.value}`}>
						{option.text}
					</option>
				);
			});
			children = [
				<select
					key={`${id}-select`}
					className={`usa-select${status ? ` usa-input--${status.type}` : ''}`}
					name={id}
					id={id}
					onChange={changeEvent}
					disabled={disabled}
					value={selectedItems[0]}
					required={!optional}
					aria-describedby={status ? status.id : undefined}
					aria-invalid={status && status.type === 'error'}
				>
					{[...optionElements]}
				</select>,
			];
	}

	if (children.length === 1) {
		const singletonInput = (
			<div
				className={`usa-form-group${status ? ` usa-form-group--${status.type}` : ''}`}
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
				{[...children]}
			</div>
		);
		if (!showotherInput) {
			return singletonInput;
		}
		children = [singletonInput];
	}

	return (
		<FieldSet
			// Will never actually be undefined
			legend={legend || label || ''}
			status={status}
			id={`${id}-fieldset`}
			aria-describedby={status ? status.id : undefined}
			className={className}
			childrenGroupClassName="margin-top-3"
			hint={hint}
			optional={optional}
		>
			<div className={horizontal ? 'grid-row flex-align-start grid-gap' : ''}>
				{[...children]}
				{showotherInput && otherInputLabel !== undefined && (
					<TextInput id={`${id}-other`} label={otherInputLabel} onChange={changeEvent} />
				)}
			</div>
		</FieldSet>
	);
}
