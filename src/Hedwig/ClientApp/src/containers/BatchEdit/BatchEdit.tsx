import React, { useContext, useState, useEffect } from 'react';
import qs from 'query-string';
import UserContext from '../../contexts/User/UserContext';
import useApi from '../../hooks/useApi';
import { FundingSource, CdcReport } from '../../generated';
import { getIdForUser, isFunded } from '../../utils/models';
import CommonContainer from '../CommonContainer';
import { EnrollmentsEditList } from './EnrollmentsEditList';

type BatchEditProps = {
	history: History;
	location: {
		search: string;
	};
};
const BatchEdit: React.FC<BatchEditProps> = ({ location: { search } }) => {
	const parsedQuery = qs.parse(search);
	const reportId = parseInt(parsedQuery['reportId'] as string) || 0;

	// Set up report get
	const { user } = useContext(UserContext);
	const params = {
		orgId: getIdForUser(user, 'org'),
		id: reportId,
	};

	const { data: report, loading } = useApi<CdcReport>((api) =>
		api.apiOrganizationsOrgIdReportsIdGet(params)
	);

	if (loading) {
		return <>Loading...</>;
	}

	const needInfoEnrollments = (report?.enrollments || []).filter(
		(e) =>
			e.validationErrors && e.validationErrors.length && isFunded(e, { source: FundingSource.CDC })
	);
	return (
		<CommonContainer>
			<div className="grid-container">
				<h1>Add needed information</h1>
				<p className="usa-intro">
					{needInfoEnrollments.length} enrollments have missing or incomplete information
				</p>
				<EnrollmentsEditList
					enrollments={needInfoEnrollments}
					pathToReport={`/reports/${reportId}`}
				/>
			</div>
		</CommonContainer>
	);
};

export default BatchEdit;
