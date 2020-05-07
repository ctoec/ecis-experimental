import React, { useContext, useState, useEffect, useReducer } from 'react';
import { Section } from '../enrollmentTypes';
import moment from 'moment';
import { Button, TextInput, DateInput, ChoiceList, FieldSet } from '../../../components';
import { nameFormatter } from '../../../utils/stringFormatters';
import dateFormatter from '../../../utils/dateFormatter';
import {
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsPostRequest,
	Gender,
	Enrollment,
	HedwigApi,
} from '../../../generated';
import UserContext from '../../../contexts/User/UserContext';
import { validatePermissions, getIdForUser, emptyEnrollment } from '../../../utils/models';
import {
	genderFromString,
	prettyGender,
	prettyMultiRace,
	prettyEthnicity,
	birthCertPresent,
	getSummaryLine,
} from '../../../utils/models';
import {
	useFocusFirstError,
	sectionHasValidationErrors,
	warningForFieldSet,
	warningForField,
	serverErrorForField,
	initialLoadErrorGuard,
	isBlockingValidationError,
} from '../../../utils/validations';
import AlertContext from '../../../contexts/Alert/AlertContext';
import { FormReducer, formReducer, updateData } from '../../../utils/forms/form';
import { DeepNonUndefineable } from '../../../utils/types';
import useApi, { ApiError } from '../../../hooks/useApi';
import { validationErrorAlert } from '../../../utils/stringFormatters/alertTextMakers';
import {
	REQUIRED_FOR_ENROLLMENT,
	REQUIRED_FOR_OEC_REPORTING,
} from '../../../utils/validations/messageStrings';

const ChildInfo: Section = {
	key: 'child-information',
	name: 'Child information',
	status: ({ enrollment }) =>
		enrollment && sectionHasValidationErrors([enrollment.child]) ? 'incomplete' : 'complete',

	Summary: ({ enrollment }) => {
		var child = enrollment && enrollment.child;
		return (
			<div className="ChildInfoSummary">
				{child && (
					<>
						<p>Name: {getSummaryLine(nameFormatter(child))}</p>
						<p>Birthdate: {getSummaryLine(dateFormatter(child.birthdate))}</p>
						<p>Birth certificate: {getSummaryLine(birthCertPresent(child))}</p>
						<p>Race: {getSummaryLine(prettyMultiRace(child))}</p>
						<p>Ethnicity: {getSummaryLine(prettyEthnicity(child))}</p>
						<p>Gender: {getSummaryLine(prettyGender(child.gender))}</p>
					</>
				)}
			</div>
		);
	},

	Form: ({ enrollment, siteId, error, successCallback, onSectionTouch, touchedSections }) => {
		if (!enrollment && !siteId) {
			throw new Error('ChildInfo rendered without an enrollment or a siteId');
		}

		const { user } = useContext(UserContext);
		const { setAlerts } = useContext(AlertContext);

		// set up form state
		const initialLoad = touchedSections ? !touchedSections[ChildInfo.key] : false;
		const [hasAlertedOnError, setHasAlertedOnError] = useState(false);
		const [_error, setError] = useState<ApiError | null>(error);
		useFocusFirstError([_error]);
		useEffect(() => {
			if (_error && !hasAlertedOnError) {
				if (!isBlockingValidationError(_error)) {
					throw new Error(_error.title || 'Unknown api error');
				}
				setAlerts([validationErrorAlert]);
			}
		}, [_error, hasAlertedOnError]);

		const [_enrollment, updateEnrollment] = useReducer<
			FormReducer<DeepNonUndefineable<Enrollment>>
		>(formReducer, enrollment || emptyEnrollment(siteId, user));

		const updateFormData = updateData<DeepNonUndefineable<Enrollment>>(updateEnrollment);

		const child = _enrollment.child || {};
		const {
			sasid,
			firstName,
			middleName,
			lastName,
			suffix,
			birthCertificateId,
			birthTown,
			birthState,
			birthdate,
			americanIndianOrAlaskaNative,
			asian,
			blackOrAfricanAmerican,
			nativeHawaiianOrPacificIslander,
			white,
			hispanicOrLatinxEthnicity,
			gender,
		} = child;

		const childRace = [
			{
				text: 'American Indian or Alaska Native',
				value: 'americanIndianOrAlaskaNative',
				selected: americanIndianOrAlaskaNative,
			},
			{
				text: 'Asian',
				value: 'asian',
				selected: asian,
			},
			{
				text: 'Black or African American',
				value: 'blackOrAfricanAmerican',
				selected: blackOrAfricanAmerican,
			},
			{
				text: 'Native Hawaiian or Pacific Islander',
				value: 'nativeHawaiianOrPacificIslander',
				selected: nativeHawaiianOrPacificIslander,
			},
			{
				text: 'White',
				value: 'white',
				selected: white,
			},
		].map(r => ({ ...r, name: `child.${r.value}` }));

		const [attemptingSave, setAttemptingSave] = useState(false);

		const postParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsPostRequest = {
			orgId: getIdForUser(user, 'org'),
			siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
			enrollment: { ..._enrollment },
		};

		const useApiOpts = {
			callback: () => {
				setAttemptingSave(false);
				onSectionTouch && onSectionTouch(ChildInfo);
			},
			skip: enrollment
				? // If there is already an enrollment, then we should fire the put when we are attempting save and there is an enrollment
				  !attemptingSave || !enrollment
				: // If there is not an enrollment, we should fire save when we are attempting save and there is a site id (and not use a post if there is an enrollment)
				  !!enrollment || !attemptingSave || !siteId,
		};

		// set up PUT or POST request to be triggered on save attempt
		const apiQuery = (api: HedwigApi) =>
			enrollment
				? api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut({
						...postParams,
						id: _enrollment.id,
				  })
				: api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsPost({
						...postParams,
				  });
		const { error: saveError, data: saveData } = useApi<Enrollment>(apiQuery, useApiOpts);

		useEffect(() => {
			if (!saveData && !saveError) {
				// If the request did not go through, exit
				return;
			}
			// Set the new error whether it's undefined or an error
			setError(saveError);
			if (saveData && !saveError) {
				if (successCallback) successCallback(saveData);
			}
		}, [saveData, saveError]);

		return (
			<form className="ChildInfoForm usa-form" noValidate autoComplete="off">
				<div className="grid-row grid-gap">
					<div className="mobile-lg:grid-col-12">
						<TextInput
							type="input"
							id="sasid"
							label="SASID"
							name="child.sasid"
							onChange={updateFormData()}
							defaultValue={sasid || ''}
							optional
						/>
					</div>
					<div className="mobile-lg:grid-col-9">
						<TextInput
							type="input"
							id="firstName"
							label="First name"
							defaultValue={firstName || ''}
							name="child.firstName"
							onChange={updateFormData()}
							status={initialLoadErrorGuard(
								initialLoad,
								serverErrorForField(
									hasAlertedOnError,
									setHasAlertedOnError,
									'child.firstname',
									_error,
									REQUIRED_FOR_ENROLLMENT
								)
							)}
						/>
					</div>
					<div className="mobile-lg:grid-col-9">
						<TextInput
							type="input"
							id="middleName"
							label="Middle name"
							defaultValue={middleName || ''}
							name="child.middleName"
							onChange={updateFormData()}
							optional
						/>
					</div>
					<div className="display-flex flex-row flex-align-end grid-row grid-gap">
						<div className="mobile-lg:grid-col-9">
							<TextInput
								type="input"
								id="lastName"
								label="Last name"
								defaultValue={lastName || ''}
								name="child.lastName"
								onChange={updateFormData()}
								status={initialLoadErrorGuard(
									initialLoad,
									serverErrorForField(
										hasAlertedOnError,
										setHasAlertedOnError,
										'child.lastname',
										_error,
										REQUIRED_FOR_ENROLLMENT
									)
								)}
							/>
						</div>
						<div className="mobile-lg:grid-col-3">
							<TextInput
								type="input"
								id="suffix"
								label="Suffix"
								defaultValue={suffix || ''}
								name="child.suffix"
								onChange={updateFormData()}
								optional
							/>
						</div>
					</div>
				</div>

				<h2>Date of birth</h2>
				<DateInput
					name="child.birthdate"
					onChange={updateFormData(newBirthdate => newBirthdate.toDate())}
					date={birthdate ? moment(birthdate) : null}
					label="Birth date"
					id="birthdate-picker"
					hideLabel
					status={initialLoadErrorGuard(
						initialLoad,
						warningForFieldSet(
							'birthdate-fields',
							['birthdate'],
							enrollment ? enrollment.child : null,
							REQUIRED_FOR_OEC_REPORTING
						)
					)}
				/>

				<h2>Birth certificate</h2>
				<FieldSet
					status={initialLoadErrorGuard(
						initialLoad,
						warningForFieldSet(
							'birth-certificate-fields',
							['birthCertificateId', 'birthState', 'birthTown'],
							enrollment ? enrollment.child : null,
							REQUIRED_FOR_OEC_REPORTING
						)
					)}
					legend="Birth certificate"
					className="display-inline-block"
					id="birth-certificate-fields"
				>
					<div className="mobile-lg:grid-col-12">
						<TextInput
							type="input"
							id="birthCertificateId"
							label="Birth certificate ID #"
							defaultValue={birthCertificateId || ''}
							name="child.birthCertificateId"
							onChange={updateFormData()}
							status={initialLoadErrorGuard(
								initialLoad,
								warningForField('birthCertificateId', enrollment ? enrollment.child : null, '')
							)}
						/>
					</div>
					<div className="mobile-lg:grid-col-8 display-inline-block">
						<TextInput
							type="input"
							id="birthTown"
							label="Town"
							defaultValue={birthTown || ''}
							name="child.birthTown"
							onChange={updateFormData()}
							status={initialLoadErrorGuard(
								initialLoad,
								warningForField('birthTown', enrollment ? enrollment.child : null, '')
							)}
						/>
					</div>
					<div className="mobile-lg:grid-col-4 display-inline-block">
						<TextInput
							type="input"
							id="birthState"
							label="State"
							name="child.birthState"
							onChange={updateFormData()}
							defaultValue={birthState || ''}
							status={initialLoadErrorGuard(
								initialLoad,
								warningForField('birthState', enrollment ? enrollment.child : null, '')
							)}
						/>
					</div>
				</FieldSet>

				<h2>Race</h2>
				<ChoiceList
					type="check"
					options={childRace}
					selected={childRace.filter(raceObj => raceObj.selected).map(raceObj => raceObj.value)}
					hint="As identified by family"
					status={initialLoadErrorGuard(
						initialLoad,
						warningForFieldSet(
							'race-checklist',
							childRace.map(o => o.value),
							enrollment ? enrollment.child : null,
							REQUIRED_FOR_OEC_REPORTING
						)
					)}
					legend="Race"
					id="race-checklist"
					name="child"
					onChange={updateFormData((_, e) => e.target.checked)}
				/>

				<h2>Ethnicity</h2>
				<ChoiceList
					type="radio"
					hint="As identified by family"
					status={initialLoadErrorGuard(
						initialLoad,
						warningForFieldSet(
							'ethnicity-radiogroup',
							['hispanicOrLatinxEthnicity'],
							enrollment ? enrollment.child : null,
							REQUIRED_FOR_OEC_REPORTING
						)
					)}
					legend="Ethnicity"
					id="ethnicity-radiogroup"
					options={[
						{
							text: 'Not Hispanic or Latinx',
							value: 'no',
						},
						{
							text: 'Hispanic or Latinx',
							value: 'yes',
						},
					]}
					selected={
						hispanicOrLatinxEthnicity === null || hispanicOrLatinxEthnicity === undefined
							? undefined
							: hispanicOrLatinxEthnicity
							? ['yes']
							: ['no']
					}
					name="child.hispanicOrLatinxEthnicity"
					onChange={updateFormData(selectedValue => selectedValue === 'yes')}
				/>

				<h2>Gender</h2>
				<ChoiceList
					hint="As identified by family"
					type="select"
					options={[
						{
							value: Gender.Female,
							text: 'Female',
						},
						{
							value: Gender.Male,
							text: 'Male',
						},
						{
							value: Gender.Nonbinary,
							text: 'Nonbinary',
						},
						{
							value: Gender.Unknown,
							text: 'Unknown',
						},
					]}
					label="Gender"
					selected={[gender] || [Gender.Unspecified]}
					name="child.gender"
					onChange={updateFormData(genderFromString)}
					id="gender-select"
					status={initialLoadErrorGuard(
						initialLoad,
						warningForFieldSet(
							'gender-select',
							['gender'],
							enrollment ? enrollment.child : null,
							REQUIRED_FOR_OEC_REPORTING
						)
					)}
				/>

				<Button
					text={attemptingSave ? 'Saving...' : 'Save'}
					onClick={() => setAttemptingSave(true)}
					disabled={attemptingSave}
				/>
			</form>
		);
	},
};

export default ChildInfo;
