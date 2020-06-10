import React from 'react';
import { UpdateFormSectionProps } from '../common';
import { getCurrentC4kCertificate } from '../../../../../../utils/models';
import { C4KCertificateCard } from './C4KCertificateCard';
import { C4KCertificate } from '../../../../../../generated';

export const Care4KidsForm: React.FC<UpdateFormSectionProps> = ({
	mutatedEnrollment,
	saveError,
	setMutatedEnrollment,
	setAttemptingSave,
}) => {
	if (!mutatedEnrollment || !mutatedEnrollment.child) {
		throw new Error('Section rendered without enrollment or child');
	}

	// get current cert
	const c4kFunding = getCurrentC4kCertificate(mutatedEnrollment);
	// get past certs
	const pastC4kCerts: C4KCertificate[] = []

	return <>
		{c4kFunding && <><h2>Current certificate</h2>
			<C4KCertificateCard certificate={c4kFunding} c4KFamilyId={c4kFunding.child?.familyId || 0} isCurrent /></>}
		{pastC4kCerts.length > 0 &&
			<><h2>Past Care 4 Kids certificates</h2>{pastC4kCerts.map(pastCert => <C4KCertificateCard certificate={pastCert} c4KFamilyId={} />)}</>}
	</>;
};
