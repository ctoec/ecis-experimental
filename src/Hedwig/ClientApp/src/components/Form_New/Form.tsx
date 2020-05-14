import React, { FormHTMLAttributes, PropsWithChildren, useState, useEffect } from 'react';
import { FormProvider } from './FormContext';

type FormProps<T> = {
	onSubmit: (_: T) => void
	data: T
	className: string;
} &
/**
 * Creates a set of props that includes
 * all FormHTMLAttributes<HTMLFormElement> props, except onSubmit
 */
Pick<
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

	// If data prop changes, update the internal store
	// This is exceptionally important when multiple forms track the same data
	useEffect(() => {
		updateData(data);
	}, [data]);

	/**
	 * 
	 * @param e 
	 */
	const _onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSubmit(_data);
		return false;
	};

	return (
		<FormProvider
			value={{
				data: _data,
				updateData
			}}
		>
			<form className={className} onSubmit={_onSubmit} {...props}>
				<div className="usa-form">
					{children}
				</div>
			</form>
		</FormProvider>
	)
};

export default Form;
