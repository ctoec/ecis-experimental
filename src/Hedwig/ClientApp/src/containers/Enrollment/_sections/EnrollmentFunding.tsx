import React, { useContext, useState, useEffect, useReducer } from 'react';
import moment from 'moment';
import idx from 'idx';
import { Section } from '../enrollmentTypes';
import {
	Button,
	DateInput,
	ChoiceList,
	ChoiceListExpansion,
	TextInput,
	InlineIcon,
	Alert,
} from '../../../components';
import dateFormatter from '../../../utils/dateFormatter';
import {
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest,
	Age,
	Funding,
	FundingSource,
	ReportingPeriod,
	Enrollment,
	ApiOrganizationsOrgIdSitesIdGetRequest,
	C4KCertificate,
	FundingSpace,
	ApiOrganizationsOrgIdReportsGetRequest,
	Site,
	CdcReport,
} from '../../../generated';
import UserContext from '../../../contexts/User/UserContext';
import {
	validatePermissions,
	getIdForUser,
	prettyFundingSource,
	fundingSourceFromString,
	getFundingSpaces,
	prettyFundingSpaceTime,
	isFundedForFundingSpace,
} from '../../../utils/models';
import { DeepNonUndefineable, DeepNonUndefineableArray } from '../../../utils/types';
import {
	initialLoadErrorGuard,
	useFocusFirstError,
	hasValidationErrors,
} from '../../../utils/validations';
import ReportingPeriodContext from '../../../contexts/ReportingPeriod/ReportingPeriodContext';
import {
	incomeDeterminationNotDisclosed,
	getCurrentCdcFunding,
	updateFunding,
	createFunding,
	getCurrentC4kCertificate,
	ageFromString,
	prettyAge,
	reportingPeriodFormatter,
	currentReportingPeriod,
} from '../../../utils/models';
import { FormReducer, formReducer, updateData, toFormString } from '../../../utils/forms/form';
import useApi, { ApiError } from '../../../hooks/useApi';
import { dateSorter, propertyDateSorter } from '../../../utils/dateSorter';
import { propertyBetweenDates, propertyBeforeDate } from '../../../utils/dateFilter';
import { REQUIRED_FOR_OEC_REPORTING } from '../../../utils/validations/messageStrings';
import { displayValidationStatus } from '../../../utils/validations/displayValidationStatus';
import useCatchAllErrorAlert from '../../../hooks/useCatchAllErrorAlert';

type UtilizationRate = {
	capacity: number;
	numEnrolled: number;
};

const EnrollmentFunding: Section = {
	key: 'enrollment-funding',
	name: 'Enrollment and funding',
	status: ({ enrollment }) =>
		enrollment &&
		(hasValidationErrors(enrollment, ['fundings', 'ageGroup', 'entry']) ||
			hasValidationErrors(enrollment.child, ['c4KFamilyCaseNumber', 'c4KCertificates']))
			? 'incomplete'
			: 'complete',

	Summary: ({ enrollment: _enrollment }) => {
		const enrollment = _enrollment as DeepNonUndefineable<Enrollment>;
		if (!enrollment) return <></>;
		const child = enrollment.child;
		const fundings = enrollment.fundings || [];
		const cdcFunding = getCurrentCdcFunding(fundings);

		const c4kFunding = getCurrentC4kCertificate(enrollment);
		const receivesC4k = c4kFunding !== undefined;

		return (
			<div className="EnrollmentFundingSummary">
				{enrollment && (
					<>
						<p>Site: {idx(enrollment, (_) => _.site.name)} </p>
						<p>
							Age group:{' '}
							{enrollment.ageGroup
								? prettyAge(enrollment.ageGroup)
								: InlineIcon({ icon: 'incomplete' })}
						</p>
						<p>
							{' '}
							Enrollment date:{' '}
							{enrollment.entry
								? dateFormatter(enrollment.entry)
								: InlineIcon({ icon: 'incomplete' })}{' '}
						</p>
						<p>
							Funding:{' '}
							{!cdcFunding
								? 'Private pay'
								: `CDC - ${prettyFundingSpaceTime(cdcFunding.fundingSpace)}`}
						</p>
						{!!cdcFunding && (
							<p>
								First reporting period: {reportingPeriodFormatter(cdcFunding.firstReportingPeriod)}
							</p>
						)}
						{receivesC4k && c4kFunding && (
							<>
								<p>
									Care 4 Kids Family ID:{' '}
									{child.c4KFamilyCaseNumber
										? child.c4KFamilyCaseNumber
										: InlineIcon({ icon: 'incomplete' })}
								</p>
								<p>
									Care 4 Kids Certificate Start Date:{' '}
									{c4kFunding.startDate
										? dateFormatter(c4kFunding.startDate)
										: InlineIcon({ icon: 'incomplete' })}
								</p>
							</>
						)}
					</>
				)}
			</div>
		);
	},

	Form: ({
		enrollment: __enrollment,
		siteId,
		error: inputError,
		successCallback,
		onSectionTouch,
		touchedSections,
	}) => {
		const enrollment = __enrollment as DeepNonUndefineable<Enrollment>;
		if (!enrollment) {
			throw new Error('EnrollmentFunding rendered without an enrollment');
		}

		// set up form state
		const initialLoad = touchedSections ? !touchedSections[EnrollmentFunding.key] : false;
		const [error, setError] = useState<ApiError | null>(inputError);
		useFocusFirstError([error]);
		const errorAlertState = useCatchAllErrorAlert(error);

		const { user } = useContext(UserContext);
		const { cdcReportingPeriods: reportingPeriods } = useContext(ReportingPeriodContext);

		const siteParams: ApiOrganizationsOrgIdSitesIdGetRequest = {
			// Separate query so that mutation doesn't try to update all the enrollments when user saves this one
			// Otherwise we get "Enrollment exit reason is required for ended enrollments" validation errors on both site.enrollments and child.org.site.enrollments
			id: validatePermissions(user, 'site', siteId) ? siteId : 0,
			orgId: getIdForUser(user, 'org'),
			include: ['organizations', 'enrollments', 'funding_spaces', 'fundings'],
		};
		const { data: site } = useApi((api) => api.apiOrganizationsOrgIdSitesIdGet(siteParams), {
			skip: !user,
		}) as { data: DeepNonUndefineable<Site> };
		const reportsParams: ApiOrganizationsOrgIdReportsGetRequest = {
			orgId: getIdForUser(user, 'org'),
		};
		const { data: reports } = useApi((api) => api.apiOrganizationsOrgIdReportsGet(reportsParams), {
			skip: !user,
		}) as { data: DeepNonUndefineable<CdcReport[]> };
		const submittedReports = (reports || [])
			.filter((report) => !!report.submittedAt)
			.sort((a, b) => dateSorter(a.submittedAt, b.submittedAt, true));
		const lastSubmittedReport = submittedReports[0];

		const [_enrollment, updateEnrollment] = useReducer<
			FormReducer<DeepNonUndefineable<Enrollment>>
		>(formReducer, enrollment);
		const updateFormData = updateData<DeepNonUndefineable<Enrollment>>(updateEnrollment);
		const entry = _enrollment.entry;

		const [fundings, updateFundings] = useState(
			_enrollment.fundings || ([] as DeepNonUndefineableArray<Funding>)
		);
		const child = _enrollment.child;

		const cdcFundings = fundings.filter((funding) => funding.source === FundingSource.CDC);
		const currentCdcFunding = getCurrentCdcFunding(fundings);
		const [cdcReportingPeriod, updateCdcReportingPeriod] = useState<ReportingPeriod | undefined>(
			currentCdcFunding ? currentCdcFunding.firstReportingPeriod : undefined
		);

		const [reportingPeriodOptions, updateReportingPeriodOptions] = useState<ReportingPeriod[]>([]);

		//#region Reporting Period Options
		useEffect(() => {
			// Get the modified or current enrollment entry date
			// Default to today's date
			const startDate = entry ? entry : enrollment.entry ? enrollment.entry : moment().toDate();

			// Declare a variable that will store all periods that are on or after the start date
			// And on or before the last submitted reporting period (plus one)
			let periodsAfterEntryAndLastReportingPeriodAndBeforeNextReportingPeriod: ReportingPeriod[];

			// This should always cover the current reporting period plus the next one
			const twoMonthsAndAWeekFromToday = moment().add(2, 'month').add(1, 'week').toDate();
			const reportingPeriodsBetweenStartDateAndNextReportingPeriod = propertyBetweenDates(
				reportingPeriods,
				(r) => r.periodEnd,
				startDate,
				twoMonthsAndAWeekFromToday
			);

			if (lastSubmittedReport) {
				// If the program has submitted a report
				// Get the period start of the most recently submitted one
				const lastSubmittedReportingPeriodStart = lastSubmittedReport.reportingPeriod.periodStart;
				// Get all reporting periods that are on or before the last submitted reporting period start date
				const reportingPeriodsBeforeLastSubmittedReport = propertyBeforeDate(
					reportingPeriods,
					(r) => r.periodStart,
					lastSubmittedReportingPeriodStart
				);
				// Exclude all reporting periods corresponding to reporting periods that occured
				// before the most recently submitted report
				periodsAfterEntryAndLastReportingPeriodAndBeforeNextReportingPeriod = reportingPeriodsBetweenStartDateAndNextReportingPeriod.filter(
					(period) =>
						reportingPeriodsBeforeLastSubmittedReport.map((p) => p.id).indexOf(period.id) < 0
				);
			} else {
				// No reports submitted, so just use all reporting periods between enrollment start date and one month from now
				periodsAfterEntryAndLastReportingPeriodAndBeforeNextReportingPeriod = reportingPeriodsBetweenStartDateAndNextReportingPeriod;
			}

			// If there are previous cdc fundings that have last reporting periods,
			// get the most recent one
			const newestLastReportingPeriod = cdcFundings
				.map((funding) => funding.lastReportingPeriod)
				.filter((period) => period !== undefined)
				.sort((a, b) => propertyDateSorter(a, b, (r) => r.period, true))[0];

			let allValidPeriods = periodsAfterEntryAndLastReportingPeriodAndBeforeNextReportingPeriod;
			if (newestLastReportingPeriod) {
				// If there is a most recent last reporting period on a previous funding
				// filter out all reporting periods that occur before that reporting period
				const periodsBeforeMostRecentLastReportingPeriod = propertyBeforeDate(
					reportingPeriods,
					(r) => r.periodStart,
					newestLastReportingPeriod.periodEnd
				);
				allValidPeriods = periodsAfterEntryAndLastReportingPeriodAndBeforeNextReportingPeriod.filter(
					(period) =>
						periodsBeforeMostRecentLastReportingPeriod.map((p) => p.id).indexOf(period.id) < 0
				);
			}

			// If there is currently a selected value for the reporting period
			if (cdcReportingPeriod) {
				// Exclude it so we can safely add it back in without creating a duplicate
				allValidPeriods = [
					...allValidPeriods.filter((period) => period.id !== cdcReportingPeriod.id),
				];
			}

			// If there is currently a selected value for the reporting period
			// We want to make sure that it is shown in the select field
			const periods = cdcReportingPeriod
				? [cdcReportingPeriod, ...allValidPeriods]
				: allValidPeriods;
			updateReportingPeriodOptions(
				[...periods].sort((a, b) => propertyDateSorter(a, b, (r) => r.period))
			);
		}, [
			enrollment.entry,
			entry,
			reportingPeriods,
			cdcReportingPeriod,
			enrollment.fundings,
			lastSubmittedReport,
		]);
		//#endregion

		/*** CDC (& eventually OTHER FUNDINGS (Non C4K)) ***/
		const [fundingSourceOpts, setFundingSourceOpts] = useState<{ value: string; text: string }[]>(
			[]
		);

		// TODO: is it smarter to store this as list of fundingspaces and switch to input options in
		const [fundingSpaceOpts, setFundingSpaceOpts] = useState<{ value: string; text: string }[]>([]);

		const [fundingSource, updateFundingSource] = useState<FundingSource | undefined>(
			currentCdcFunding ? FundingSource.CDC : undefined
		);

		const [fundingSpace, updateFundingSpace] = useState<FundingSpace | undefined>(
			currentCdcFunding && currentCdcFunding.fundingSpace
				? currentCdcFunding.fundingSpace
				: undefined
		);

		const fundingSpaces = idx(site, (_) => _.organization.fundingSpaces) as DeepNonUndefineable<
			FundingSpace[]
		>;

		//#region Funding Source Options
		useEffect(() => {
			var privatePayOpt = {
				value: 'privatePay',
				text: prettyFundingSource(undefined),
			};

			// Give private pay as the only option when the organization has no funding spaces
			// Or the family income is not disclosed and there was not a previous CDC funding
			// The CDC funding includes information that we do not want to silently remove
			if (
				!fundingSpaces ||
				(incomeDeterminationNotDisclosed(enrollment.child.family) && !currentCdcFunding)
			) {
				setFundingSourceOpts([privatePayOpt]);
				return;
			}

			// Show funding type options provided the organization has that funding
			// space for the given age group. If an age group is not selected, only
			// private pay will be available as an option.
			const newFundingSourceOpts = fundingSpaces
				.filter((space) => space.ageGroup === _enrollment.ageGroup)
				.reduce<{ value: string; text: string }[]>((acc, fundingSpace) => {
					if (acc.some((a) => a.value == fundingSpace.source)) return acc;

					return [
						...acc,
						{
							value: fundingSpace.source,
							text: prettyFundingSource(fundingSpace.source),
						},
					];
				}, []);

			setFundingSourceOpts([privatePayOpt, ...newFundingSourceOpts]);
			// If there are no funding source options,
			// forcibly reset the funding source to private pay
			if (newFundingSourceOpts.length === 0) {
				updateFundingSource(undefined);
			}
		}, [site, _enrollment.ageGroup, enrollment, currentCdcFunding]);
		//#endregion

		//#region Funding Space Options
		useEffect(() => {
			if (!fundingSpaces || !fundingSource || !_enrollment.ageGroup) return;

			const matchingFundingSpaces = getFundingSpaces(fundingSpaces, {
				ageGroup: _enrollment.ageGroup,
				source: fundingSource,
			});

			setFundingSpaceOpts(
				matchingFundingSpaces.map((fundingSpace) => ({
					value: '' + fundingSpace.id,
					text: prettyFundingSpaceTime(fundingSpace, true),
				}))
			);

			// If there is only one funding space option, update selected fundingSpaceId accordingly
			if (matchingFundingSpaces.length === 1) {
				updateFundingSpace(matchingFundingSpaces[0]);
				// TODO: Remove this client-side check and allow users to submit with previously entered
				// invalid data and process the validation error
			} else if (fundingSpace && !matchingFundingSpaces.some((fs) => fs.id == fundingSpace.id)) {
				updateFundingSpace(undefined);
			}
		}, [fundingSpaces, fundingSource, _enrollment.ageGroup]);
		//#endregion

		// update enrollment funding
		useEffect(() => {
			let updatedFundings: Funding[] = [...fundings]
				// filter out current CDC funding (will either be deleted, or updated)
				.filter((funding) => funding.id !== (currentCdcFunding && currentCdcFunding.id))
				// and filter out any fundings associated with funding spaces that are
				// no longer valid for this enrollment
				.filter(
					(funding) =>
						!!(
							funding.fundingSpaceId &&
							!fundingSpaceOpts.some((opt) => opt.value === `${funding.fundingSpaceId}`)
						)
				);

			switch (fundingSource) {
				case FundingSource.CDC:
					if (currentCdcFunding) {
						updatedFundings.push(
							updateFunding({
								currentFunding: currentCdcFunding,
								source: FundingSource.CDC,
								firstReportingPeriod: cdcReportingPeriod,
								fundingSpace,
							})
						);
					} else {
						updatedFundings.push(
							createFunding({
								enrollmentId: enrollment.id,
								source: FundingSource.CDC,
								firstReportingPeriod: cdcReportingPeriod,
								fundingSpace,
							})
						);
					}
					break;
				default:
					// Private pay
					break;
			}

			updateFundings(updatedFundings as DeepNonUndefineableArray<Funding>);
		}, [
			enrollment,
			JSON.stringify(currentCdcFunding),
			fundingSource,
			fundingSpace,
			fundingSpaceOpts,
			cdcReportingPeriod,
			updateFunding,
			createFunding,
			_enrollment.ageGroup,
		]);

		// *** C4K ***
		const inputC4kFunding = getCurrentC4kCertificate(enrollment);
		const [c4kCertificates, updateC4kCertificates] = useState<C4KCertificate[]>([
			...(enrollment.child.c4KCertificates || []),
		]);
		const [c4kFamilyId, updateC4kFamilyId] = useState<number | null>(
			child ? child.c4KFamilyCaseNumber : null
		);
		const [c4kFunding, updateC4kFunding] = useState<C4KCertificate>(
			inputC4kFunding || {
				id: 0,
				childId: enrollment.child.id,
				startDate: null,
				endDate: null,
			}
		);
		const [receivesC4k, updateReceivesC4k] = useState<boolean>(!!inputC4kFunding);
		const { startDate: c4kCertificateStartDate } = c4kFunding || {};

		useEffect(() => {
			// When the existing one is updated, update the fundings
			let updatedC4kCertificates = [...c4kCertificates].filter(
				(cert) => cert.id !== (c4kFunding && c4kFunding.id)
			);
			if (receivesC4k) {
				updatedC4kCertificates.push(c4kFunding);
			}
			updateC4kCertificates(updatedC4kCertificates);
		}, [c4kFunding, receivesC4k]);

		// *** Set the utilization rate ***
		const [utilizationRate, setUtilizationRate] = useState<UtilizationRate>();
		const thisPeriod = currentReportingPeriod(reportingPeriods);
		useEffect(() => {
			if (!site || !site.enrollments || !thisPeriod) {
				return;
			}

			// This and below will need rewritten if we have more than just CDC in the dropdown
			const _fundingSpace = currentCdcFunding
				? currentCdcFunding.fundingSpace
				: fundingSpace
				? fundingSpace
				: undefined;

			if (_fundingSpace) {
				const enrolled = site.enrollments.filter<DeepNonUndefineable<Enrollment>>((e) =>
					isFundedForFundingSpace(e, _fundingSpace.id, {
						startDate: moment(thisPeriod.periodStart),
						endDate: moment(thisPeriod.periodEnd),
					})
				);

				const newCdcFunding = !currentCdcFunding && fundingSource === FundingSource.CDC;
				const removedCdcFunding = currentCdcFunding && !fundingSource;
				const countDifferent = newCdcFunding ? 1 : removedCdcFunding ? -1 : 0;
				const numEnrolled = enrolled.length + countDifferent;

				const capacity =
					currentCdcFunding && currentCdcFunding.fundingSpace
						? currentCdcFunding.fundingSpace.capacity
						: fundingSpace
						? fundingSpace.capacity
						: 0;

				setUtilizationRate({ capacity, numEnrolled });
			}
		}, [site, thisPeriod, currentCdcFunding, fundingSpace]);

		// *** Save ***
		const [attemptingSave, setAttemptingSave] = useState(false);
		const defaultParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
			id: enrollment.id || 0,
			orgId: getIdForUser(user, 'org'),
			siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
			enrollment: {
				..._enrollment,
				fundings: fundings,
				child: {
					..._enrollment.child,
					c4KFamilyCaseNumber: c4kFamilyId,
					c4KCertificates: c4kCertificates,
				},
			},
		};
		const { error: saveError, data: saveData } = useApi<Enrollment>(
			(api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(defaultParams),
			{
				skip: !attemptingSave || !user,
				callback: () => {
					setAttemptingSave(false);
					onSectionTouch && onSectionTouch(EnrollmentFunding);
				},
			}
		);
		useEffect(() => {
			// If the request did not go through, return early
			if (!saveData && !saveError) {
				return;
			}

			// Handle post-request actions
			setError(saveError);
			if (saveData && !saveError) {
				if (successCallback) successCallback(saveData);
			}
		}, [saveData, saveError]);

		return (
			<form className="EnrollmentFundingForm" noValidate autoComplete="off">
				<div className="usa-form">
					<h2>{site && site.name}</h2>
					<DateInput
						name="entry"
						onChange_Old={updateFormData((newDate) => (newDate ? newDate.toDate() : null))}
						defaultValue={entry || null}
						label="Start date"
						id="enrollment-start-date"
						status={initialLoadErrorGuard(
							initialLoad,
							displayValidationStatus([
								{
									type: 'warning',
									response: enrollment.validationErrors,
									field: 'entry',
									message: REQUIRED_FOR_OEC_REPORTING,
								},
							])
						)}
					/>

					<h2>Age group</h2>
					<ChoiceList
						type="radio"
						legend="Age group"
						id="age-group"
						name="ageGroup"
						options={[
							{
								text: 'Infant/Toddler',
								value: Age.InfantToddler,
							},
							{
								text: 'Preschool',
								value: Age.Preschool,
							},
							{
								text: 'School-age',
								value: Age.SchoolAge,
							},
						]}
						defaultValue={toFormString(_enrollment.ageGroup)}
						onChange={updateFormData(ageFromString)}
						status={initialLoadErrorGuard(
							initialLoad,
							displayValidationStatus([
								{
									type: 'warning',
									response: enrollment.validationErrors,
									fields: ['ageGroup'],
									message: REQUIRED_FOR_OEC_REPORTING,
								},
							])
						)}
					/>
					<h2>Funding</h2>
					<ChoiceList
						// Hack to trigger rerender on selected change
						key={`fundingType-${fundingSource || 'privatePay'}`}
						type="radio"
						legend="Funding type"
						id="fundingType"
						options={fundingSourceOpts}
						onChange={(event) => {
							updateFundingSource(fundingSourceFromString(event.target.value));
						}}
						defaultValue={toFormString(fundingSource || 'privatePay')}
					>
						<ChoiceListExpansion showOnValue={'CDC'}>
							{fundingSpaceOpts.length ? (
								fundingSpaceOpts.length === 1 ? (
									<div>
										<span className="usa-hint text-italic">{fundingSpaceOpts[0].text}</span>
									</div>
								) : (
									<ChoiceList
										type="select"
										id="fundingSpace"
										options={fundingSpaceOpts}
										defaultValue={toFormString(fundingSpace ? fundingSpace.id : '')}
										label="Contract space"
										// TODO: USE FORM REDUCER
										onChange={(event) => {
											updateFundingSpace(
												fundingSpaces.find(
													(fundingSpace) => fundingSpace.id === parseInt(event.target.value)
												)
											);
										}}
										status={initialLoadErrorGuard(
											initialLoad,
											displayValidationStatus([
												{
													type: 'error',
													response: error,
													field: 'fundings.fundingSpaceId',
													message: REQUIRED_FOR_OEC_REPORTING,
													errorAlertState,
												},
												{
													type: 'error',
													response: error,
													field: 'fundings.fundingspace',
													errorAlertState,
												},
											])
										)}
									/>
								)
							) : undefined}
							<ChoiceList
								type="select"
								id="firstReportingPeriod"
								options={[
									...reportingPeriodOptions.map((period) => {
										return {
											value: '' + period.id,
											text: reportingPeriodFormatter(period, { extended: true }),
										};
									}),
								]}
								label="First reporting period"
								// TODO: USE FORM REDUCER
								onChange={(event) => {
									const chosen = reportingPeriodOptions.find(
										(period) => period.id === parseInt(event.target.value)
									);
									updateCdcReportingPeriod(chosen);
								}}
								defaultValue={toFormString(cdcReportingPeriod ? cdcReportingPeriod.id : undefined)}
								status={initialLoadErrorGuard(
									initialLoad,
									displayValidationStatus([
										{
											type: 'error',
											response: error,
											field: 'fundings.firstReportingPeriodId',
											message: REQUIRED_FOR_OEC_REPORTING,
											errorAlertState,
										},
										{
											type: 'error',
											response: error,
											field: 'fundings',
											errorAlertState,
										},
									])
								)}
							/>
						</ChoiceListExpansion>
					</ChoiceList>
					{utilizationRate && utilizationRate.numEnrolled > utilizationRate.capacity && (
						<Alert
							type="info"
							// TODO (after user research): This will only warn about the current reporting period.  What if they set an earlier reporting period date?
							text={`${utilizationRate.numEnrolled} out of ${
								utilizationRate.capacity
							} spaces will be utilized for the ${
								thisPeriod ? reportingPeriodFormatter(thisPeriod) : 'current'
							} reporting period.`}
						/>
					)}
					<h2>Care 4 Kids</h2>
					<ChoiceList
						type="check"
						defaultValue={receivesC4k ? ['receives-c4k'] : undefined}
						options={[
							{
								text: 'Receives Care 4 Kids',
								value: 'receives-c4k',
							},
						]}
						onChange={(e) => updateReceivesC4k(!!(e.target as HTMLInputElement).checked)}
						id="c4k-check-box"
						legend="Receives Care 4 Kids"
						className="margin-top-3"
					/>
					{receivesC4k && (
						<>
							<TextInput
								type="input"
								name="receivesC4k"
								id="familyId"
								label="Family ID"
								defaultValue={c4kFamilyId ? '' + c4kFamilyId : ''}
								// TODO: USE REDUCER HERE
								onChange={(event) => updateC4kFamilyId(parseInt(event.target.value))}
								status={initialLoadErrorGuard(
									initialLoad,
									displayValidationStatus([
										{
											type: 'warning',
											response: child ? child.validationErrors : null,
											field: 'c4KFamilyCaseNumber',
											message: REQUIRED_FOR_OEC_REPORTING,
										},
									])
								)}
							/>
							<DateInput
								name="c4kCertificateStartDate"
								onChange_Old={(newDate) =>
									updateC4kFunding({
										...c4kFunding,
										startDate: newDate ? newDate.toDate() : null,
									})
								}
								defaultValue={c4kCertificateStartDate || null}
								label="Certificate start date"
								id="c4k-certificate-start-date"
								status={initialLoadErrorGuard(
									initialLoad,
									displayValidationStatus([
										{
											type: 'warning',
											response: c4kFunding.validationErrors || null,
											field: 'startDate',
											message: REQUIRED_FOR_OEC_REPORTING,
										},
									])
								)}
							/>
						</>
					)}
				</div>

				<div className="usa-form">
					<Button
						text={attemptingSave ? 'Saving...' : 'Save'}
						onClick={() => setAttemptingSave(true)}
						disabled={attemptingSave}
					/>
				</div>
			</form>
		);
	},
};

export default EnrollmentFunding;
