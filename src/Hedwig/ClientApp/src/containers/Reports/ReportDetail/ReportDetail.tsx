import React, { useContext } from 'react';
import idx from 'idx';
import { useParams } from 'react-router-dom';
import ReportSubmitForm from './ReportSubmitForm';
import monthFormatter from '../../../utils/monthFormatter';
import dateFormatter from '../../../utils/dateFormatter';
import UserContext from '../../../contexts/User/UserContext';
import getIdForUser from '../../../utils/getIdForUser';
import useApi from '../../../hooks/useApi';
import { Enrollment } from '../../../generated/models/Enrollment';
import { Button, AlertProps, DirectionalLinkProps, Tag } from '../../../components';
import { DeepNonUndefineable } from '../../../utils/types';
import CommonContainer from '../../CommonContainer';

export default function ReportDetail() {
	const { id } = useParams();
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

	if (loading || !report) {
		return <div className="Report"></div>;
	}

	const numEnrollmentsMissingInfo = (report.enrollments|| []).filter<DeepNonUndefineable<Enrollment>>(
		e => !!e.validationErrors && e.validationErrors.length > 0
	).length;

	let additionalAlerts: AlertProps[] = [];

	if (error) {
		additionalAlerts.push(
			{
	      type: 'error',
	      heading: 'Something went wrong',
	      text: 'There was an error loading the report',
			},
		);
	}

	if (numEnrollmentsMissingInfo) {
		additionalAlerts.push(
			{
				type: 'error',
				heading: 'Update roster',
				text: `There are ${numEnrollmentsMissingInfo} enrollments missing information required to submit this CDC report.`,
				actionItem: <Button text="Update roster" href="/roster" />,
			},
		);
	}

	const directionalLinkProps: DirectionalLinkProps = {
		direction: 'left',
		to: '/reports',
		text: 'Back to reports',
	};

	return (
		<CommonContainer
			additionalAlerts={additionalAlerts || undefined}
			directionalLinkProps={directionalLinkProps}
		>
			<section className="grid-container">
				<div className="grid-row flex-first-baseline flex-space-between">
					<h1 className="tablet:grid-col-auto">
						{monthFormatter(idx(report, _ => _.reportingPeriod.period))} {report.type} Report{' '}
						{!report.submittedAt && (
							<Tag text="DRAFT" color="gold-20v" className="margin-left-1 text-middle" />
						)}
					</h1>
					<div className="tablet:grid-col-auto print-btn">
						<Button text="Print" onClick={window.print} appearance="outline" />
					</div>
				</div>
				<p className="usa-intro">
					{idx(report, _ => _.organization.name)} <br />
					{dateFormatter(idx(report, _ => _.reportingPeriod.periodStart))}–
					{dateFormatter(idx(report, _ => _.reportingPeriod.periodEnd))}
				</p>
				<ReportSubmitForm
					report={report}
					mutate={mutate}
					canSubmit={numEnrollmentsMissingInfo === 0}
				/>
			</section>
		</CommonContainer>
	);
}
