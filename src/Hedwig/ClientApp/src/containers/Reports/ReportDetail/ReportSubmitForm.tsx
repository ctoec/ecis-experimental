import React, { useState, useEffect, useContext, useReducer } from 'react';
import {
	CdcReport,
	ApiOrganizationsOrgIdReportsIdPutRequest,
	ApiOrganizationsOrgIdEnrollmentsGetRequest,
	FundingTime,
	FundingTimeSplitUtilization,
	FundingSpace,
	FundingTimeSplit,
	ReportingPeriod,
} from '../../../generated';
import useApi, { ApiError } from '../../../hooks/useApi';
import UserContext from '../../../contexts/User/UserContext';
import { Button, TextInput, ChoiceList, FieldSet, ErrorBoundary } from '../../../components';
import AppContext from '../../../contexts/App/AppContext';
import currencyFormatter from '../../../utils/currencyFormatter';
import parseCurrencyFromString from '../../../utils/parseCurrencyFromString';
import {
	getIdForUser,
	activeC4kFundingAsOf,
	getReportingPeriodWeeks,
	getFundingSpaces,
	prettyFundingTime,
	prettyAge,
	getReportingPeriodMonth,
	getTimeSplitUtilizationsForFiscalYearOfReport as getTimeSplitUtilizationsOfFundingSpaceForFiscalYearOfReport,
} from '../../../utils/models';
import UtilizationTable from './UtilizationTable';
import AlertContext from '../../../contexts/Alert/AlertContext';
import { useHistory } from 'react-router';
import { DeepNonUndefineable } from '../../../utils/types';
import { useFocusFirstError, isBlockingValidationError } from '../../../utils/validations';
import { reportSubmittedAlert, reportSubmitFailAlert } from '../../../utils/stringFormatters';
import pluralize from 'pluralize';
import { validationErrorAlert } from '../../../utils/stringFormatters/alertTextMakers';
import { FormReducer, formReducer, updateData } from '../../../utils/forms/form';
import dateFormatter from '../../../utils/dateFormatter';
import {
	REQUIRED_FOR_REPORT,
	WEEKS_USED_CANNOT_EXCEED_WEEKS_AVAILABLE,
} from '../../../utils/validations/messageStrings';
import { sumWeeksUsed } from '../../../utils/models/fundingTimeSplitUtilization';
import { displayValidationStatus } from '../../../utils/validations/displayValidationStatus';

export type ReportSubmitFormProps = {
	report: CdcReport;
	error: ApiError | null;
	canSubmit: boolean;
};

export default function ReportSubmitForm({
	report: __report,
	error: inputError,
	canSubmit,
}: ReportSubmitFormProps) {
	const report = __report as DeepNonUndefineable<CdcReport>;
	const history = useHistory();

	const { user } = useContext(UserContext);

	const [_report, updateReport] = useReducer<FormReducer<DeepNonUndefineable<CdcReport>>>(
		formReducer,
		report
	);
	const updateFormData = updateData<DeepNonUndefineable<CdcReport>>(updateReport);
	const {
		submittedAt,
		accredited,
		c4KRevenue,
		retroactiveC4KRevenue,
		familyFeesRevenue,
		comment,
	} = _report;

	const { invalidateCache: invalidateAppCache } = useContext(AppContext);
	const { getAlerts, setAlerts } = useContext(AlertContext);
	const alerts = getAlerts();

	const params: ApiOrganizationsOrgIdReportsIdPutRequest = {
		id: report.id || 0,
		orgId: getIdForUser(user, 'org'),
	};

	const enrollmentParams: ApiOrganizationsOrgIdEnrollmentsGetRequest = {
		orgId: getIdForUser(user, 'org'),
		include: ['fundings'],
		startDate: report.reportingPeriod.periodStart,
		endDate: report.reportingPeriod.periodEnd,
		asOf: submittedAt || undefined,
	};

	const { data: allEnrollments } = useApi(
		(api) => api.apiOrganizationsOrgIdEnrollmentsGet(enrollmentParams),
		{ skip: !user || !report }
	);

	const [care4KidsCount, setCare4KidsCount] = useState(0);

	useEffect(() => {
		if (allEnrollments) {
			var c4kFundedEnrollments = allEnrollments.filter(
				(enrollment) => !!activeC4kFundingAsOf(enrollment, submittedAt || undefined)
			);
			var childIds: string[] = [];
			c4kFundedEnrollments.forEach((enrollment) => {
				const childId = enrollment.childId;
				if (childIds.indexOf(childId) < 0) {
					childIds.push(childId);
				}
			});
			setCare4KidsCount(childIds.length);
		}
	}, [allEnrollments, submittedAt]);

	const [error, setError] = useState(inputError);

	// set up form state
	useFocusFirstError([error]);
	const [hasAlertedOnError, setHasAlertedOnError] = useState(false);
	useEffect(() => {
		if (error && !hasAlertedOnError) {
			if (!isBlockingValidationError(error)) {
				throw new Error(error.title || 'Unknown api error');
			}
			setAlerts([validationErrorAlert]);
		}
	}, [error, hasAlertedOnError, setAlerts]);

	const [attemptingSave, setAttemptingSave] = useState(false);
	const { loading, error: saveError, data: saveData } = useApi<CdcReport>(
		(api) =>
			api.apiOrganizationsOrgIdReportsIdPut({
				...params,
				cdcReport: {
					..._report,
					timeSplitUtilizations: timeSplitUtilizations,
				},
			}),
		{ skip: !user || !attemptingSave, callback: () => setAttemptingSave(false) }
	);

	useEffect(() => {
		if (!saveData && !saveError) {
			// If the request did not go through, exit
			return;
		}

		// unset hasAlertedOnError to get correct error handling in subsequent requests
		setHasAlertedOnError(false);
		// Set the new error whether it's undefined or an error
		setError(saveError);
		if (saveData && !saveError) {
			const newAlert = reportSubmittedAlert(report.reportingPeriod);
			const newAlerts = [...alerts, newAlert];
			setAlerts(newAlerts);
			invalidateAppCache(); // Updates the count of unsubmitted reports in the nav bar
			history.push('/reports', newAlerts);
		}
	}, [
		saveData,
		saveError,
		history,
		setAlerts,
		invalidateAppCache,
		report,
		setError,
		setHasAlertedOnError,
		alerts,
	]);

	const reportingPeriodWeeks = getReportingPeriodWeeks(report.reportingPeriod);
	const splitTimeFundingSpaces = getFundingSpaces(report.organization.fundingSpaces, {
		time: FundingTime.Split,
	});
	const getSplitUtilization = (
		timeSplit: FundingTimeSplit,
		lesserWeeksUsed: number,
		reportingPeriodWeeks: number,
		reportingPeriod: ReportingPeriod,
		report: CdcReport
	) => {
		const lesserTime =
			timeSplit.fullTimeWeeks < timeSplit.partTimeWeeks ? FundingTime.Full : FundingTime.Part;
		const greaterWeeksUsed = reportingPeriodWeeks - lesserWeeksUsed;
		return {
			fundingSpaceId: timeSplit.fundingSpaceId,
			reportingPeriodId: reportingPeriod.id,
			reportId: report.id,
			fullTimeWeeksUsed: lesserTime === FundingTime.Full ? lesserWeeksUsed : greaterWeeksUsed,
			partTimeWeeksUsed: lesserTime === FundingTime.Full ? greaterWeeksUsed : lesserWeeksUsed,
		} as DeepNonUndefineable<FundingTimeSplitUtilization>;
	};

	const [timeSplitUtilizations, updateTimeSplitUtilizations] = useState(
		report.timeSplitUtilizations && report.timeSplitUtilizations.length
			? report.timeSplitUtilizations
			: splitTimeFundingSpaces.map((fundingSpace) =>
					getSplitUtilization(
						fundingSpace.timeSplit as FundingTimeSplit,
						0,
						reportingPeriodWeeks,
						report.reportingPeriod,
						report
					)
			  )
	);

	const splitTimeUtilizationQuestion = (fundingSpace: FundingSpace) => {
		const timeSplit = fundingSpace.timeSplit;
		if (!timeSplit) return;
		const currentFiscalYearTimeSplitUtilizations = getTimeSplitUtilizationsOfFundingSpaceForFiscalYearOfReport(
			fundingSpace,
			report
		);
		const lesserTime =
			timeSplit.fullTimeWeeks < timeSplit.partTimeWeeks ? FundingTime.Full : FundingTime.Part;
		const labelText = `${prettyAge(
			fundingSpace.ageGroup
		)} services were provided ${prettyFundingTime(lesserTime)}`;

		const fiscalYearUsedWeeks = sumWeeksUsed(currentFiscalYearTimeSplitUtilizations, lesserTime);

		const existingUtilizationForSpace = timeSplitUtilizations.find(
			(ut) => ut.fundingSpaceId === fundingSpace.id
		) || { fullTimeWeeksUsed: 0, partTimeWeeksUsed: 0 }; // these default 0s are only ever used to populate the default value

		const remainingWeeks =
			Math.min(timeSplit.fullTimeWeeks, timeSplit.partTimeWeeks) -
			fiscalYearUsedWeeks -
			(lesserTime === FundingTime.Full
				? existingUtilizationForSpace.fullTimeWeeksUsed
				: existingUtilizationForSpace.partTimeWeeksUsed);

		return (
			<>
				<TextInput
					type="inline-input"
					name="splitFundingTimeUtilization"
					id={`${fundingSpace.id}-lesser-weeks-used`}
					label={<span className="text-bold">{labelText}</span>}
					defaultValue={`${
						lesserTime === FundingTime.Full
							? existingUtilizationForSpace.fullTimeWeeksUsed
							: existingUtilizationForSpace.partTimeWeeksUsed
					}`}
					onChange={(e) => {
						const input = e.target.value;
						const lesserWeeksUsed = parseInt(input.replace(/[^0-9.]/g, ''), 10) || 0;

						updateTimeSplitUtilizations((_uts) => [
							..._uts.filter((ut) => ut.fundingSpaceId !== fundingSpace.id),
							getSplitUtilization(
								timeSplit,
								lesserWeeksUsed,
								reportingPeriodWeeks,
								report.reportingPeriod,
								report
							),
						]);
					}}
					status={displayValidationStatus([
						{
							type: 'error',
							response: error,
							field: 'timesplitutilizations',
							message: WEEKS_USED_CANNOT_EXCEED_WEEKS_AVAILABLE,
						},
					])}
					disabled={!!report.submittedAt}
					small
					afterContent={
						<>
							of {reportingPeriodWeeks} weeks in {getReportingPeriodMonth(report.reportingPeriod)}.
							<span className="text-italic text-gray-70">
								&nbsp;({remainingWeeks} {prettyFundingTime(lesserTime)} weeks remaining)
							</span>
						</>
					}
				/>
			</>
		);
	};

	return (
		<ErrorBoundary alertProps={reportSubmitFailAlert}>
			{report.submittedAt && (
				<p>
					<b>Submitted:</b> {dateFormatter(report.submittedAt)}{' '}
				</p>
			)}
			<ChoiceList
				type="check"
				id="accredited"
				name="accredited"
				legend="Accredited"
				disabled={!!report.submittedAt}
				defaultValue={accredited ? ['accredited'] : undefined}
				options={[
					{
						text: 'Accredited',
						value: 'accredited',
					},
				]}
				onChange={updateFormData((_, e) => e.target.checked)}
			/>
			{splitTimeFundingSpaces && splitTimeFundingSpaces.length && (
				<FieldSet
					className="usa-form usa-form--full-width margin-bottom-5"
					id="time-split-utilizations"
					legend="Funding time split utilizations"
				>
					{splitTimeFundingSpaces.map((fundingSpace) => splitTimeUtilizationQuestion(fundingSpace))}
				</FieldSet>
			)}
			<UtilizationTable
				report={{ ..._report, accredited }}
				timeSplitUtilizations={timeSplitUtilizations}
			/>
			<form className="usa-form" noValidate autoComplete="off">
				<h2>Other Revenue</h2>
				<FieldSet id="other-revenue" legend="Other Revenue" childrenGroupClassName={''}>
					<div className="mobile-lg:grid-col-12">
						<TextInput
							type="input"
							id="c4k-revenue"
							name="c4KRevenue"
							label={
								<React.Fragment>
									<span className="text-bold">Care 4 Kids</span>
									<span>
										{' '}
										({care4KidsCount} {pluralize('kid', care4KidsCount)} receiving subsidies)
									</span>
								</React.Fragment>
							}
							defaultValue={currencyFormatter(c4KRevenue)}
							onChange={updateFormData(parseCurrencyFromString)}
							onBlur={(event) =>
								(event.target.value = c4KRevenue !== null ? currencyFormatter(c4KRevenue) : '')
							}
							disabled={!!report.submittedAt}
							status={displayValidationStatus([
								{
									type: 'error',
									response: error,
									field: 'report.c4krevenue',
									message: REQUIRED_FOR_REPORT,
								},
							])}
							className="flex-fill"
						/>
					</div>
					<ChoiceList
						type="check"
						id="c4k-includes-retroactive"
						legend="Includes retroactive payment"
						name="retroactiveC4KRevenue"
						defaultValue={retroactiveC4KRevenue ? ['retroactiveC4KRevenue'] : undefined}
						onChange={updateFormData((_, e) => e.target.checked)}
						disabled={!!report.submittedAt}
						options={[
							{
								text: 'Includes retroactive payment for past months',
								value: 'retroactiveC4KRevenue',
							},
						]}
					/>
					<div className="mobile-lg:grid-col-12">
						<TextInput
							type="input"
							id="family-fees-revenue"
							name="familyFeesRevenue"
							label={<span className="text-bold">Family Fees</span>}
							defaultValue={currencyFormatter(familyFeesRevenue)}
							onChange={updateFormData(parseCurrencyFromString)}
							onBlur={(event) =>
								(event.target.value =
									familyFeesRevenue !== null ? currencyFormatter(familyFeesRevenue) : '')
							}
							disabled={!!report.submittedAt}
							status={displayValidationStatus([
								{
									type: 'error',
									response: error,
									field: 'familyfeesrevenue',
									message: REQUIRED_FOR_REPORT,
								},
							])}
							className="flex-fill"
						/>
					</div>
					<div className="mobile-lg:grid-col-12">
						<TextInput
							type="textarea"
							id="cdc-report-comment"
							name="comment"
							label={
								<span className="text-bold">
									Anything to share with the Office of Early Childhood about your report?
								</span>
							}
							defaultValue={comment || ''}
							onChange={updateFormData()}
							disabled={!!report.submittedAt}
							optional={true}
						/>
					</div>
				</FieldSet>
				{!report.submittedAt && (
					<Button
						onClick={() => setAttemptingSave(true)}
						text={attemptingSave ? 'Submitting...' : 'Submit'}
						disabled={!canSubmit || attemptingSave || loading}
					/>
				)}
			</form>
		</ErrorBoundary>
	);
}
