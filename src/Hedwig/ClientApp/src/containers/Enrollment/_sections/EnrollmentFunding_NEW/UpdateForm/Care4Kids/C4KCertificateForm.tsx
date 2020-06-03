import React from 'react';
import { Enrollment } from '../../../../../../generated';
import { Form, FormSubmitButton } from '../../../../../../components/Form_New';
import { FamilyIdField } from '../../Fields/Care4Kids/FamilyId';
import { StartDateField as CertificateStartDateField } from '../../Fields/Care4Kids/StartDate';
import { Button } from '../../../../../../components';

type C4KCertificateFormForCardProps = {
	certificateId: number;
	formData: Enrollment;
	onSubmit: (_:Enrollment) => void;
	onCancel?: () => void;
}


export const C4kCertificateFormForCard: React.FC<C4KCertificateFormForCardProps> = ({
	certificateId,
	formData,
	onSubmit,
	onCancel
}) => {
	return (
		<Form
			id={`update-c4kcertificate-${certificateId}`}
			data={formData}
			onSubmit={onSubmit}
			className="usa-form"
		>
			<FamilyIdField />
			<CertificateStartDateField certificateId={certificateId} />
			<div>
				<Button
					text="Cancel"
					appearance="outline"
					onClick={() =>  onCancel && onCancel() }
				/>
				<FormSubmitButton text="Save edits" />
			</div>
		</Form>
	)
}
