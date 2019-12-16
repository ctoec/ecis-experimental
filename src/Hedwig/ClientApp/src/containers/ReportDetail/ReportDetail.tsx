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
import missingInformation from '../../utils/missingInformation';
import { Enrollment } from '../../generated/models/Enrollment';
import Button from '../../components/Button/Button';
import Alert, { AlertProps } from '../../components/Alert/Alert';
import { DeepNonUndefineable } from '../../utils/types';

export default function ReportDetail() {
  const [alert, setAlert] = useState<AlertProps | null>(null);

  let { id } = useParams();
  const { user } = useContext(UserContext);
  const reportParams = {
    id: parseInt(id || '0'),
    orgId: getIdForUser(user, 'org'),
    include: ['organizations', 'enrollments', 'sites', 'funding_spaces', 'child'],
  };
  const [loading, error, report, mutate] = useApi(
    api => api.apiOrganizationsOrgIdReportsIdGet(reportParams),
    [user]
  );

  if (loading || error || !report) {
    return <div className="Report"></div>;
  }

  const reportEnrollments = report.organization && report.organization.sites && report.organization.sites[0].enrollments;
  let numEnrollmentsMissingInfo = reportEnrollments
    ? reportEnrollments.filter<DeepNonUndefineable<Enrollment>>((enrollment => missingInformation(enrollment)) as (_: DeepNonUndefineable<Enrollment>) => _ is DeepNonUndefineable<Enrollment>).length
    : 0;

  return (
    <div className="Report">
      <section className="grid-container">
        <DirectionalLink direction="left" to="/reports" text="Back to reports" />
        {alert && <Alert {...alert} />}
        {numEnrollmentsMissingInfo > 0 && (
          <Alert
            type="error"
            heading="Update roster"
            text={`There are ${numEnrollmentsMissingInfo} enrollments missing information required to submit this CDC report.`}
            actionItem={<Button text="Update roster" href="/roster" />}
          />
        )}
        <h1>
          {monthFormatter(idx(report, _ => _.reportingPeriod.period))} {report.type} Report{' '}
          {!report.submittedAt && (
            <Tag text="DRAFT" color="gold-20v" addClass="margin-left-1 text-middle" />
          )}
        </h1>
        <p className="usa-intro">
          {idx(report, _ => _.organization.name)} |{' '}
          {dateFormatter(idx(report, _ => _.reportingPeriod.periodStart))} -{' '}
          {dateFormatter(idx(report, _ => _.reportingPeriod.periodEnd))}
        </p>
        <ReportSubmitForm
          report={report}
          mutate={mutate}
          setAlert={setAlert}
          canSubmit={numEnrollmentsMissingInfo === 0}
        />
      </section>
    </div>
  );
}
