import { SectionProps } from '../../enrollmentTypes';
import React, { useState, useContext } from 'react';
import UserContext from '../../../../contexts/User/UserContext';
import {
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest,
	Enrollment,
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
import EnrollmentFunding from '.';
import idx from 'idx';
import { WithNewC4kCertificate } from './Fields/Care4Kids/WithNewC4kCertificate';
import { FamilyIdField } from './Fields/Care4Kids/FamilyId';
import { WithNewFunding } from './Fields/Funding/WithNewFunding';
import { Alert } from '../../../../components';
import { somethingWentWrongAlert } from '../../../../utils/stringFormatters/alertTextMakers';

export const NewForm: React.FC<SectionProps> = ({
	enrollment,
	updateEnrollment,
	siteId,
	successCallback,
	touchedSections,
	onSectionTouch,
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
				onSectionTouch && onSectionTouch(EnrollmentFunding);
			},
			successCallback: (returnedEnrollment) => {
				successCallback && successCallback(returnedEnrollment);
			},
		}
	);

	const errorAlertState = useCatchAllErrorAlert(saveError);

	const params: ApiOrganizationsIdGetRequest = {
		id: getIdForUser(user, 'org'),
	};

	const { data: organization, error: organizationError, loading: organizationLoading } = useApi<
		Organization
	>((api) => api.apiOrganizationsIdGet(params), {
		skip: !user,
	});

	const isReturnVisit = touchedSections && touchedSections[EnrollmentFunding.key];
	const fundingId = idx(enrollment, (_) => _.fundings[0].id) || 0;
	const certificateId = idx(enrollment, (_) => _.child.c4KCertificates[0].id) || 0;
	const [receivesC4K, setRecievesC4K] = useState(isReturnVisit ? certificateId === 0 : false);

	if (organizationLoading || !organization) {
		return <>Loading...</>;
	}

	if (organizationError) {
		return <Alert {...somethingWentWrongAlert}></Alert>;
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
				<EnrollmentStartDate
					errorDisplayGuard={!isReturnVisit}
					error={saveError}
					errorAlertState={errorAlertState}
				/>
				<AgeGroupField
					errorDisplayGuard={!isReturnVisit}
					error={saveError}
					errorAlertState={errorAlertState}
				/>
				<span className="usa-label text-bold font-sans-lg">Funding</span>
				<WithNewFunding shouldCreate={fundingId === 0}>
					<FundingField
						fundingId={fundingId}
						fundingSpaces={fundingSpaces}
						error={saveError}
						errorAlertState={errorAlertState}
					/>
				</WithNewFunding>

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
