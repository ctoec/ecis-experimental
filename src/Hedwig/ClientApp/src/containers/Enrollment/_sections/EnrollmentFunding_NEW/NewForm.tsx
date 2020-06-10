import { SectionProps } from '../../enrollmentTypes';
import React, { useState, useContext, useEffect } from 'react';
import UserContext from '../../../../contexts/User/UserContext';
import {
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest,
	Enrollment,
	User,
	ApiOrganizationsIdGetRequest,
	Organization,
} from '../../../../generated';
import { validatePermissions, getIdForUser } from '../../../../utils/models';
import useApi from '../../../../hooks/useApi';
import useCatchAllErrorAlert from '../../../../hooks/useCatchAllErrorAlert';
import Form from '../../../../components/Form_New/Form';
import { EnrollmentStartDate } from './Fields/EnrollmentStartDate';
import { AgeGroupField } from './Fields/AgeGroup';
import { FundingField } from './Fields/Funding';
import { CertificateStartDate } from './Fields/Care4Kids/CertificateStartDate';
import FormSubmitButton from '../../../../components/Form_New/FormSubmitButton';
import { ReceivesC4KField } from './Fields/Care4Kids/ReceivesC4K';
import EnrollmentFunding from '../EnrollmentFunding';
import idx from 'idx';
import { WithNewC4kCertificate } from './Fields/Care4Kids/WithNewC4kCertificate';
import { FamilyIdField } from './Fields/Care4Kids/FamilyId';

export const NewForm: React.FC<SectionProps> = ({
	enrollment,
	updateEnrollment,
	siteId,
	successCallback,
	onSectionTouch,
	touchedSections,
}) => {
	if (!enrollment) {
		throw new Error('Section rendered without enrollment');
	}

	const [attemptingSave, setAttemptingSave] = useState(false);
	const { user } = useContext(UserContext);
	const putParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
		id: enrollment.id,
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
		orgId: getIdForUser(user, 'org'),
		enrollment: enrollment,
	};

	const { error: saveError, loading: saving, data: saveData } = useApi<Enrollment>(
		(api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(putParams),
		{
			skip: !attemptingSave,
			callback: () => {
				setAttemptingSave(false);
				// onSectionTouch && onSectionTouch(EnrollmentFunding)
			},
		}
	);

	// Handle API request ERROR
	const errorAlertState = useCatchAllErrorAlert(saveError);

	// Handle API request SUCCESS
	useEffect(() => {
		if (saving) {
			return;
		}

		if (saveError) {
			return;
		}

		if (saveData) {
			successCallback && successCallback(saveData);
		}
	}, [saving, saveError, successCallback, saveData]);

	const params: ApiOrganizationsIdGetRequest = {
		id: getIdForUser(user, 'org'),
		include: ['enrollments', 'fundings', 'funding_spaces'],
	};

	const { data: organization, error: organizationError, loading: organizationLoading } = useApi<
		Organization
	>((api) => api.apiOrganizationsIdGet(params), {
		skip: !user,
	});

	const isReturnVisit = touchedSections && touchedSections[EnrollmentFunding.key];
	const certificateId = idx(enrollment, (_) => _.child.c4KCertificates[0].id) || 0;
	const [receivesC4K, setRecievesC4K] = useState(isReturnVisit ? certificateId === 0 : false);

	if (organizationLoading || !organization) {
		return <>Loading...</>;
	}

	if (organizationError) {
		return <>Something went wrong!</>;
	}

	const fundingSpaces = organization.fundingSpaces || [];

	return (
		<>
			<Form<Enrollment>
				data={enrollment}
				onSubmit={(_data) => {
					updateEnrollment(_data);
					setAttemptingSave(true);
				}}
				className="usa-form enrollment-new-enrollment-funding-section"
			>
				<span className="usa-label text-bold font-sans-lg">{enrollment.site?.name}</span>
				<EnrollmentStartDate initialLoad={!isReturnVisit} />
				<AgeGroupField initialLoad={!isReturnVisit} />
				<span className="usa-label text-bold font-sans-lg">Funding</span>
				<FundingField fundingId={0} fundingSpaces={fundingSpaces} error={saveError} errorAlertState={errorAlertState}/>

				<span className="usa-label text-bold font-sans-lg">Care 4 Kids</span>
				<WithNewC4kCertificate shouldCreate={certificateId === 0 && receivesC4K}>
					{/* TODO: replace with solo checkbox when/if that exists-- just add flag on solo checkbox and go ditch all the margins */}
					<div className="margin-top-3">
						<ReceivesC4KField receivesC4K={receivesC4K} setReceivesC4K={setRecievesC4K} />
					</div>
					{receivesC4K && (
						<>
							<FamilyIdField />
							<CertificateStartDate certificateId={certificateId} />
						</>
					)}
				</WithNewC4kCertificate>

				<FormSubmitButton text={saving ? 'Saving...' : 'Save'} />
			</Form>
		</>
	);
};
