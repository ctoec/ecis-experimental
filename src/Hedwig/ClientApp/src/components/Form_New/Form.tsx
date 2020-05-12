import React, { FormHTMLAttributes, PropsWithChildren, useState, useEffect } from 'react';
import { FormProvider } from './FormContext';

type FormProps<T> = {
	onSubmit: (_: T, e?: React.FormEvent<HTMLFormElement>) => void
	data: T
	className: string;
} & Pick<
	FormHTMLAttributes<HTMLFormElement>,
	Exclude<keyof FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>
>;

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

	const _onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSubmit(_data, e);
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