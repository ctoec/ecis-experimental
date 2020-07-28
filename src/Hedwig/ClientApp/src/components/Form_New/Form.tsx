import React, { FormHTMLAttributes, PropsWithChildren, useState, useEffect } from 'react';
import { FormProvider } from './FormContext';
import { ObjectDriller } from './ObjectDriller';

type FormProps<T> = {
	onSubmit: (_: T) => void;
	data: T;
	className: string;
} & /**
 * Creates a set of props that includes
 * all FormHTMLAttributes<HTMLFormElement> props, except onSubmit
 */ Pick<
	FormHTMLAttributes<HTMLFormElement>,
	Exclude<keyof FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>
>;

/**
 * Generic form component for updating an object of type T.
 * The form tracks state of the object, and requires the use of a
 * 'submit' button (should be a FormSubmitButton)
 */
const Form = <T extends any>({
	className,
	onSubmit,
	data,
	children,
	...props
}: PropsWithChildren<FormProps<T>>) => {
	const [_data, updateData] = useState(data);

	// If data prop changes, update the internal store as multiple forms can track the same data
	useEffect(() => {
		updateData(data);
	}, [data]);

	/**
	 * onSubmit function to supply to the form. The form event
	 * default is suppressed, and the Form component's onSubmit
	 * function is called with the form data as an argument.
	 * @param e FormEvent
	 */
	const _onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSubmit(_data);
	};

	return (
		<FormProvider
			value={{
				data: _data,
				dataDriller: new ObjectDriller(_data),
				updateData,
			}}
		>
			<form className={className} onSubmit={_onSubmit} {...props}>
				{children}
			</form>
		</FormProvider>
	);
};

export default Form;
