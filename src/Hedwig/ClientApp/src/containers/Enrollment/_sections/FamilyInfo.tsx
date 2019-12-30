import React, { useState, useContext } from 'react';
import { Section } from '../enrollmentTypes';
import Button from '../../../components/Button/Button';
import TextInput from '../../../components/TextInput/TextInput';
import Checklist from '../../../components/Checklist/Checklist';
import idx from 'idx';
import { ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest } from '../../../generated';
import UserContext from '../../../contexts/User/UserContext';
import getIdForUser from '../../../utils/getIdForUser';
import { sectionHasValidationErrors, hasValidationErrors, processValidationError, warningForFieldSet, warningForField } from '../../../utils/validations';
import FieldSet from '../../../components/FieldSet/FieldSet';
import { addressFormatter, homelessnessText, fosterText } from '../../../utils/models';

const FamilyInfo: Section = {
	key: 'family-information',
	name: 'Family information',
	status: ({ enrollment }) =>  sectionHasValidationErrors([idx(enrollment, _ => _.child.family) || null]) ? 'incomplete' : 'complete',

	Summary: ({ enrollment }) => {
		if (!enrollment || !enrollment.child) return <></>;

		const family = enrollment.child.family;
		const [address, missingInformation] = addressFormatter(family);
		const foster = enrollment.child.foster;
		const homelessness = family.homelessness;
		return (
			<div className="FamilyInfoSummary">
				{family && (address || foster || homelessness) ? (
					<>
						<p>Address: {address} {missingInformation}</p>
						{foster && <p>{fosterText()}</p>}
						{homelessness && <p>{homelessnessText()}</p>}
					</>
				) : (
					<p>No family information on record.</p>
				)}
			</div>
		);
	},

	Form: ({ enrollment, mutate, callback }) => {
		if (!enrollment || !enrollment.child) {
			throw new Error('FamilyInfo rendered without a child');
		}

		const child = enrollment.child;
		const { user } = useContext(UserContext);
		const defaultParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
			id: enrollment.id || 0,
			orgId: getIdForUser(user, "org"),
			siteId: getIdForUser(user, "site"),
			enrollment: enrollment
		}

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

		const save = () => {
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
								organizationId: getIdForUser(user, "org"),
								...child.family,
								...args
							}
						}
					}
				}
				mutate((api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(params))
					.then((res) => {
						if(callback && res) callback(res);
					})
			}
		}

		return (
			<div className="FamilyInfoForm usa-form">
				<h3>Address</h3>
				<FieldSet
					id="family-address"
					legend="Address"
					status={warningForFieldSet(
						'family-address',
						['addressLine1', 'state', 'town', 'zip'],
						idx(enrollment, _ => _.child.family) || null,
						'This information is required for OEC reporting',
					)}
					display="inline-block"
				>
					<div className="mobile-lg:grid-col-12">
						<TextInput
							id="addressLine1"
							label="Address line 1"
							defaultValue={addressLine1 || ''}
							onChange={event => updateAddressLine1(
								event.target.value ? event.target.value : null
							)}
							status={warningForField(
								'addressLine1',
								idx(enrollment, _ => _.child.family) || null,
								''
							)}
						/>
					</div>
					<div className="mobile-lg:grid-col-12">
						<TextInput
							id="addressLine2"
							label="Address line 2"
							defaultValue={addressLine2 || ''}
							onChange={event => updateAddressLine2(
								event.target.value ? event.target.value : null
							)}
							optional={true}
						/>
					</div>
					<div className="mobile-lg:grid-col-4 display-inline-block">
						<TextInput
							id="state"
							label="State"
							defaultValue={state || ''}
							onChange={event => updateState(
								event.target.value ? event.target.value : null
							)}
							status={warningForField(
								'state',
								idx(enrollment, _ => _.child.family) || null,
								''
							)}
						/>
					</div>
					<div className="mobile-lg:grid-col-8 display-inline-block">
						<TextInput
							id="town"
							label="Town"
							defaultValue={town || '' }
							onChange={event => updateTown(
								event.target.value ? event.target.value : null
							)}
							status={warningForField(
								'town',
								idx(enrollment, _ => _.child.family) || null,
								''
							)}
						/>
					</div>
					<div className="mobile-lg:grid-col-6">
						<TextInput
							id="zip"
							label="ZIP Code"
							defaultValue={zip || ''}
							onChange={event => updateZip(
								event.target.value ? event.target.value : null
							)}
							status={warningForField(
								'zip',
								idx(enrollment, _ => _.child.family) || null,
								''
							)}
						/>
					</div>
				</FieldSet>

				<h3>Other</h3>
				<div className="margin-top-3">
					<Checklist
						legend="Foster"
						id="foster"
						options={[
							{
								text: fosterText(),
								value: 'foster',
								checked: foster,
								onChange: event => updateFoster(event.target.checked),
							},
						]}
					/>
					<Checklist
						legend="Homelessness"
						id="homelessness"
						options={[
							{
								text: homelessnessText(),
								value: 'homelessness',
								checked: homelessness || false,
								onChange: event => updateHomelessness(event.target.checked),
							},
						]}
					/>
				</div>
				<p className="oec-form-helper">
					Indicate if you are aware that the family has experienced housing insecurity, including
					overcrowded housing, within the last year.
				</p>
				<Button text="Save" onClick={save} />
			</div>
		);
	},
};

export default FamilyInfo;
