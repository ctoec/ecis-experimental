import React, { createContext, useEffect, useReducer, PropsWithChildren } from 'react';
import { FormReducer, formReducer, updateData, InputField } from '../../utils/forms/form';
import { HTMLChoiceElement } from '..';

export type GenericFormContextType<TData, TFieldData, TAdditionalInformation> = {
	data: TData;
	updateData: (
		_: (__: any, ___: any) => TFieldData
	) => <T extends {}>(
		event: React.ChangeEvent<HTMLChoiceElement | HTMLTextAreaElement> | InputField<T>
	) => void;
	additionalInformation: TAdditionalInformation;
};

export type FormContextType = {
	data: any;
	updateData: (
		_: (__: any, ___: any) => any
	) => <T extends {}>(
		event: React.ChangeEvent<HTMLChoiceElement | HTMLTextAreaElement> | InputField<T>
	) => void;
	additionalInformation: any;
};

export const FormContext = createContext<FormContextType>({
	data: undefined,
	updateData: () => () => {},
	additionalInformation: {},
});

export const { Provider: FormProvider, Consumer: FormConsumer } = FormContext;

type FormProps<TData> = {
	className: string;
	onSave: (_: TData) => any;
	data: TData;
	/**
	 * Allow for consumers to pass down an arbitrary collection of other information
	 */
	additionalInformation: any;
} & React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

/**
 * General purpose form component
 * Handles intermediate updates to the supplied data with a reducer
 * Accepts a onSave prop for processing data after user submits
 *
 * NOTE: Consumer must supply a submit button (see FormSubmitButton)
 * @param props
 */
const Form = <TData extends object>({
	className,
	onSave,
	data,
	additionalInformation,
	children,
	...props
}: PropsWithChildren<FormProps<TData>>) => {
	const [_data, updateFormData] = useReducer<FormReducer<TData>>(formReducer, data);
	const applyFormDataUpdate = updateData<TData>(updateFormData);

	// If data prop changes, update the internal store
	// This is exceptionally important when multiple forms track the same data
	useEffect(() => {
		updateFormData(data);
	}, [data]);

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSave(_data);
		return false;
	};

	return (
		// Context provider so each form field can access the current same data store
		<FormProvider
			value={{
				data: _data,
				updateData: applyFormDataUpdate,
				additionalInformation,
			}}
		>
			<form className={className} onSubmit={onSubmit} {...props}>
				<div className="usa-form">{children}</div>
			</form>
		</FormProvider>
	);
};

export default Form;
