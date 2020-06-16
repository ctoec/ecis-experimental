import React, { useContext } from 'react';
import moment from 'moment';
import UserContext from '../../contexts/User/UserContext';
import useApi from '../../hooks/useApi';
import { Enrollment } from '../../generated';
import { getIdForUser } from '../../utils/models';
import CommonContainer from '../CommonContainer';
import { EnrollmentsEditList } from './EnrollmentsEditList';

type BatchEditProps = {
	history: History;
	match: {
		params: { activeEnrollmentId?: number; }
	}
};
const BatchEdit: React.FC<BatchEditProps> = ({
	match: {params: sectionId }
}) => {
	// TODO get from QS param from roster
	const startDate = moment();
	const endDate = moment();

	// Set up enrollments get.
	const { user } = useContext(UserContext);
	const params = {
		orgId: getIdForUser(user, 'org'),
		startDate: startDate.toDate(),
		endDate: endDate.toDate(),
	};

	const { data: enrollments, loading, error } = useApi<Enrollment[]>(
		(api) => api.apiOrganizationsOrgIdEnrollmentsGet(params)
	)

	const needInfoEnrollments = (enrollments || []).filter(e => e.validationErrors && e.validationErrors.length);
	return (
		<CommonContainer>
			<div className="grid-container">
				<h1>Add needed information</h1>
				<p className="usa-intro">{needInfoEnrollments.length} enrollments have missing or incomplete information</p> 
				{needInfoEnrollments.length 
					? <EnrollmentsEditList enrollments={needInfoEnrollments} />
					: <p>all good</p>
				}
			</div>
		</CommonContainer>
	)
}

export default BatchEdit;
