import React, { useState } from 'react';
import { ItemChooser, ItemChooserParentCommonProps } from '../ItemChooser/ItemChooser';
import { ItemChooserExpansion } from '../ItemChooser/ItemChooserExpansion';
import { selectOnlyChildrenOfType } from '../utils/selectOnlyChildrenOfType';
import { withOtherOptionTextInput } from '../utils/withOtherOptionTextInput';
import { StandardFormFieldSet } from '../FormComponents/StandardFormFieldSet';
import Checkbox from '../Checkbox/Checkbox';

export type CheckboxGroupProps = {
	legend?: string;
	showLegend?: boolean;
	horizontal?: boolean;
} & Pick<
	ItemChooserParentCommonProps<HTMLInputElement>,
	Exclude<keyof ItemChooserParentCommonProps<HTMLInputElement>, 'labelOrLegend'>
>;

const InternalCheckboxGroup: React.FC<CheckboxGroupProps> = ({
	id,
	className,
	legend,
	name,
	defaultValue = [],
	onChange,
	options,
	optional = false,
	status,
	hint,
	disabled = false,
	horizontal = false,
	children,
	...props
}) => {
	const selectedItemsOnInput = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
	let processedSelectedItems = selectedItemsOnInput;
	if (selectedItemsOnInput.length === 0) {
		processedSelectedItems = [''];
	}
	const [selectedItems, setSelectedItems] = useState(processedSelectedItems);

	const _onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let newSelectedItems: string[];
		const changedValue = event.target.value;
		if (selectedItems.includes(changedValue)) {
			// Uncheck a checkbox if it was already checked
			newSelectedItems = selectedItems.filter(v => v !== changedValue);
		} else {
			newSelectedItems = [...selectedItems, changedValue];
		}
		setSelectedItems(newSelectedItems);
		onChange(event);
	};

	return (
		<ItemChooser
			options={options}
			defaultValue={selectedItems}
			optionElementFactory={({ option }) => (
				<Checkbox
					id={`${id}-${option.value}`}
					{...option}
					name={option.name || name || ''}
					onChange={_onChange}
					defaultValue={selectedItems.includes(option.value)}
					disabled={disabled}
					key={`${id}-${option.value}`}
					{...props}
				/>
			)}
		>
			{selectOnlyChildrenOfType(children, ItemChooserExpansion)}
		</ItemChooser>
	);
};

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ children, ...props }) => {
	return (
		<StandardFormFieldSet
			id={`${props.id}-fieldset`}
			legend={props.legend || ''}
			showLegend={props.showLegend}
			className={props.className}
		>
			<InternalCheckboxGroup {...props}>{children}</InternalCheckboxGroup>
		</StandardFormFieldSet>
	);
};

export const CheckboxGroupWithOther = withOtherOptionTextInput({
	ItemChooserComponent: InternalCheckboxGroup,
});
