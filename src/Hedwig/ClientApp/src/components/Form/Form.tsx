import React, { createContext, useReducer, PropsWithChildren } from 'react';
import { Button } from '..';
import { FormReducer, formReducer, updateData } from '../../utils/forms/form';

type FormContextType = {
	data: any;
	updateData: (_: any) => void;
};

export const FormContext = createContext<FormContextType>({
	data: undefined,
	updateData: () => {},
});

export const { Provider: FormProvider, Consumer: FormConsumer } = FormContext;

type FormProps<TData> = {
	className: string;
	onSave: (_: TData) => any;
	data: TData;
};

const Form = <TData extends object>({
	className,
	onSave,
	data,
	children,
}: PropsWithChildren<FormProps<TData>>) => {
	const [_data, updateFormData] = useReducer<FormReducer<TData>>(formReducer, data);
	const applyFormDataUpdate = updateData<TData>(updateFormData);

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
			}}
		>
			<form className={className} onSubmit={onSubmit} noValidate autoComplete="off">
				<div className="usa-form">
					{children}
					{/* <Button text={isMutating ? 'Saving...' : 'Save'} onClick="submit" disabled={isMutating} /> */}
					<Button text={'Save'} onClick="submit" />
				</div>
			</form>
		</FormProvider>
	);
};

export default Form;
