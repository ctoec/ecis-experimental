import React from 'react';
import { Form, FormSubmitButton } from '../../../../components/Form_New';
import { Enrollment } from '../../../../generated';
import { BatchEditStepProps } from '../batchEditTypes';
import { hasValidationErrors } from '../../../../utils/validations';
import { EnrollmentStartDateField } from '../../../Enrollment/_sections/EnrollmentFunding/Fields/EnrollmentStartDate';
import { FamilyIdField } from '../../../Enrollment/_sections/EnrollmentFunding/Fields/Care4Kids/FamilyId';
import { CertificateStartDate } from '../../../Enrollment/_sections/EnrollmentFunding/Fields/Care4Kids/CertificateStartDate';
import { Button } from '../../../../components';

export const EditForm: React.FC<BatchEditStepProps> = ({
	enrollment,
	error,
	errorAlertState,
	onSubmit,
	onSkip,
}) => {
	const c4KCertificatesWithErrors = enrollment.child?.c4KCertificates?.filter((cert) =>
		hasValidationErrors(cert)
	);

	return (
		<Form<Enrollment>
			className="usa-form"
			data={enrollment}
			onSubmit={onSubmit}
			noValidate
			autoComplete="off"
		>
			{/*
				Only need to check for missing entry, not missing ageGroup
				because we are only considering funded enrollments as missing information
				(un-funded enrollments do not contribute to a report, and thus do not
				block report submission). Funding cannot be entered without adding an ageGroup,
				so it's impossible an enrollment with a missing age group could show up here.
			*/}
			{hasValidationErrors(enrollment, ['entry']) && (
				<>
					<h4>Enrollment</h4>
					<EnrollmentStartDateField
						blockErrorDisplay={true}
						error={error}
						errorAlertState={errorAlertState}
					/>
				</>
			)}
			{hasValidationErrors(enrollment.child, ['C4KFamilyCaseNumber', 'c4KCertificates']) && (
				<>
					<h4>Care 4 Kids</h4>
					{hasValidationErrors(enrollment.child, ['C4KFamilyCaseNumber']) && <FamilyIdField />}
					{c4KCertificatesWithErrors?.map((cert) => (
						<>
							{hasValidationErrors(cert, ['startDate']) && (
								<CertificateStartDate certificateId={cert.id} />
							)}
						</>
					))}
				</>
			)}
			<FormSubmitButton text="Save and next" />
			<Button appearance="outline" text="Skip" onClick={onSkip} />
		</Form>
	);
};
