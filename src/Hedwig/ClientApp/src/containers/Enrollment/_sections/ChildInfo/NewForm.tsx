import React, { useContext, useState, useEffect } from 'react';
import { SectionProps } from '../../enrollmentTypes';
import {
	Enrollment,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsPostRequest,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest,
	HedwigApi,
} from '../../../../generated';
import UserContext from '../../../../contexts/User/UserContext';
import { createEmptyEnrollment, getIdForUser, validatePermissions } from '../../../../utils/models';
import useCatchAllErrorAlert from '../../../../hooks/useCatchAllErrorAlert';
import Form from '../../../../components/Form_New/Form';
import FormSubmitButton from '../../../../components/Form_New/FormSubmitButton';
import {
	SasidField,
	FirstNameField,
	MiddleNameField,
	LastNameField,
	SuffixField,
	DateOfBirthField,
	BirthCertificateFormFieldSet,
	RaceField,
	EthnicityField,
	GenderField,
} from './Fields';
import useApi from '../../../../hooks/useApi';
import { useFocusFirstError } from '../../../../utils/validations';
import ChildInfo from '.';

export const NewForm: React.FC<SectionProps> = ({
	enrollment,
	siteId,
	successCallback,
	onSectionTouch,
}) => {
	const { user } = useContext(UserContext);

	// Keep state of whether a network request is running
	const [attemptSave, setAttemptSave] = useState(false);

	// Store an enrollment that receives user mutations.
	// This should be updated when the user clicks Save,
	// applying the mutations to this local copy.
	// We then send the mutatedEnrollment to the API.
	// The default value is the current value of the enrollment
	// Or if it hasn't been created yet, an empty enrollment.
	const [mutatedEnrollment, setMutatedEnrollment] = useState<Enrollment>(
		enrollment || createEmptyEnrollment(siteId, user)
	);

	// Create query params common to both POST and PUT requests
	const commonParams:
		| ApiOrganizationsOrgIdSitesSiteIdEnrollmentsPostRequest
		| ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
		orgId: getIdForUser(user, 'org'),
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
		enrollment: mutatedEnrollment,
	};

	// When API call completes, reset attemptSave state
	// and mark section as touched
	const apiCallback = () => {
		setAttemptSave(false);
		onSectionTouch && onSectionTouch(ChildInfo);
	};

	// Create the specific API request depending on whether enrollment is null.
	// If it is null, then it hasn't been created, so POST. Otherwise, it has, so PUT.
	const apiRequest = (api: HedwigApi) =>
		enrollment === null
			? api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsPost({
					...commonParams,
			  })
			: api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut({
					...commonParams,
					id: enrollment.id,
			  });
	const { error: errorOnSave, loading: isSaving, data: returnedEnrollment } = useApi<Enrollment>(
		apiRequest,
		{
			skip: !attemptSave,
			callback: apiCallback,
		}
	);

	const errorAlertState = useCatchAllErrorAlert(errorOnSave);
	useFocusFirstError([errorOnSave]);
	useEffect(() => {
		// If the request is still loading or
		// If the request produced an error,
		// Do nothing
		if (isSaving || errorOnSave) {
			return;
		}
		// If the request succeeded, process the response
		if (returnedEnrollment) {
			successCallback && successCallback(returnedEnrollment);
		}
		// Else the request hasn't fired, do nothing
	}, [errorOnSave, isSaving, returnedEnrollment]);

	const onFormSubmit = (userModifiedEnrollment: Enrollment) => {
		// Apply the mutations to the local copy of the enrollment
		setMutatedEnrollment(userModifiedEnrollment);
		// Kick off the API request
		setAttemptSave(true);
	};

	return (
		<Form<Enrollment>
			className="ChildInfoForm"
			// Supply the most up-to-date enrollment to the Form
			data={mutatedEnrollment}
			onSubmit={onFormSubmit}
			noValidate
			autoComplete="off"
		>
			<div className="grid-row grid-gap">
				<div className="mobile-lg:grid-col-12">
					<SasidField />
				</div>
				<div className="mobile-lg:grid-col-9">
					<FirstNameField error={errorOnSave} errorAlertState={errorAlertState} />
				</div>
				<div className="mobile-lg:grid-col-9">
					<MiddleNameField />
				</div>
				<div className="display-flex flex-row flex-align-end grid-row grid-gap">
					<div className="mobile-lg:grid-col-9">
						<LastNameField error={errorOnSave} errorAlertState={errorAlertState} />
					</div>
					<div className="mobile-lg:grid-col-3">
						<SuffixField />
					</div>
				</div>
			</div>
			<h2>Date of birth</h2>
			<DateOfBirthField />
			<h2>Birth certificate</h2>
			<BirthCertificateFormFieldSet />
			<h2>Race</h2>
			<RaceField />
			<h2>Ethnicity</h2>
			<EthnicityField />
			<h2>Gender</h2>
			<GenderField />
			<FormSubmitButton text={isSaving ? 'Saving...' : 'Save'} disabled={isSaving} />
		</Form>
	);
};
