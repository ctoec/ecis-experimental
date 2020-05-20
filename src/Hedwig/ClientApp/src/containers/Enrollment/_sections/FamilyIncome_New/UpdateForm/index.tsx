import React, { useState, useContext, useEffect } from 'react';
import { SectionProps } from '../../../enrollmentTypes';
import { DeepNonUndefineable } from '../../../../../utils/types';
import { Enrollment, ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest } from '../../../../../generated';
import UserContext from '../../../../../contexts/User/UserContext';
import { validatePermissions, getIdForUser } from '../../../../../utils/models';
import useApi from '../../../../../hooks/useApi';
// import useCatchallErrorAlert from '../../../../../hooks/useCatchallErrorAlert';
import { Button, Card } from '../../../../../components';
import { propertyDateSorter } from '../../../../../utils/dateSorter';
import { DeterminationCard }  from './DeterminationCard';
import CardForm from './CardForm';

export const UpdateForm = ({
	enrollment, 
	updateEnrollment,
	siteId,
	loading,
}: SectionProps) => {

	// Enrollment and child must already exist to create family income data,
	// and cannot be created without user input (have required non null fields)
	if(!enrollment || !enrollment.child || !enrollment.child.family) {
		throw new Error('Section rendered without enrollment or child');
	}



	// Set up API request (enrollment PUT)
	const [attemptingSave, setAttemptingSave] = useState(false);
	const { user } = useContext(UserContext);
	const putParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
		id: enrollment.id,
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
		orgId: getIdForUser(user, 'org'),
		enrollment: enrollment ? enrollment : undefined,
	};
	const { error: saveError, loading: saving } = useApi<Enrollment>(
		api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(putParams),
		{
			skip: !user || !attemptingSave,
			callback: () => {
				setAttemptingSave(false);
			}
		}
	);

	// The form to interact with all current and historical family income information
	// including editing past determinations, and creating a new determination
	const sortedDeterminations = [...(enrollment.child.family.determinations || [])]
		.sort((a,b) => propertyDateSorter(a, b, det => det.determinationDate, true));
	const currentDetermination = sortedDeterminations[0];
	const pastDeterminations = sortedDeterminations.slice(1);

	const [showNew, setShowNew] = useState(false);
	const [didAddNew, setDidAddNew] = useState(false);
	const [isNew, setIsNew] = useState(false);
	const [forceClose, setForceClose] = useState(false);

	// Use catchall error to display a catchall error alert on _any_ saveError,
	// since no form fields have field-specific error alerting
		// useCatchallErrorAlert(saveError);

	// Handle successful API request
	useEffect(() => {
		if (loading) {
			return;
		}

		if(!saveError) {
			if(didAddNew) {
				setIsNew(true);
			}			
			setShowNew(false);
			setForceClose(true);
		}
	}, [loading, saveError, didAddNew]);

	if(loading) {
		return <>Loading...</>
	};

	const formOnSubmit = (_data: Enrollment) => {
		updateEnrollment(_data as DeepNonUndefineable<Enrollment>);
		setAttemptingSave(true);
	}

	return (
		<>
			<h2 className="margin-bottom-1">Family income determination</h2>
				{showNew &&
					<Card>
						<CardForm
							determinationId={0}
							isEditExpansion={false}
							formData={enrollment}
							onSubmit={(_data) => {
								setDidAddNew(true);
								formOnSubmit(_data);
							}}
							onCancel={() => setShowNew(false)}
						/>
					</Card>
				}

				 <div className="display-flex align-center">
					<h3>Current income determination</h3>
					&nbsp;&nbsp;&nbsp;
					{!showNew &&
							<Button
							text="Add new income determination"
							appearance="unstyled"
							onClick={() => setShowNew(true)}
						/>
					}
				</div>
				<div>
					{currentDetermination ? 
						<DeterminationCard
							determination={currentDetermination}
							isCurrent={true}
							isNew={isNew}
							forceClose={forceClose}
							expansion={
								<CardForm
									determinationId={currentDetermination.id}
									isEditExpansion={true}
									formData={enrollment}
									onSubmit={formOnSubmit}
								/>
							}
					 />
					: <p>No determinations</p>}
				</div>

				{pastDeterminations.length > 0 && (
					<>
						<div className="display-flex align-center">
							<h3>Past income determinations</h3>
						</div>
						<div>
							{pastDeterminations.map(determination => (
								<DeterminationCard
									determination={determination}
									isCurrent={false}
									forceClose={forceClose}
									expansion={
										<CardForm
											determinationId={currentDetermination.id}
											isEditExpansion={true}
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
	)
}
