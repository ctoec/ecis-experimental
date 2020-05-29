import React, { useState, useContext, useEffect } from 'react';
import { SectionProps } from '../../../enrollmentTypes';
import {
	Enrollment,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest,
} from '../../../../../generated';
import UserContext from '../../../../../contexts/User/UserContext';
import { validatePermissions, getIdForUser } from '../../../../../utils/models';
import useApi from '../../../../../hooks/useApi';
import { Button, Card } from '../../../../../components';
import { propertyDateSorter } from '../../../../../utils/dateSorter';
import { FamilyDeterminationCard } from './FamilyDeterminationCard';
import FamilyDeterminationFormForCard from './FamilyDeterminationFormForCard';
import useCatchAllErrorAlert from '../../../../../hooks/useCatchAllErrorAlert';

/**
 * The form rendered in EnrollmentUpdate flow, which displays all determinations
 * for the given enrollment's child's family. The user can edit any existing
 * determination, or add a new one.
 */
export const UpdateForm = ({ enrollment, siteId }: SectionProps) => {
	// Enrollment and child must already exist to create family income data,
	// and cannot be created without user input (have required non null fields)
	if (!enrollment || !enrollment.child || !enrollment.child.family) {
		throw new Error('Section rendered without enrollment or child');
	}

	const [mutatedEnrollment, setMutatedEnrollment] = useState<Enrollment>(enrollment);

	// Set up form state
	const [showNew, setShowNew] = useState(false);
	const [forceCloseEditForms, setForceCloseEditForms] = useState(false);
	const [didAddNew, setDidAddNew] = useState(false);
	const [isNew, setIsNew] = useState(false);

	// Set up API request (enrollment PUT)
	const [attemptingSave, setAttemptingSave] = useState(false);
	const { user } = useContext(UserContext);
	const putParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
		id: enrollment.id,
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
		orgId: getIdForUser(user, 'org'),
		enrollment: mutatedEnrollment,
	};

	const { error: saveError, loading: isSaving, data: returnedEnrollment } = useApi<Enrollment>(
		(api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(putParams),
		{
			skip: !user || !attemptingSave,
			callback: () => {
				setAttemptingSave(false);
			},
		}
	);

	// Handle API error
	// display CatchAll error alert on any API error
	useCatchAllErrorAlert(saveError);

	// Handle successful API request
	useEffect(() => {
		// If the request is still loading or
		// If the request produced an error,
		// Do nothing
		if (isSaving || saveError) {
			return;
		}

		// If the request succeeded, process the response
		if (returnedEnrollment) {
			setMutatedEnrollment(returnedEnrollment);
			if (didAddNew) {
				setIsNew(true);
			}
			setShowNew(false);
			setForceCloseEditForms(false);
		}
		// Else  the request hasn't fired, do nothing
	}, [isSaving, saveError, didAddNew, returnedEnrollment]);

	// Convenience vars for rendering the form
	const formOnSubmit = (_data: Enrollment) => {
		setMutatedEnrollment(_data);
		setAttemptingSave(true);
		setForceCloseEditForms(true);
	};

	// mutatedEnrollment is known to have child & family from check above on enrollment
	const sortedDeterminations = [
		...(mutatedEnrollment?.child?.family?.determinations || []),
	].sort((a, b) => propertyDateSorter(a, b, (det) => det.determinationDate, true));
	const currentDetermination = sortedDeterminations[0];
	const pastDeterminations = sortedDeterminations.slice(1);

	return (
		<>
			{showNew && (
				<Card>
					<FamilyDeterminationFormForCard
						determinationId={0}
						formData={mutatedEnrollment}
						onSubmit={(_data) => {
							setDidAddNew(true);
							formOnSubmit(_data);
						}}
						onCancel={() => setShowNew(false)}
					/>
				</Card>
			)}

			<div className="margin-top-1">
				<div className="display-flex align-center">
					<h2 className="font-sans-md margin-top-2 margin-bottom-2">
						{currentDetermination
							? 'Current income determination'
							: 'No income information on record'}
					</h2>
					&nbsp;&nbsp;&nbsp;
					{!showNew && (
						<Button
							text="Add new income determination"
							appearance="unstyled"
							onClick={() => setShowNew(true)}
						/>
					)}
				</div>
				<div>
					{currentDetermination && (
						<FamilyDeterminationCard
							determination={currentDetermination}
							isCurrent={true}
							isNew={isNew}
							forceClose={forceCloseEditForms}
							expansion={
								<FamilyDeterminationFormForCard
									determinationId={currentDetermination.id}
									formData={mutatedEnrollment}
									onSubmit={formOnSubmit}
								/>
							}
						/>
					)}
				</div>

				{pastDeterminations.length > 0 && (
					<>
						<div className="display-flex align-center">
							<h2 className="font-sans-md margin-top-2 margin-bottom-2">
								Past income determinations
							</h2>
						</div>
						<div>
							{pastDeterminations.map((determination) => (
								<FamilyDeterminationCard
									key={determination.id}
									determination={determination}
									isCurrent={false}
									forceClose={forceCloseEditForms}
									expansion={
										<FamilyDeterminationFormForCard
											determinationId={determination.id}
											formData={mutatedEnrollment}
											onSubmit={formOnSubmit}
										/>
									}
								/>
							))}
						</div>
					</>
				)}
			</div>
		</>
	);
};
