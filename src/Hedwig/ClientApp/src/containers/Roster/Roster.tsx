import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { legendDisplayDetails } from '../../utils/legendFormatters';
import { getIdForUser } from '../../utils/models';
import { Legend, LegendItem, DirectionalLinkProps, DateRange } from '../../components';
import useApi, { paginate } from '../../hooks/useApi';
import {
	Age,
	Enrollment,
	FundingSpace,
	ApiOrganizationsOrgIdEnrollmentsGetRequest,
	ApiOrganizationsIdGetRequest,
	Organization,
} from '../../generated';
import UserContext from '../../contexts/User/UserContext';
import AgeGroupSection from './AgeGroupSection';
import { DeepNonUndefineable, DeepNonUndefineableArray } from '../../utils/types';
import { getObjectsByAgeGroup } from '../../utils/models';
import CommonContainer from '../CommonContainer';
import RosterHeader from './RosterHeader';

import getDefaultDateRange from '../../utils/getDefaultDateRange';
import { Suspend } from '../../components/Suspend/Suspend';

export default function Roster() {
	const { id: urlSiteId } = useParams();
	const { user } = useContext(UserContext);

	const [showPastEnrollments, toggleShowPastEnrollments] = useState(false);
	const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
	const [filterByRange, setFilterByRange] = useState(false);

	const orgParams: ApiOrganizationsIdGetRequest = {
		id: getIdForUser(user, 'org'),
		include: ['sites', 'funding_spaces'],
	};

	const { loading: organizationLoading, data: organization } = useApi(
		api => api.apiOrganizationsIdGet(orgParams),
		{
			skip: !user,
			defaultValue: {} as Organization,
		}
	);

	const sites = organization && organization.sites;
	const siteIds = (sites || []).map(s => s.id);
	const siteId = urlSiteId ? parseInt(urlSiteId) : undefined;
	const site = sites && siteId ? sites.find(s => s.id === siteId) : undefined;

	const enrollmentParams: ApiOrganizationsOrgIdEnrollmentsGetRequest = {
		orgId: getIdForUser(user, 'org'),
		siteIds: siteIds,
		include: ['child', 'fundings', 'sites'],
		startDate: (dateRange && dateRange.startDate && dateRange.startDate.toDate()) || undefined,
		endDate: (dateRange && dateRange.endDate && dateRange.endDate.toDate()) || undefined,
	};

	const { data: _enrollments } = useApi(
		(api, opt) => api.apiOrganizationsOrgIdEnrollmentsGet(paginate(enrollmentParams, opt)),
		{
			skip: !user || !siteIds.length,
			deps: [user, dateRange, organization],
			defaultValue: [],
			paginate: true,
		}
	);

	let enrollments: DeepNonUndefineableArray<Enrollment> = [];
	let siteRosterDirectionalLinkProps: DirectionalLinkProps | undefined = undefined;
	if (site) {
		enrollments = _enrollments.filter(e => e.siteId === site.id);
		siteRosterDirectionalLinkProps = {
			to: '/roster',
			text: 'Back to program roster',
			direction: 'left',
		};
	} else {
		enrollments = _enrollments;
	}

	const incompleteEnrollments = enrollments.filter<DeepNonUndefineable<Enrollment>>(
		enrollment => !enrollment.ageGroup || !enrollment.entry
	);
	const completeEnrollments = enrollments.filter<DeepNonUndefineable<Enrollment>>(
		enrollment => !incompleteEnrollments.includes(enrollment)
	);

	const completeEnrollmentsByAgeGroup = getObjectsByAgeGroup(completeEnrollments);

	const fundingSpaces = (organization && organization.fundingSpaces) || [];
	const fundingSpacesByAgeGroup = getObjectsByAgeGroup(fundingSpaces);

	const legendItems: LegendItem[] = Object.values(legendDisplayDetails).map(
		({ legendTextFormatter, hidden, symbol }) => ({
			symbol,
			// If we make date range filterable on the org view, will need to change this so that we don't show ratio on org level roster
			text: legendTextFormatter(enrollments, { showPastEnrollments, organization, site }),
			hidden: hidden(organization, enrollments),
		})
	);

	const commonAgeGroupSectionProps = {
		organization,
		site,
		rosterDateRange: dateRange,
		showPastEnrollments,
	};

	return (
		<CommonContainer directionalLinkProps={siteRosterDirectionalLinkProps}>
			<div className="grid-container">
				<Suspend waitFor={!organizationLoading} fallback={<div>Loading...</div>}>
					<RosterHeader
						organization={organization}
						site={site}
						numberOfEnrollments={enrollments.length}
						showPastEnrollments={showPastEnrollments}
						toggleShowPastEnrollments={() => toggleShowPastEnrollments(!showPastEnrollments)}
						dateRange={dateRange}
						setDateRange={setDateRange}
						filterByRange={filterByRange}
						setFilterByRange={setFilterByRange}
					/>
					<Legend items={legendItems} />
				</Suspend>
				<Suspend waitFor={enrollments.length > 0} fallback={<div>Loading...</div>}>
					<AgeGroupSection
						{...commonAgeGroupSectionProps}
						ageGroup={Age.InfantToddler}
						ageGroupTitle={`Infant/toddler`}
						enrollments={completeEnrollmentsByAgeGroup[Age.InfantToddler]}
						fundingSpaces={fundingSpacesByAgeGroup[Age.InfantToddler]}
					/>
					<AgeGroupSection
						{...commonAgeGroupSectionProps}
						ageGroup={Age.Preschool}
						ageGroupTitle={`Preschool`}
						enrollments={completeEnrollmentsByAgeGroup[Age.Preschool]}
						fundingSpaces={fundingSpacesByAgeGroup[Age.Preschool]}
					/>
					<AgeGroupSection
						{...commonAgeGroupSectionProps}
						ageGroup={Age.SchoolAge}
						ageGroupTitle={`School age`}
						enrollments={completeEnrollmentsByAgeGroup[Age.SchoolAge]}
						fundingSpaces={fundingSpacesByAgeGroup[Age.SchoolAge]}
					/>
					{incompleteEnrollments.length > 0 && (
						<AgeGroupSection
							{...commonAgeGroupSectionProps}
							ageGroup="incomplete"
							ageGroupTitle={`Incomplete enrollments`}
							enrollments={incompleteEnrollments}
						/>
					)}
				</Suspend>
			</div>
		</CommonContainer>
	);
}
