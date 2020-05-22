import React, { useState } from 'react';
import { FieldSet, TextInput } from '..';
import { ItemChooserParentCommonProps } from '../ItemChooser/ItemChooser';

type OtherOptionTextInputWrapperProps<T> = {
	legend: string;
	showLegend?: boolean;
	otherInputLabel: string;
	otherInputOnChange: React.ChangeEventHandler;
	otherOptionDisplay: string;
	horizontal?: boolean;
} & 
Pick<
	T,
	Exclude<keyof T, 'label' | 'legend' | 'labelOrLegend'>
> & {
	innerLabelOrLegend: string;
};

export function withOtherOptionTextInput<
	TElement extends HTMLElement,
	T extends ItemChooserParentCommonProps<TElement>
>({ ItemChooserComponent } : 
	T extends ItemChooserParentCommonProps<TElement> ?
	{	ItemChooserComponent: React.FC<T>} : 
	never
):
React.FC<OtherOptionTextInputWrapperProps<T>> {
	return ({
		id,
		legend,
		showLegend,
		innerLabelOrLegend,
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
	}: OtherOptionTextInputWrapperProps<
		ItemChooserParentCommonProps<TElement>
	>) => {
		const OTHER_VALUE = '__other';

		const selectedItemsOnInput = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
		const [showOther, setShowOther] = useState(selectedItemsOnInput[0] === OTHER_VALUE);

		const optionsWithOther = [
			...options,
			{
				text: otherOptionDisplay,
				value: OTHER_VALUE,
			}
		];

		const _onChange = (e: React.ChangeEvent<TElement>) => {
			const changedValue = (e.target as any).value;
			if (changedValue === OTHER_VALUE) {
				setShowOther(true);
			} else {
				setShowOther(false);
			}
			onChange(e);
		}

		return (
			<FieldSet
				id={`${id}-fieldset`}	
				className={className}
				legend={legend || ''}
				showLegend={showLegend}
				status={status}
				aria-describedby={status ? status.id : undefined}
				childrenGroupClassName="margin-top-3"
				hint={hint}
				optional={optional}
			>
				<div className={horizontal ? 'grid-row flex-align-start grid-gap' : ''}>
					<ItemChooserComponent
						id={id}
						labelOrLegend={innerLabelOrLegend}
						className={className}
						optional={optional}
						defaultValue={selectedItemsOnInput}
						status={status}
						options={optionsWithOther}
						onChange={_onChange}
						{...props}
					>
						{children}
					</ItemChooserComponent>
					{showOther && <TextInput
						type="input"
						id={`${id}-other`}
						name={name || ''}
						label={otherInputLabel}
						onChange={otherInputOnChange}
					/>}
				</div>
			</FieldSet>
		);
	}
}