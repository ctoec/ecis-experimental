import { useContext, useState } from 'react';
import { useParams } from 'react-router';
import UserContext from '../contexts/User/UserContext';
import { DateRange, DirectionalLinkProps, LegendItem } from '../components';
import getDefaultDateRange from '../utils/getDefaultDateRange';
import {
	ApiOrganizationsIdGetRequest,
	ApiOrganizationsOrgIdEnrollmentsGetRequest,
	Enrollment,
	Organization,
	Site,
	FundingSpace,
} from '../generated';
import { getIdForUser, getObjectsByAgeGroup } from '../utils/models';
import useApi, { paginate } from './useApi';
import { legendDisplayDetails } from '../utils/legendFormatters';

type UseRosterReturnType = {
	showPastEnrollments: boolean;
	toggleShowPastEnrollments: React.Dispatch<React.SetStateAction<boolean>>;
	dateRange: DateRange;
	setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
	filterByRange: boolean;
	setFilterByRange: React.Dispatch<React.SetStateAction<boolean>>;
	organizationLoading: boolean;
	enrollmentsLoading: boolean;
	organization: Organization | null;
	site: Site | null;
	enrollments: Enrollment[] | null;
	siteRosterDirectionalLinkProps: DirectionalLinkProps | undefined;
	completeEnrollmentsByAgeGroup: { [ageGroup: string]: Enrollment[] };
	fundingSpacesByAgeGroup: { [ageGroup: string]: FundingSpace[] };
	incompleteEnrollments: Enrollment[];
	legendItems: LegendItem[];
	error?: boolean;
};

export const useRoster: () => UseRosterReturnType = () => {
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
		(api) => api.apiOrganizationsIdGet(orgParams),
		{
			skip: !user,
		}
	);

	const sites = organization && organization.sites;
	const siteIds = (sites || []).map((s) => s.id);
	const siteId = urlSiteId ? parseInt(urlSiteId) : undefined;
	const site = (sites && siteId && sites.find((s) => s.id === siteId)) || null;

	const enrollmentParams: ApiOrganizationsOrgIdEnrollmentsGetRequest = {
		orgId: getIdForUser(user, 'org'),
		siteIds: siteIds,
		include: ['child', 'fundings', 'sites'],
		startDate: (dateRange && dateRange.startDate && dateRange.startDate.toDate()) || undefined,
		endDate: (dateRange && dateRange.endDate && dateRange.endDate.toDate()) || undefined,
	};

	const { loading: enrollmentsLoading, data: _enrollments } = useApi(
		(api, opt) => api.apiOrganizationsOrgIdEnrollmentsGet(paginate(enrollmentParams, opt)),
		{
			skip: !user || !siteIds.length,
			deps: [user, dateRange, organization],
			defaultValue: [],
			paginate: true,
		}
	);

	const commonReturnProperties = {
		showPastEnrollments,
		toggleShowPastEnrollments,
		dateRange,
		setDateRange,
		filterByRange,
		setFilterByRange,
		organizationLoading,
		enrollmentsLoading,
		organization,
		site,
	};

	// If we are still loading, return early
	if (organizationLoading || enrollmentsLoading) {
		return {
			...commonReturnProperties,
			enrollments: _enrollments,
			siteRosterDirectionalLinkProps: undefined,
			completeEnrollmentsByAgeGroup: {},
			fundingSpacesByAgeGroup: {},
			incompleteEnrollments: [],
			legendItems: [],
		};
	}

	// If we stopped loading, and still don't have these values
	// Then an error other than a validation error ocurred.
	// (In staging, it is likely that a new deployment happened.
	// This changes the ids of the objects. Thus, when a user
	// navigates back to roster 401/403 errors to occur.
	// This can be resolved with a hard refresh. We don't do that
	// because if it truly is a 500 error, we would get an infite
	// loop). For now, show a general purpose alert message.
	if (!organization || !_enrollments) {
		return {
			...commonReturnProperties,
			enrollments: _enrollments,
			siteRosterDirectionalLinkProps: undefined,
			completeEnrollmentsByAgeGroup: {},
			fundingSpacesByAgeGroup: {},
			incompleteEnrollments: [],
			legendItems: [],
			error: true,
		};
	}

	let enrollments: Enrollment[] = [];
	let siteRosterDirectionalLinkProps: DirectionalLinkProps | undefined = undefined;
	if (site) {
		enrollments = _enrollments.filter((e) => e.siteId === site.id);
		siteRosterDirectionalLinkProps = {
			to: '/roster',
			text: 'Back to program roster',
			direction: 'left',
		};
	} else {
		enrollments = _enrollments;
	}

	const incompleteEnrollments = enrollments.filter(
		(enrollment) => !enrollment.ageGroup || !enrollment.entry
	);
	const completeEnrollments = enrollments.filter(
		(enrollment) => !incompleteEnrollments.includes(enrollment)
	);

	const completeEnrollmentsByAgeGroup = getObjectsByAgeGroup(completeEnrollments);

	const fundingSpaces = (organization && organization.fundingSpaces) || [];
	const fundingSpacesByAgeGroup = getObjectsByAgeGroup(fundingSpaces);

	const legendItems: LegendItem[] = Object.values(legendDisplayDetails).map(
		({ legendTextFormatter, hidden, symbolGenerator }) => ({
			symbol: symbolGenerator({ className: 'position-relative top-neg-2px' }),
			// If we make date range filterable on the org view, will need to change this so that we don't show ratio on org level roster
			text: legendTextFormatter(enrollments, {
				showPastEnrollments,
				organization,
				site: site || undefined,
			}),
			hidden: hidden(organization, enrollments),
		})
	);

	return {
		...commonReturnProperties,
		enrollments,
		siteRosterDirectionalLinkProps,
		completeEnrollmentsByAgeGroup,
		fundingSpacesByAgeGroup,
		incompleteEnrollments,
		legendItems,
	};
};
