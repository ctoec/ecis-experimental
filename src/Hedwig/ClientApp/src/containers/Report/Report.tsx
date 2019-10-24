import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useParams } from 'react-router-dom';
import { ReportQuery } from '../../generated/ReportQuery';
import ReportSubmitForm from './ReportSubmitForm';
import monthFormatter from '../../utils/monthFormatter';
import dateFormatter from '../../utils/dateFormatter';

export const REPORT_QUERY = gql`
    query ReportQuery ($id: ID!){
        report(id: $id) {
            ...on CdcReportType {
                id
                type
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

export default function Report() {
    let { id } = useParams();
    const { loading, error, data } = useQuery<ReportQuery>(REPORT_QUERY, {
        variables: { id },
    });

    if (loading || error || !data || !data.report) {
        return <div className="Report"></div>;
    }

    console.log(data);
    return (
        <div className="Report">
            <section className="grid-container">
                <h1>{monthFormatter(data.report.period)} {data.report.type} Report</h1>
                <p className="usa-intro">{data.report.organization.name} | {dateFormatter(data.report.periodStart)} - {dateFormatter(data.report.periodEnd)}</p>
                <ReportSubmitForm {...data.report} />
            </section>
        </div>
    )
}