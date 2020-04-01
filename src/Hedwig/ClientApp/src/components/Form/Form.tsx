import React, { createContext, useEffect, useReducer, PropsWithChildren, useState } from 'react';
import { FormReducer, formReducer, updateData } from '../../utils/forms/form';

export type GenericFormContextType<S> = {
	data: any;
	updateData: (_: any) => void;
	additionalInformation: S;
};

export type FormContextType = {
	data: any;
	updateData: (_: any) => void;
	additionalInformation: any;
};

export const FormContext = createContext<FormContextType>({
	data: undefined,
	updateData: () => {},
	additionalInformation: {},
});

export const { Provider: FormProvider, Consumer: FormConsumer } = FormContext;

type FormProps<TData> = {
	className: string;
	onSave: (_: TData) => any;
	data: TData;
	additionalInformation: any;
} & React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

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
