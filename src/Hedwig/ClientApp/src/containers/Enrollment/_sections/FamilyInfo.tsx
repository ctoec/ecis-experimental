import React, { useState, useContext, useEffect, useReducer } from 'react';
import idx from 'idx';
import { Section } from '../enrollmentTypes';
import { Button, TextInput, ChoiceList, FieldSet } from '../../../components';
import {
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest,
	Enrollment,
} from '../../../generated';
import UserContext from '../../../contexts/User/UserContext';
import { validatePermissions, getIdForUser } from '../../../utils/models';
import {
	sectionHasValidationErrors,
	warningForFieldSet,
	warningForField,
	initialLoadErrorGuard,
	useFocusFirstError,
} from '../../../utils/validations';
import { addressFormatter, homelessnessText, fosterText } from '../../../utils/models';
import usePromiseExecution from '../../../hooks/usePromiseExecution';
import { isBlockingValidationError } from '../../../utils/validations/isBlockingValidationError';
import { validationErrorAlert } from '../../../utils/stringFormatters/alertTextMakers';
import AlertContext from '../../../contexts/Alert/AlertContext';
import { FormReducer, formReducer, updateData } from '../../../utils/forms/form';
import { DeepNonUndefineable } from '../../../utils/types';

const FamilyInfo: Section = {
	key: 'family-information',
	name: 'Family information',
	status: ({ enrollment }) =>
		sectionHasValidationErrors([idx(enrollment, _ => _.child.family) || null])
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
				{family && (
					<>
						<p>
							Address: {address} {missingInformation}
						</p>
						{foster && <p>{fosterText()}</p>}
						{homelessness && <p>{homelessnessText()}</p>}
					</>
				)}
			</div>
		);
	},

	Form: ({
		enrollment,
		siteId,
		mutate,
		error,
		successCallback,
		finallyCallback,
		visitedSections,
	}) => {
		if (!enrollment || !enrollment.child) {
			throw new Error('FamilyInfo rendered without a child');
		}

		// set up form state
		const { setAlerts } = useContext(AlertContext);
		const initialLoad = visitedSections ? !visitedSections[FamilyInfo.key] : false;
		const [hasAlertedOnError, setHasAlertedOnError] = useState(false);
		// We're not setting has alerted on error anywhere?

		useFocusFirstError([error]);
		useEffect(() => {
			if (error && !hasAlertedOnError) {
				if (!isBlockingValidationError(error)) {
					throw new Error(error.title || 'Unknown api error');
				}
				setAlerts([validationErrorAlert]);
			}
		}, [error, hasAlertedOnError]);

		const [_enrollment, updateEnrollment] = useReducer<
			FormReducer<DeepNonUndefineable<Enrollment>>
		>(formReducer, enrollment);
		const updateFormData = updateData<DeepNonUndefineable<Enrollment>>(updateEnrollment);

		const child = _enrollment.child;
		const { user } = useContext(UserContext);
		const defaultParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
			id: _enrollment.id || 0,
			orgId: getIdForUser(user, 'org'),
			siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
			enrollment: _enrollment,
		};

		const {
			family: { addressLine1, addressLine2, town, state, zip, homelessness },
			foster,
		} = child || {};

		const _save = () => {
			if (enrollment.child && enrollment.id) {
				const params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
					...defaultParams,
					id: enrollment.id,
					enrollment: {
						..._enrollment,
					},
				};
				return mutate(api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(params))
					.then(res => {
						if (successCallback && res && !error) successCallback(res);
					})
					.finally(() => {
						finallyCallback && finallyCallback(FamilyInfo);
					});
			}
			return new Promise(() => {});
			// TODO: what should happen if there is no child or enrollment id?  See also family income
		};

		const { isExecuting: isMutating, setExecuting: save } = usePromiseExecution(_save);

		return (
			<form className="FamilyInfoForm usa-form" onSubmit={save} noValidate autoComplete="off">
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
							'This information is required for OEC reporting'
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
							onChange={updateFormData(newAddressLine1 => newAddressLine1)}
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
							onChange={updateFormData(newAddressLine2 => newAddressLine2)}
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
							onChange={updateFormData(newTown => newTown)}
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
							// onChange={(event, selectedValues) => updateState(selectedValues[0])}
							onChange={updateFormData(newState => newState)}
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
							onChange={updateFormData(newZip => newZip)}
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
				<Button text={isMutating ? 'Saving...' : 'Save'} onClick="submit" disabled={isMutating} />
			</form>
		);
	},
};

export default FamilyInfo;
