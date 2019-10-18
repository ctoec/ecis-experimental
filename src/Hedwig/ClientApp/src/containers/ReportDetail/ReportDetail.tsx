import React, { useState, FormEvent } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useParams } from 'react-router-dom';
import { ReportDetailQuery, ReportDetailQuery_report } from '../../generated/ReportDetailQuery';
import { ReportUpdateMut } from '../../generated/ReportUpdateMut';
import { CdcReportInput } from '../../generated/globalTypes';
import monthFormatter from '../../utils/monthFormatter';
import dateFormatter from '../../utils/dateFormatter';

export const REPORT_DETAIL_QUERY = gql`
    query ReportDetailQuery ($id: ID!){
        report(id: $id) {
            ...on CdcReportType {
                id
                type
                reportingPeriodId
                period
                periodStart
                periodEnd
                submittedAt
                accredited
                organization {
                    id
                    name
                }
            }
        }
    }
`;

export const REPORT_SUBMIT = gql`
    mutation ReportUpdateMut ($reportInput: CdcReportInput!) {
        updatedCdcReport(reportInput: $reportInput) {
            ...on CdcReportType {
                id,
                submittedAt
            }
        }
    }
`;

function ReportDetailForm(report: ReportDetailQuery_report) {
    const [accredited, setAccredited] = useState(!!report.accredited);
    const [submitted, setSubmitted] = useState(!!report.submittedAt);
    const [submittedAt, setSubmittedAt] = useState(report.submittedAt);

    const reportInput: CdcReportInput = {
        id: report.id,
        reportingPeriodId: report.reportingPeriodId,
        organizationId: report.organization.id,
        submittedAt: new Date().toUTCString(),
        accredited: accredited
    };
    const [updateReport] = useMutation<ReportUpdateMut>(REPORT_SUBMIT, {
        onCompleted: (data) => {
            setSubmitted(true);
            setSubmittedAt(data && data.updatedCdcReport ? data.updatedCdcReport.submittedAt: null);
        },
        onError: (error) => {
            console.log(error);

        }
    });

    function onSubmit(e: FormEvent) {
        e.preventDefault();
        updateReport({ variables: { reportInput }});
    }


    return (
        <form className="usa-form" onSubmit={onSubmit}>
        {submitted &&
        <p><b>Submitted At:</b> {submittedAt} </p>
        }
        <div className="usa-checkbox">
            <input 
                className="usa-checkbox__input" 
                id="accredited" 
                type="checkbox" 
                disabled={submitted} 
                defaultChecked={!!accredited}
                onChange={e => setAccredited(e.target.checked)}
            />
            <label className="usa-checkbox__label" htmlFor="accredited">Accredited</label>
        </div>
        {!submitted && 
        <input className="usa-button" type="submit" value="Submit"/>
        }
    </form>
    )
}

export default function ReportDetail() {
    let { id } = useParams();
    const { loading, error, data } = useQuery<ReportDetailQuery>(REPORT_DETAIL_QUERY, {
        variables: { id: id},
    });

    if (loading || error || !data || !data.report) {
        return <div className="ReportDetail"></div>;
    }

    return (
        <div className="ReportDetail">
            <section className="grid-container">
                <h1>{monthFormatter(data.report.period)} {data.report.type} Report</h1>
                <p className="usa-intro">{data.report.organization.name} | {dateFormatter(data.report.periodStart)} - {dateFormatter(data.report.periodEnd)}</p>
                <ReportDetailForm {...data.report}/>
            </section>
        </div>
    )
}