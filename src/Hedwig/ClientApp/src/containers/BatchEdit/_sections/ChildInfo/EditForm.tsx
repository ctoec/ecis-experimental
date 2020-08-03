import React from 'react';
import { Enrollment } from '../../../../generated';
import { hasValidationErrors } from '../../../../utils/validations';
import {
	DateOfBirthField,
	BirthCertificateFormFieldSet,
	RaceField,
	GenderField,
	EthnicityField,
} from '../../../Enrollment/_sections/ChildInfo/Fields';
import { BatchEditStepProps } from '../batchEditTypes';
import { Form } from '../../../../components/Form_New';
import { Button, FormSubmitButton } from '@ctoec/component-library';

export const EditForm: React.FC<BatchEditStepProps> = ({ enrollment, onSubmit, onSkip }) => {
	return (
		<Form<Enrollment>
			className="usa-form"
			data={enrollment}
			onSubmit={onSubmit}
			noValidate
			autoComplete="off"
		>
			{hasValidationErrors(enrollment.child, ['birthdate']) && (
				<>
					<h4>Date of Birth</h4>
					<DateOfBirthField blockErrorDisplay={true} />
				</>
			)}
			{hasValidationErrors(enrollment.child, ['birthCertificateId', 'birthState', 'birthTown']) && (
				<>
					<h4>Birth Certificate</h4>
					<BirthCertificateFormFieldSet blockErrorDisplay={true} />
				</>
			)}
			{hasValidationErrors(enrollment.child, [
				'americanIndianOrAlaskaNative',
				'asian',
				'blackOrAfricanAmerican',
				'nativeHawaiianOrPacificIslander',
				'white',
			]) && (
					<>
						<h4>Race</h4>
						<RaceField blockErrorDisplay={true} />
					</>
				)}
			{hasValidationErrors(enrollment.child, ['hispanicOrLatinxEthnicity']) && (
				<>
					<h4>Ethnicity</h4>
					<EthnicityField blockErrorDisplay={true} />
				</>
			)}
			{hasValidationErrors(enrollment.child, ['gender']) && (
				<>
					<h4>Gender</h4>
					<GenderField blockErrorDisplay={true} />
				</>
			)}
			<FormSubmitButton text="Save and next" />
			<Button appearance="outline" text="Skip" onClick={onSkip} />
		</Form>
	);
};
