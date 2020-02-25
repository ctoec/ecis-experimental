import React, { useContext, useState, useEffect } from 'react';
import { History } from 'history';
import moment from 'moment';
import UserContext from '../../contexts/User/UserContext';
import {
	Enrollment,
	Funding,
	FundingSource,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest,
	ValidationProblemDetails,
	ValidationProblemDetailsFromJSON,
	ReportingPeriod,
} from '../../generated';
import { nameFormatter, splitCamelCase, childWithdrawnAlert } from '../../utils/stringFormatters';
import { DeepNonUndefineable } from '../../utils/types';
import {
	generateFundingTag,
	enrollmentExitReasons,
	currentCdcFunding,
	currentC4kFunding,
	lastNReportingPeriods,
} from '../../utils/models';
import { DatePicker, ChoiceList, Button, InlineIcon } from '../../components';
import useApi from '../../hooks/useApi';
import { validatePermissions, getIdForUser } from '../../utils/models';
import CommonContainer from '../CommonContainer';
import {
	clientErrorForField,
	serverErrorForField,
	useFocusFirstError,
	hasValidationErrors,
} from '../../utils/validations';
import ReportingPeriodContext from '../../contexts/ReportingPeriod/ReportingPeriodContext';
import { processBlockingValidationErrors } from '../../utils/validations/processBlockingValidationErrors';
import AlertContext from '../../contexts/Alert/AlertContext';

type WithdrawalProps = {
	history: History;
	match: {
		params: {
			siteId: number;
			enrollmentId: number;
		};
	};
};

export default function Withdrawal({
	history,
	match: {
		params: { siteId, enrollmentId },
	},
}: WithdrawalProps) {
	const { user } = useContext(UserContext);
	const { setAlerts } = useContext(AlertContext);
	const { cdcReportingPeriods: reportingPeriods } = useContext(ReportingPeriodContext);

	const defaultParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest = {
		id: enrollmentId || 0,
		orgId: getIdForUser(user, 'org'),
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
	};

	const [loading, error, enrollment, mutate] = useApi<Enrollment>(
		api =>
			api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet({
				...defaultParams,
				include: ['child', 'family', 'determinations', 'fundings', 'sites'],
			}),
		[enrollmentId, user],
		{
			skip: !enrollmentId,
		}
	);

	const [enrollmentEndDate, updateEnrollmentEndDate] = useState<Date>();
	const [exitReason, updateExitReason] = useState<string>();
	const [lastReportingPeriod, updateLastReportingPeriod] = useState<ReportingPeriod>();

	const [reportingPeriodOptions, updateReportingPeriodOptions] = useState(reportingPeriods);

	const [attemptedSave, setAttemptedSave] = useState(false);
	const [apiError, setApiError] = useState<ValidationProblemDetails>();

	const fundings =
		enrollment && enrollment.fundings
			? enrollment.fundings
			: ([] as DeepNonUndefineable<Funding[]>);
	const cdcFundings = fundings.filter(funding => funding.source === FundingSource.CDC);
	const cdcFunding = currentCdcFunding(cdcFundings);

	useEffect(() => {
		if (reportingPeriods) {
			updateReportingPeriodOptions(
				lastNReportingPeriods(reportingPeriods, enrollmentEndDate || moment().toDate(), 5)
			);
		}
	}, [reportingPeriods, enrollmentEndDate]);

	const isMissingInformation = hasValidationErrors(enrollment);

	useEffect(() => {
		if (isMissingInformation) {
			setAlerts([
				{
					type: 'error',
					heading: 'Information needed to withdraw child',
					text:
						'To withdraw a child from a funded space in your program, they cannot have any missing information. Please enter all missing information indicated below to withdraw this child.',
				},
			]);
			history.push(`/roster/sites/${siteId}/enrollments/${enrollment.id}`);
		}
	}, [enrollment, isMissingInformation, history, setAlerts]);

	useFocusFirstError([apiError]);

	if (loading || error || !enrollment) {
		return <div className="Withdrawl"></div>;
	}

	const save = () => {
		setAttemptedSave(true);

		//enrollment end date (exit) is required for withdrawl
		if (!enrollmentEndDate) {
			return;
		}

		let updatedFundings: Funding[] = fundings;
		if (cdcFunding && lastReportingPeriod) {
			updatedFundings = [
				...fundings.filter<DeepNonUndefineable<Funding>>(funding => funding.id !== cdcFunding.id),
				{
					...cdcFunding,
					lastReportingPeriodId: lastReportingPeriod.id,
					lastReportingPeriod: lastReportingPeriod,
				},
			];
		}

		const c4KFunding = currentC4kFunding(
			fundings.filter<DeepNonUndefineable<Funding>>(funding => funding.source === FundingSource.C4K)
		);
		if (c4KFunding) {
			updatedFundings = [
				...updatedFundings.filter(funding => funding.id !== c4KFunding.id),
				{
					...c4KFunding,
					certificateEndDate: enrollmentEndDate,
				},
			];
		}
		const putParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
			...defaultParams,
			enrollment: {
				...enrollment,
				exit: enrollmentEndDate,
				exitReason,
				fundings: updatedFundings,
			},
		};

		mutate(api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(putParams))
			.then(() => {
				setAlerts([childWithdrawnAlert(nameFormatter(enrollment.child))]);
				history.push(`/roster`);
			})
			.catch(async error => {
				setApiError(await ValidationProblemDetailsFromJSON(error));
			});
	};

	return (
		<CommonContainer
			directionalLinkProps={{
				direction: 'left',
				to: `/roster/sites/${siteId}/enrollments/${enrollment.id}/`,
				text: 'Back',
			}}
		>
			<div className="grid-container">
				<h1>Withdraw {nameFormatter(enrollment.child)}</h1>
				<div className="grid-row grid-gap oec-enrollment-details-section__content margin-top-1">
					<div className="mobile-lg:grid-col-6">
						<p>{enrollment.site.name}</p>
						<p>Age: {splitCamelCase(enrollment.ageGroup, '/')}</p>
						<p>Enrollment date: {enrollment.entry && enrollment.entry.toLocaleDateString()}</p>
					</div>
					{cdcFunding && (
						<div className="mobile-lg:grid-col-6">
							<p>{generateFundingTag(cdcFunding)}</p>
							<p>Enrollment: {cdcFunding.time}</p>
							<p>
								First reporting period:{' '}
								{cdcFunding.firstReportingPeriod
									? cdcFunding.firstReportingPeriod.period.toLocaleDateString()
									: InlineIcon({ icon: 'attentionNeeded' })}
							</p>
						</div>
					)}
				</div>

				<div className="usa-form mobile-lg:grid-col-12">
					<DatePicker
						label="Enrollment end date"
						id="enrollment-end-date"
						onChange={range =>
							updateEnrollmentEndDate((range.startDate && range.startDate.toDate()) || undefined)
						}
						dateRange={{ startDate: null, endDate: null }}
						status={
							// TODO should we use a different fact for this condition?
							reportingPeriodOptions.length === 0
								? {
										type: 'error',
										id: 'last-reporting-period-error',
										message:
											'ECE Reporter only contains data for fiscal year 2020 and later. Please do not add children who withdrew prior to July 2019.',
								  }
								: apiError && processBlockingValidationErrors('exit', apiError.errors)
								? serverErrorForField('exit', apiError)
								: clientErrorForField(
										'exit',
										enrollmentEndDate,
										attemptedSave,
										'This information is required for withdrawal'
								  )
						}
					/>
					<ChoiceList
						type="select"
						label="Reason"
						id="exit-reason"
						options={Object.entries(enrollmentExitReasons).map(([key, reason]) => ({
							value: key,
							text: reason,
						}))}
						otherInputLabel="Other"
						onChange={event => updateExitReason(event.target.value)}
						status={serverErrorForField(
							'exitreason',
							apiError,
							'This information is required for withdrawal'
						)}
					/>
					{cdcFunding && (
						<ChoiceList
							type="select"
							label="Last reporting period"
							id="last-reporting-period"
							options={reportingPeriodOptions.map(period => ({
								value: '' + period.id,
								text: `${period.periodStart.toLocaleDateString()} - ${period.periodEnd.toLocaleDateString()}`,
							}))}
							onChange={event => {
								const chosen = reportingPeriods.find<ReportingPeriod>(
									period => period.id === parseInt(event.target.value)
								);
								updateLastReportingPeriod(chosen);
							}}
							status={serverErrorForField(
								'fundings',
								apiError,
								'This information is required for withdrawal'
							)}
						/>
					)}
				</div>

				<div className="grid-row margin-y-6">
					<div className="mobile-lg:grid-col-auto">
						<Button
							text="Cancel"
							href={`/roster/sites/${siteId}/enrollments/${enrollment.id}/`}
							appearance="outline"
						/>
					</div>
					<div className="mobile-lg:grid-col-auto padding-left-2">
						<Button text="Confirm and withdraw" onClick={save} disabled={isMissingInformation} />
					</div>
				</div>
			</div>
		</CommonContainer>
	);
}
