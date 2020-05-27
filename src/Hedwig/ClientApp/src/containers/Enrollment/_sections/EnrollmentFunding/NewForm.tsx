import { SectionProps } from "../../enrollmentTypes";
import React, { useState, useContext } from "react";
import UserContext from "../../../../contexts/User/UserContext";
import { ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest, Enrollment } from "../../../../generated";
import { validatePermissions, getIdForUser } from "../../../../utils/models";
import useApi from "../../../../hooks/useApi";
import { useEffect } from "@storybook/addons";
import useCatchallErrorAlert from "../../../../hooks/useCatchallErrorAlert";
import Form from "../../../../components/Form_New/Form";
import { DeepNonUndefineable } from "../../../../utils/types";

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
		enrollment: enrollment
	};

	const { error: saveError, loading: saving, data: saveData } = useApi<Enrollment>(
		api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(putParams),
		{
			skip: !attemptingSave,
			callback: () => {
				setAttemptingSave(false);
				// onSectionTouch && onSectionTouch(EnrollmentFunding)
			}
		}
	);

	// Handle API request ERROR
	const errorAlertState = useCatchallErrorAlert(saveError);

	// Handle API request SUCCESS
	useEffect(() => {
		if (saving) {
			return;
		}

		if(saveError) {
			return;
		}

		if(saveData) {
			successCallback && successCallback(saveData);
		}
	}, [saving, saveError, successCallback, saveData])

	return (
		<>
			<Form<Enrollment>
				data={enrollment}
				onSubmit={_data => {
					updateEnrollment(_data as DeepNonUndefineable<Enrollment>);
					setAttemptingSave(true);
				}}
				className="enrollment-new-enrollment-funding-section"
			>
				
			</Form>
		</>
	)
}
