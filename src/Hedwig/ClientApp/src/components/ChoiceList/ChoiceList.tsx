import React, { useState } from 'react';
import TextInput from '../TextInput/TextInput';
import FormStatus, { FormStatusProps } from '../FormStatus/FormStatus';
import FieldSet from '../FieldSet/FieldSet';
import Checkbox from '../Checklist/Checkbox';
import RadioButton from '../RadioGroup/RadioButton';

type Option = {
	text: string;
	value: string;
};

type ChoiceListProps = {
	type: 'radio' | 'check' | 'select';
	options: Option[];
	id: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => any;
	selected: string[];
	legend: string;
	status?: FormStatusProps;
	disabled?: boolean;
	className?: string;
	hint?: string;
	horizontal?: boolean;
	otherText?: string;
};

type RadioOrChecklistProps = ChoiceListProps & {
	label?: never;
};

type DropdownProps = ChoiceListProps & {
	label: string;
};

export default function ChoiceList({
	type,
	options: inputOptions,
	id,
	onChange,
	selected,
	legend,
	status,
	disabled,
	className,
	hint,
	horizontal,
	otherText,
	label,
}: RadioOrChecklistProps | DropdownProps) {
	const [showOtherTextInput, updateShowOtherTextInput] = useState(false);
	const userDefinedOnChange = onChange;
	const options = [...inputOptions];
	if (otherText !== undefined) {
		options.push({
			text: otherText,
			value: 'other',
		});
		onChange = event => {
			if (event.target.value === 'other') {
				updateShowOtherTextInput(true);
			} else {
				updateShowOtherTextInput(false);
			}
			userDefinedOnChange(event);
		};
	}

	let children: JSX.Element[] = [];
	switch (type) {
		case 'radio':
			if (selected.length > 1) {
				throw new Error('Radio group can only have one selected value at a time.');
			}
			children = options.map(option => (
				<RadioButton
					{...option}
					name={`${id}-group`}
					onChange={onChange}
					selected={selected.includes(option.value)}
				/>
			));
			break;
		case 'check':
			children = options.map(option => (
				<Checkbox
					{...option}
					name={`${id}-${option.value}`}
					onChange={onChange}
					selected={selected.includes(option.value)}
				/>
			));
			break;
		case 'select':
			const optionElements = [<option value={undefined}>- Select -</option>];
			options.forEach(option => {
				optionElements.push(
					<option value={option.value} key={`${option.value}`}>
						{option.text}
					</option>
				);
			});
			children = [
				<select
					className={`usa-select${status ? ` usa-input--${status.type}` : ''}`}
					name={id}
					id={id}
					onChange={onChange}
					disabled={disabled}
					aria-describedby={status ? status.id : undefined}
					value={selected}
				>
					{[...optionElements]}
				</select>,
			];
	}

	// TODO:
	// Write stories, incl for errors
	// Replace existing inputs

	if (options.length === 1 && !showOtherTextInput) {
		// Select has length of one
		return (
			<div className={`usa-form-group${status ? ` usa-form-group--${status.type}` : ''}`}>
				{label && <label className={`usa-label${status ? ` usa-label--${status.type}` : ''}`} htmlFor={id}>
					{label}
				</label>}
				{status && status.message && <FormStatus {...status} />}){[...children]}
			</div>
		);
	}

	return (
		<FieldSet
			legend={legend}
			status={status}
			id={id}
			aria-describedby={status ? status.id : undefined}
			className={className}
			childrenGroupClassName="margin-top-3"
			hint={hint}
		>
			<div className={horizontal ? 'grid-row flex-align-start grid-gap' : ''}>
				{[...children]}
				{showOtherTextInput && otherText != undefined && (
					// TODO: DOES THIS NEED ARIA DESCRIBED BY OR ANYTHING?
					<TextInput id={`${id}-other`} label={otherText} onChange={userDefinedOnChange} />
				)}
			</div>
		</FieldSet>
	);
}
