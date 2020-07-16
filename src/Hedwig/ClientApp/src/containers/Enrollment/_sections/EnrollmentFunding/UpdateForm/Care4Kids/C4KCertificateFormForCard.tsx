import React from 'react';
import { Enrollment } from '../../../../../../generated';
import { FamilyIdField } from '../../Fields/Care4Kids/FamilyId';
import { CertificateStartDate } from '../../Fields/Care4Kids/CertificateStartDate';
import { Button, ExpandCard, Form, FormSubmitButton } from '@ctoec/component-library';
import { WithNewC4kCertificate } from '../../Fields/Care4Kids/WithNewC4kCertificate';
import { CertificateEndDate } from '../../Fields/Care4Kids/CertificateEndDate';
import { ApiError } from '../../../../../../hooks/useApi';
import { ErrorAlertState } from '../../../../../../hooks/useCatchAllErrorAlert';

type C4KCertificateFormForCardProps = {
	certificateId: number;
	isCurrent?: boolean;
	formData: Enrollment;
	onSubmit: (_: Enrollment) => void;
	familyIdForRenewal?: number;
	error: ApiError | null;
	errorAlertState: ErrorAlertState;
};

export const C4kCertificateFormForCard: React.FC<C4KCertificateFormForCardProps> = ({
	certificateId,
	isCurrent = false,
	formData,
	onSubmit,
	error,
	errorAlertState,
}) => {
	const isEdit = certificateId !== 0;

	return (
		<Form
			id={`update-c4kcertificate-${certificateId}`}
			data={formData}
			onSubmit={onSubmit}
			className="usa-form"
		>
			<WithNewC4kCertificate shouldCreate={!isEdit}>
				<FamilyIdField />
				<CertificateStartDate certificateId={certificateId} />
				{isEdit && !isCurrent && (
					<CertificateEndDate
						certificateId={certificateId}
						error={error}
						errorAlertState={errorAlertState}
					/>
				)}
			</WithNewC4kCertificate>
			<ExpandCard>
				<Button text="Cancel" appearance="outline" />
			</ExpandCard>
			<FormSubmitButton text={certificateId === 0 ? 'Save' : 'Save edits'} />
		</Form>
	);
};
