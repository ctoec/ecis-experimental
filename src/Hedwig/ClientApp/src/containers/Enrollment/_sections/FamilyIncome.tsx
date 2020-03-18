import React, { useState, useContext, useEffect, useReducer } from 'react';
import moment from 'moment';
import idx from 'idx';
import { Section } from '../enrollmentTypes';
import {
	Button,
	TextInput,
	DateInput,
	Alert,
	ChoiceList,
	FieldSet,
	InlineIcon,
} from '../../../components';
import dateFormatter from '../../../utils/dateFormatter';
import notNullOrUndefined from '../../../utils/notNullOrUndefined';
import {
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest,
	Enrollment,
} from '../../../generated';
import parseCurrencyFromString from '../../../utils/parseCurrencyFromString';
import currencyFormatter from '../../../utils/currencyFormatter';
import { validatePermissions, getIdForUser } from '../../../utils/models';
import UserContext from '../../../contexts/User/UserContext';
import {
	sectionHasValidationErrors,
	processValidationError,
	warningForField,
	warningForFieldSet,
	initialLoadErrorGuard,
	isBlockingValidationError,
	hasValidationErrors,
} from '../../../utils/validations';
import usePromiseExecution from '../../../hooks/usePromiseExecution';
import { validationErrorAlert } from '../../../utils/stringFormatters/alertTextMakers';
import AlertContext from '../../../contexts/Alert/AlertContext';
import { FormReducer, formReducer, updateData } from '../../../utils/forms/form';
import { DeepNonUndefineable } from '../../../utils/types';

const FamilyIncome: Section = {
	key: 'family-income',
	name: 'Family income determination',
	status: ({ enrollment }) => {
		// family income disclosure not required for children living with foster families
		if (idx(enrollment, _ => _.child.foster)) {
			return 'exempt';
		}

		// section is incomplete if:
		// - section itself has validation errors
		// - family section has validation error for `determinations` field
		return sectionHasValidationErrors([
			idx(enrollment, _ => _.child.family.determinations) || null,
		]) ||
			processValidationError(
				'determinations',
				idx(enrollment, _ => _.child.family.validationErrors) || null
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

	Form: ({
		enrollment,
		siteId,
		mutate,
		error,
		successCallback,
		finallyCallback,
		visitedSections,
	}) => {
		if (!enrollment || !enrollment.child || !enrollment.child.family) {
			throw new Error('FamilyIncome rendered without enrollment.child.family');
		}

		// set up form state
		const { setAlerts } = useContext(AlertContext);
		const initialLoad = visitedSections ? !visitedSections[FamilyIncome.key] : false;
		const [hasAlertedOnError, setHasAlertedOnError] = useState(false);
		useEffect(() => {
			if (error && !hasAlertedOnError) {
				if (!isBlockingValidationError(error)) {
					throw new Error(error.title || 'Unknown api error');
				}
				setAlerts([validationErrorAlert]);
			}
		}, [error, hasAlertedOnError]);

		const { user } = useContext(UserContext);
		const defaultParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
			id: enrollment.id || 0,
			siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
			orgId: getIdForUser(user, 'org'),
			enrollment: enrollment,
		};

		const [_enrollment, updateEnrollment] = useReducer<
			FormReducer<DeepNonUndefineable<Enrollment>>
		>(formReducer, enrollment);
		const updateFormData = updateData<DeepNonUndefineable<Enrollment>>(updateEnrollment);

		const child = _enrollment.child;
		const determination = idx(child, _ => _.family.determinations[0]) || undefined;

		const { numberOfPeople, income, determinationDate, notDisclosed } = determination || {};
		const _save = () => {
			const params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
				...defaultParams,
				enrollment: {
					..._enrollment,
				},
			};
			return mutate(api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(params))
				.then(res => {
					if (successCallback && res) successCallback(res);
				})
				.finally(() => {
					finallyCallback && finallyCallback(FamilyIncome);
				});
		};

		const { isExecuting: isMutating, setExecuting: save } = usePromiseExecution(_save);

		// To skip over family income section when "Lives with foster family" is selected
		if (child.foster && successCallback) {
			successCallback(enrollment);
			return <></>;
		}

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
									// Missing information for determination warning
									warningForFieldSet(
										'family-income',
										// Only check for determinationDate errors if it does not have a value. Otherwise, the error is about the
										// value of determinationDate and should not trigger a missing information alert
										['numberOfPeople', 'income', !determinationDate ? 'determinationDate' : ''],
										determination ? determination : null,
										'This information is required for OEC reporting'
									) ||
										// Missing determination warning
										warningForFieldSet(
											'family-income',
											['determinations'],
											idx(enrollment, _ => _.child.family) || null,
											'Income must be determined or marked as not disclosed',
											true
										)
								)}
							>
								<div>
									<TextInput
										type="input"
										id="numberOfPeople"
										label="Household size"
										defaultValue={numberOfPeople ? '' + numberOfPeople : ''}
										onChange={updateFormData(
											newNumberOfPeople =>
												parseInt(newNumberOfPeople.replace(/[^0-9.]/g, ''), 10) || null
										)}
										onBlur={event =>
											(event.target.value = numberOfPeople ? '' + numberOfPeople : '')
										}
										status={initialLoadErrorGuard(
											initialLoad,
											warningForField('numberOfPeople', determination ? determination : null, '')
										)}
										small
										name="child.family.determinations[0].numberOfPeople"
									/>
								</div>
								<div>
									<TextInput
										type="input"
										id="income"
										label="Annual household income"
										name="child.family.determinations[0].income"
										defaultValue={currencyFormatter(income)}
										onChange={updateFormData(parseCurrencyFromString)}
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
								<DateInput
									label="Date of income determination"
									id="income-determination-date"
									date={determinationDate ? moment(determinationDate) : null}
									name="child.family.determinations[0].determinationDate"
									onChange={updateFormData(newDate => (newDate ? newDate.toDate() : null))}
									status={initialLoadErrorGuard(
										initialLoad,
										warningForField(
											'determinationDate',
											determination ? determination : null,
											!determinationDate ? '' : undefined
										)
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
						name="child.family.determinations[0].notDisclosed"
						onChange={updateFormData((_, event) => event.target.checked)}
						selected={notDisclosed ? ['familyIncomeNotDisclosed'] : undefined}
						options={[
							{
								text: 'Family income not disclosed',
								value: 'familyIncomeNotDisclosed',
							},
						]}
						status={warningForFieldSet(
							'family-income',
							['notDisclosed'],
							determination ? determination : null,
							'Income information must be disclosed for CDC funded enrollments'
						)}
					/>
				</div>

				{/*Only display the alert if:
				 - determination is notDisclosed
				 - there is no 'notDisclosed' validationError (which will result in warning on the notDisclosed field)
				*/}
				{notDisclosed &&
					!hasValidationErrors(determination ? determination : null, ['notDisclosed']) && (
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
