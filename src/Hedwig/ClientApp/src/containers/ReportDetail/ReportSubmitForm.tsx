import React, { useState, FormEvent, useContext, SetStateAction, Dispatch } from 'react';
import Alert, { AlertProps } from '../../components/Alert/Alert';
import { CdcReport, ApiOrganizationsOrgIdReportsIdPutRequest, CdcReportFromJSON } from '../../OAS-generated';
import { Mutate } from '../../hooks/useApi';
import UserContext from '../../contexts/User/UserContext';
import idx from 'idx';
import TextInput from '../../components/TextInput/TextInput';
import Checkbox from '../../components/Checklist/Checkbox';

export type ReportSubmitFormProps = {
	report: CdcReport,
	mutate: Mutate<CdcReport>,
	setAlert: Dispatch<SetStateAction<AlertProps | null>>,
	canSubmit: boolean
};

export default function ReportSubmitForm({report, mutate, setAlert, canSubmit}: ReportSubmitFormProps) {
	const [accredited, setAccredited] = useState(report.accredited);
	const [c4KRevenue, setC4KRevenue] = useState(report.c4KRevenue);
	const [retroactiveC4KRevenue, setRetroactiveC4KRevenue] = useState(report.retroactiveC4KRevenue);
	const [familyFeesRevenue, setFamilyFeesRevenue] = useState(report.familyFeesRevenue);
	const [submittedAt, setSubmittedAt] = useState(report.submittedAt);

	const { user } = useContext(UserContext);
	const params : ApiOrganizationsOrgIdReportsIdPutRequest = {
		id: report.id || 0,
		orgId: idx(user, _ => _.orgPermissions[0].organizationId) || 0
	};

	function updatedReport() : CdcReport{
		return {
			...report,
			accredited,
			c4KRevenue,
			retroactiveC4KRevenue,
			familyFeesRevenue,
			submittedAt
		};
	}

	function onSubmit(e: FormEvent) {
		e.preventDefault();
		mutate(
			api => api.apiOrganizationsOrgIdReportsIdPut({
				...params,
				cdcReport: updatedReport()
			})
		)
		.then(res => {
			if(res) {
				setSubmittedAt(res.submittedAt)
				setAlert({
					type: 'success',
					heading: 'Report submitted',
					text: 'You have successfully submitted this report'
				});
			}
		})
		.catch(err => {
			console.log(err);
			setAlert({
				type: 'error',
				heading: 'Report not submitted',
				text: 'There was an error submitting this report'
			})
		})
	}

	return (
		<React.Fragment>
			<form className="usa-form" onSubmit={onSubmit}>
				{submittedAt && (
					<p>
						<b>Submitted At:</b> {submittedAt.toLocaleDateString()}{' '}
					</p>
				)}
				<div className="usa-checkbox">
					<input
						className="usa-checkbox__input"
						id="accredited"
						type="checkbox"
						disabled={!!submittedAt}
						defaultChecked={accredited}
						onChange={e => setAccredited(e.target.checked)}
					/>
					<label className="usa-checkbox__label" htmlFor="accredited">
						Accredited
					</label>
				</div>
				<fieldset className="usa-fieldset">
					{/* TODO: USE SAME VALIDATION AS FAMILY INCOME */}
					{/* TODO: WHAT NEEDS TO BE ADDED TO BACKEND? */}
					<legend>
						<h2 className="margin-bottom-0 margin-top-2">Other Revenue</h2>
					</legend>
					<TextInput
						id="c4k-revenue"
						label={
							<React.Fragment>
								<span className="text-bold">Care 4 Kids</span>
							</React.Fragment>
						}
						defaultValue={`${c4KRevenue}`}
						onChange={(e) => setC4KRevenue(parseFloat(e.target.value))}
						disabled={!!submittedAt}
					/>
					<div className="margin-top-2">
						<Checkbox
							text="Includes retroactive payment for past months"
							value="c4k-includes-retroactive"
							name="c4k-includes-retroactive"
							onChange={(e) => setRetroactiveC4KRevenue(!!e.target.checked)}
							disabled={!!submittedAt}
							checked={retroactiveC4KRevenue}
						/>
					</div>
					<TextInput
						id="family-fee-srevenue"
						label={<span className="text-bold">Family Fees</span>}
						onChange={(e) => setFamilyFeesRevenue(parseFloat(e.target.value))}
						disabled={!!submittedAt}
					/>
				</fieldset>
				{!submittedAt && <input className="usa-button" type="submit" value="Submit" disabled={!canSubmit}/>}
			</form>
		</React.Fragment>
	);
}
