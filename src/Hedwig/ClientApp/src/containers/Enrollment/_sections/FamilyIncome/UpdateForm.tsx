import React, { useContext, useState, useEffect, useReducer } from 'react';
import { SectionProps } from '../../enrollmentTypes';
import AlertContext from '../../../../contexts/Alert/AlertContext';
import FamilyIncome from '.';
import useNewUseApi, { ApiError } from '../../../../hooks/newUseApi';
import { isBlockingValidationError, initialLoadErrorGuard, warningForFieldSet, warningForField, hasValidationErrors } from '../../../../utils/validations';
import { validationErrorAlert } from '../../../../utils/stringFormatters/alertTextMakers';
import UserContext from '../../../../contexts/User/UserContext';
import { FormReducer, formReducer, updateData } from '../../../../utils/forms/form';
import { DeepNonUndefineable } from '../../../../utils/types';
import { Enrollment, ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest } from '../../../../generated';
import idx from 'idx';
import { validatePermissions, getIdForUser } from '../../../../utils/models';
import { FieldSet, TextInput, DateInput, ChoiceList, Alert, Button } from '../../../../components';
import currencyFormatter from '../../../../utils/currencyFormatter';
import parseCurrencyFromString from '../../../../utils/parseCurrencyFromString';
import notNullOrUndefined from '../../../../utils/notNullOrUndefined';
import moment from 'moment';
import { nameFormatter } from '../../../../utils/stringFormatters';

const UpdateForm: React.FC<SectionProps> = ({
	enrollment,
	siteId,
	error: inputError,
	successCallback,
	visitSection,
	visitedSections,
}) => {
	if (!enrollment || !enrollment.child || !enrollment.child.family) {
		throw new Error('FamilyIncome rendered without enrollment.child.family');
	}

	// set up form state
	const { setAlerts } = useContext(AlertContext);
	const initialLoad = visitedSections ? !visitedSections[FamilyIncome.key] : false;
	if (initialLoad) {
		visitSection && visitSection(FamilyIncome);
	}
	const [error, setError] = useState<ApiError | null>(inputError);
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

	const [_enrollment, updateEnrollment] = useReducer<
		FormReducer<DeepNonUndefineable<Enrollment>>
	>(formReducer, enrollment);
	const updateFormData = updateData<DeepNonUndefineable<Enrollment>>(updateEnrollment);

	const child = _enrollment.child;
	const determination = idx(child, _ => _.family.determinations[0]) || undefined;

	const { numberOfPeople, income, determinationDate, notDisclosed } = determination || {};

	const [attemptingSave, setAttemptingSave] = useState(false);
	const defaultParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
		id: enrollment.id || 0,
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
		orgId: getIdForUser(user, 'org'),
		enrollment: _enrollment,
	};
	const { error: saveError, data: saveData } = useNewUseApi<Enrollment>(
		api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(defaultParams),
		{ skip: !attemptingSave, callback: () => setAttemptingSave(false) }
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

	// To skip over family income section when "Lives with foster family" is selected
	if (child.foster && successCallback) {
		successCallback(enrollment);
		return <div className="FamilyIncome foster"></div>;
	}

	return (
		<form className="FamilyIncomeForm" noValidate autoComplete="off">
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
				<Button
					text={attemptingSave ? 'Saving...' : 'Save'}
					onClick={() => setAttemptingSave(true)}
					disabled={attemptingSave}
				/>
			</div>
		</form>
	);
};

export default UpdateForm;