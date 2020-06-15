import { SectionProps } from "../../../Enrollment/enrollmentTypes";
import React, { useEffect, useContext, useState } from "react";
import { Form, FormSubmitButton } from "../../../../components/Form_New";
import { Enrollment, ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest } from "../../../../generated";
import { hasValidationErrors } from "../../../../utils/validations";
import { DateOfBirthField, BirthCertificateFormFieldSet, RaceField, GenderField, EthnicityField } from "../../../Enrollment/_sections/ChildInfo/Fields";
import UserContext from "../../../../contexts/User/UserContext";
import { getIdForUser, validatePermissions } from "../../../../utils/models";
import useApi from "../../../../hooks/useApi";
import useCatchAllErrorAlert from "../../../../hooks/useCatchAllErrorAlert";

export const EditForm: React.FC<SectionProps> = ({
	enrollment,
	updateEnrollment,
	error,
	successCallback,
	triggerSave,
}) => {
	if(!enrollment) {
		throw new Error("Section rendered without enrollment");
	}

	useCatchAllErrorAlert(error);

	const onFormSubmit = (userModifiedEnrollment: Enrollment) => {
		updateEnrollment(userModifiedEnrollment);
		triggerSave && triggerSave();
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
					<h2>Gender</h2>
					<GenderField />
				</>
			}	
			<FormSubmitButton text="Save"/>
		</Form>
	)
}
