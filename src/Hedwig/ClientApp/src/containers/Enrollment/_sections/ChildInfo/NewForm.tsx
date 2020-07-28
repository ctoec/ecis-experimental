import React, { useContext, useState } from 'react';
import { SectionProps, headerLevels } from '../../enrollmentTypes';
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
	startingHeaderLevel = headerLevels[2],
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
	const { error, loading: isSaving } = useApi<Enrollment>(apiRequest, {
		skip: !attemptSave,
		callback: apiCallback,
		successCallback: successCallback,
	});

	const errorAlertState = useCatchAllErrorAlert(error);
	useFocusFirstError([error]);

	const onFormSubmit = (userModifiedEnrollment: Enrollment) => {
		// Apply the mutations to the local copy of the enrollment
		setMutatedEnrollment(userModifiedEnrollment);
		// Kick off the API request
		setAttemptSave(true);
	};

	const Header = startingHeaderLevel;

	return (
		<Form<Enrollment>
			className="ChildInfoForm usa-form"
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
					<FirstNameField error={error} errorAlertState={errorAlertState} />
				</div>
				<div className="mobile-lg:grid-col-9">
					<MiddleNameField />
				</div>
				<div className="display-flex flex-row flex-align-end grid-row grid-gap">
					<div className="mobile-lg:grid-col-9">
						<LastNameField error={error} errorAlertState={errorAlertState} />
					</div>
					<div className="mobile-lg:grid-col-3">
						<SuffixField />
					</div>
				</div>
			</div>
			<Header>Date of birth</Header>
			<DateOfBirthField />
			<Header>Birth certificate</Header>
			<BirthCertificateFormFieldSet />
			<Header>Race</Header>
			<RaceField />
			<Header>Ethnicity</Header>
			<EthnicityField />
			<Header>Gender</Header>
			<GenderField />
			<FormSubmitButton text={isSaving ? 'Saving...' : 'Save'} disabled={isSaving} />
		</Form>
	);
};
