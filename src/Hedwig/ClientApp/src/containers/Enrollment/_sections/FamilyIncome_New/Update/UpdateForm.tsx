import React, { useState, useContext } from 'react';
import { SectionProps } from '../../../enrollmentTypes';
import produce from 'immer';
import { DeepNonUndefineable } from '../../../../../utils/types';
import { Enrollment, Family, ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest, FamilyDetermination } from '../../../../../generated';
import UserContext from '../../../../../contexts/User/UserContext';
import { validatePermissions, getIdForUser } from '../../../../../utils/models';
import useApi from '../../../../../hooks/useApi';
import useCatchallErrorAlert from '../../../../../hooks/useCatchallErrorAlert';
import Form from '../../../../../components/Form_New/Form';
import { Button, Card } from '../../../../../components';
import { propertyDateSorter } from '../../../../../utils/dateSorter';
import { CardExpansion } from '../../../../../components/Card/CardExpansion';
import { Summary } from './Summary';
import { AddForm } from './AddForm';
import { EditForm } from './EditForm';
import { useEffect } from '@storybook/addons';

export const UpdateForm = ({
	enrollment, 
	updateEnrollment,
	siteId,
	loading,
	successCallback
}: SectionProps) => {
	// Enrollment and child must already exist to create family income data,
	// and cannot be created without user input (have required non null fields)
	if(!enrollment || !enrollment.child || !enrollment.child.family) {
		throw new Error('Section rendered without enrollment or child');
	}

	// Family must already exist to create family income data,
	// but can be created without user input with all empty defaults
	if(!enrollment.child.family) {
		updateEnrollment(produce<DeepNonUndefineable<Enrollment>>(
			enrollment, draft => draft.child.family = {} as DeepNonUndefineable<Family>
		))
	}

	if(loading) {
		return <>Loading...</>
	};

	// Set up API request (enrollment PUT)
	const [attemptingSave, setAttemptingSave] = useState(false);
	const { user } = useContext(UserContext);
	const putParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
		id: enrollment.id,
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
		orgId: getIdForUser(user, 'org'),
		enrollment
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
	const sortedDeterminations = (enrollment.child.family.determinations || [])
		.sort((a,b) => propertyDateSorter(a, b, det => det.determinationDate, true));
	const currentDetermination = sortedDeterminations[0];
	const pastDeterminations = sortedDeterminations.slice(1);
	const [showNew, setShowNew] = useState(false);
	const [didAddNew, setDidAddNew] = useState(false);
	const [isNew, setIsNew] = useState(false);
	const [forceClose, setForceClose] = useState(false);

	// Use catchall error to display a catchall error alert on _any_ saveError,
	// since no form fields have field-specific error alerting
	useCatchallErrorAlert(saveError);

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
	});

	return (
		<>
			<h2 className="margin-bottom-1">Family income determination</h2>
				{showNew &&
					<Card>
						<AddForm 
							formData={enrollment}
							onSubmit={(_data) => {updateEnrollment(_data as DeepNonUndefineable<Enrollment>)}}
							onCancel={() => { setShowNew(false) }}
						/>
					</Card>
				}
				<div className="display-flex align-center">
					<h3>Current income determination</h3>
					&nbsp;&nbsp;&nbsp;
					<Button
						text="Add new income determination"
						appearance="unstyled"
						onClick={() => setShowNew(true)}
					/>
				</div>
				<div>
					{currentDetermination ? (
						<Card
							showTag={isNew}
							forceClose={forceClose}
						>
							<Summary determination={currentDetermination}/>
							{/* 
								summary for not disclosed determinations 
								do NOT have ExpandCard buttons, so they
								do NOT need CardExpansion content
							*/}
							{!currentDetermination.notDisclosed &&
								<CardExpansion>
									<EditForm id={currentDetermination.id}/>
								</CardExpansion>
							}	
						</Card>
					): (<p>No determinations</p>)}
				</div>
				{pastDeterminations.length > 0 && (
					pastDeterminations.map(determination => (
						<Card
							appearance="secondary"
							className="margin-bottom-2"
							forceClose={forceClose}
							key={determination.id}
						>
							<Summary determination={determination}/>
							<CardExpansion>
								<EditForm id={determination.id}/>
							</CardExpansion>
						</Card>
					))
				)}
			</Form>
		</>
	)
}
