import React, { useContext, useEffect, useReducer, useState } from 'react';
import idx from 'idx';
import { Section } from '../enrollmentTypes';
import { Button, TextInput, ChoiceList, FieldSet } from '../../../components';
import {
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest,
	Enrollment,
} from '../../../generated';
import UserContext from '../../../contexts/User/UserContext';
import { validatePermissions, getIdForUser, createEmptyFamily } from '../../../utils/models';
import {
	sectionHasValidationErrors,
	warningForFieldSet,
	warningForField,
	initialLoadErrorGuard,
	useFocusFirstError,
	processValidationError,
} from '../../../utils/validations';
import { addressFormatter, homelessnessText, fosterText } from '../../../utils/models';
import { isBlockingValidationError } from '../../../utils/validations/isBlockingValidationError';
import { validationErrorAlert } from '../../../utils/stringFormatters/alertTextMakers';
import AlertContext from '../../../contexts/Alert/AlertContext';
import { FormReducer, formReducer, updateData } from '../../../utils/forms/form';
import { DeepNonUndefineable } from '../../../utils/types';
import useApi, { ApiError } from '../../../hooks/useApi';
import { REQUIRED_FOR_OEC_REPORTING } from '../../../utils/validations/messageStrings';

const FamilyInfo: Section = {
	key: 'family-information',
	name: 'Family information',
	status: ({ enrollment }) =>
		sectionHasValidationErrors([idx(enrollment, _ => _.child.family) || null]) ||
		processValidationError('familyid', idx(enrollment, _ => _.child.validationErrors) || null)
			? 'incomplete'
			: 'complete',

	Summary: ({ enrollment }) => {
		if (!enrollment || !enrollment.child) return <></>;

		const family = enrollment.child.family;
		const [address, missingInformation] = addressFormatter(family);
		const foster = enrollment.child.foster;
		const homelessness = family && family.homelessness;
		return (
			<div className="FamilyInfoSummary">
				{family ? (
					<>
						<p>
							Address: {address} {missingInformation}
						</p>
						{foster && <p>{fosterText()}</p>}
						{homelessness && <p>{homelessnessText()}</p>}
					</>
				) : (
					<p>No family information on record.</p>
				)}
			</div>
		);
	},

	Form: ({
		enrollment,
		siteId,
		error: inputError,
		successCallback,
		visitSection,
		visitedSections,
	}) => {
		if (!enrollment || !enrollment.child) {
			throw new Error('FamilyInfo rendered without a child');
		}

		// set up form state
		const { setAlerts } = useContext(AlertContext);
		const initialLoad = visitedSections ? !visitedSections[FamilyInfo.key] : false;

		// const [hasAlertedOnError, setHasAlertedOnError] = useState(false);
		// Above line is left to show symmetry for future form component refactor-- wasn't actually used in this component

		const [error, setError] = useState<ApiError | null>(inputError);

		useFocusFirstError([error]);
		useEffect(() => {
			if (error) {
				if (!isBlockingValidationError(error)) {
					throw new Error(error.title || 'Unknown api error');
				}
				setAlerts([validationErrorAlert]);
			}
		}, [error]);

		const [_enrollment, updateEnrollment] = useReducer<
			FormReducer<DeepNonUndefineable<Enrollment>>
		>(formReducer, enrollment);
		const updateFormData = updateData<DeepNonUndefineable<Enrollment>>(updateEnrollment);

		const { user } = useContext(UserContext);

		if (!_enrollment.child.family) {
			// If there isn't a family, create one-- otherwise user can save section without making one
			updateFormData(e => e.value)({
				name: 'child.family',
				value: createEmptyFamily(getIdForUser(user, 'org'), enrollment.child.familyId || 0),
			});
		}
		const child = _enrollment.child;
		const { foster, family } = child;
		const { addressLine1, addressLine2, town, state, zip, homelessness } = family || {};

		const defaultParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
			id: _enrollment.id,
			orgId: getIdForUser(user, 'org'),
			siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
			enrollment: _enrollment,
		};

		const [attemptingSave, setAttemptingSave] = useState(false);
		const { error: saveError, data: saveData } = useApi<Enrollment>(
			api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(defaultParams),
			{
				skip: !attemptingSave,
				callback: () => {
					setAttemptingSave(false);
					visitSection && visitSection(FamilyInfo);
				},
			}
		);

		useEffect(() => {
			// If the request went through, then do the next steps
			if (!saveData && !saveError) {
				return;
			}
			// Set the new error regardless of whether there is one
			setError(saveError);
			if (saveData && !saveError) {
				if (successCallback) successCallback(saveData);
			}
		}, [saveData, saveError]);

		return (
			<form className="FamilyInfoForm usa-form" noValidate autoComplete="off">
				<h2>Address</h2>
				<FieldSet
					id="family-address"
					legend="Address"
					status={initialLoadErrorGuard(
						initialLoad,
						warningForFieldSet(
							'family-address',
							['addressLine1', 'state', 'town', 'zip'],
							idx(enrollment, _ => _.child.family) || null,
							REQUIRED_FOR_OEC_REPORTING
						)
					)}
					className="display-inline-block"
				>
					<div className="mobile-lg:grid-col-12">
						<TextInput
							type="input"
							id="addressLine1"
							label="Address line 1"
							name="child.family.addressLine1"
							defaultValue={addressLine1 || ''}
							onChange={updateFormData()}
							status={initialLoadErrorGuard(
								initialLoad,
								warningForField('addressLine1', idx(enrollment, _ => _.child.family) || null, '')
							)}
						/>
					</div>
					<div className="mobile-lg:grid-col-12">
						<TextInput
							type="input"
							id="addressLine2"
							label="Address line 2"
							name="child.family.addressLine2"
							defaultValue={addressLine2 || ''}
							onChange={updateFormData()}
							optional={true}
						/>
					</div>
					<div className="mobile-lg:grid-col-8 display-inline-block">
						<TextInput
							type="input"
							id="town"
							label="Town"
							name="child.family.town"
							defaultValue={town || ''}
							onChange={updateFormData()}
							status={initialLoadErrorGuard(
								initialLoad,
								warningForField('town', idx(enrollment, _ => _.child.family) || null, '')
							)}
						/>
					</div>
					<div className="mobile-lg:grid-col-4 display-inline-block">
						<ChoiceList
							type="select"
							id="state"
							label="State"
							name="child.family.state"
							options={['CT', 'MA', 'NY', 'RI'].map(_state => ({ text: _state, value: _state }))}
							selected={state ? [state] : undefined}
							onChange={updateFormData()}
							status={initialLoadErrorGuard(
								initialLoad,
								warningForField('state', idx(enrollment, _ => _.child.family) || null, '')
							)}
						/>
					</div>
					<div className="mobile-lg:grid-col-6">
						<TextInput
							type="input"
							id="zip"
							label="ZIP Code"
							name="child.family.zip"
							defaultValue={zip || ''}
							onChange={updateFormData()}
							status={initialLoadErrorGuard(
								initialLoad,
								warningForField('zip', idx(enrollment, _ => _.child.family) || null, '')
							)}
						/>
					</div>
				</FieldSet>

				<h2>Other</h2>
				<ChoiceList
					type="check"
					legend="Foster"
					id="foster"
					name="child.foster"
					selected={foster ? ['foster'] : undefined}
					onChange={updateFormData((_, event) => event.target.checked)}
					options={[
						{
							text: fosterText(),
							value: 'foster',
						},
					]}
				/>
				<ChoiceList
					type="check"
					legend="Homelessness"
					id="homelessness"
					name="child.family.homelessness"
					selected={homelessness ? ['homelessness'] : undefined}
					onChange={updateFormData((_, event) => event.target.checked)}
					options={[
						{
							text: homelessnessText(),
							value: 'homelessness',
						},
					]}
				/>
				<p className="usa-hint text-italic">
					Indicate if you are aware that the family has experienced housing insecurity, including
					overcrowded housing, within the last year.
				</p>
				<Button
					text={attemptingSave ? 'Saving...' : 'Save'}
					onClick={() => setAttemptingSave(true)}
					disabled={attemptingSave}
				/>
			</form>
		);
	},
};

export default FamilyInfo;
