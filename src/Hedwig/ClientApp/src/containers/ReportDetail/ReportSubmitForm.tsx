import React, { useState, FormEvent } from 'react';
import useAuthMutation from '../../hooks/useAuthMutation';
import { gql } from 'apollo-boost';
import { ReportQuery_report } from '../../generated/ReportQuery';
import { ReportSubmitMutation } from '../../generated/ReportSubmitMutation';
import Alert, { AlertProps } from '../../components/Alert/Alert';
import TextInput from '../../components/TextInput/TextInput';
import Checkbox from '../../components/Checklist/Checkbox';

export const REPORT_SUBMIT_MUTATION = gql`
	mutation ReportSubmitMutation($id: Int!, $accredited: Boolean!) {
		submitCdcReport(id: $id, accredited: $accredited) {
			... on CdcReportType {
				id
				submittedAt
			}
		}
	}
`;

export default function ReportSubmitForm(report: ReportQuery_report) {
	const [accredited, setAccredited] = useState(report.accredited);
	const [submittedAt, setSubmittedAt] = useState(report.submittedAt);
	const [alert, setAlert] = useState<AlertProps | null>(null);

	const [updateReport] = useAuthMutation<ReportSubmitMutation>(REPORT_SUBMIT_MUTATION, {
		onCompleted: data => {
			setSubmittedAt(data && data.submitCdcReport ? data.submitCdcReport.submittedAt : null);
			setAlert({
				type: 'success',
				heading: 'Report submitted',
				text: 'You have successfully submitted this report.',
			});
		},

		onError: error => {
			console.log(error);
			setAlert({ type: 'error', heading: 'Report not submitted', text: error.message });
		},
	});

	function onSubmit(e: FormEvent) {
		e.preventDefault();
		updateReport({ variables: { id: report.id, accredited } });
	}

	return (
		<React.Fragment>
			{alert && <Alert {...alert} />}
			<form className="usa-form" onSubmit={onSubmit}>
				{submittedAt && (
					<p>
						<b>Submitted At:</b> {submittedAt}{' '}
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
						onChange={() => {}}
						disabled={!!submittedAt}
					/>
					<div className="margin-top-2">
						<Checkbox
							text="Includes retroactive payment for past months"
							value="retroactive"
							name="retroactive"
							onChange={() => {}}
							disabled={!!submittedAt}
						/>
					</div>
					<TextInput
						id="family-fee-srevenue"
						label={<span className="text-bold">Family Fees</span>}
						onChange={() => {}}
						disabled={!!submittedAt}
					/>
				</fieldset>
				{!submittedAt && <input className="usa-button" type="submit" value="Submit" />}
			</form>
		</React.Fragment>
	);
}
