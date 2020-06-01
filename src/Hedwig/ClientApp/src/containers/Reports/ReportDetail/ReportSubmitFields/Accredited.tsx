import React from 'react';
import FormField from '../../../../components/Form_New/FormField';
import { CdcReport } from '../../../../generated';
import Checkbox, { CheckboxProps } from '../../../../components/Checkbox/Checkbox';

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
			text="Accredited"
			value="accredited"
			disabled={disabled}
		/>
	);
};
