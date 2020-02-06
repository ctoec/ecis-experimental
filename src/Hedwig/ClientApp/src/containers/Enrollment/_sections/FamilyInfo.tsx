import React, { useState, useContext } from 'react';
import idx from 'idx';
import { Section } from '../enrollmentTypes';
import { Button, TextInput, ChoiceList, FieldSet } from '../../../components';
import { ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest } from '../../../generated';
import UserContext from '../../../contexts/User/UserContext';
import { validatePermissions, getIdForUser } from '../../../utils/models';
import {
	sectionHasValidationErrors,
	warningForFieldSet,
	warningForField,
} from '../../../utils/validations';
import { addressFormatter, homelessnessText, fosterText } from '../../../utils/models';
import initialLoadErrorGuard from '../../../utils/validations/initialLoadErrorGuard';
import useIsExecuting from '../../../hooks/useIsExecuting';

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
				{family &&
					<>
						<p>
							Address: {address} {missingInformation}
						</p>
						{foster && <p>{fosterText()}</p>}
						{homelessness && <p>{homelessnessText()}</p>}
					</>
				}
			</div>
		);
	},

	Form: ({ enrollment, siteId, mutate, successCallback, finallyCallback, visitedSections }) => {
		if (!enrollment || !enrollment.child) {
			throw new Error('FamilyInfo rendered without a child');
		}

		const initialLoad = visitedSections ? !visitedSections[FamilyInfo.key] : false;

		const child = enrollment.child;
		const { user } = useContext(UserContext);
		const defaultParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
			id: enrollment.id || 0,
			orgId: getIdForUser(user, 'org'),
			siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
			enrollment: enrollment,
		};

		const [addressLine1, updateAddressLine1] = useState(
			child.family ? child.family.addressLine1 : null
		);
		const [addressLine2, updateAddressLine2] = useState(
			child.family ? child.family.addressLine2 : null
		);
		const [town, updateTown] = useState(child.family ? child.family.town : null);
		const [state, updateState] = useState(child.family ? child.family.state : null);
		const [zip, updateZip] = useState(child.family ? child.family.zip : null);
		const [homelessness, updateHomelessness] = useState(
			child.family ? child.family.homelessness : undefined
		);

		const [foster, updateFoster] = useState(child.foster ? child.foster : false);

		const _save = () => {
			const args = {
				addressLine1,
				addressLine2,
				town,
				state,
				zip,
				homelessness,
			};

			if (enrollment.child && enrollment.id) {
				const params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
					...defaultParams,
					id: enrollment.id,
					enrollment: {
						...enrollment,
						child: {
							...child,
							foster,
							family: {
								id: child.familyId || 0,
								organizationId: getIdForUser(user, 'org'),
								...child.family,
								...args,
							},
						},
					},
				};
				return mutate(api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(params))
					.then(res => {
						if (successCallback && res) successCallback(res);
					})
					.finally(() => {
						finallyCallback && finallyCallback(FamilyInfo);
					});
			}
			return new Promise(() => {});
			// TODO: what should happen if there is no child or enrollment id?  See also family income
		};

		const { isExecuting: isMutating, updateIsExecuting: save } = useIsExecuting(_save);

		return (
			<form className="FamilyInfoForm usa-form" onSubmit={save} noValidate autoComplete="off">
				<h3>Address</h3>
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
							id="addressLine1"
							label="Address line 1"
							defaultValue={addressLine1 || ''}
							onChange={event => updateAddressLine1(event.target.value ? event.target.value : null)}
							status={initialLoadErrorGuard(
								initialLoad,
								warningForField('addressLine1', idx(enrollment, _ => _.child.family) || null, '')
							)}
						/>
					</div>
					<div className="mobile-lg:grid-col-12">
						<TextInput
							id="addressLine2"
							label="Address line 2"
							defaultValue={addressLine2 || ''}
							onChange={event => updateAddressLine2(event.target.value ? event.target.value : null)}
							optional={true}
						/>
					</div>
					<div className="mobile-lg:grid-col-8 display-inline-block">
						<TextInput
							id="town"
							label="Town"
							defaultValue={town || ''}
							onChange={event => updateTown(event.target.value ? event.target.value : null)}
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
							options={['CT', 'MA', 'NY', 'RI'].map(_state => ({ text: _state, value: _state }))}
							selected={state ? [state] : undefined}
							onChange={(event, selectedValues) => updateState(selectedValues[0])}
							status={initialLoadErrorGuard(
								initialLoad,
								warningForField('state', idx(enrollment, _ => _.child.family) || null, '')
							)}
						/>
					</div>
					<div className="mobile-lg:grid-col-6">
						<TextInput
							id="zip"
							label="ZIP Code"
							defaultValue={zip || ''}
							onChange={event => updateZip(event.target.value ? event.target.value : null)}
							status={initialLoadErrorGuard(
								initialLoad,
								warningForField('zip', idx(enrollment, _ => _.child.family) || null, '')
							)}
						/>
					</div>
				</FieldSet>

				<h3>Other</h3>
				<ChoiceList
					type="check"
					legend="Foster"
					id="foster"
					selected={foster ? ['foster'] : undefined}
					onChange={event => updateFoster(((event.target as unknown) as HTMLInputElement).checked)}
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
					selected={homelessness ? ['homelessness'] : undefined}
					onChange={event =>
						updateHomelessness(((event.target as unknown) as HTMLInputElement).checked)
					}
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
				<Button text={isMutating ? 'Saving' : 'Save'} onClick="submit" disabled={isMutating} />
			</form>
		);
	},
};

export default FamilyInfo;
