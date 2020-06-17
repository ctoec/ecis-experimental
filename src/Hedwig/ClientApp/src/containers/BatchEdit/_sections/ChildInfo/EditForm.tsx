import React from "react";
import { Form, FormSubmitButton } from "../../../../components/Form_New";
import { Enrollment } from "../../../../generated";
import { hasValidationErrors } from "../../../../utils/validations";
import { DateOfBirthField, BirthCertificateFormFieldSet, RaceField, GenderField, EthnicityField } from "../../../Enrollment/_sections/ChildInfo/Fields";
import useCatchAllErrorAlert from "../../../../hooks/useCatchAllErrorAlert";
import { BatchEditStepProps } from "../batchEditTypes";
import { Button } from "../../../../components";

export const EditForm: React.FC<BatchEditStepProps> = ({
	enrollment,
	error,
	onSubmit,
	onSkip
}) => {
	if(!enrollment) {
		throw new Error("Section rendered without enrollment");
	}

	useCatchAllErrorAlert(error);

	return (
		<Form<Enrollment>
			className="usa-form"
			data={enrollment}
			onSubmit={onSubmit}
			noValidate
			autoComplete="off"
		>
			{hasValidationErrors(enrollment.child, ['birthdate']) &&
				<>
					<h3>Date of Birth</h3>
					<DateOfBirthField errorDisplayGuard={true}/>
				</>
			}
			{hasValidationErrors(enrollment.child, ['birthCertificateId', 'birthState', 'birthTown']) &&
				<>
					<h3>Birth Certificate</h3>
					<BirthCertificateFormFieldSet errorDisplayGuard={true}/>
				</>
			}
			{hasValidationErrors(enrollment.child, ['americanIndianOrAlaskaNative', 'asian', 'blackOrAfricanAmerican', 'nativeHawaiianOrPacificIslander', 'white']) &&
				<>
					<h3>Race</h3>
					<RaceField errorDisplayGuard={true}/>
				</>
			}
			{hasValidationErrors(enrollment.child, ['hispanicOrLatinxEthnicity']) &&
				<>
					<h3>Ethnicity</h3>
					<EthnicityField errorDisplayGuard={true}/>
				</>
			}	
			{hasValidationErrors(enrollment.child, ['gender']) &&
				<>
					<h3>Gender</h3>
					<GenderField errorDisplayGuard={true} />
				</>
			}	
			<FormSubmitButton text="Save and next"/>
			<Button appearance="outline" text="Skip" onClick={onSkip} />
		</Form>
	)
}
