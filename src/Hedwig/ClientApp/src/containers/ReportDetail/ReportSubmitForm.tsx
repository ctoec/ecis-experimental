import React, { useState, FormEvent } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { ReportQuery_report } from '../../generated/ReportQuery';
import { ReportSubmitMutation } from '../../generated/ReportSubmitMutation';

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

	const [updateReport] = useMutation<ReportSubmitMutation>(REPORT_SUBMIT_MUTATION, {
		onCompleted: data => {
			setSubmittedAt(data && data.submitCdcReport ? data.submitCdcReport.submittedAt : null);
		},
		onError: error => {
			console.log(error);
		},
	});

	function onSubmit(e: FormEvent) {
		e.preventDefault();
		updateReport({ variables: { id: report.id, accredited } });
	}

	return (
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
	);
}
