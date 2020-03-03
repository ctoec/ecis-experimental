import React, { useContext, useState, useCallback, useEffect, useReducer } from 'react';
import { Section } from '../enrollmentTypes';
import moment, { Moment } from 'moment';
import idx from 'idx';
import { Button, TextInput, DateInput, ChoiceList, FieldSet, DateRange } from '../../../components';
import { nameFormatter } from '../../../utils/stringFormatters';
import dateFormatter from '../../../utils/dateFormatter';
import {
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsPostRequest,
	Gender,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest,
	Enrollment,
} from '../../../generated';
import UserContext from '../../../contexts/User/UserContext';
import { validatePermissions, getIdForUser } from '../../../utils/models';
import emptyGuid from '../../../utils/emptyGuid';
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
import usePromiseExecution from '../../../hooks/usePromiseExecution';
import { validationErrorAlert } from '../../../utils/stringFormatters/alertTextMakers';
import AlertContext from '../../../contexts/Alert/AlertContext';
import { FormReducer, formReducer, updateData } from '../../../utils/forms/form';
import { DeepNonUndefineable } from '../../../utils/types';

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

	Form: ({
		enrollment,
		siteId,
		mutate,
		error,
		successCallback,
		finallyCallback,
		visitedSections,
	}) => {
		if (!enrollment && !siteId) {
			throw new Error('ChildInfo rendered without an enrollment or a siteId');
		}

		// set up form state
		const { setAlerts } = useContext(AlertContext);
		const initialLoad = visitedSections ? !visitedSections[ChildInfo.key] : false;
		const [hasAlertedOnError, setHasAlertedOnError] = useState(false);
		useFocusFirstError([error]);
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
		>(
			formReducer,
			enrollment ||
				({
					id: 0,
					siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
					childId: emptyGuid(),
					child: {
						id: emptyGuid(),
						organizationId: getIdForUser(user, 'org'),
						// ...args,
					},
				} as DeepNonUndefineable<Enrollment>)
		);
		const updateFormData = updateData<DeepNonUndefineable<Enrollment>>(updateEnrollment);

		console.log(_enrollment);

		const defaultPostParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsPostRequest = {
			orgId: getIdForUser(user, 'org'),
			siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
			enrollment: enrollment as Enrollment,
		};
		const defaultPutParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
			...defaultPostParams,
			id: idx(enrollment, _ => _.id) || 0,
		};

		const child = enrollment && enrollment.child;
		const [sasid, updateSasid] = useState(child ? child.sasid : null);

		const [firstName, updateFirstName] = useState(child ? child.firstName : null);
		const [middleName, updateMiddleName] = useState(child ? child.middleName : null);
		const [lastName, updateLastName] = useState(child ? child.lastName : null);
		const [suffix, updateSuffix] = useState(child ? child.suffix : null);

		const [birthdate, updateBirthdate] = useState(child ? child.birthdate : null);
		const setBirthdate = useCallback(
			(newBirthDate: Moment | null) => {
				updateBirthdate(newBirthDate && newBirthDate.isValid() ? newBirthDate.toDate() : null);
			},
			[updateBirthdate]
		);
		const [birthCertificateId, updateBirthCertificateId] = useState(
			child ? child.birthCertificateId : null
		);
		const [birthTown, updateBirthTown] = useState(child ? child.birthTown : null);
		const [birthState, updateBirthState] = useState(child ? child.birthState : null);

		const [childRace, updateChildRace] = useState([
			{
				text: 'American Indian or Alaska Native',
				value: 'americanIndianOrAlaskaNative',
				selected: (child && child.americanIndianOrAlaskaNative) || false,
			},
			{
				text: 'Asian',
				value: 'asian',
				selected: (child && child.asian) || false,
			},
			{
				text: 'Black or African American',
				value: 'blackOrAfricanAmerican',
				selected: (child && child.blackOrAfricanAmerican) || false,
			},
			{
				text: 'Native Hawaiian or Pacific Islander',
				value: 'nativeHawaiianOrPacificIslander',
				selected: (child && child.nativeHawaiianOrPacificIslander) || false,
			},
			{
				text: 'White',
				value: 'white',
				selected: (child && child.white) || false,
			},
		]);

		const [hispanicOrLatinxEthnicity, updateHispanicOrLatinxEthnicity] = useState(
			child ? child.hispanicOrLatinxEthnicity : null
		);

		const [gender, updateGender] = useState(child ? child.gender : Gender.Unspecified);

		let childRaceArgs: { [key: string]: boolean } = {};
		childRace.forEach(raceObj => (childRaceArgs[raceObj.value] = raceObj.selected));

		const args = {
			sasid,
			firstName,
			middleName,
			lastName,
			suffix,
			birthdate,
			birthCertificateId,
			birthTown,
			birthState,
			hispanicOrLatinxEthnicity,
			gender,
			...childRaceArgs,
		};

		const _save = () => {
			if (enrollment) {
				// If enrollment exists, put to save changes
				const putParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
					...defaultPutParams,
					enrollment: {
						...enrollment,
						child: {
							id: enrollment.childId,
							organizationId: getIdForUser(user, 'org'),
							...enrollment.child,
							...args,
						},
					},
				};
				return mutate(api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(putParams))
					.then(res => {
						if (successCallback && res) successCallback(res);
					})
					.finally(() => {
						finallyCallback && finallyCallback(ChildInfo);
					});
			} else if (siteId) {
				// If enrollment doesn't exist, post to create a new enrollment
				const postParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsPostRequest = {
					...defaultPostParams,
					enrollment: {
						id: 0,
						siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
						childId: emptyGuid(),
						child: {
							id: emptyGuid(),
							organizationId: getIdForUser(user, 'org'),
							...args,
						},
					},
				};
				return mutate(api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsPost(postParams))
					.then(res => {
						if (successCallback && res && !error) successCallback(res);
					})
					.finally(() => {
						finallyCallback && finallyCallback(ChildInfo);
					});
			} else {
				throw new Error('Something impossible happened');
			}
		};

		const { isExecuting: isMutating, setExecuting: save } = usePromiseExecution(_save);

		// TODO: use reducer for everything except first and last name, for which we need an enrollment\
		// will need to make an enrollment object to do anything with user reducer

		// TODO: should gender be radio buttons as recommended by USWDS rather than select?
		return (
			<form className="ChildInfoForm usa-form" onSubmit={save} noValidate autoComplete="off">
				<div className="grid-row grid-gap">
					<div className="mobile-lg:grid-col-12">
						<TextInput
							type="input"
							id="sasid"
							label="SASID"
							defaultValue={sasid || ''}
							onChange={event => updateSasid(event.target.value)}
							optional
						/>
					</div>
					<div className="mobile-lg:grid-col-9">
						<TextInput
							type="input"
							id="firstName"
							label="First name"
							defaultValue={firstName || ''}
							onChange={event => updateFirstName(event.target.value)}
							status={initialLoadErrorGuard(
								initialLoad,
								serverErrorForField(
									hasAlertedOnError,
									setHasAlertedOnError,
									'child.firstname',
									error,
									'This information is required for enrollment'
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
							onChange={event => updateMiddleName(event.target.value)}
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
								onChange={event => updateLastName(event.target.value)}
								status={initialLoadErrorGuard(
									initialLoad,
									serverErrorForField(
										hasAlertedOnError,
										setHasAlertedOnError,
										'child.lastname',
										error,
										'This information is required for enrollment'
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
								onChange={event => updateSuffix(event.target.value)}
								optional
							/>
						</div>
					</div>
				</div>

				<h2>Date of birth</h2>
				<DateInput
					onChange={setBirthdate}
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
							'This information is required for OEC reporting'
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
							'This information is required for OEC reporting'
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
							onChange={event => updateBirthCertificateId(event.target.value)}
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
							onChange={event => updateBirthTown(event.target.value)}
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
							defaultValue={birthState || ''}
							onChange={event => updateBirthState(event.target.value)}
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
							'This information is required for OEC reporting'
						)
					)}
					legend="Race"
					id="race-checklist"
					onChange={(_, selected) => {
						updateChildRace(
							childRace.map(raceObj => ({ ...raceObj, selected: selected.includes(raceObj.value) }))
						);
					}}
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
							'This information is required for OEC reporting'
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
					onChange={event =>
						updateHispanicOrLatinxEthnicity(
							event.target.value === '' ? null : event.target.value === 'yes'
						)
					}
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
					onChange={event => updateGender(genderFromString(event.target.value))}
					id="gender-select"
					status={initialLoadErrorGuard(
						initialLoad,
						warningForFieldSet(
							'gender-select',
							['gender'],
							enrollment ? enrollment.child : null,
							'This information is required for OEC reporting'
						)
					)}
				/>

				<Button text={isMutating ? 'Saving...' : 'Save'} onClick="submit" disabled={isMutating} />
			</form>
		);
	},
};

export default ChildInfo;
