import React, { useState } from 'react';
import useAuthMutation from '../../../hooks/useAuthMutation';
import { CREATE_FAMILY_MUTATION, UPDATE_FAMILY_MUTATION, CHILD_QUERY } from '../enrollmentQueries';
import { CreateFamilyMutation } from '../../../generated/CreateFamilyMutation';
import { UpdateFamilyMutation } from '../../../generated/UpdateFamilyMutation';
import { ChildQuery } from '../../../generated/ChildQuery';
import { Section } from '../enrollmentTypes';
import Button from '../../../components/Button/Button';
import TextInput from '../../../components/TextInput/TextInput';
import Checklist from '../../../components/Checklist/Checklist';
import mapEmptyStringsToNull from '../../../utils/mapEmptyStringsToNull';
import useApi from '../../../hooks/useApi';
import { Enrollment, Child, ApiOrganizationsOrgIdChildrenIdPutRequest } from '../../../OAS-generated';
import idx from 'idx';

const FamilyInfo: Section = {
	key: 'family-information',
	name: 'Family information',
	status: () => 'complete',

	Summary: ({ enrollment }) => {
		if (!enrollment || ! enrollment.child) return <></>;

		const child = enrollment.child;
		return (
			<div className="FamilyInfoSummary">
				{child && child.family && child.family.town && child.family.state && (
					<p>
						{child.family.town}, {child.family.state}
					</p>
				)}
			</div>
		);
	},

	Form: ({ enrollment, mutate }) => {
		console.log("info", enrollment);
		if (!enrollment || !enrollment.child) {
			throw new Error('FamilyInfo rendered without a child');
			// return <></>;
		}

		const child = enrollment.child;
		const [params, setParams] = useState<ApiOrganizationsOrgIdChildrenIdPutRequest>({
			id: child.id || '',
			orgId: idx(enrollment, _ => _.site.organizationId) || 0,
			child: child
		});
		const [skip, setSkip] = useState<boolean>(true);
		const [loading, error, _enrollment] = useApi<Child>(
			(api) => api.apiOrganizationsOrgIdChildrenIdPut(params),
			[params],
			child,
			skip
		);
		
		const [createFamily] = useAuthMutation<CreateFamilyMutation>(CREATE_FAMILY_MUTATION, {
			update: (cache, { data }) => {
				const cachedData = cache.readQuery<ChildQuery>({
					query: CHILD_QUERY,
					variables: { id: child.id },
				});

				if (cachedData && cachedData.child) {
					cachedData.child.family = data.createFamilyWithChild;

					cache.writeQuery({
						query: CHILD_QUERY,
						data: cachedData,
						variables: { id: child.id },
					});
				}
			},
			onCompleted: () => {
				// if (afterSave) {
				// 	afterSave(enrollment);
				// }
			},
		});

		const [updateFamily] = useAuthMutation<UpdateFamilyMutation>(UPDATE_FAMILY_MUTATION, {
			onCompleted: () => {
				// if (afterSave) {
				// 	afterSave(enrollment);
				// }
			},
		});

		const [addressLine1, updateAddressLine1] = React.useState(
			child.family ? child.family.addressLine1 : null
		);
		const [addressLine2, updateAddressLine2] = React.useState(
			child.family ? child.family.addressLine2 : null
		);
		const [town, updateTown] = React.useState(child.family ? child.family.town : null);
		const [state, updateState] = React.useState(child.family ? child.family.state : null);
		const [zip, updateZip] = React.useState(child.family ? child.family.zip : null);
		const [homelessness, updateHomelessness] = React.useState(
			child.family ? child.family.homelessness : null
		);

		// TODO: On the child model, no mutation yet in place
		const [foster, updateFoster] = React.useState(child.foster);

		const save = () => {
			const args = mapEmptyStringsToNull({
				addressLine1,
				addressLine2,
				town,
				state,
				zip,
				homelessness,
			});

			if (child.family) {
				updateFamily({ variables: { ...args, id: child.family.id } });
			} else {
				createFamily({ variables: { ...args, childId: child.id } });
			}
		};

		return (
			<div className="FamilyInfoForm usa-form">
				<h3>Address</h3>
				<div className="grid-row grid-gap">
					<div className="mobile-lg:grid-col-12">
						<TextInput
							id="addressLine1"
							label="Address line 1"
							defaultValue={addressLine1 || ''}
							onChange={event => updateAddressLine1(event.target.value)}
						/>
					</div>
					<div className="mobile-lg:grid-col-12">
						<TextInput
							id="addressLine2"
							label="Address line 2"
							defaultValue={addressLine2 || ''}
							onChange={event => updateAddressLine2(event.target.value)}
							optional={true}
						/>
					</div>
					<div className="mobile-lg:grid-col-4">
						<TextInput
							id="state"
							label="State"
							defaultValue={state || ''}
							onChange={event => updateState(event.target.value)}
						/>
					</div>
					<div className="mobile-lg:grid-col-8">
						<TextInput
							id="town"
							label="Town"
							defaultValue={town || ''}
							onChange={event => updateTown(event.target.value)}
						/>
					</div>
					<div className="mobile-lg:grid-col-6">
						<TextInput
							id="zip"
							label="ZIP Code"
							defaultValue={zip || ''}
							onChange={event => updateZip(event.target.value)}
						/>
					</div>
				</div>
				<h3>Other</h3>
				<div className="margin-top-3">
					<Checklist
						groupName="foster"
						legend="Foster status"
						options={[
							{
								text: 'Child lives with foster family',
								value: 'foster',
								checked: foster || false,
								onChange: event => updateFoster(event.target.checked),
							},
						]}
					/>
					<Checklist
						groupName="homelessness"
						legend="Homeless status"
						options={[
							{
								text: 'Family has experienced homelessness or housing insecurity',
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
