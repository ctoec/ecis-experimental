import React from 'react';
import { Enrollment } from '../../../../../generated';
import { ChildInfoFormFieldProps } from './common';
import { initialLoadErrorGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { REQUIRED_FOR_OEC_REPORTING } from '../../../../../utils/validations/messageStrings';
import { FormFieldSet } from '../../../../../components/Form_New/FormFieldSet';
import { BirthCertificateIdField } from './BirthCertificateId';
import { BirthTownField } from './BirthTown';
import { BirthStateField } from './BirthState';

/**
 * Component that wraps BirthCertificateId, BirthTown, and BirthState in a fieldset.
 */
export const BirthCertificateFormFieldSet: React.FC<ChildInfoFormFieldProps> = ({
	errorDisplayGuard: initialLoad,
}) => {
	return (
		<FormFieldSet<Enrollment>
			id="birth-certificate-fields"
			legend="Birth certificate"
			className="display-inline-block"
			status={(enrollment) =>
				initialLoadErrorGuard(
					initialLoad || false,
					displayValidationStatus([
						{
							type: 'warning',
							response: enrollment.at('child').at('validationErrors').value || null,
							fields: ['birthCertificateId', 'birthState', 'birthTown'],
							message: REQUIRED_FOR_OEC_REPORTING,
						},
					])
				)
			}
		>
			<div className="mobile-lg:grid-col-12">
				<BirthCertificateIdField errorDisplayGuard={initialLoad} />
			</div>
			<div className="mobile-lg:grid-col-8 display-inline-block">
				<BirthTownField errorDisplayGuard={initialLoad} />
			</div>
			<div className="mobile-lg:grid-col-4 display-inline-block">
				<BirthStateField errorDisplayGuard={initialLoad} />
			</div>
		</FormFieldSet>
	);
};
