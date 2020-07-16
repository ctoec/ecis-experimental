import React from 'react';
import { CdcReport } from '../../../../generated';
import { Checkbox, CheckboxProps, FormField } from '@ctoec/component-library';

type AccreditedFieldProps = {
	disabled: boolean;
};
/**
 * Component for entering whether the program is accredited.
 */
export const AccreditedField: React.FC<AccreditedFieldProps> = ({ disabled }) => {
	return (
		<FormField<CdcReport, CheckboxProps, boolean>
			getValue={(data) => data.at('accredited')}
			parseOnChangeEvent={(e) => e.target.checked}
			inputComponent={Checkbox}
			id="accredited"
			text="Program accredited by NAEYC"
			disabled={disabled}
		/>
	);
};
