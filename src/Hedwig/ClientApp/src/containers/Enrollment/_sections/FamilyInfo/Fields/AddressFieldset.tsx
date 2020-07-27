import React from 'react';
import { errorDisplayGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { REQUIRED_FOR_ENROLLMENT } from '../../../../../utils/validations/messageStrings';
import { Enrollment } from '../../../../../generated';
import { AddressLine1 } from './AddressLine1';
import { AddressLine2 } from './AddressLine2';
import { Zip } from './Zip';
import { State } from './State';
import { Town } from './Town';
import { FamilyInfoFormFieldProps } from './common';
import { FormFieldSet } from '@ctoec/component-library';

export const AddressFieldset: React.FC<FamilyInfoFormFieldProps> = ({
	blockErrorDisplay = false,
}) => (
	<FormFieldSet<Enrollment>
		id="family-address"
		legend="Address"
		horizontal
		className="display-inline-block"
		status={(enrollment) =>
			errorDisplayGuard(
				blockErrorDisplay,
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
			<AddressLine1 blockErrorDisplay={blockErrorDisplay} />
		</div>
		<div className="mobile-lg:grid-col-12">
			<AddressLine2 />
		</div>
		<div className="grid-row grid-gap">
			<div className="mobile-lg:grid-col-8 display-inline-block">
				<Town blockErrorDisplay={blockErrorDisplay} />
			</div>
			<div className="mobile-lg:grid-col-4 display-inline-block">
				<State blockErrorDisplay={blockErrorDisplay} />
			</div>
		</div>
		<div className="mobile-lg:grid-col-6">
			<Zip blockErrorDisplay={blockErrorDisplay} />
		</div>
	</FormFieldSet>
);
