import React, { PropsWithChildren } from 'react';
import FormContext, { useGenericContext } from './FormContext';
import { FieldSetProps, FieldSet } from '../FieldSet/FieldSet';
import { FormStatusProps } from '../FormStatus/FormStatus';
import { TObjectDriller, ObjectDriller } from './ObjectDriller';

type FormFieldSetProps<TData> = {
	status?: (_: TObjectDriller<NonNullable<TData>>) => FormStatusProps | undefined;
} & Pick<FieldSetProps, Exclude<keyof FieldSetProps, 'status'>>;

/**
 * Generic fieldset component for use within a Form.
 * FormFieldSet has an optional status function, which
 * determines fieldset status based on the form data,
 * to which this FormFieldSet has access via the FormContext.
 */
export const FormFieldSet = <TData extends object>({
	status = () => undefined,
	children,
	...props
}: PropsWithChildren<FormFieldSetProps<TData>>) => {
	const { data } = useGenericContext<TData>(FormContext);
	const dataDriller = (new ObjectDriller(data) as unknown) as TObjectDriller<NonNullable<TData>>;

	return (
		<FieldSet status={status(dataDriller)} {...props}>
			{children}
		</FieldSet>
	);
};
