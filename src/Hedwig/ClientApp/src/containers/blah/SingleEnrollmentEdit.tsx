import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../../contexts/User/UserContext';
import { ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest, Enrollment, ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest } from '../../generated';
import { getIdForUser, validatePermissions } from '../../utils/models';
import useApi from '../../hooks/useApi';
import StepList, { StepProps } from '../../components/StepList/StepList';
import ChildInfo from './_sections/ChildInfo';
import { Section, SectionProps } from '../Enrollment/enrollmentTypes';
import { hasValidationErrors } from '../../utils/validations';
import { useHistory } from 'react-router';
import { DateRange } from '../../components';
import moment from 'moment';

type EnrollmentEditProps = {
	enrollmentId: number;
	siteId: number;
	moveNext: () => void;
	setRefetch?: React.Dispatch<React.SetStateAction<number>>;
}

export const EnrollmentEdit: React.FC<EnrollmentEditProps> = ({
	enrollmentId,
	siteId,
	moveNext,
	setRefetch,
}) => {
	const { user } = useContext(UserContext);
	// get the enrollment detail
	const params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest = {
		id: enrollmentId,
		siteId,
		orgId: getIdForUser(user, 'org'),
	}

	const { error, data: enrollment, loading } = useApi<Enrollment>(
		(api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet(params),
		{ skip: !user,
		deps:[enrollmentId, siteId] }
	)


	const [mutatedEnrollment, updateMutatedEnrollment] = useState<Enrollment | null>(enrollment);
	useEffect(() => {
		updateMutatedEnrollment(enrollment);
	}, [enrollment]);

	const [attemptingSave, setAttemptingSave] = useState(false);
	const putParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
		id: enrollment?.id || 0,
		orgId: getIdForUser(user, 'org'),
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
		enrollment: mutatedEnrollment || undefined,
	};

	const {error: saveError, loading: isSaving, data: returnedEnrollment } = useApi<Enrollment>(
		(api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(putParams),
		{
			skip: !attemptingSave || !user,
			callback: () => {
				setAttemptingSave(false);
			},
			successCallback: () => {
				setAttemptingSave(false);
				console.log("success");
				const currentIndex = sections.findIndex((section) => section.key === sectionId);
				if(currentIndex === sections.length - 1) {
					console.log("move next");
					moveNext();
					// setRefetch && setRefetch(r => r + 1);
				} else {
					const nextSectionId = sections[currentIndex + 1].key;
					push(`#${nextSectionId}`);
				}
			}
		}
	);
	const sections: Section[] = [];
	if(hasValidationErrors(enrollment?.child, undefined, true)) {
		sections.push(ChildInfo)
	}

	const steps = sections as StepProps<SectionProps>[];

	const { location, push } = useHistory();
	const sectionId = location.hash 
		? location.hash.slice(1) 
		: sections[0] 
			? sections[0].key
			: 'complete';



	const props: SectionProps = {
		enrollment: mutatedEnrollment,
		updateEnrollment: updateMutatedEnrollment,
		siteId,
		error: saveError,
		loading: isSaving,
		onSkip: moveNext,
		triggerSave: () => { setAttemptingSave(true) }
	};

	if (!mutatedEnrollment) {
		return <>not found</>;
	}

	if(loading) {
		return <>Loading...</>;
	}

	return (
		<StepList steps={steps} props={props} activeStep={steps.length ? steps[0].key : 'complete'}/>
	)
}
