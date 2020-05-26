import React, { useState, useContext, useEffect } from 'react';
import { SectionProps } from '../../../enrollmentTypes';
import { DeepNonUndefineable } from '../../../../../utils/types';
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
export const UpdateForm = ({ enrollment, updateEnrollment, siteId }: SectionProps) => {
	// Enrollment and child must already exist to create family income data,
	// and cannot be created without user input (have required non null fields)
	if (!enrollment || !enrollment.child || !enrollment.child.family) {
		throw new Error('Section rendered without enrollment or child');
	}

	// Set up form state
	const [showNew, setShowNew] = useState(false);
	const [didAddNew, setDidAddNew] = useState(false);
	const [isNew, setIsNew] = useState(false);
	const [forceClose, setForceClose] = useState(false);

	// Set up API request (enrollment PUT)
	const [attemptingSave, setAttemptingSave] = useState(false);
	const { user } = useContext(UserContext);
	const putParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
		id: enrollment.id,
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
		orgId: getIdForUser(user, 'org'),
		enrollment: enrollment ? enrollment : undefined,
	};
	const { error: saveError, loading: saving, data: saveData } = useApi<Enrollment>(
		api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(putParams),
		{
			skip: !user || !attemptingSave,
			callback: () => {
				setAttemptingSave(false);
			},
		}
	);

	// CatchAll error alert will be displayed on _any_ saveError,
	// since no field-specific error alerts exist
	useCatchAllErrorAlert(saveError);

	// Handle successful API request
	useEffect(() => {
		// API request is still on going -- exit
		if (saving) {
			return;
		}

		// API request failed -- exit
		if (saveError) {
			return;
		}

		// Set isNew to display new tag on current determination
		if (didAddNew) {
			setIsNew(true);
		}

		// Close new form and any open edit forms
		setShowNew(false);
		setForceClose(true);

		// Update enrollment to have most updated response data
		if (saveData) {
			updateEnrollment(saveData);
		}
	}, [saving, saveError, didAddNew, saveData]);

	if (saving) {
		return <>Loading...</>;
	}

	// Convenience vars for rendering the form
	const formOnSubmit = (_data: Enrollment) => {
		updateEnrollment(_data as DeepNonUndefineable<Enrollment>);
		setAttemptingSave(true);
	};

	const sortedDeterminations = [...(enrollment.child.family.determinations || [])].sort((a, b) =>
		propertyDateSorter(a, b, det => det.determinationDate, true)
	);
	const currentDetermination = sortedDeterminations[0];
	const pastDeterminations = sortedDeterminations.slice(1);

	return (
		<>
			{showNew && (
				<Card>
					<FamilyDeterminationFormForCard
						determinationId={0}
						formData={enrollment}
						onSubmit={_data => {
							setDidAddNew(true);
							formOnSubmit(_data);
						}}
						onCancel={() => setShowNew(false)}
					/>
				</Card>
			)}

			<div className="display-flex align-center">
				<h3>
					{currentDetermination
						? 'Current income determination'
						: 'No income information on record'}
				</h3>
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
						forceClose={forceClose}
						expansion={
							<FamilyDeterminationFormForCard
								determinationId={currentDetermination.id}
								formData={enrollment}
								onSubmit={formOnSubmit}
							/>
						}
					/>
				)}
			</div>

			{pastDeterminations.length > 0 && (
				<>
					<div className="display-flex align-center">
						<h3>Past income determinations</h3>
					</div>
					<div>
						{pastDeterminations.map(determination => (
							<FamilyDeterminationCard
								determination={determination}
								isCurrent={false}
								forceClose={forceClose}
								expansion={
									<FamilyDeterminationFormForCard
										determinationId={determination.id}
										formData={enrollment}
										onSubmit={formOnSubmit}
									/>
								}
							/>
						))}
					</div>
				</>
			)}
		</>
	);
};
