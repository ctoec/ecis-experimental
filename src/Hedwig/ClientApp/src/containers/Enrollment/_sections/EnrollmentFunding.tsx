import React, { useContext, useState, useEffect } from 'react';
import { Section } from '../enrollmentTypes';
import Button from '../../../components/Button/Button';
import DatePicker from '../../../components/DatePicker/DatePicker';
import Dropdown from '../../../components/Dropdown/Dropdown';
import RadioGroup from '../../../components/RadioGroup/RadioGroup';
import dateFormatter from '../../../utils/dateFormatter';
import moment from 'moment';
import idx from 'idx';
import { ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest, Age, FundingTime, Funding, FundingSource, ReportingPeriod } from '../../../generated';
import UserContext from '../../../contexts/User/UserContext';
import { ageFromString, prettyAge } from '../../../utils/ageGroupUtils';
import getIdForUser from '../../../utils/getIdForUser';
import { DeepNonUndefineable } from '../../../utils/types';
import { sectionHasValidationErrors } from '../../../utils/validations';
import { prettyFundingTime, fundingTimeFromString } from '../../../utils/fundingTimeUtils';
import { nextNReportingPeriods } from '../../../utils/models/reportingPeriod';
import ReportingPeriodContext from '../../../contexts/ReportingPeriod/ReportingPeriodContext';
import { currentFunding } from '../../../utils/models';
import { familyDeterminationNotDisclosed } from '../../../utils/models/familyDetermination';
import Checkbox from '../../../components/Checklist/Checkbox';
import TextInput from '../../../components/TextInput/TextInput';

const EnrollmentFunding: Section = {
  key: 'enrollment-funding',
  name: 'Enrollment and funding',
  status: ({ enrollment }) => enrollment && sectionHasValidationErrors([enrollment, enrollment.fundings]) ? 'incomplete' : 'complete',

  Summary: ({ enrollment }) => {
		const { cdcReportingPeriods: reportingPeriods } = useContext(ReportingPeriodContext);

		if (!enrollment) return <></>;

		const cdcFundings = (enrollment.fundings || []).filter<DeepNonUndefineable<Funding>>(
			(funding => funding.source === FundingSource.CDC)
		).sort((a,b) => {
			if (a.firstReportingPeriod.periodStart === b.firstReportingPeriod.periodStart) {
				return 0;
			} else if (a.firstReportingPeriod.periodStart < b.firstReportingPeriod.periodStart) {
				return -1;
			} else {
				return 1;
			}
		});
		const c4kFundings = (enrollment.fundings || []).filter<DeepNonUndefineable<Funding>>(
			(funding => funding.source === FundingSource.C4K)
		).sort((a,b) => {
			if (a.firstReportingPeriod.periodStart === b.firstReportingPeriod.periodStart) {
				return 0;
			} else if (a.firstReportingPeriod.periodStart < b.firstReportingPeriod.periodStart) {
				return -1;
			} else {
				return 1;
			}
		});
		const cdcFunding = cdcFundings.length > 0 ? cdcFundings[0] : undefined;
		const isPrivatePay = cdcFunding === undefined;
		const c4kFunding = c4kFundings.length > 0 ? c4kFundings[0] : undefined;
		const receivesC4k = c4kFunding !== undefined;

		const fundingFirstReportingPeriod = reportingPeriods.find<DeepNonUndefineable<ReportingPeriod>>(period => cdcFunding ? cdcFunding.firstReportingPeriodId == period.id : false);
		return (
			<div className="EnrollmentFundingSummary">
				{enrollment && (
					<>
						<p>Site: {idx(enrollment, _ => _.site.name)} </p>
						<p>Age Group: {prettyAge(idx(enrollment, _ => _.ageGroup) || null)}</p>
						<p>
							Enrollment date:{' '}
							{dateFormatter(idx(enrollment, _ => _.entry))}
						</p>
						<p>Funding:{' '}
							{isPrivatePay ?
								'Private pay' :
								`CDC - ${prettyFundingTime((cdcFunding as Funding).time)}` // cdcFunding will always be defined but Typescript does not infer so
							}
						</p>
						{!isPrivatePay &&
							<p>First reporting period:{' '}
								{dateFormatter((fundingFirstReportingPeriod as ReportingPeriod).period)} {/*cdcFunding will always be defined but Typescript does not infer so */}
							</p>
						}
						{receivesC4k && (
							<>
								<p>Care 4 Kids Family ID:{' '}
									{(c4kFunding as Funding).familyId} {/* c4kFunding will always be defined but Typescript does not infer so */}
								</p>
								<p>Care 4 Kids Certificate Start Date:{' '}
									{dateFormatter((c4kFunding as Funding).certificateStartDate)} {/* c4kFunding will always be defined but Typescript does not infer so */}
								</p>
							</>
						)}
					</>
				)}
			</div>
		);
  },

  Form: ({ enrollment, mutate, callback }) => {
    if (!enrollment) {
			throw new Error('EnrollmentFunding rendered without an enrollment');
		}

		const { user } = useContext(UserContext);
		const { cdcReportingPeriods: reportingPeriods } = useContext(ReportingPeriodContext);

		const defaultParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
			id: enrollment.id || 0,
			orgId: getIdForUser(user, "org"),
			siteId: getIdForUser(user, "site"),
			enrollment: enrollment
		}

		const [siteId, updateSiteId] = useState(idx(enrollment, _ => _.siteId));

		const [entry, updateEntry] = useState(enrollment ? enrollment.entry : null);
		const [age, updateAge] = useState(enrollment ? enrollment.ageGroup : null);

		const fundings = enrollment.fundings ? enrollment.fundings : [] as DeepNonUndefineable<Funding[]>;

		const cdcFundings = fundings.filter(funding => funding.source === FundingSource.CDC);
		const cdcFunding = currentFunding(cdcFundings);
		const [cdcFundingId] = useState<number | null>(cdcFunding ? cdcFunding.id : null);
		const [cdcFundingTime, updateCdcFundingTime] = useState<FundingTime | null>(cdcFunding ? cdcFunding.time : null);
		const [privatePay, updatePrivatePay] = useState<boolean>(cdcFundings.length === 0);

		const [cdcReportingPeriod, updateCdcReportingPeriod] = useState<ReportingPeriod | null>(null);

		const [reportingPeriodOptions, updateReportingPeriodOptions] = useState<ReportingPeriod[]>([]);

		const c4kFundings = fundings.filter(funding => funding.source === FundingSource.C4K);
		const c4kFunding = currentFunding(c4kFundings);
		const [c4kFundingId] = useState<number | null>(c4kFunding ? c4kFunding.id : null);
		const [receivesC4k, updateReceivesC4k] = useState<boolean>(!!c4kFunding);
		const [c4kFamilyId, updateC4kFamilyId] = useState<number | null>(c4kFunding ? c4kFunding.familyId : null);
		const [c4kCertificateStartDate, updateC4kCertificateStartDate] = useState<Date | null>(c4kFunding ? c4kFunding.certificateStartDate : null);

		useEffect(() => {
			if (reportingPeriods) {
				const _cdcReporingPeriod = cdcFunding ?
					reportingPeriods.find<DeepNonUndefineable<ReportingPeriod>>(
						period => period.id === cdcFunding.firstReportingPeriodId
					) :
					null;
				updateCdcReportingPeriod(_cdcReporingPeriod ? _cdcReporingPeriod : null);
			}
		}, [reportingPeriods, cdcFunding]);

		useEffect(() => {
			const startDate = entry ? entry : enrollment.entry ? enrollment.entry : new Date();
			updateReportingPeriodOptions(nextNReportingPeriods(reportingPeriods, startDate, 3));
		}, [enrollment.entry, entry, reportingPeriods])

		const save = () => {
			const currentCdcFunding = fundings.find<DeepNonUndefineable<Funding>>(
				(funding => funding.id === cdcFundingId) as (_: DeepNonUndefineable<Funding>) => _ is DeepNonUndefineable<Funding>
			);

			let updatedFundings: Funding[];
			if (cdcFundingId && privatePay) {
				// Current funding exists, remove it because it has been switched to private pay
				// TODO: Consider whether this should instead set the exit date on funding to today
				updatedFundings = [
					...(fundings.filter<DeepNonUndefineable<Funding>>(funding => funding.id !== cdcFundingId))
				]
			} else if (cdcFundingId && !privatePay) {
				// Current funding exists, update it with supplied information
				const newCdcFunding: Funding = {
					...(currentCdcFunding as Funding), // currentCdcFunding will always be defined but typescript doesn't infer so
					time: cdcFundingTime ? cdcFundingTime : undefined,
					firstReportingPeriodId: (cdcReportingPeriod as ReportingPeriod).id // cdcReporingPeriod will always be defined but typescript doesn't infer so
				};
				updatedFundings = [
					...(fundings.filter<DeepNonUndefineable<Funding>>(funding => funding.id !== cdcFundingId)),
					newCdcFunding
				]
			} else if (!cdcFundingId && privatePay) {
				// No current funding, do nothing because private pay has been selected
				updatedFundings = [...fundings];
			} else /* !cdcFunding && !privatePay */ {
				// No current funding, add new funding with supplied information
				const newCdcFunding: Funding = {
					id: 0,
					enrollmentId: enrollment.id,
					source: FundingSource.CDC,
					time: cdcFundingTime ? cdcFundingTime : undefined,
					firstReportingPeriodId: (cdcReportingPeriod as ReportingPeriod).id // cdcReporingPeriod will always be defined but typescript doesn't infer so
				}
				updatedFundings = [
					...fundings,
					newCdcFunding
				]
			}

			if (c4kFundingId && receivesC4k) {
				// Current funding exists, update it with supplied information
				const newC4kFunding = {
					...(c4kFunding as Funding),
					certificateStartDate: c4kCertificateStartDate ? c4kCertificateStartDate : undefined,
					familyId: c4kFamilyId
				}
				updatedFundings = [
					...(updatedFundings.filter(funding => funding.id !== c4kFundingId)),
					newC4kFunding
				]
			} else if (c4kFundingId && !receivesC4k) {
				// Current funding exists, remove it because it has been switched to no receipt of C4K
				updatedFundings = [
					...updatedFundings.filter(funding => funding.id !== c4kFundingId)
				]
			} else if (!c4kFundingId && receivesC4k) {
				// // No current funding, add new funding with supplied information
				const newC4kFunding: Funding = {
					id: 0,
					enrollmentId: enrollment.id,
					source: FundingSource.C4K,
					certificateStartDate: c4kCertificateStartDate ? c4kCertificateStartDate : undefined,
					familyId: c4kFamilyId
				}
				updatedFundings = [
					...updatedFundings,
					newC4kFunding
				]
			} else /* !c4kFunding && !receivesC4k */ {
				// No current funding, do nothing because receives C4K has not been selected
			}

			const args = {
				entry: entry,
				ageGroup: age || undefined,
				fundings: updatedFundings
			};

			if (enrollment) {
				const params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
					...defaultParams,
					enrollment: {
						...enrollment,
						...args
					}
				}
				mutate((api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(params))
					.then((res) => {
						if (callback && res) callback(res);
					});
			}
		};

		return (
			<div className="EnrollmentFundingForm">
				<div className="usa-form">
					<Dropdown
						id="site"
						options={
							idx(user, _ => _.orgPermissions[0].organization.sites.map(s => ({
								value: `${s.id}`,
								text: s.name
							})))
							|| []
						}
						label="Site"
						selected={siteId ? '' + siteId : undefined}
						onChange={event => updateSiteId(parseInt(event.target.value, 10))}
					/>
					<DatePicker
						onChange={range =>
							updateEntry((range.startDate && range.startDate.toDate()) || null)
						}
						dateRange={{ startDate: entry ? moment(entry) : null, endDate: null }}
						label="Start date"
						id="enrollment-start-date"
					/>

					<h3>Age group</h3>
					<RadioGroup
						legend="Age"
						id="age"
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
						onChange={event =>
							updateAge(ageFromString(event.target.value))
						}
					/>
					<h2>Funding</h2>
					<Dropdown
						id="fundingType"
						options={
							[
								{
									value: '',
									text: '- Select -'
								},
								...(
									familyDeterminationNotDisclosed(enrollment) ?
										[] :
										Object.values(FundingTime).map(fundingTime => {
											return {
												value: fundingTime,
												text: `CDC - ${prettyFundingTime(fundingTime)}`
											}
										})
									),
								{
									value: 'privatePay',
									text: 'Private pay'
								}
							]
						}
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
								updateCdcFundingTime(fundingTimeFromString(event.target.value))
							}
						}}
						selected={
							privatePay ?
							'privatePay' :
							cdcFundingTime !== null ?
								cdcFundingTime :
								''
						}
					/>
					{(!privatePay && cdcFundingTime) && (
						<Dropdown
							id="firstReportingPeriod"
							options={
								[
									...(reportingPeriodOptions.map(period => {
										return {
											value: '' + period.id,
											text: `${period.periodStart.toLocaleDateString()} - ${period.periodEnd.toLocaleDateString()}`
										}
									}))
								]
							}
							label="First reporting period"
							onChange={event => {
								const chosen = reportingPeriodOptions.find(period => period.id === parseInt(event.target.value));
								updateCdcReportingPeriod(chosen || reportingPeriodOptions[0]);
							}}
							selected={
								cdcReportingPeriod ?
								'' + cdcReportingPeriod.id :
									reportingPeriodOptions[0] ?
										'' + reportingPeriodOptions[0].id :
										''
							}
						/>
					)}
					<h3>Care 4 Kids</h3>
					<Checkbox
						text="Receives Care 4 Kids"
						value="receives-c4k"
						name="receives-c4k"
						onChange={(e) => updateReceivesC4k(!!e.target.checked)}
						checked={!!receivesC4k}
					/>
					{receivesC4k && (
						<>
							<TextInput
								id="familyId"
								label="Family ID"
								defaultValue={c4kFamilyId ? '' + c4kFamilyId : ''}
								onChange={event => updateC4kFamilyId(parseInt(event.target.value))}
							/>
							<DatePicker
								onChange={range =>
									updateC4kCertificateStartDate((range.startDate && range.startDate.toDate()) || null)
								}
								dateRange={{ startDate: c4kCertificateStartDate ? moment(c4kCertificateStartDate) : null, endDate: null }}
								label="Certificate start date"
								id="c4k-certificate-start-date"
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
