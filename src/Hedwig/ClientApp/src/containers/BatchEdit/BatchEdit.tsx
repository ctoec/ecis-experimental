import React, { useContext, useState } from 'react';
import qs from 'query-string';
import UserContext from '../../contexts/User/UserContext';
import useApi from '../../hooks/useApi';
import { CdcReport, Enrollment } from '../../generated';
import { getIdForUser } from '../../utils/models';
import CommonContainer from '../CommonContainer';
import { EnrollmentsEditList } from './EnrollmentsEditList';
import pluralize from 'pluralize';

type BatchEditProps = {
	location: {
		search: string;
	};
};
const BatchEdit: React.FC<BatchEditProps> = ({ location: { search } }) => {
	const parsedQuery = qs.parse(search);
	const reportId = parseInt(parsedQuery['reportId'] as string) || 0;

	// Set up enrollments state var
	const [batchEditEnrollments, setBatchEditEnrollments] = useState<Enrollment[]>([]);

	// and function to pass down, used by child components to update this list of enrollments
	// as single enrollments are edited by the user
	const replaceEnrollment = (updatedEnrollment: Enrollment) => {
		setBatchEditEnrollments((enrollments) => {
			const enrollmentIdx = enrollments.findIndex((e) => e.id === updatedEnrollment.id);
			enrollments[enrollmentIdx] = updatedEnrollment;
			return [...enrollments];
		});
	};

	// Set up report get
	const { user } = useContext(UserContext);
	const params = {
		orgId: getIdForUser(user, 'org'),
		id: reportId,
	};

	const { loading } = useApi<CdcReport>((api) =>
		api.apiOrganizationsOrgIdReportsIdGet(params),
		{
			successCallback: (returnedReport) => setBatchEditEnrollments(
				(returnedReport.enrollments || [])
					.filter((enrollment) => enrollment.validationErrors && enrollment.validationErrors.length)
			)
		}
	);

	if (loading) {
		return <>Loading...</>;
	}

	const needInfoEnrollmentsCount = batchEditEnrollments.filter((e) => e.validationErrors && e.validationErrors.length).length;
	return (
		<CommonContainer>
			<div className="grid-container">
				<h1>Add needed information</h1>
				<p className="usa-intro">
					{ needInfoEnrollmentsCount > 0 
						? needInfoEnrollmentsCount
						: 'No'
					} {pluralize("enrollment", needInfoEnrollmentsCount)} {pluralize("has", needInfoEnrollmentsCount)} missing or incomplete information
				</p>
				<EnrollmentsEditList
					enrollments={batchEditEnrollments}
					replaceEnrollment={replaceEnrollment}
					pathToReport={`/reports/${reportId}`}
				/>
			</div>
		</CommonContainer>
	);
};

export default BatchEdit;
