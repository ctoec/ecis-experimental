import { FormFieldSet } from '../../../../../components/Form_New/FormFieldSet';
import React from 'react';
import { initialLoadErrorGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { REQUIRED_FOR_ENROLLMENT } from '../../../../../utils/validations/messageStrings';
import { Enrollment } from '../../../../../generated';
import { AddressLine1 } from './AddressLine1';
import { AddressLine2 } from './AddressLine2';
import { Zip } from './Zip';
import { State } from './State';
import { Town } from './Town';
import { FamilyInfoFormFieldProps } from './common';

export const AddressFieldset: React.FC<FamilyInfoFormFieldProps> = ({ initialLoad }) => (
	<FormFieldSet<Enrollment>
		id="family-address"
		legend="Address"
		horizontal
		className="display-inline-block"
		status={(enrollment) =>
			initialLoadErrorGuard(
				initialLoad || false,
				displayValidationStatus([
					{
						type: 'warning',
						response: enrollment.at('child').at('family').at('validationErrors').value,
						fields: ['addressline1', 'town', 'state', 'zip'],
						message: REQUIRED_FOR_ENROLLMENT,
					},
				])
			)
		}
	>
		<div className="mobile-lg:grid-col-12">
			<AddressLine1 />
		</div>
		<div className="mobile-lg:grid-col-12">
			<AddressLine2 />
		</div>
		<div className="mobile-lg:grid-col-8 display-inline-block">
			<Town />
		</div>
		<div className="mobile-lg:grid-col-4 display-inline-block">
			<State />
		</div>
		<div className="mobile-lg:grid-col-6">
			<Zip />
		</div>
	</FormFieldSet>
);
