import React from 'react';
import { Section } from '../enrollmentTypes';
import Button from '../../../components/Button/Button';
import TextInput from '../../../components/TextInput/TextInput';
import DatePicker from '../../../components/DatePicker/DatePicker';
import dateFormatter from '../../../utils/dateFormatter';
import moment from 'moment';
import idx from 'idx';
import { ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest } from '../../../OAS-generated';

const FamilyIncome: Section = {
	key: 'family-income',
	name: 'Family income',
	status: () => 'complete',

	Summary: ({ enrollment }) => {
		if (!enrollment) return <></>;
		const determination = idx(enrollment, _ => _.child.family.determinations[0])
		return (
			<div className="FamilyIncomeSummary">
				{determination ? (
					<>
						<p>Household size: {determination.numberOfPeople}</p>
						<p>Annual household income: ${idx(determination, _ => _.income.toFixed(2))}</p>
						<p>Determined on: {dateFormatter(idx(determination, _ => _.determined))}</p>
					</>
				) : (
					<p>No income determination on record.</p>
				)}
			</div>
		);
	},

	Form: ({ enrollment, mutate }) => {
		if(!enrollment || ! enrollment.child || !enrollment.child.family) {
			throw new Error('FamilyIncome rendered without a family');
		}

		const defaultParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
			id: enrollment.id || 0,
			siteId: idx(enrollment, _ => _.siteId) || 0,
			orgId: idx(enrollment, _ => _.site.organizationId) || 0,
			enrollment: enrollment
		}

		const child = enrollment.child;
		const determination = idx(child, _ => _.family.determinations[0]) || undefined;
		const [numberOfPeople, updateNumberOfPeople] = React.useState(
			determination ? determination.numberOfPeople : null
		);
		const [income, updateIncome] = React.useState(determination ? determination.income : null);
		const [determined, updateDetermined] = React.useState(
			determination ? determination.determined : null
		);

		const save = () => {
            // If determination is not added, allow user to proceed without creating one
			if (!numberOfPeople && !income && !determined) {
				mutate((api) => Promise.resolve(enrollment), (_, result) => result);
				return;
			}

			// If determination is added, all fields must be present
			if (numberOfPeople && income && determined) {
				const args = {
					numberOfPeople: numberOfPeople || undefined,
					income: income || undefined,
					determined: determined || undefined,
				};

				if (enrollment && child && child.family) {
					const params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
						...defaultParams,
						enrollment: {
							...enrollment,
							child: {
								...child,
								family: {
									...child.family,
									determinations: determination ? [{
										...determination,
										...args
									}] : [{...args}]
								}
							}
						}
					};
					mutate((api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(params), (_, result) => result);
				}
			}
		};

		return (
			<div className="FamilyIncomeForm usa-form">
				<TextInput
					id="numberOfPeople"
					label="Household size"
					defaultValue={numberOfPeople ? '' + numberOfPeople : ''}
					onChange={event => {
						const value = parseInt(event.target.value.replace(/[^0-9.]/g, ''), 10) || null;
						updateNumberOfPeople(value);
					}}
					onBlur={event => (event.target.value = numberOfPeople ? '' + numberOfPeople : '')}
					small
				/>
				<TextInput
					id="income"
					label="Annual household income"
					defaultValue={income ? '$' + income.toFixed(2) : ''}
					onChange={event => {
						const value =
							Math.round(parseFloat(event.target.value.replace(/[^0-9.]/g, '')) * 100) / 100 ||
							null;
						updateIncome(value);
					}}
					onBlur={event => (event.target.value = income ? '$' + income.toFixed(2) : '')}
				/>
				<label className="usa-label" htmlFor="date">
					Date determined
				</label>
				<DatePicker
					onChange={range =>
						updateDetermined((range.startDate && range.startDate.toDate()) || null)
					}
					dateRange={{ startDate: determined ? moment(determined) : null, endDate: null }}
				/>
				<Button text="Save" onClick={save} />
			</div>
		);
	},
};

export default FamilyIncome;
