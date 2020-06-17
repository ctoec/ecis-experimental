import React, { useState } from 'react';
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
import useCatchAllErrorAlert from '../../../../../../hooks/useCatchAllErrorAlert';
import { Enrollment } from '../../../../../../generated';

export const Care4KidsForm: React.FC<UpdateFormSectionProps> = ({
	mutatedEnrollment,
	formOnSubmit: _formOnSubmit,
	saveError = null,
	forceCloseEditForms,
}) => {
	if (!mutatedEnrollment || !mutatedEnrollment.child) {
		throw new Error('Section rendered without enrollment or child');
	}

	const currentC4kCert = getCurrentC4kCertificate(mutatedEnrollment);
	const pastC4kCerts = getPastC4kCertificates(mutatedEnrollment).sort((a, b) =>
		c4kCertificateSorter(a, b, true)
	);

	const errorAlertState = useCatchAllErrorAlert(saveError);

	// // this is a hack, borrowed from what made sense + worked in FamilyIncome
	// // the "new" form needs to be recreated based on the current state of the
	// // form data at display time. Simply expanding the CardExpansion does NOT
	// // result in a re-rendered form, thus results in an incorrectly instantiated
	// // form. This was an easy fix, relying on why we don't have this issue in
	// // FamilyIncome. Better suggestions WAY WELCOME
	// const [showNew, setShowNew] = useState(false);

	const formOnSubmit = (data: Enrollment) => {
		// setShowNew(false);
		_formOnSubmit && _formOnSubmit(data);
	};

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
							// onClick={() => setShowNew(true)}
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
