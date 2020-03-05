import React, { useState, useEffect, useContext, useReducer } from 'react';
import {
	CdcReport,
	ApiOrganizationsOrgIdReportsIdPutRequest,
	ApiOrganizationsOrgIdEnrollmentsGetRequest,
} from '../../../generated';
import useApi, { Mutate, ApiError } from '../../../hooks/useApi';
import UserContext from '../../../contexts/User/UserContext';
import { Button, TextInput, ChoiceList, FieldSet, ErrorBoundary } from '../../../components';
import AppContext from '../../../contexts/App/AppContext';
import currencyFormatter from '../../../utils/currencyFormatter';
import parseCurrencyFromString from '../../../utils/parseCurrencyFromString';
import { getIdForUser, activeC4kFundingAsOf } from '../../../utils/models';
import UtilizationTable from './UtilizationTable';
import AlertContext from '../../../contexts/Alert/AlertContext';
import { useHistory } from 'react-router';
import { DeepNonUndefineable } from '../../../utils/types';
import {
	useFocusFirstError,
	serverErrorForField,
	isBlockingValidationError,
} from '../../../utils/validations';
import usePromiseExecution from '../../../hooks/usePromiseExecution';
import { reportSubmittedAlert, reportSubmitFailAlert } from '../../../utils/stringFormatters';
import pluralize from 'pluralize';
import { validationErrorAlert } from '../../../utils/stringFormatters/alertTextMakers';
import { FormReducer, formReducer, updateData } from '../../../utils/forms/form';

export type ReportSubmitFormProps = {
	report: DeepNonUndefineable<CdcReport>;
	mutate: Mutate<CdcReport>;
	error: ApiError | null;
	canSubmit: boolean;
};

export default function ReportSubmitForm({
	report,
	mutate,
	error,
	canSubmit,
}: ReportSubmitFormProps) {
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

	const [, , allEnrollments] = useApi(
		api => api.apiOrganizationsOrgIdEnrollmentsGet(enrollmentParams),
		[user, report]
	);

	const [care4KidsCount, setCare4KidsCount] = useState(0);

	useEffect(() => {
		if (allEnrollments) {
			var c4kFundedEnrollments = allEnrollments.filter(
				enrollment => !!activeC4kFundingAsOf(enrollment.fundings, submittedAt || undefined)
			);
			var childIds: string[] = [];
			c4kFundedEnrollments.forEach(enrollment => {
				const childId = enrollment.childId;
				if (childIds.indexOf(childId) < 0) {
					childIds.push(childId);
				}
			});
			setCare4KidsCount(childIds.length);
		}
	}, [allEnrollments]);

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
	}, [error, hasAlertedOnError]);

	function _onSubmit() {
		return mutate(api =>
			api.apiOrganizationsOrgIdReportsIdPut({
				...params,
				cdcReport: { ..._report },
			})
		).then(res => {
			if (res) {
				const newAlert = reportSubmittedAlert(report.reportingPeriod);
				const newAlerts = [...alerts, newAlert];
				setAlerts(newAlerts);
				invalidateAppCache(); // Updates the count of unsubmitted reports in the nav bar
				history.push('/reports', newAlerts);
			}
		});
	}
	const { isExecuting: isMutating, setExecuting: onSubmit } = usePromiseExecution(_onSubmit);

	return (
		<ErrorBoundary alertProps={reportSubmitFailAlert}>
			{report.submittedAt && (
				<p>
					<b>Submitted:</b> {report.submittedAt.toLocaleDateString()}{' '}
				</p>
			)}
			<ChoiceList
				type="check"
				id="accredited"
				name="accredited"
				legend="Accredited"
				disabled={!!report.submittedAt}
				selected={accredited ? ['accredited'] : undefined}
				options={[
					{
						text: 'Accredited',
						value: 'accredited',
					},
				]}
				onChange={updateFormData((_, e) => e.target.checked)}
				className="margin-bottom-5"
			/>
			<UtilizationTable {...{ ..._report, accredited }} />
			<form className="usa-form" onSubmit={onSubmit} noValidate autoComplete="off">
				<h2>Other Revenue</h2>
				<FieldSet id="other-revenue" legend="Other Revenue">
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
						onBlur={event =>
							(event.target.value = c4KRevenue !== null ? currencyFormatter(c4KRevenue) : '')
						}
						optional={true}
						disabled={!!report.submittedAt}
						status={serverErrorForField(
							hasAlertedOnError,
							setHasAlertedOnError,
							'report.c4krevenue',
							error,
							'This information is required for the report'
						)}
					/>
					<ChoiceList
						type="check"
						id="c4k-includes-retroactive"
						legend="Includes retroactive payment"
						name="retroactiveC4KRevenue"
						selected={retroactiveC4KRevenue ? ['retroactiveC4KRevenue'] : undefined}
						onChange={updateFormData((_, e) => e.target.checked)}
						disabled={!!report.submittedAt}
						options={[
							{
								text: 'Includes retroactive payment for past months',
								value: 'retroactiveC4KRevenue',
							},
						]}
					/>
					<TextInput
						type="input"
						id="family-fees-revenue"
						name="familyFeesRevenue"
						label={<span className="text-bold">Family Fees</span>}
						defaultValue={currencyFormatter(familyFeesRevenue)}
						onChange={updateFormData(parseCurrencyFromString)}
						onBlur={event =>
							(event.target.value =
								familyFeesRevenue !== null ? currencyFormatter(familyFeesRevenue) : '')
						}
						disabled={!!report.submittedAt}
						status={serverErrorForField(
							hasAlertedOnError,
							setHasAlertedOnError,
							'familyfeesrevenue',
							error,
							'This information is required'
						)}
					/>
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
				</FieldSet>
				{!report.submittedAt && (
					<Button
						onClick="submit"
						text={isMutating ? 'Submitting...' : 'Submit'}
						disabled={!canSubmit || isMutating}
					/>
				)}
			</form>
		</ErrorBoundary>
	);
}
