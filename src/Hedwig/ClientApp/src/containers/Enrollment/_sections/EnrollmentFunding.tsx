import React, { useContext, useState, useEffect, useReducer } from 'react';
import moment from 'moment';
import idx from 'idx';
import { Section } from '../enrollmentTypes';
import { Button, DatePicker, ChoiceList, TextInput, InlineIcon, Alert } from '../../../components';
import dateFormatter from '../../../utils/dateFormatter';
import {
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest,
	Age,
	FundingTime,
	Funding,
	FundingSource,
	ReportingPeriod,
	ValidationProblemDetails,
	ValidationProblemDetailsFromJSON,
	Enrollment,
	ApiOrganizationsOrgIdSitesIdGetRequest,
} from '../../../generated';
import UserContext from '../../../contexts/User/UserContext';
import { validatePermissions, getIdForUser } from '../../../utils/models';
import { DeepNonUndefineable } from '../../../utils/types';
import {
	sectionHasValidationErrors,
	warningForField,
	warningForFieldSet,
	serverErrorForField,
} from '../../../utils/validations';
import ReportingPeriodContext from '../../../contexts/ReportingPeriod/ReportingPeriodContext';
import {
	familyDeterminationNotDisclosed,
	currentCdcFunding,
	updateFunding,
	createFunding,
	currentC4kFunding,
	ageFromString,
	getSourcelessFunding,
	nextNReportingPeriods,
	periodSorter,
	prettyFundingTime,
	prettyAge,
	reportingPeriodFormatter,
	isFunded,
	currentReportingPeriod,
} from '../../../utils/models';
import initialLoadErrorGuard from '../../../utils/validations/initialLoadErrorGuard';
import {
	FundingSelection,
	fundingSelectionFromString,
	fundingSelectionToString,
	FundingType,
} from '../../../utils/fundingSelectionUtils';
import { FormReducer, formReducer, updateData, toFormString } from '../../../utils/forms/form';
import useApi from '../../../hooks/useApi';
import getFundingSpaceCapacity from '../../../utils/getFundingSpaceCapacity';
import usePromiseExecution from '../../../hooks/usePromiseExecution';

const EnrollmentFunding: Section = {
	key: 'enrollment-funding',
	name: 'Enrollment and funding',
	status: ({ enrollment }) =>
		enrollment && sectionHasValidationErrors([enrollment, enrollment.fundings])
			? 'incomplete'
			: 'complete',

	Summary: ({ enrollment }) => {
		const { cdcReportingPeriods: reportingPeriods } = useContext(ReportingPeriodContext);

		if (!enrollment) return <></>;

		const sourcelessFunding = getSourcelessFunding(enrollment);
		const fundings = enrollment.fundings || [];
		const cdcFunding = currentCdcFunding(fundings);
		const isPrivatePay = !sourcelessFunding && cdcFunding === undefined;

		const c4kFunding = currentC4kFunding(fundings);
		const receivesC4k = c4kFunding !== undefined;

		const fundingFirstReportingPeriod = reportingPeriods.find<DeepNonUndefineable<ReportingPeriod>>(
			period => (cdcFunding ? cdcFunding.firstReportingPeriodId === period.id : false)
		);
		return (
			<div className="EnrollmentFundingSummary">
				{enrollment && (
					<>
						<p>Site: {idx(enrollment, _ => _.site.name)} </p>
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
							{sourcelessFunding
								? InlineIcon({ icon: 'incomplete' })
								: isPrivatePay
								? 'Private pay'
								: `CDC - ${prettyFundingTime((cdcFunding as Funding).time)}` // cdcFunding will always be defined but Typescript does not infer so
							}
						</p>
						{!isPrivatePay && !sourcelessFunding && (
							<p>
								First reporting period:{' '}
								{fundingFirstReportingPeriod
									? reportingPeriodFormatter(fundingFirstReportingPeriod)
									: InlineIcon({ icon: 'incomplete' })}
							</p>
						)}
						{receivesC4k && c4kFunding && (
							<>
								<p>
									Care 4 Kids Family ID:{' '}
									{c4kFunding.familyId ? c4kFunding.familyId : InlineIcon({ icon: 'incomplete' })}
								</p>
								<p>
									Care 4 Kids Certificate Start Date:{' '}
									{c4kFunding.certificateStartDate
										? dateFormatter(c4kFunding.certificateStartDate)
										: InlineIcon({ icon: 'incomplete' })}
								</p>
							</>
						)}
					</>
				)}
			</div>
		);
	},

	Form: ({ enrollment, siteId, mutate, successCallback, finallyCallback, visitedSections }) => {
		if (!enrollment) {
			throw new Error('EnrollmentFunding rendered without an enrollment');
		}

		const initialLoad = visitedSections ? !visitedSections[EnrollmentFunding.key] : false;

		const { user } = useContext(UserContext);
		const { cdcReportingPeriods: reportingPeriods } = useContext(ReportingPeriodContext);

		const defaultParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
			id: enrollment.id || 0,
			orgId: getIdForUser(user, 'org'),
			siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
			enrollment: enrollment,
		};

		const [_enrollment, updateEnrollment] = useReducer<
			FormReducer<DeepNonUndefineable<Enrollment>>
		>(formReducer, enrollment);
		const updateFormData = updateData<DeepNonUndefineable<Enrollment>>(updateEnrollment);
		const entry = _enrollment.entry;

		const fundings = _enrollment.fundings || [];
		const sourcelessFunding = getSourcelessFunding(_enrollment);

		const cdcFunding = currentCdcFunding(fundings);
		const [cdcReportingPeriod, updateCdcReportingPeriod] = useState<ReportingPeriod | undefined>(
			cdcFunding ? cdcFunding.firstReportingPeriod : undefined
		);

		const initialFundingSource =
			initialLoad || sourcelessFunding
				? FundingType.UNSELECTED
				: cdcFunding
				? FundingType.CDC
				: FundingType.PRIVATE_PAY;
		const [fundingSelection, updateFundingSelection] = useState<FundingSelection>({
			source: initialFundingSource,
			time: cdcFunding ? cdcFunding.time : undefined,
		});

		const [reportingPeriodOptions, updateReportingPeriodOptions] = useState<ReportingPeriod[]>([]);

		const c4kFunding = currentC4kFunding(fundings);
		const [receivesC4k, updateReceivesC4k] = useState<boolean>(!!c4kFunding);
		const [c4kFamilyId, updateC4kFamilyId] = useState<number | null>(
			c4kFunding ? c4kFunding.familyId : null
		);
		const [c4kCertificateStartDate, updateC4kCertificateStartDate] = useState<Date | null>(
			c4kFunding ? c4kFunding.certificateStartDate : null
		);

		// For page load
		useEffect(() => {
			if (reportingPeriods) {
				const _cdcReporingPeriod = cdcFunding
					? reportingPeriods.find<DeepNonUndefineable<ReportingPeriod>>(
							period => period.id === cdcFunding.firstReportingPeriodId
					  )
					: undefined;
				updateCdcReportingPeriod(_cdcReporingPeriod);
			}
		}, [reportingPeriods, cdcFunding]);

		// For drop down and change on enrollment start date
		useEffect(() => {
			const startDate = entry ? entry : enrollment.entry ? enrollment.entry : moment().toDate();
			const nextPeriods = nextNReportingPeriods(reportingPeriods, startDate, 5);
			let nextPeriodsExcludingCurrent = nextPeriods;
			if (cdcReportingPeriod) {
				nextPeriodsExcludingCurrent = [
					...nextPeriods.filter(period => period.id !== cdcReportingPeriod.id),
				];
			}
			const periods = cdcReportingPeriod
				? [cdcReportingPeriod, ...nextPeriodsExcludingCurrent]
				: nextPeriodsExcludingCurrent;
			updateReportingPeriodOptions([...periods].sort(periodSorter));
		}, [enrollment.entry, entry, reportingPeriods]);

		const [apiError, setApiError] = useState<ValidationProblemDetails>();

		const _save = () => {
			let updatedFundings: Funding[] = [...fundings]
				.filter(funding => funding.id !== (sourcelessFunding && sourcelessFunding.id))
				.filter(funding => funding.id !== (cdcFunding && cdcFunding.id));

			switch (fundingSelection.source) {
				case FundingType.UNSELECTED:
					updatedFundings.push(
						createFunding({
							enrollmentId: enrollment.id,
							source: null,
						})
					);
					break;
				case FundingType.PRIVATE_PAY:
					// do nothing
					break;
				case FundingType.CDC:
					const time = fundingSelection.time || FundingTime.Part;
					if (cdcFunding) {
						updatedFundings.push(
							updateFunding({
								currentFunding: cdcFunding,
								time,
								reportingPeriod: cdcReportingPeriod,
							})
						);
					} else if (sourcelessFunding) {
						updatedFundings.push(
							updateFunding({
								currentFunding: sourcelessFunding,
								source: FundingSource.CDC,
								time,
								reportingPeriod: cdcReportingPeriod,
							})
						);
					} else {
						updatedFundings.push(
							createFunding({
								enrollmentId: enrollment.id,
								source: FundingSource.CDC,
								time,
								firstReportingPeriod: cdcReportingPeriod,
							})
						);
					}
					break;
				default:
					break;
			}

			updatedFundings = [...updatedFundings].filter(
				funding => funding.id !== (c4kFunding && c4kFunding.id)
			);
			if (receivesC4k) {
				updatedFundings.push({
					id: c4kFunding ? c4kFunding.id : 0,
					enrollmentId: enrollment.id,
					source: FundingSource.C4K,
					certificateStartDate: c4kCertificateStartDate ? c4kCertificateStartDate : undefined,
					familyId: c4kFamilyId,
				});
			} else {
				// do nothing
			}

			if (enrollment) {
				const params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
					...defaultParams,
					enrollment: {
						..._enrollment,
						fundings: updatedFundings,
					},
				};

				return mutate(api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(params))
					.then(res => {
						if (successCallback && res) successCallback(res);
					})
					.catch(error => {
						setApiError(ValidationProblemDetailsFromJSON(error));
					})
					.finally(() => {
						finallyCallback && finallyCallback(EnrollmentFunding);
					});
			}
			return new Promise(() => {});
			// TODO: what should happen if there is no enrollment, child, or family?  See also family info and family income
		};

		const { isExecuting: isMutating, setExecuting: save } = usePromiseExecution(_save);

		const siteParams: ApiOrganizationsOrgIdSitesIdGetRequest = {
			// Separate query so that mutation doesn't try to update all the enrollments when user saves this one
			// Otherwise we get "Enrollment exit reason is required for ended enrollments" validation errors on both site.enrollments and child.org.site.enrollments
			id: validatePermissions(user, 'site', siteId) ? siteId : 0,
			orgId: getIdForUser(user, 'org'),
			include: ['organizations', 'enrollments', 'funding_spaces', 'fundings'],
		};
		const [, , site] = useApi(api => api.apiOrganizationsOrgIdSitesIdGet(siteParams), [user]);

		// Dropdown options for funding type
		const [fundingTypeOpts, setFundingTypeOpts] = useState<{ value: string; text: string }[]>([]);
		useEffect(() => {
			const orgFundingSpaces = idx(site, _ => _.organization.fundingSpaces);
			if (!orgFundingSpaces || familyDeterminationNotDisclosed(enrollment)) return;
			const newFundingTypeOpts = orgFundingSpaces
				.filter(space => space.ageGroup === _enrollment.ageGroup)
				.map(space => ({
					value: '' + space.time,
					text: `${space.source} - ${prettyFundingTime(space.time)}`,
				}));
			setFundingTypeOpts([
				...newFundingTypeOpts,
				{
					value: 'privatePay',
					text: 'Private pay',
				},
			]);
		}, [site, _enrollment.ageGroup]);

		// TODO: make alert wider?
		// TODO: do we care which reporting periods it violates this constraint for, or just the current one?
		type UtilizationRate = {
			capacity: number;
			numEnrolled: number;
		};
		const [utilizationRate, setUtilizationRate] = useState<UtilizationRate>();
		const newlySetCdcFunding = !cdcFunding && fundingSelection.source === FundingType.CDC;
		const thisPeriod = currentReportingPeriod(reportingPeriods);
		useEffect(() => {
			if (!site || !site.enrollments || !(cdcFunding || newlySetCdcFunding) || !thisPeriod) {
				return;
			}
			// This and below will need rewritten if we have more than just CDC in the dropdown
			const currentFundingOpts = {
				source: FundingSource.CDC,
				time: fundingSelection.time,
				ageGroup: _enrollment.ageGroup,
			};
			const capacity = getFundingSpaceCapacity(site.organization, currentFundingOpts);
			const enrolled = site.enrollments.filter<DeepNonUndefineable<Enrollment>>(
				e =>
					e.ageGroup === _enrollment.ageGroup &&
					isFunded(e, {
						...currentFundingOpts,
						currentRange: {
							startDate: moment(thisPeriod.periodStart),
							endDate: moment(thisPeriod.periodEnd),
						},
					})
			);

			const numEnrolled = enrolled.length + (newlySetCdcFunding ? 1 : 0);
			setUtilizationRate({ capacity, numEnrolled });
		}, [site, fundingSelection, _enrollment.ageGroup, thisPeriod]);

		return (
			<form className="EnrollmentFundingForm" onSubmit={save} noValidate autoComplete="off">
				<div className="usa-form">
					<ChoiceList
						type="select"
						id="site"
						name="siteId"
						options={
							idx(user, _ =>
								_.orgPermissions[0].organization.sites.map(s => ({
									value: `${s.id}`,
									text: s.name,
								}))
							) || []
						}
						label="Site"
						selected={toFormString(_enrollment.siteId)}
						onChange={updateFormData(value => parseInt(value, 10))}
					/>
					<DatePicker
						name="entry"
						onChange={updateFormData(
							range => (range.startDate && range.startDate.toDate()) || null
						)}
						dateRange={{ startDate: entry ? moment(entry) : null, endDate: null }}
						label="Start date"
						id="enrollment-start-date"
						status={initialLoadErrorGuard(
							initialLoad,
							warningForField('entry', enrollment, 'This information is required for OEC reporting')
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
						selected={toFormString(_enrollment.ageGroup)}
						onChange={updateFormData(ageFromString)}
						status={initialLoadErrorGuard(
							initialLoad,
							warningForFieldSet(
								'age-group-warning',
								['ageGroup'],
								enrollment,
								'This field is required for OEC reporting'
							)
						)}
					/>
					<h2>Funding</h2>
					<ChoiceList
						type="select"
						id="fundingType"
						options={fundingTypeOpts}
						label="Funding type"
						onChange={event => {
							updateFundingSelection(fundingSelectionFromString(event.target.value));
						}}
						selected={toFormString(fundingSelectionToString(fundingSelection))}
						status={initialLoadErrorGuard(
							initialLoad,
							warningForField(
								'source',
								cdcFunding || sourcelessFunding || null,
								'This information is required for OEC reporting'
							)
						)}
					/>
					{fundingSelection.source === FundingType.CDC && (
						<ChoiceList
							type="select"
							id="firstReportingPeriod"
							options={[
								...reportingPeriodOptions.map(period => {
									return {
										value: '' + period.id,
										text: reportingPeriodFormatter(period, { extended: true }),
									};
								}),
							]}
							label="First reporting period"
							onChange={event => {
								const chosen = reportingPeriodOptions.find(
									period => period.id === parseInt(event.target.value)
								);
								updateCdcReportingPeriod(chosen);
							}}
							selected={toFormString(cdcReportingPeriod ? cdcReportingPeriod.id : undefined)}
							status={initialLoadErrorGuard(
								initialLoad,
								serverErrorForField('fundings', apiError) ||
									warningForField(
										'firstReportingPeriod',
										cdcFunding || null,
										'This information is required for OEC reporting'
									)
							)}
						/>
					)}
					{utilizationRate && utilizationRate.numEnrolled > utilizationRate.capacity && (
						<Alert
							type="info"
							// TODO (after user research): This will only warn about the current reporting period.  What if they set an earlier reporting period date?
							text={`${utilizationRate.numEnrolled} out of ${
								utilizationRate.capacity
							} spaces are utilized for the ${
								thisPeriod ? reportingPeriodFormatter(thisPeriod) : 'current'
							} reporting period.`}
						/>
					)}
					<h2>Care 4 Kids</h2>
					<ChoiceList
						type="check"
						selected={receivesC4k ? ['receives-c4k'] : undefined}
						options={[
							{
								text: 'Receives Care 4 Kids',
								value: 'receives-c4k',
							},
						]}
						onChange={e => updateReceivesC4k(!!(e.target as HTMLInputElement).checked)}
						id="c4k-check-box"
						legend="Receives Care 4 Kids"
						className="margin-top-3"
					/>
					{receivesC4k && (
						<>
							<TextInput
								type='input'
								name="receivesC4k"
								id="familyId"
								label="Family ID"
								defaultValue={c4kFamilyId ? '' + c4kFamilyId : ''}
								onChange={event => updateC4kFamilyId(parseInt(event.target.value))}
								status={initialLoadErrorGuard(
									initialLoad,
									warningForField(
										'familyId',
										c4kFunding ? c4kFunding : null,
										'This information is required for OEC reporting'
									)
								)}
							/>
							<DatePicker
								name="c4kCertificateStartDate"
								onChange={range =>
									updateC4kCertificateStartDate(
										(range.startDate && range.startDate.toDate()) || null
									)
								}
								dateRange={{
									startDate: c4kCertificateStartDate ? moment(c4kCertificateStartDate) : null,
									endDate: null,
								}}
								label="Certificate start date"
								id="c4k-certificate-start-date"
								status={initialLoadErrorGuard(
									initialLoad,
									warningForField(
										'certificateStartDate',
										c4kFunding ? c4kFunding : null,
										'This information is required for OEC reporting'
									)
								)}
							/>
						</>
					)}
				</div>

				<div className="usa-form">
					<Button text={isMutating ? 'Saving...' : 'Save'} onClick="submit" disabled={isMutating} />
				</div>
			</form>
		);
	},
};

export default EnrollmentFunding;
