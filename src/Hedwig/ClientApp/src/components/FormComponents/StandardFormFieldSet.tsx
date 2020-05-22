import React from 'react';
import { FieldSetProps, FieldSet } from '../FieldSet/FieldSet';

type StandardFormFieldSetProps = {
	horizontal?: boolean;
} & Pick<FieldSetProps, Exclude<keyof FieldSetProps, 'childrenGroupClassName'>>;

export const StandardFormFieldSet: React.FC<StandardFormFieldSetProps> = ({
	id,
	status,
	horizontal,
	children,
	...props
}) => {
	return (
		<FieldSet
			id={`${id}-fieldset`}
			status={status}
			aria-describedby={status ? status.id : undefined}
			childrenGroupClassName="margin-top-3"
			{...props}
		>
			<div className={horizontal ? 'grid-row flex-align-start grid-gap' : ''}>{children}</div>
		</FieldSet>
	);
};
