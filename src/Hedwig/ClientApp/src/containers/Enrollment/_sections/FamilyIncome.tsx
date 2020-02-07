import React, { useState, useContext } from 'react';
import moment from 'moment';
import idx from 'idx';
import { Section } from '../enrollmentTypes';
import {
	Button,
	TextInput,
	DatePicker,
	Alert,
	ChoiceList,
	FieldSet,
	InlineIcon,
} from '../../../components';
import dateFormatter from '../../../utils/dateFormatter';
import notNullOrUndefined from '../../../utils/notNullOrUndefined';
import { ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest } from '../../../generated';
import parseCurrencyFromString from '../../../utils/parseCurrencyFromString';
import currencyFormatter from '../../../utils/currencyFormatter';
import { validatePermissions, getIdForUser } from '../../../utils/models';
import UserContext from '../../../contexts/User/UserContext';
import {
	sectionHasValidationErrors,
	processValidationError,
	warningForField,
	warningForFieldSet,
} from '../../../utils/validations';
import initialLoadErrorGuard from '../../../utils/validations/initialLoadErrorGuard';
import usePromiseExecution from '../../../hooks/usePromiseExecution';

const FamilyIncome: Section = {
	key: 'family-income',
	name: 'Family income determination',
	status: ({ enrollment }) => {
		if (idx(enrollment, _ => _.child.foster)) {
			return 'exempt';
		}
		return sectionHasValidationErrors([
			idx(enrollment, _ => _.child.family.determinations) || null,
		]) ||
			processValidationError(
				'child.family.determinations',
				enrollment ? enrollment.validationErrors : null
			)
			? 'incomplete'
			: 'complete';
	},
	Summary: ({ enrollment }) => {
		if (!enrollment || !enrollment.child || !enrollment.child.family) return <></>;
		const determination = idx(enrollment, _ => _.child.family.determinations[0]);
		const isFoster = enrollment.child.foster;
		let elementToReturn;

		if (isFoster) {
			elementToReturn = (
				<p>Household Income: This information is not required for foster children.</p>
			);
		} else if (
			!determination &&
			!processValidationError(
				'child.family.determinations',
				enrollment ? enrollment.validationErrors : null
			)
		) {
			elementToReturn = <p>No income determination on record.</p>;
		} else if (determination && determination.notDisclosed) {
			elementToReturn = <p>Income determination not disclosed.</p>;
		} else {
			elementToReturn = (
				<>
					<p>
						Household size:{' '}
						{determination && determination.numberOfPeople
							? determination.numberOfPeople
							: InlineIcon({ icon: 'incomplete' })}
					</p>
					<p>
						Annual household income:{' '}
						{determination && determination.income !== null && determination.income !== undefined
							? currencyFormatter(determination.income)
							: InlineIcon({ icon: 'incomplete' })}
					</p>
					<p>
						Determined on:{' '}
						{determination && determination.determinationDate
							? dateFormatter(determination.determinationDate)
							: InlineIcon({ icon: 'incomplete' })}
					</p>
				</>
			);
		}

		return <div className="FamilyIncomeSummary">{elementToReturn}</div>;
	},

	Form: ({ enrollment, siteId, mutate, successCallback, finallyCallback, visitedSections }) => {
		if (!enrollment || !enrollment.child || !enrollment.child.family) {
			throw new Error('FamilyIncome rendered without enrollment.child.family');
		}

		const initialLoad = visitedSections ? !visitedSections[FamilyIncome.key] : false;

		const { user } = useContext(UserContext);
		const defaultParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
			id: enrollment.id || 0,
			siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
			orgId: getIdForUser(user, 'org'),
			enrollment: enrollment,
		};

		const child = enrollment.child;
		const determination = idx(child, _ => _.family.determinations[0]) || undefined;
		const [numberOfPeople, updateNumberOfPeople] = React.useState(
			determination ? determination.numberOfPeople : null
		);
		const [income, updateIncome] = React.useState(determination ? determination.income : null);
		const [determinationDate, updateDeterminationDate] = React.useState(
			determination ? determination.determinationDate : null
		);
		const [notDisclosed, updateNotDisclosed] = useState(
			determination ? determination.notDisclosed : false
		);

		const args = {
			numberOfPeople,
			income,
			determinationDate,
			notDisclosed,
		};

		const _save = () => {
			if (enrollment && child && child.family) {
				const params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
					...defaultParams,
					enrollment: {
						...enrollment,
						child: {
							...child,
							family: {
								...child.family,
								determinations: determination
									? [
											{
												...determination,
												...args,
											},
									  ]
									: [
											{
												id: 0,
												familyId: child.family.id,
												...args,
											},
									  ],
							},
						},
					},
				};
				return (
					mutate(api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(params))
						.then(res => {
							if (successCallback && res) successCallback(res);
						})
						// TODO deal with error from server
						.catch()
						.finally(() => {
							finallyCallback && finallyCallback(FamilyIncome);
						})
				);
			}
			return new Promise(() => {});
			// TODO: what should happen if there is no enrollment, child, or family?  See also family info and enrollment funding
		};

		const { isExecuting: isMutating, setExecuting: save } = usePromiseExecution(_save);

		return (
			<form className="FamilyIncomeForm" onSubmit={save} noValidate autoComplete="off">
				<div className="usa-form">
					{!notDisclosed && (
						<>
							<FieldSet
								id="family-income"
								legend="Family income"
								status={initialLoadErrorGuard(
									initialLoad,
									warningForFieldSet(
										'family-income',
										['numberOfPeople', 'income', 'determinationDate'],
										determination ? determination : null,
										'This information is required for enrollment'
									) ||
										warningForFieldSet(
											'family-income',
											['child.family.determinations'],
											enrollment,
											'Income must be determined for funded enrollments'
										)
								)}
							>
								<div>
									<TextInput
										id="numberOfPeople"
										label="Household size"
										defaultValue={numberOfPeople ? '' + numberOfPeople : ''}
										onChange={event => {
											const value =
												parseInt(event.target.value.replace(/[^0-9.]/g, ''), 10) || null;
											updateNumberOfPeople(value);
										}}
										onBlur={event =>
											(event.target.value = numberOfPeople ? '' + numberOfPeople : '')
										}
										status={initialLoadErrorGuard(
											initialLoad,
											warningForField('numberOfPeople', determination ? determination : null, '')
										)}
										small
									/>
								</div>
								<div>
									<TextInput
										id="income"
										label="Annual household income"
										defaultValue={currencyFormatter(income)}
										onChange={event => {
											updateIncome(parseCurrencyFromString(event.target.value));
										}}
										onBlur={event =>
											(event.target.value = notNullOrUndefined(income)
												? currencyFormatter(income)
												: '')
										}
										status={initialLoadErrorGuard(
											initialLoad,
											warningForField('income', determination ? determination : null, '')
										)}
									/>
								</div>
								<DatePicker
									label="Date of income determination"
									id="income-determination-date"
									onChange={range =>
										updateDeterminationDate((range.startDate && range.startDate.toDate()) || null)
									}
									dateRange={{
										startDate: determinationDate ? moment(determinationDate) : null,
										endDate: null,
									}}
									status={initialLoadErrorGuard(
										initialLoad,
										warningForField('determintionDate', determination ? determination : null, '')
									)}
								/>
							</FieldSet>
						</>
					)}
					<ChoiceList
						type="check"
						legend="Family income disclosure"
						id="family-income-disclosed"
						className="margin-top-3"
						onChange={event => updateNotDisclosed((event.target as HTMLInputElement).checked)}
						selected={notDisclosed ? ['familyIncomeNotDisclosed'] : undefined}
						options={[
							{
								text: 'Family income not disclosed',
								value: 'familyIncomeNotDisclosed',
							},
						]}
						status={
							!notDisclosed
								? undefined
								: warningForFieldSet(
										'family-income-disclosed',
										['child.family.determinations'],
										enrollment,
										'Income must be disclosed for funded enrollments'
								  )
						}
					/>
				</div>

				{notDisclosed &&
					!processValidationError(
						'child.family.determinations',
						enrollment ? enrollment.validationErrors : null
					) && (
						<Alert
							type="info"
							text="Income information is required to enroll a child in a CDC funded space. You will not be able to assign this child to a funding space without this information."
						/>
					)}

				<div className="usa-form">
					<Button text={isMutating ? 'Saving...' : 'Save'} onClick="submit" disabled={isMutating} />
				</div>
			</form>
		);
	},
};

export default FamilyIncome;
