import React, { useState } from 'react';
import { TextInput, FormStatus, FormStatusProps, FieldSet } from '..';
import Checkbox from '../Checkbox/Checkbox';
import RadioButton from '../RadioButton/RadioButton';
import { ChoiceListExpansion } from './ChoiceListExpansion';

type Option = {
	text: string;
	value: string;
	name?: string;
};

type InternalOption = Option & {
	expansion?: JSX.Element;
};

export type HTMLChoiceElement = HTMLInputElement | HTMLSelectElement;

type InternalChoiceListProps = {
	options: Option[];
	id: string;
	name?: string;
	onChange: (
		e: React.ChangeEvent<HTMLChoiceElement>,
		selectedValues: string[],
		otherInput?: string
	) => any;
	defaultValue?: string[];
	status?: FormStatusProps;
	disabled?: boolean;
	optional?: boolean;
	className?: string;
	hint?: string;
	otherInputLabel?: string;
};

export type RadioOrChecklistProps = InternalChoiceListProps & {
	type: 'radio' | 'check';
	legend: string;
	horizontal?: boolean;
	label?: never;
	unselectedText?: never;
};

type DropdownProps = InternalChoiceListProps & {
	type: 'select';
	label: string;
	unselectedText?: string;
	horizontal?: never;
	legend?: never;
};

export type ChoiceListProps = RadioOrChecklistProps | DropdownProps;

/**
 * @deprecated
 */
export const ChoiceList: React.FC<ChoiceListProps> = ({
	type,
	options: inputOptions,
	id,
	name,
	onChange,
	defaultValue: inputSelected = [],
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
	children: expansionChildren,
}) => {
	const [selectedItems, updateSelection] = useState(inputSelected);
	const [otherInput, updateOtherInput] = useState<string | undefined>();

	let internalOptions = inputOptions as InternalOption[];
	const validTypesArray: boolean[] =
		React.Children.map(expansionChildren, (child) => {
			if (React.isValidElement(child)) {
				return !!child.type && (child.type as Function).name === ChoiceListExpansion.name;
			} else {
				throw new Error('Invalid element');
			}
		}) || [];
	const areValid = validTypesArray.reduce(
		(pendingAreValid, isValid) => pendingAreValid && isValid,
		true
	);
	if (!areValid) {
		throw new Error('One or more children are not of type ChoiceListExpansion');
	}
	const valueToExpansionChild = React.Children.toArray(expansionChildren).reduce<{
		[value: string]: JSX.Element;
	}>((acc, child) => {
		if (React.isValidElement(child)) {
			return {
				...acc,
				[child.props.showOnValue as string]: child,
			};
		} else {
			return acc;
		}
	}, {});
	internalOptions = inputOptions.map((option) => ({
		...option,
		expansion: valueToExpansionChild[option.value],
	}));

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
			newSelectedItems = selectedItems.filter((v) => v !== changedValue);
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

	const options = [...internalOptions];
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
			children = options.map((option) => {
				const expansion = option.expansion;
				return (
					<>
						<RadioButton
							{...option}
							name={option.name || name || ''}
							onChange={changeEvent}
							selected={selectedItems.includes(option.value)}
							disabled={disabled}
							// Including whether it's selected to force re-render... seems bad, but otherwise this option is not showing up as checked
							key={`${id}-${option.value}-${selectedItems.includes(option.value)}`}
						/>
						{expansion && selectedItems.includes(option.value) && (
							<div className="oec-choicelist-expansion">{expansion}</div>
						)}
					</>
				);
			});
			break;
		case 'check':
			children = options.map((option) => {
				const expansion = option.expansion;
				return (
					<>
						<Checkbox
							id={`${id}-${option.value}`}
							text={option.text}
							value={option.value}
							name={option.name || name || ''}
							onChange={changeEvent}
							defaultValue={selectedItems.includes(option.value)}
							disabled={disabled}
							key={`${id}-${option.value}`}
						/>
						{expansion && selectedItems.includes(option.value) && (
							<div className="oec-choicelist-expansion">{expansion}</div>
						)}
					</>
				);
			});
			break;
		case 'select':
			if (selectedItems.length > 1) {
				throw new Error('Dropdown can only have one selected value at a time.');
			}
			const optionElements = [
				<option key={`${id}-unselected`} value="">
					{unselectedText || '- Select -'}
				</option>,
			];
			options.forEach((option) => {
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
					name={name || ''}
					id={id}
					onChange={changeEvent}
					disabled={disabled}
					value={selectedItems[0]}
					aria-required={!optional}
					// Using aria-required to avoid default Chrome behavior
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
				className={`usa-form-group${status ? ` usa-form-group--${status.type}` : ''} ${
					className || ''
				}`}
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
				{options.map((option) => {
					const expansion = option.expansion;
					return (
						<React.Fragment key={`${option.value}-expansion`}>
							{expansion && selectedItems.includes(option.value) && (
								<div className="oec-choicelist-expansion">{option.expansion}</div>
							)}
						</React.Fragment>
					);
				})}
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
					<TextInput
						type="input"
						id={`${id}-other`}
						name={name || ''}
						label={otherInputLabel}
						onChange={changeEvent}
					/>
				)}
			</div>
		</FieldSet>
	);
};
