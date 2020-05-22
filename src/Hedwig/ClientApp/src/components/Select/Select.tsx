import React, { useState } from 'react';
import { ItemChooser, ItemChooserParentCommonProps } from '../ItemChooser/ItemChooser';
import cx from 'classnames';
import { FormStatus } from '../FormStatus/FormStatus';
import { ItemChooserExpansion } from '../ItemChooser/ItemChooserExpansion';
import { selectOnlyChildrenOfType } from '../utils/selectOnlyChildrenOfType';
import { withOtherOptionTextInput } from '../utils/withOtherOptionTextInput';

export type SelectProps = {
	label?: string;
	unselectedText?: string;
} & Pick<
	ItemChooserParentCommonProps<HTMLSelectElement>,
	Exclude<keyof ItemChooserParentCommonProps<HTMLSelectElement>, 'labelOrLegend'>
>;

export const Select: React.FC<SelectProps> = ({
	id,
	className,
	label,
	name,
	defaultValue = [],
	onChange,
	options,
	optional = false,
	status,
	hint,
	unselectedText = '- Select -',
	children,
	...props
}) => {
	const selectedItemsOnInput = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
	let processedSelectedItems = selectedItemsOnInput;
	if (selectedItemsOnInput.length === 0) {
		processedSelectedItems = [''];
	}
	const [selectedItems, setSelectedItems] = useState(processedSelectedItems);

	const _onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const changedValue = event.target.value;
		const newSelectedItems = [changedValue];
		setSelectedItems(newSelectedItems);
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
			<ItemChooser
				options={options}
				defaultValue={selectedItems}
				optionElementFactory={({ option }) => (
					<option value={option.value} key={`${id}-${option.value}`}>
						{option.text}
					</option>
				)}
				optionElementContainerFactory={({ children: _children }) => (
					<select
						id={id}
						key={`${id}-select`}
						className={`usa-select${status ? ` usa-input--${status.type}` : ''}`}
						name={name || ''}
						onChange={_onChange}
						value={selectedItems[0]}
						// Using aria-required to avoid default Chrome behavior
						aria-required={!optional}
						aria-describedby={status ? status.id : undefined}
						aria-invalid={status && status.type === 'error'}
						{...props}
					>
						<option key={`${id}-unselected`} value="">
							{unselectedText || '- Select -'}
						</option>
						{_children}
					</select>
				)}
				useExpansionOnContainerElement={true}
			>
				{selectOnlyChildrenOfType(children, ItemChooserExpansion)}
			</ItemChooser>
		</div>
	);
};

export const SelectWithOther = withOtherOptionTextInput({
	ItemChooserComponent: Select,
});
