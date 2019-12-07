import React, { useState, useContext } from 'react';
import idx from 'idx';
import { useParams } from 'react-router-dom';
import ReportSubmitForm from './ReportSubmitForm';
import monthFormatter from '../../utils/monthFormatter';
import dateFormatter from '../../utils/dateFormatter';
import DirectionalLink from '../../components/DirectionalLink/DirectionalLink';
import Tag from '../../components/Tag/Tag';
import UserContext from '../../contexts/User/UserContext';
import getIdForUser from '../../utils/getIdForUser';
import useApi from '../../hooks/useApi';
import UtilizationTable from './UtilizationTable';

export default function ReportDetail() {
  let { id } = useParams();
  const { user } = useContext(UserContext);
  const reportParams = {
    id: parseInt(id || '0'),
    orgId: getIdForUser(user, 'org'),
    include: ['organizations', 'enrollments', 'sites', 'funding_spaces'],
  };
  const [loading, error, report] = useApi(
    api => api.apiOrganizationsOrgIdReportsIdGet(reportParams),
    [user]
  );

  console.log(report);

  if (!report) {
    return <div className="Report"></div>;
  }

  return (
    <div className="Report">
      <section className="grid-container">
        <DirectionalLink direction="left" to="/reports" text="Back to reports" />
        <h1>
          {monthFormatter(idx(report, _ => _.reportingPeriod.period))} {report.type} Report{' '}
          {!report.submittedAt && (
            <Tag text="DRAFT" color="gold-20v" addClass="margin-left-1 text-middle" />
          )}
        </h1>
        <p className="usa-intro">
          {idx(report, _ => _.organization.name)} | {dateFormatter(idx(report, _ => _.reportingPeriod.periodStart))} -{' '}
          {dateFormatter(idx(report, _ => _.reportingPeriod.periodEnd))}
        </p>
        <UtilizationTable {...report} />
        <ReportSubmitForm {...report} />
      </section>
    </div>
  );
}
