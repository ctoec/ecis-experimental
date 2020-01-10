import React, { useState } from 'react';
import TextInput from '../TextInput/TextInput';
import FormStatus, { FormStatusProps } from '../FormStatus/FormStatus';
import FieldSet from '../FieldSet/FieldSet';
import Checkbox from './Checkbox';
import RadioButton from './RadioButton';

type Option = {
	text: string;
	value: string;
};

type ChoiceListProps = {
	options: Option[];
	id: string;
	onChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
		selectedValues: string[],
		otherInput?: string
	) => any;
	selected?: string[];
	status?: FormStatusProps;
	disabled?: boolean;
	className?: string;
	hint?: string;
	otherInputLabel?: string;
};

type RadioOrChecklistProps = ChoiceListProps & {
	type: 'radio' | 'check';
	legend: string;
	label?: never;
	horizontal?: boolean;
};

type DropdownProps = ChoiceListProps & {
	type: 'select';
	label: string;
	horizontal?: never;
	legend?: never;
};

export default function ChoiceList({
	type,
	options: inputOptions,
	id,
	onChange,
	selected = [],
	legend,
	status,
	disabled,
	className,
	hint,
	horizontal,
	otherInputLabel,
	label,
}: RadioOrChecklistProps | DropdownProps) {
	const [selectedItems, updateSelection] = useState(selected);
	const [otherInput, updateotherInput] = useState();

	const changeEvent = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const changedValue = event.target.value;
		if (event.target.type === 'text') {
			updateotherInput(changedValue);
			onChange(event, selectedItems, changedValue);
			return;
		}
		let newSelectedItems: string[];
		if (selectedItems.includes(changedValue)) {
			newSelectedItems = selectedItems.filter(v => v !== changedValue);
		} else if (type === 'check') {
			newSelectedItems = [changedValue, ...selectedItems];
		} else {
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
					- Select -
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
					aria-describedby={status ? status.id : undefined}
					value={selectedItems[0]}
				>
					{[...optionElements]}
				</select>,
			];
	}

	// TODO:
	// Replace existing inputs

	if (children.length === 1) {
		const singletonInput = (
			<div
				className={`usa-form-group${status ? ` usa-form-group--${status.type}` : ''}${!label ? ' margin-top-3' : ''}`}
				key={`${id}-form-group`}
			>
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
