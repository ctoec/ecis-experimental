import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../../contexts/User/UserContext';
import useApi from '../../hooks/useApi';
import { getIdForUser } from '../../utils/models';
import { Enrollment } from '../../generated';
import CommonContainer from '../CommonContainer';
import { Suspend } from '../../components/Suspend/Suspend';
import { SideNav, InlineIcon, Button, TextWithIcon, TextInput, DateRange } from '../../components';
import { lastFirstNameFormatter } from '../../utils/stringFormatters';
import { SideNavItemProps } from '../../components/SideNav/SideNavItem';
import { hasValidationErrors } from '../../utils/validations';
import { ReactComponent as ArrowRight } from '../../assets/images/arrowRight.svg';
import { EnrollmentEdit } from './SingleEnrollmentEdit';
import moment from 'moment';
import { BatchEditInternal } from './Internal';


type BatchEditProps = { };
export default function BatchEdit({
}: BatchEditProps) {
	const dateRange: DateRange = {startDate: moment(), endDate: moment() };
	const { user } = useContext(UserContext);

	const [refetch, setRefetch] = useState(0);
	const { data: enrollments, loading, error } = useApi<Enrollment[]>(
		(api) => 
			api.apiOrganizationsOrgIdEnrollmentsGet({
				orgId: getIdForUser(user, 'org'),
				include: ['child', 'fundings', 'sites'],
				startDate: dateRange.startDate?.toDate(),
				endDate: dateRange.endDate?.toDate(),
			}),
			{
				// deps: [refetch]
			}
	);

	return (
		<CommonContainer backHref="/roster" backText="Back to program roster">
			<div className="grid-container">
				<h1>Add needed information</h1>
				<Suspend waitFor={!loading} fallback={<div>Loading...</div>}>
					<p className="usa-intro">{enrollments?.length} enrollments have missing or incomplete infor required to submit reports</p>
					<BatchEditInternal setRefetch={setRefetch} enrollments={enrollments} />
				</Suspend>
			</div>
		</CommonContainer>
	)

}
