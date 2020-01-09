import React, { useContext, useState, useEffect } from 'react';
import { Section } from '../enrollmentTypes';
import Button from '../../../components/Button/Button';
import DatePicker from '../../../components/DatePicker/DatePicker';
import Dropdown from '../../../components/Dropdown/Dropdown';
import RadioGroup from '../../../components/RadioGroup/RadioGroup';
import dateFormatter from '../../../utils/dateFormatter';
import moment from 'moment';
import idx from 'idx';
import {
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest,
	Age,
	FundingTime,
	Funding,
	FundingSource,
	ReportingPeriod,
	ValidationProblemDetails,
	ValidationProblemDetailsFromJSON,
} from '../../../generated';
import UserContext from '../../../contexts/User/UserContext';
import { ageFromString, prettyAge } from '../../../utils/ageGroupUtils';
import getIdForUser from '../../../utils/getIdForUser';
import { DeepNonUndefineable } from '../../../utils/types';
import {
	sectionHasValidationErrors,
	warningForField,
	warningForFieldSet,
	serverErrorForField,
} from '../../../utils/validations';
import { prettyFundingTime, fundingTimeFromString } from '../../../utils/fundingTimeUtils';
import { nextNReportingPeriods, periodSorter } from '../../../utils/models/reportingPeriod';
import ReportingPeriodContext from '../../../contexts/ReportingPeriod/ReportingPeriodContext';
import { familyDeterminationNotDisclosed, currentFunding, updateFunding, createFunding, currentC4kFunding } from '../../../utils/models';
import Checklist from '../../../components/Checklist/Checklist';
import TextInput from '../../../components/TextInput/TextInput';
import InlineIcon from '../../../components/InlineIcon/InlineIcon';

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

		const fundings = enrollment.fundings || [];
		const sourcelessFunding = fundings.find(funding => !funding.source);

		const cdcFundings = fundings
			.filter<DeepNonUndefineable<Funding>>(funding => funding.source === FundingSource.CDC);
		const cdcFunding = currentFunding(cdcFundings);
		const isPrivatePay = !sourcelessFunding && cdcFunding === undefined;

		const c4kFundings = fundings
			.filter<DeepNonUndefineable<Funding>>(funding => funding.source === FundingSource.C4K)
		const c4kFunding = currentC4kFunding(c4kFundings);
		const receivesC4k = c4kFunding !== undefined;

		const fundingFirstReportingPeriod = reportingPeriods.find<DeepNonUndefineable<ReportingPeriod>>(
			period => (cdcFunding ? cdcFunding.firstReportingPeriodId == period.id : false)
		);
		return (
			<div className="EnrollmentFundingSummary">
				{enrollment && (
					<>
						<p>Site: {idx(enrollment, _ => _.site.name)} </p>
						<p>
							Age Group:{' '}
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
							{sourcelessFunding ?
								InlineIcon({ icon: 'incomplete' }) :
								isPrivatePay
									? 'Private pay'
									: `CDC - ${prettyFundingTime((cdcFunding as Funding).time)}` // cdcFunding will always be defined but Typescript does not infer so
							}
						</p>
						{!isPrivatePay && !sourcelessFunding && (
							<p>
								First reporting period:{' '}
								{fundingFirstReportingPeriod
									? dateFormatter(fundingFirstReportingPeriod.period)
									: InlineIcon({ icon: 'incomplete' })}
							</p>
						)}
						{(receivesC4k && c4kFunding) && (
							<>
								<p>
									Care 4 Kids Family ID: {c4kFunding.familyId ? c4kFunding.familyId : InlineIcon({icon: 'incomplete'})}
								</p>
								<p>
									Care 4 Kids Certificate Start Date: {c4kFunding.certificateStartDate ? dateFormatter(c4kFunding.certificateStartDate) : InlineIcon({icon: 'incomplete'})}
								</p>
							</>
						)}
					</>
				)}
			</div>
		);
	},

	Form: ({ enrollment, mutate, callback, visitedSections }) => {
		if (!enrollment) {
			throw new Error('EnrollmentFunding rendered without an enrollment');
		}

		const initialLoad = visitedSections ? !visitedSections[EnrollmentFunding.key] : false;

		const { user } = useContext(UserContext);
		const { cdcReportingPeriods: reportingPeriods } = useContext(ReportingPeriodContext);

		const defaultParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
			id: enrollment.id || 0,
			orgId: getIdForUser(user, 'org'),
			siteId: getIdForUser(user, 'site'),
			enrollment: enrollment,
		};

		const [siteId, updateSiteId] = useState(idx(enrollment, _ => _.siteId));

		const [entry, updateEntry] = useState(enrollment ? enrollment.entry : null);
		const [age, updateAge] = useState(enrollment ? enrollment.ageGroup : null);

		const fundings = enrollment.fundings
			? enrollment.fundings
			: ([] as DeepNonUndefineable<Funding[]>);

		const sourcelessFunding = fundings.find(funding => !funding.source);
		const cdcFundings = fundings.filter(funding => funding.source === FundingSource.CDC);
		const cdcFunding = currentFunding(cdcFundings);
		const [cdcFundingId] = useState<number | null>(cdcFunding ? cdcFunding.id : null);
		const [cdcFundingTime, updateCdcFundingTime] = useState<FundingTime | null>(
			cdcFunding ? cdcFunding.time : null
		);
		const [privatePay, updatePrivatePay] = useState<boolean>(!initialLoad && !sourcelessFunding && cdcFundings.length === 0);

		const [cdcReportingPeriod, updateCdcReportingPeriod] = useState<ReportingPeriod>();

		const [reportingPeriodOptions, updateReportingPeriodOptions] = useState<ReportingPeriod[]>([]);

		const c4kFundings = fundings.filter(funding => funding.source === FundingSource.C4K);
		const c4kFunding = currentFunding(c4kFundings);
		const [c4kFundingId] = useState<number | null>(c4kFunding ? c4kFunding.id : null);
		const [receivesC4k, updateReceivesC4k] = useState<boolean>(!!c4kFunding);
		const [c4kFamilyId, updateC4kFamilyId] = useState<number | null>(
			c4kFunding ? c4kFunding.familyId : null
		);
		const [c4kCertificateStartDate, updateC4kCertificateStartDate] = useState<Date | null>(
			c4kFunding ? c4kFunding.certificateStartDate : null
		);

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

		useEffect(() => {
			const startDate = entry ? entry : enrollment.entry ? enrollment.entry : moment().toDate();
			const nextPeriods = nextNReportingPeriods(reportingPeriods, startDate, 5);
			let nextPeriodsExcludingCurrent = nextPeriods;
			if (cdcReportingPeriod) {
				nextPeriodsExcludingCurrent = [...nextPeriods.filter(period => period.id != cdcReportingPeriod.id)];
			}
			const periods = cdcReportingPeriod ? [cdcReportingPeriod, ...nextPeriodsExcludingCurrent] : nextPeriodsExcludingCurrent;
			updateReportingPeriodOptions([...periods].sort(periodSorter));
		}, [enrollment.entry, entry, reportingPeriods]);

		const [apiError, setApiError] = useState<ValidationProblemDetails>();

		const save = () => {
			let updatedFundings: Funding[] | undefined = undefined;

			// CDC REGION
			if (sourcelessFunding) {
				// The user previously saved without selecting a funding from the dropdown
				if (!privatePay && !cdcFundingTime) {
					// The user still hasn't selected a funding
					// Do nothing
				} else {
					// The user has explicitly selected a funding
					// Remove this sourceless funding (we either need to update it or remove it)
					updatedFundings = [
						...fundings.filter(funding => funding.id !== sourcelessFunding.id)
					];
					if (privatePay) {
					// The user has explicitly selected private pay
					// We've already removed the sourceless funding
					} else if (cdcFundingTime) {
						// The user has explicitly selected a CDC funding
						// Update the funding
						updatedFundings.push(updateFunding({
							currentFunding: sourcelessFunding,
							source: FundingSource.CDC,
							time: cdcFundingTime,
							reportingPeriod: cdcReportingPeriod
						}));
					}
				}
			} else {
				// There is no sourceless funding
				if (cdcFundingId && cdcFunding) {
					// Current funding exists
					// Remove current current (we either need to update it or remove it)
					updatedFundings = [
						...fundings.filter<DeepNonUndefineable<Funding>>(funding => funding.id !== cdcFundingId)
					];
					if (!privatePay && cdcFundingTime) {
						// The funding is to be updated, so add it back with the new values
						updatedFundings.push(updateFunding({
							currentFunding: cdcFunding,
							time: cdcFundingTime,
							reportingPeriod: cdcReportingPeriod
						}));
					} else if (privatePay && !cdcFundingTime) {
						// The funding is to be removed
						// Do nothing
					} else if (!privatePay && !cdcFundingTime) {
						// '- Select -' was chosen
						updatedFundings.push(createFunding({
							enrollmentId: enrollment.id,
							source: null
						}))
					} else {
						// privatePay and cdcFundingTime should never both be value-ful
						throw new Error("Something impossible happened");
					}
				} else {
					// No current funding exists
					// Copy over all fundings
					updatedFundings = [...fundings];
					if (cdcFundingTime && !privatePay) {
						// There should be a new funding added
						updatedFundings.push(createFunding({
							enrollmentId: enrollment.id,
							source: FundingSource.CDC,
							time: cdcFundingTime,
							firstReportingPeriodId: cdcReportingPeriod ? cdcReportingPeriod.id : undefined
						}));
					} else if (!cdcFunding && privatePay) {
						// User selected private pay, do nothing
					} else if (!cdcFunding && !privatePay) {
						// User did not select a funding, create a source-less funding
						updatedFundings.push(createFunding({
							enrollmentId: enrollment.id,
							source: null
						}));
					}
					else /* (cdcFundingTime && privatePay) */ {
						throw new Error("Something impossible happened");
					}
				}
			}
			// END CDC REGION

			// C4K REGION
			if (!updatedFundings) {
				updatedFundings = [...fundings];
			}
			if (c4kFundingId && receivesC4k) {
				// Current funding exists, update it with supplied information
				const newC4kFunding = {
					...(c4kFunding as Funding),
					certificateStartDate: c4kCertificateStartDate ? c4kCertificateStartDate : undefined,
					familyId: c4kFamilyId,
				};
				updatedFundings = [
					...updatedFundings.filter(funding => funding.id !== c4kFundingId),
					newC4kFunding,
				];
			} else if (c4kFundingId && !receivesC4k) {
				// Current funding exists, remove it because it has been switched to no receipt of C4K
				updatedFundings = [...updatedFundings.filter(funding => funding.id !== c4kFundingId)];
			} else if (!c4kFundingId && receivesC4k) {
				// // No current funding, add new funding with supplied information
				const newC4kFunding: Funding = {
					id: 0,
					enrollmentId: enrollment.id,
					source: FundingSource.C4K,
					certificateStartDate: c4kCertificateStartDate ? c4kCertificateStartDate : undefined,
					familyId: c4kFamilyId,
				};
				updatedFundings = [...updatedFundings, newC4kFunding];
			} /* !c4kFunding && !receivesC4k */ else {
				// No current funding, do nothing because receives C4K has not been selected
			}

			const args = {
				entry: entry,
				ageGroup: age || undefined,
				fundings: updatedFundings,
			};

			if (enrollment) {
				const params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
					...defaultParams,
					enrollment: {
						...enrollment,
						...args,
					},
				};
				mutate(api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(params))
					.then(res => {
						if (callback && res) callback(res);
					})
					.catch(error => {
						setApiError(ValidationProblemDetailsFromJSON(error));
					});
			}
		};

		return (
			<div className="EnrollmentFundingForm">
				<div className="usa-form">
					<Dropdown
						id="site"
						options={
							idx(user, _ =>
								_.orgPermissions[0].organization.sites.map(s => ({
									value: `${s.id}`,
									text: s.name,
								}))
							) || []
						}
						label="Site"
						selected={siteId ? '' + siteId : undefined}
						onChange={event => updateSiteId(parseInt(event.target.value, 10))}
					/>
					<DatePicker
						onChange={range => updateEntry((range.startDate && range.startDate.toDate()) || null)}
						dateRange={{ startDate: entry ? moment(entry) : null, endDate: null }}
						label="Start date"
						id="enrollment-start-date"
						status={warningForField(
							'entry',
							enrollment,
							'This information is required for OEC reporting'
						)}
					/>

					<h3>Age group</h3>
					<RadioGroup
						legend="Age group"
						id="age-group"
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
						selected={'' + age}
						onChange={event => updateAge(ageFromString(event.target.value))}
						status={warningForFieldSet(
							'age-group-warning',
							['ageGroup'],
							enrollment,
							'This field is required for OEC reporting'
						)}
					/>
					<h3>Funding</h3>
					<Dropdown
						id="fundingType"
						options={[
							...(familyDeterminationNotDisclosed(enrollment)
								? []
								: Object.values(FundingTime).map(fundingTime => {
										return {
											value: fundingTime,
											text: `CDC - ${prettyFundingTime(fundingTime)}`,
										};
								  })),
							{
								value: 'privatePay',
								text: 'Private pay',
							},
						]}
						noSelectionText="-Select-"
						label="Funding type"
						onChange={event => {
							if (event.target.value === 'privatePay') {
								updatePrivatePay(true);
								updateCdcFundingTime(null);
							} else if (event.target.value === '') {
								updatePrivatePay(false);
								updateCdcFundingTime(null);
							} else {
								updatePrivatePay(false);
								updateCdcFundingTime(fundingTimeFromString(event.target.value));
							}
						}}
						selected={privatePay ? 'privatePay' : cdcFundingTime !== null ? cdcFundingTime : ''}
					/>
					{!privatePay && cdcFundingTime && (
						<Dropdown
							id="firstReportingPeriod"
							options={[
								...reportingPeriodOptions.map(period => {
									return {
										value: '' + period.id,
										text: `${period.periodStart.toLocaleDateString()} - ${period.periodEnd.toLocaleDateString()}`,
									};
								}),
							]}
							noSelectionText="-Select-"
							label="First reporting period"
							onChange={event => {
								const chosen = reportingPeriodOptions.find(
									period => period.id === parseInt(event.target.value)
								);
								updateCdcReportingPeriod(chosen);
							}}
							selected={cdcReportingPeriod ? '' + cdcReportingPeriod.id : ''}
							status={
								serverErrorForField(
									'fundings',
									apiError
								) ||
								warningForField(
									'firstReportingPeriod',
									cdcFunding ? cdcFunding as Funding : null,
									'This information is required for OEC reporting'
								)
							}
						/>
					)}
					<h3>Care 4 Kids</h3>
					<Checklist
						options={[
							{
								text: 'Receives Care 4 Kids',
								value: 'receives-c4k',
								checked: !!receivesC4k,
								onChange: e => updateReceivesC4k(!!e.target.checked),
							},
						]}
						id="c4k-checklist-box"
						legend="Receives Care 4 Kids"
						className="margin-top-3"
					/>
					{receivesC4k && (
						<>
							<TextInput
								id="familyId"
								label="Family ID"
								defaultValue={c4kFamilyId ? '' + c4kFamilyId : ''}
								onChange={event => updateC4kFamilyId(parseInt(event.target.value))}
								status={warningForField(
									'familyId',
									c4kFunding ? c4kFunding : null,
									'This information is required for OEC reporting'
								)}
							/>
							<DatePicker
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
								status={warningForField(
									'certificateStartDate',
									c4kFunding ? c4kFunding : null,
									'This information is required for OEC reporting'
								)}
							/>
						</>
					)}
				</div>

				<div className="usa-form">
					<Button text="Save" onClick={save} />
				</div>
			</div>
		);
	},
};

export default EnrollmentFunding;
