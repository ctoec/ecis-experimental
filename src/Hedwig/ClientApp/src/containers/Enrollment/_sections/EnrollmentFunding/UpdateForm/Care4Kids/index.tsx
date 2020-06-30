import React from 'react';
import { UpdateFormSectionProps } from '../common';
import {
	getCurrentC4kCertificate,
	getPastC4kCertificates,
	c4kCertificateSorter,
} from '../../../../../../utils/models';
import { C4KCertificateCard } from './C4KCertificateCard';
import { C4kCertificateFormForCard } from './C4KCertificateFormForCard';
import { Card, Button, TextWithIcon } from '../../../../../../components';
import { ReactComponent as PlusCircle } from '../../../../../../assets/images/plusCircle.svg';
import { CardExpansion } from '../../../../../../components/Card/CardExpansion';
import { ExpandCard } from '../../../../../../components/Card/ExpandCard';
import { propertyDateSorter } from '../../../../../../utils/dateSorter';
import { Enrollment } from '../../../../../../generated';

export const Care4KidsForm: React.FC<UpdateFormSectionProps> = ({
	mutatedEnrollment,
	setMutatedEnrollment,
	attemptSave,
	saveError,
	errorAlertState,
	forceCloseEditForms,
}) => {
	if (!mutatedEnrollment.child) {
		throw new Error('Section rendered without enrollment or child');
	}

	const formOnSubmit = (userModifiedEnrollment: Enrollment) => {
		setMutatedEnrollment(userModifiedEnrollment);
		attemptSave();
	};

	const sortedC4kCerts = (mutatedEnrollment.child?.c4KCertificates || [])
		.slice() // force copy to avoid sorting immutable object (javascript array sort is in-place)
		.sort((a, b) => propertyDateSorter(a, b, (cert) => cert.endDate, true));
	const currentC4kCert = sortedC4kCerts.find((cert) => !cert.endDate);
	const pastC4kCerts = sortedC4kCerts.slice(1);

	return (
		<>
			<Card forceClose={forceCloseEditForms}>
				<div className="display-flex flex-justify">
					<p>
						{currentC4kCert
							? `Did ${mutatedEnrollment.child.firstName}'s family renew their Care 4 Kids certificate?`
							: 'No active Care 4 Kids Certificate'}
					</p>
					<ExpandCard>
						<Button
							text={
								<TextWithIcon
									text={currentC4kCert ? 'Renew certificate' : 'Add a certificate'}
									Icon={PlusCircle}
									iconClassName="text-green"
								/>
							}
							appearance="unstyled"
						/>
					</ExpandCard>
				</div>
				<CardExpansion>
					<C4kCertificateFormForCard
						certificateId={0}
						formData={mutatedEnrollment}
						onSubmit={formOnSubmit}
						error={saveError}
						errorAlertState={errorAlertState}
					/>
				</CardExpansion>
			</Card>

			{currentC4kCert && (
				<>
					<h2 className="font-sans-md margin-top-2 margin-bottom-2">Current certificate</h2>
					<C4KCertificateCard
						isCurrent
						certificate={currentC4kCert}
						c4KFamilyId={mutatedEnrollment.child?.c4KFamilyCaseNumber}
						forceClose={forceCloseEditForms}
						expansion={
							<C4kCertificateFormForCard
								certificateId={currentC4kCert.id}
								isCurrent
								formData={mutatedEnrollment}
								onSubmit={formOnSubmit}
								error={saveError}
								errorAlertState={errorAlertState}
							/>
						}
					/>
				</>
			)}
			{pastC4kCerts.length > 0 && (
				<>
					<h2 className="font-sans-md margin-top-2 margin-bottom-2">
						Past Care 4 Kids certificates
					</h2>
					{pastC4kCerts.map((pastCert) => (
						<C4KCertificateCard
							key={`${pastCert.id}-past-cert`}
							isCurrent={false}
							certificate={pastCert}
							c4KFamilyId={mutatedEnrollment.child?.c4KFamilyCaseNumber}
							forceClose={forceCloseEditForms}
							expansion={
								<C4kCertificateFormForCard
									certificateId={pastCert.id}
									formData={mutatedEnrollment}
									onSubmit={formOnSubmit}
									error={saveError}
									errorAlertState={errorAlertState}
								/>
							}
						/>
					))}
				</>
			)}
		</>
	);
};
