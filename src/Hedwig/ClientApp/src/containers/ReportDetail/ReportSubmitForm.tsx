import React, { useState, FormEvent } from 'react';
import useAuthMutation from '../../hooks/useAuthMutation';
import { gql } from 'apollo-boost';
import { ReportQuery_report } from '../../generated/ReportQuery';
import { ReportSubmitMutation } from '../../generated/ReportSubmitMutation';
import Alert, { AlertProps } from '../../components/Alert/Alert';

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
				{!submittedAt && <input className="usa-button" type="submit" value="Submit" />}
			</form>
		</React.Fragment>
	);
}
