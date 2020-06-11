import { SectionProps } from "../../../Enrollment/enrollmentTypes";
import React, { useContext, useState } from "react";
import { Form, FormSubmitButton } from "../../../../components/Form_New";
import { Enrollment, ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest } from "../../../../generated";
import { hasValidationErrors } from "../../../../utils/validations";
import { DateOfBirthField, BirthCertificateFormFieldSet, RaceField, GenderField, EthnicityField } from "../../../Enrollment/_sections/ChildInfo/Fields";
import UserContext from "../../../../contexts/User/UserContext";
import { getIdForUser, validatePermissions } from "../../../../utils/models";
import useApi from "../../../../hooks/useApi";
import { useEffect } from "@storybook/addons";
import useCatchAllErrorAlert from "../../../../hooks/useCatchAllErrorAlert";

export const EditForm: React.FC<SectionProps> = ({
	enrollment,
	siteId, 
	successCallback,
}) => {
	if(!enrollment) {
		throw new Error("Section rendered without enrollment");
	}

	const { user } = useContext(UserContext);
	
	const [attemptingSave, setAttemptingSave] = useState(false);
	const [mutatedEnrollment, setMutatedEnrollment] = useState<Enrollment>(enrollment);
	const putParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
		id: enrollment.id,
		orgId: getIdForUser(user, 'org'),
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
		enrollment: mutatedEnrollment,
	};
	const {error: saveError, loading: isSaving, data: returnedEnrollment } = useApi<Enrollment>(
		(api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(putParams),
		{
			skip: !attemptingSave || !user,
			callback: () => {
				setAttemptingSave(false);
			}
		}
	)

	useCatchAllErrorAlert(saveError);
	useEffect(() => {
		if(isSaving || saveError) {
			return;
		}

		if(returnedEnrollment) {
			successCallback && successCallback(returnedEnrollment);
		}
	}, [isSaving, saveError, returnedEnrollment]);


	const onFormSubmit = (userModifiedEnrollment: Enrollment) => {
		setMutatedEnrollment(userModifiedEnrollment);
		setAttemptingSave(true);
	}

	if(!hasValidationErrors(enrollment.child)) {
		successCallback && successCallback(enrollment);
		return <> </>;
	}

	return (
		<Form<Enrollment>
			className="usa-form"
			data={enrollment}
			onSubmit={onFormSubmit}
			noValidate
			autoComplete="off"
		>
			{hasValidationErrors(enrollment.child, ['birthdate']) &&
				<>
					<h2>Date of Birth</h2>
					<DateOfBirthField/>
				</>
			}
			{hasValidationErrors(enrollment.child, ['birthCertificateId', 'birthState', 'birthTown']) &&
				<>
					<h2>Birth Certificate</h2>
					<BirthCertificateFormFieldSet />
				</>
			}
			{hasValidationErrors(enrollment.child, ['americanIndianOrAlaskaNative', 'asian', 'blackOrAfricanAmerican', 'nativeHawaiianOrPacificIslander', 'white']) &&
				<>
					<h2>Race</h2>
					<RaceField />
				</>
			}
			{hasValidationErrors(enrollment.child, ['hispanicOrLatinxEthnicity']) &&
				<>
					<h2>Ethnicity</h2>
					<EthnicityField />
				</>
			}	
			{hasValidationErrors(enrollment.child, ['gender']) &&
				<>
					<h2>Ethnicity</h2>
					<GenderField />
				</>
			}	
			<FormSubmitButton text="Save"/>
		</Form>
	)
}
