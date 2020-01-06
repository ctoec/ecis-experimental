import React, { useState, useContext, useEffect } from 'react';
import { Section } from '../enrollmentTypes';
import Button from '../../../components/Button/Button';
import TextInput from '../../../components/TextInput/TextInput';
import DatePicker from '../../../components/DatePicker/DatePicker';
import dateFormatter from '../../../utils/dateFormatter';
import notNullOrUndefined from '../../../utils/notNullOrUndefined';
import moment from 'moment';
import idx from 'idx';
import { ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest } from '../../../generated';
import Checklist from '../../../components/Checklist/Checklist';
import Alert from '../../../components/Alert/Alert';
import parseCurrencyFromString from '../../../utils/parseCurrencyFromString';
import currencyFormatter from '../../../utils/currencyFormatter';
import getIdForUser from '../../../utils/getIdForUser';
import UserContext from '../../../contexts/User/UserContext';
import {
	sectionHasValidationErrors,
	clientErrorForField,
	errorForFieldSet,
} from '../../../utils/validations';
import { determinationArgsAreValid } from '../../../utils/models';
import FieldSet from '../../../components/FieldSet/FieldSet';

const FamilyIncome: Section = {
	key: 'family-income',
	name: 'Family income determination',
	status: ({ enrollment }) => {
		if (idx(enrollment, _ => _.child.foster)) {
			return 'exempt';
		}
		return sectionHasValidationErrors([idx(enrollment, _ => _.child.family.determinations) || null])
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
		} else if (!determination) {
			elementToReturn = <p>No income determination on record.</p>;
		} else if (determination.notDisclosed) {
			elementToReturn = <p>Income determination not disclosed.</p>;
		} else {
			elementToReturn = (
				<>
					<p>Household size: {determination.numberOfPeople}</p>
					<p>Annual household income: ${idx(determination, _ => _.income.toFixed(2))}</p>
					<p>Determined on: {dateFormatter(idx(determination, _ => _.determinationDate))}</p>
				</>
			);
		}
		return <div className="FamilyIncomeSummary">{elementToReturn}</div>;
	},

	Form: ({ enrollment, mutate, callback }) => {
		if (!enrollment || !enrollment.child || !enrollment.child.family) {
			throw new Error('FamilyIncome rendered without enrollment.child.family');
		}

		const { user } = useContext(UserContext);
		const defaultParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
			id: enrollment.id || 0,
			siteId: getIdForUser(user, 'site'),
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
		const [validArgs, updateValidArgs] = useState();
		const [attemptedSave, updateAttemptedSave] = useState(false);

		useEffect(() => {
			if (determinationArgsAreValid(args)) {
				updateValidArgs(args);
			} else {
				updateValidArgs(undefined);
			}
		}, [JSON.stringify(args)]);

		function proceedWithoutCreatingDetermination(args: any) {
			return !args.notDisclosed && !args.numberOfPeople && !args.income && !args.determinationDate;
		}

		const save = () => {
			if (proceedWithoutCreatingDetermination(args)) {
				if (callback) {
					callback(enrollment);
				}
				return;
			}

			if (!validArgs) {
				updateAttemptedSave(true);
				return;
			}

			// If determination is added, all fields must be present
			// or notDisclosed must be true
			if ((numberOfPeople && income && determinationDate) || notDisclosed) {
				const args = {
					notDisclosed: notDisclosed,
					numberOfPeople: notDisclosed ? undefined : numberOfPeople || undefined,
					income: notDisclosed ? undefined : income || undefined,
					determined: notDisclosed ? undefined : determinationDate || undefined,
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
									determinations: determination
										? [
												{
													...determination,
													...validArgs,
												},
										  ]
										: [
												{
													id: 0,
													familyId: child.family.id,
													...validArgs,
												},
										  ],
								},
							},
						},
					};
					mutate(api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(params)).then(res => {
						if (callback && res) callback(res);
					});
				}
			}
		};

		var isFoster = enrollment.child.foster;

		if (isFoster) {
			save();
			return <></>;
		}

		return (
			<div className="FamilyIncomeForm">
				<div className="usa-form">
					{!notDisclosed && (
						<>
							<FieldSet
								id="family-income"
								legend="Family income determination"
								status={errorForFieldSet(
									'family-income',
									[numberOfPeople, income, determinationDate],
									attemptedSave && !notDisclosed,
									'If income is disclosed, this information is required for enrollment'
								)}
							>
								<TextInput
									id="numberOfPeople"
									label="Household size"
									defaultValue={numberOfPeople ? '' + numberOfPeople : ''}
									onChange={event => {
										const value = parseInt(event.target.value.replace(/[^0-9.]/g, ''), 10) || null;
										updateNumberOfPeople(value);
									}}
									onBlur={event => (event.target.value = numberOfPeople ? '' + numberOfPeople : '')}
									status={clientErrorForField(
										'numberOfPeople',
										numberOfPeople,
										attemptedSave && !notDisclosed
									)}
									small
								/>
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
									status={clientErrorForField('income', income, attemptedSave && !notDisclosed)}
								/>
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
									status={clientErrorForField('determinationDate', determinationDate, attemptedSave && !notDisclosed)}
								/>
							</FieldSet>
						</>
					)}
					<Checklist
						legend="Family income disclosure"
						id="familyIncome"
						options={[
							{
								text: 'Family income not disclosed',
								value: 'familyIncomeNotDisclosed',
								checked: notDisclosed,
								onChange: event => updateNotDisclosed(event.target.checked),
							},
						]}
					/>
				</div>

				{notDisclosed && (
					<Alert
						type="info"
						text="Income information is required to enroll a child in a CDC funded space. You will not be able to assign this child to a funding space without this information."
					/>
				)}

				<div className="usa-form">
					<Button text="Save" onClick={save} disabled={attemptedSave && !validArgs} />
				</div>
			</div>
		);
	},
};

export default FamilyIncome;
