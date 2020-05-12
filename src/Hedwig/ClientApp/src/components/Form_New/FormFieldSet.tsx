import React, { PropsWithChildren } from 'react';
import FormContext, { useGenericContext } from './FormContext';
import { FieldSetProps, FieldSet } from '../FieldSet/FieldSet';
import { FormStatusProps } from '../FormStatus/FormStatus';

type FormFieldSetProps<TData> = {
	status: (_: TData) => FormStatusProps | undefined
} & Pick<
	FieldSetProps,
	Exclude<keyof FieldSetProps, 'status'>
>;
export const FormFieldSet = <TData extends object>({
	status,
	children,
	...props
}: PropsWithChildren<FormFieldSetProps<TData>>) => {
	const { data } = useGenericContext<TData>(FormContext);

	return (
		<FieldSet
			status={status(data)}
			{...props}
		>
			{children}
		</FieldSet>
	);
}