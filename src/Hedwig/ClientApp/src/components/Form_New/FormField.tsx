import React, { PropsWithChildren } from 'react';
import FormContext, { useGenericContext } from './FormContext';
import produce from 'immer';
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import { ObjectDriller } from './ObjectDriller';

type FormFieldProps<TData, TComponentProps, TFieldData> = {
		defaultValue?: TFieldData;
		getValue: (_: ObjectDriller<TData>) => ObjectDriller<TFieldData>;
		preprocessForDisplay?: (_: TFieldData | undefined) => TFieldData | JSX.Element | string | undefined;
		parseOnChangeEvent: (event: React.ChangeEvent<any>, data: ObjectDriller<TData>) => TFieldData;
		inputComponent: React.FC<TComponentProps>;
	}
	// TODO: Make this props a first order citizen
	& {
		props: Pick<
			TComponentProps,
			Exclude<keyof TComponentProps, 'onChange' | 'defaultValue'>
		>
	};

/**
 * Generic form input field component that handles simple use cases, 
 * where the data displayed in the field and updated by the user maps
 * directly to the necessary updates to form data state.
 * 
 * For complex use cases (e.g. adding or removing array element), 
 * custom form field components should be created
 */
const FormField = <TData extends object, TComponentProps, TFieldData>({
	getValue,
	defaultValue,
	preprocessForDisplay,
	parseOnChangeEvent,
	inputComponent: InputComponent,
	props,
	children
}: PropsWithChildren<FormFieldProps<TData, TComponentProps, TFieldData >>) => {
	const { data, updateData } = useGenericContext<TData>(FormContext);

	const pathAccessibleData = new ObjectDriller(data);
	const accessor = getValue(pathAccessibleData);
	const value = accessor.value;
	const updatePath = accessor.path;

	const onChange = (e: React.ChangeEvent<any>) => {
		const processedData = parseOnChangeEvent(e, pathAccessibleData);
		updateData(produce<TData>(
			data, draft => set(draft, updatePath, processedData)
		));
	};

	const displayValue = value != null // checks null and undefined
		? value : defaultValue;
	return (
		/**
		 * Type '{ defaultValue: string | Element | TFieldData | undefined; onChange: (e: ChangeEvent<any>) => void; } & Pick<TComponentProps, Exclude<...>> & { ...; }' is not assignable to type 'IntrinsicAttributes & TComponentProps & { children?: ReactNode; }'.
		 * Type '{ defaultValue: string | Element | TFieldData | undefined; onChange: (e: ChangeEvent<any>) => void; } & Pick<TComponentProps, Exclude<...>> & { ...; }' is not assignable to type 'TComponentProps'.
		 * '{ defaultValue: string | Element | TFieldData | undefined; onChange: (e: ChangeEvent<any>) => void; } & Pick<TComponentProps, Exclude<...>> & { ...; }' is assignable to the constraint of type 'TComponentProps', but 'TComponentProps' could be instantiated with a different subtype of constraint '{}'.
		 */
		// @ts-ignore
		<InputComponent
			defaultValue={
				preprocessForDisplay ? preprocessForDisplay(displayValue) : displayValue
			}
			onChange={onChange}
			{...props}
		>
			{children}
		</InputComponent>
	);
}

export default FormField;
