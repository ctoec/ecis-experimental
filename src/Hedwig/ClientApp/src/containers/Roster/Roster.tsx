import React, { useContext, useState } from 'react';
import idx from 'idx';
import { useParams } from 'react-router-dom';
import { fundingSourceDetails } from '../../utils/fundingTypeFormatters';
import getFundingSpaceCapacity from '../../utils/getFundingSpaceCapacity';
import { getIdForUser } from '../../utils/models';
import {
	Tag,
	Legend,
	LegendItem,
	InlineIcon,
	DirectionalLinkProps,
	DateRange,
} from '../../components';
import useApi from '../../hooks/useApi';
import {
	Age,
	Enrollment,
	FundingSpace,
	FundingSource,
	ApiOrganizationsOrgIdEnrollmentsGetRequest,
	ApiOrganizationsIdGetRequest,
} from '../../generated';
import UserContext from '../../contexts/User/UserContext';
import AgeGroupSection from './AgeGroupSection';
import { DeepNonUndefineable, DeepNonUndefineableArray } from '../../utils/types';
import { isFunded, getObjectsByAgeGroup } from '../../utils/models';
import CommonContainer from '../CommonContainer';
import RosterHeader from './RosterHeader';

import getDefaultDateRange from '../../utils/getDefaultDateRange';

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
	const [organizationLoading, organizationError, organization] = useApi(
		api => api.apiOrganizationsIdGet(orgParams),
		[user],
		{ skip: !user }
	);

	const sites = organization && organization.sites;
	const siteIds = (sites || []).map(s => s.id);
	const siteId = urlSiteId ? parseInt(urlSiteId) : undefined;
	const site = sites && siteId ? sites.find(s => s.id === siteId) : undefined;

	const enrollmentParams: ApiOrganizationsOrgIdEnrollmentsGetRequest = {
		orgId: getIdForUser(user, 'org'),
		siteIds: siteIds,
		include: ['child', 'fundings'],
		startDate: (dateRange && dateRange.startDate && dateRange.startDate.toDate()) || undefined,
		endDate: (dateRange && dateRange.endDate && dateRange.endDate.toDate()) || undefined,
	};

	const [enrollmentLoading, enrollmentError, _enrollments] = useApi(
		api => api.apiOrganizationsOrgIdEnrollmentsGet(enrollmentParams),
		[user, dateRange, organization],
		{ skip: !user || !siteIds.length }
	);

	if (
		organizationLoading ||
		organizationError ||
		!organization ||
		enrollmentLoading ||
		enrollmentError ||
		!_enrollments
	) {
		return <div className="Roster"></div>;
	}

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

	const fundingSpaces = idx(site, _ => _.organization.fundingSpaces) || [];
	const fundingSpacesByAgeGroup = getObjectsByAgeGroup(fundingSpaces);

	const legendItems: LegendItem[] = [];

	Object.keys(fundingSourceDetails).forEach(source => {
		const capacityForFunding = getFundingSpaceCapacity(organization, { source });
		const enrolledForFunding = enrollments.filter<DeepNonUndefineable<Enrollment>>(enrollment =>
			isFunded(enrollment, { source })
		).length;

		if (enrolledForFunding === 0) {
			return;
		}

		legendItems.push({
			text: fundingSourceDetails[source].legendTextFormatter(
				fundingSourceDetails[source].fullTitle,
				enrolledForFunding,
				capacityForFunding,
				showPastEnrollments
			),
			symbol: (
				<Tag
					text={source}
					color={fundingSourceDetails[source].colorToken}
					className="position-relative top-neg-2px"
				/>
			),
		});
	});

	// CDC funded enrollments with validationErrors are considered to be missing information
	const missingInformationEnrollmentsCount = enrollments.filter<DeepNonUndefineable<Enrollment>>(
		enrollment =>
			isFunded(enrollment, { source: FundingSource.CDC }) &&
			!!enrollment.validationErrors &&
			enrollment.validationErrors.length > 0
	).length;
	if (missingInformationEnrollmentsCount > 0) {
		legendItems.push({
			text: (
				<>
					<span className="text-bold">{missingInformationEnrollmentsCount}</span>
					<span> missing information</span>
				</>
			),
			symbol: <InlineIcon icon="incomplete" />,
		});
	}

	return (
		<CommonContainer directionalLinkProps={siteRosterDirectionalLinkProps}>
			<div className="grid-container">
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
				<AgeGroupSection
					organization={organization}
					ageGroup={Age.InfantToddler}
					ageGroupTitle={`Infant/toddler`}
					enrollments={completeEnrollmentsByAgeGroup[Age.InfantToddler]}
					fundingSpaces={fundingSpacesByAgeGroup[Age.InfantToddler] as FundingSpace[]}
					rosterDateRange={dateRange}
					showPastEnrollments={showPastEnrollments}
				/>
				<AgeGroupSection
					organization={organization}
					ageGroup={Age.Preschool}
					ageGroupTitle={`Preschool`}
					enrollments={completeEnrollmentsByAgeGroup[Age.Preschool]}
					fundingSpaces={fundingSpacesByAgeGroup[Age.Preschool] as FundingSpace[]}
					rosterDateRange={dateRange}
					showPastEnrollments={showPastEnrollments}
				/>
				<AgeGroupSection
					organization={organization}
					ageGroup={Age.SchoolAge}
					ageGroupTitle={`School age`}
					enrollments={completeEnrollmentsByAgeGroup[Age.SchoolAge]}
					fundingSpaces={fundingSpacesByAgeGroup[Age.SchoolAge] as FundingSpace[]}
					rosterDateRange={dateRange}
					showPastEnrollments={showPastEnrollments}
				/>
				<AgeGroupSection
					organization={organization}
					ageGroup="incomplete"
					ageGroupTitle={`Incomplete enrollments`}
					enrollments={incompleteEnrollments}
					rosterDateRange={dateRange}
					showPastEnrollments={showPastEnrollments}
				/>
			</div>
		</CommonContainer>
	);
}
