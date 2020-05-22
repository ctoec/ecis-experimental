import React, { useState } from 'react';
import { ItemChooser, ItemChooserParentCommonProps } from '../ItemChooser/ItemChooser';
import { ItemChooserExpansion } from '../ItemChooser/ItemChooserExpansion';
import { selectOnlyChildrenOfType } from '../utils/selectOnlyChildrenOfType';
import { withOtherOptionTextInput } from '../utils/withOtherOptionTextInput';
import { StandardFormFieldSet } from '../FormComponents/StandardFormFieldSet';
import RadioButton from '../RadioButton/RadioButton';

export type RadioButtonGroupProps = {
	legend?: string;
	showLegend?: boolean;
	horizontal?: boolean;
} & Pick<
	ItemChooserParentCommonProps<HTMLInputElement>,
	Exclude<keyof ItemChooserParentCommonProps<HTMLInputElement>, 'labelOrLegend'>
>;

const InternalRadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
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
		const changedValue = event.target.value;
		const newSelectedItems = [changedValue];
		setSelectedItems(newSelectedItems);
		onChange(event);
	};

	return (
		<ItemChooser
			options={options}
			defaultValue={selectedItems}
			optionElementFactory={({ option }) => (
				<RadioButton
					{...option}
					name={option.name || name || ''}
					onChange={_onChange}
					selected={selectedItems.includes(option.value)}
					disabled={disabled}
					// Including whether it's selected to force re-render... seems bad, but otherwise this option is not showing up as checked
					key={`${id}-${option.value}-${selectedItems.includes(option.value)}`}
					{...props}
				/>
			)}
		>
			{selectOnlyChildrenOfType(children, ItemChooserExpansion)}
		</ItemChooser>
	);
};

export const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({ children, ...props }) => {
	return (
		<StandardFormFieldSet
			id={`${props.id}-fieldset`}
			legend={props.legend || ''}
			showLegend={props.showLegend}
			className={props.className}
		>
			<InternalRadioButtonGroup {...props}>{children}</InternalRadioButtonGroup>
		</StandardFormFieldSet>
	);
};

export const RadioButtonGroupWithOther = withOtherOptionTextInput({
	ItemChooserComponent: InternalRadioButtonGroup,
});
