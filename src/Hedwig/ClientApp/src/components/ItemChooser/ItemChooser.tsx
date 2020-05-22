import React, { HTMLAttributes } from 'react';
import { ItemChooserExpansion } from './ItemChooserExpansion';
import { FormFieldStatusProps } from '../FormComponents/FormFieldStatus';

export type Option = {
	text: string;
	value: string;
	name?: string;
};

type InternalOption = Option & {
	expansion?: JSX.Element;
};

export type ItemChooserParentCommonProps<T extends HTMLElement> = {
	id: string;
	labelOrLegend: string;
	options: Option[];
	name?: string;
	optional?: boolean;
	hint?: string;
	disabled?: boolean;
	onChange: React.ChangeEventHandler<T>;
} & Pick<HTMLAttributes<T>, Exclude<keyof HTMLAttributes<T>, 'id' | 'onChange'>> &
	FormFieldStatusProps;

type ItemChooserProps = {
	options: Option[];
	optionElementFactory: (props: { option: Option }) => JSX.Element;
	optionElementContainerFactory?: (props: { children: any }) => JSX.Element;
	defaultValue: string[];
	useExpansionOnContainerElement?: boolean;
};

export const ItemChooser: React.FC<ItemChooserProps> = ({
	options,
	optionElementFactory,
	optionElementContainerFactory,
	defaultValue: selectedItems,
	useExpansionOnContainerElement = false,
	children,
}) => {
	let internalOptions = options as InternalOption[];
	const validTypesArray: boolean[] =
		React.Children.map(children, child => {
			if (React.isValidElement(child)) {
				return !!child.type && (child.type as Function).name === ItemChooserExpansion.name;
			} else {
				throw new Error('Invalid element');
			}
		}) || [];
	const areValid = validTypesArray.reduce(
		(pendingAreValid, isValid) => pendingAreValid && isValid,
		true
	);
	if (!areValid) {
		throw new Error('One or more children are not of type ItemChooserExpansion');
	}
	const valueToExpansionChild = React.Children.toArray(children).reduce<{
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
	internalOptions = options.map(option => ({
		...option,
		expansion: valueToExpansionChild[option.value],
	}));

	let innerChildren = internalOptions.map<JSX.Element>(option => {
		const { expansion } = option;
		return (
			<>
				{optionElementFactory({ option })}
				{!useExpansionOnContainerElement && expansion && selectedItems.includes(option.value) && (
					<div className="oec-itemchooser-expansion">{expansion}</div>
				)}
			</>
		);
	});

	const preDisplay = optionElementContainerFactory
		? optionElementContainerFactory({
				children: innerChildren,
		  })
		: innerChildren;

	let display = Array.isArray(preDisplay) ? <>{[...preDisplay]}</> : preDisplay;

	if (useExpansionOnContainerElement) {
		display = (
			<>
				{display}
				{internalOptions.map(option => {
					const expansion = option.expansion;
					return (
						<>
							{expansion && selectedItems.includes(option.value) && (
								<div className="oec-itemchooser-expansion">{option.expansion}</div>
							)}
						</>
					);
				})}
			</>
		);
	}

	return display;
};
