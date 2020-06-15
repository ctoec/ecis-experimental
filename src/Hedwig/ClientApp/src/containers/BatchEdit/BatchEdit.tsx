import React, { useContext } from 'react';
import moment from 'moment';
import UserContext from '../../contexts/User/UserContext';
import useApi from '../../hooks/useApi';
import { Enrollment } from '../../generated';
import { getIdForUser } from '../../utils/models';
import CommonContainer from '../CommonContainer';

type BatchEditProps = {};
const BatchEdit: React.FC<BatchEditProps> = ({
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
	console.log("needInfoEnrollments", needInfoEnrollments);
	return (
		<CommonContainer>
			<div className="grid-container">
				<h1>Add needed information</h1>
				<p className="usa-intro">{needInfoEnrollments.length} enrollments have missing or incomplete information</p> 
				{needInfoEnrollments.forEach(e => {
					return <p> BLAH {e.childId}</p>
				})}
			</div>
		</CommonContainer>
	)
}

export default BatchEdit;
