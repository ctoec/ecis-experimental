import React, { useState, FormEvent, useContext } from 'react';
import { CdcReport, ApiOrganizationsOrgIdReportsIdPutRequest } from '../../../generated';
import { Mutate } from '../../../hooks/useApi';
import UserContext from '../../../contexts/User/UserContext';
import { TextInput, ChoiceList, AlertProps } from '../../../components';
import AppContext from '../../../contexts/App/AppContext';
import currencyFormatter from '../../../utils/currencyFormatter';
import parseCurrencyFromString from '../../../utils/parseCurrencyFromString';
import getIdForUser from '../../../utils/getIdForUser';
import UtilizationTable from './UtilizationTable';
import AlertContext from '../../../contexts/Alert/AlertContext';
import { useHistory } from 'react-router';
import monthFormatter from '../../../utils/monthFormatter';
import { DeepNonUndefineable } from '../../../utils/types';
import { useFocusFirstError, serverErrorForField } from '../../../utils/validations';
import { ValidationProblemDetails, ValidationProblemDetailsFromJSON } from '../../../generated';

export type ReportSubmitFormProps = {
	report: DeepNonUndefineable<CdcReport>;
	mutate: Mutate<CdcReport>;
	canSubmit: boolean;
};

export default function ReportSubmitForm({ report, mutate, canSubmit }: ReportSubmitFormProps) {
	const history = useHistory();
	const [accredited, setAccredited] = useState(report.accredited);
	const [c4KRevenue, setC4KRevenue] = useState(report.c4KRevenue || null);
	const [retroactiveC4KRevenue, setRetroactiveC4KRevenue] = useState(report.retroactiveC4KRevenue);
	const [familyFeesRevenue, setFamilyFeesRevenue] = useState(report.familyFeesRevenue || null);

	const { user } = useContext(UserContext);
	const { invalidateCache: invalidateAppCache } = useContext(AppContext);
	const { getAlerts, setAlerts } = useContext(AlertContext);
	const alerts = getAlerts();
	const params: ApiOrganizationsOrgIdReportsIdPutRequest = {
		id: report.id || 0,
		orgId: getIdForUser(user, 'org'),
	};

	const [apiError, setApiError] = useState<ValidationProblemDetails>();

	useFocusFirstError([apiError]);

	function updatedReport(): CdcReport {
		return {
			...report,
			accredited,
			c4KRevenue: c4KRevenue !== null ? c4KRevenue : undefined,
			retroactiveC4KRevenue,
			familyFeesRevenue: familyFeesRevenue !== null ? familyFeesRevenue : undefined,
		};
	}

	function onSubmit(e: FormEvent) {
		console.log(e)
		e.preventDefault();
		mutate(api =>
			api.apiOrganizationsOrgIdReportsIdPut({
				...params,
				cdcReport: updatedReport(),
			})
		)
			.then(res => {
				if (res) {
					const newAlert = {
						type: 'success',
						heading: 'Submitted',
						text: `The ${monthFormatter(
							report.reportingPeriod.period
						)} CDC Report has been shared with the Office of Early Childhood`,
					} as AlertProps;
					const newAlerts = [...alerts, newAlert];
					setAlerts(newAlerts);
					invalidateAppCache(); // Updates the count of unsubmitted reports in the nav bar
					history.push('/reports', newAlerts);
				}
			})
			.catch(error => {
				setApiError(ValidationProblemDetailsFromJSON(error));
			});
	}

	console.log(apiError)

	return (
		<React.Fragment>
			{report.submittedAt && (
				<p>
					<b>Submitted:</b> {report.submittedAt.toLocaleDateString()}{' '}
				</p>
			)}
			<ChoiceList
				type="check"
				id="accredited"
				legend="Accredited"
				disabled={!!report.submittedAt}
				selected={accredited ? ['accredited'] : undefined}
				options={[
					{
						text: 'Accredited',
						value: 'accredited',
					},
				]}
				onChange={e => setAccredited((e.target as HTMLInputElement).checked)}
				className="usa-checkbox margin-bottom-5"
			/>
			<UtilizationTable {...{ ...report, accredited }} />
			<form className="usa-form" onSubmit={onSubmit}>
				<fieldset className="usa-fieldset">
					{/* TODO: REPLACE WITH FIELDSET COMPONENT */}
					<legend>
						<h2 className="margin-bottom-0 margin-top-2">Other Revenue</h2>
					</legend>
					{/* TODO: is this actually required? error isn't happening.  We should mark it as optional if it isn't */}
					<TextInput
						id="c4k-revenue"
						label={
							<React.Fragment>
								<span className="text-bold">Care 4 Kids</span>
							</React.Fragment>
						}
						defaultValue={currencyFormatter(c4KRevenue)}
						onChange={e => setC4KRevenue(parseCurrencyFromString(e.target.value))}
						onBlur={event =>
							(event.target.value = c4KRevenue !== null ? currencyFormatter(c4KRevenue) : '')
						}
						disabled={!!report.submittedAt}
						status={serverErrorForField(
							'report.c4krevenue',
							apiError,
							'This information is required for the report'
						)}
					/>
					<div className="margin-top-2">
						<ChoiceList
							type="check"
							id="c4k-includes-retroactive"
							legend="Includes retroactive payment"
							selected={retroactiveC4KRevenue ? ['retroactiveC4KRevenue'] : undefined}
							onChange={e => setRetroactiveC4KRevenue((e.target as HTMLInputElement).checked)}
							disabled={!!report.submittedAt}
							options={[
								{
									text: 'Includes retroactive payment for past months',
									value: 'retroactiveC4KRevenue',
								},
							]}
						/>
					</div>
					<TextInput
						id="family-fees-revenue"
						label={<span className="text-bold">Family Fees</span>}
						defaultValue={currencyFormatter(familyFeesRevenue)}
						onChange={e => setFamilyFeesRevenue(parseCurrencyFromString(e.target.value))}
						onBlur={event =>
							(event.target.value =
								familyFeesRevenue !== null ? currencyFormatter(familyFeesRevenue) : '')
						}
						disabled={!!report.submittedAt}
						status={serverErrorForField(
							'report.familyfeesrevenue',
							apiError,
							'This information is required for the report'
						)}
					/>
				</fieldset>
				{/* TODO: REPLACE WITH BUTTON COMPONENT */}
				{!report.submittedAt && (
					<input className="usa-button" type="submit" value="Submit" disabled={!canSubmit} />
				)}
			</form>
		</React.Fragment>
	);
}
