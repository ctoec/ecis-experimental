import moment from 'moment';
import {
	Enrollment,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest,
	ApiOrganizationsOrgIdEnrollmentsGetRequest,
	Organization,
	CdcReport,
	Site,
	Child,
} from '../../generated';

export const mockApiOrganizationsOrgIdEnrollmentsGet = (enrollments: Enrollment[]) => (
	params: ApiOrganizationsOrgIdEnrollmentsGetRequest
) => {
	const _enrollments = enrollments
		.filter(e => !params.siteIds || params.siteIds.includes(e.siteId))
		.filter(e => {
			return (
				(!e.entry ? true : moment(e.entry).isBefore(params.endDate)) &&
				(!e.exit ? true : moment(e.exit).isAfter(moment(params.startDate)))
			);
		});
	return [false, null, _enrollments];
};

export const mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet = (enrollments: Enrollment[]) => (
	params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest
) => {
	const thisEnrollment = enrollments.find(e => e.id === params.id);
	let error = null;
	if (!thisEnrollment) return;
	const mutate = (_: any) => {
		return new Promise(resolve => {
			resolve(thisEnrollment);
		});
	};
	return [false, error, thisEnrollment, mutate];
};

export const mockApiOrganizationsOrgIdChildrenGet = (child: Child) => (params: any) => {
	const mappedChildToEnrollment = [child].reduce<{ [x: string]: Enrollment[] }>((acc, c) => {
		acc[c.id] = c.enrollments || [];
		return acc;
	}, {});
	return [false, null, mappedChildToEnrollment];
};

export const mockApiOrganizationsOrgIdSitesIdGet = (site: Site) => (params: any) => [
	false,
	null,
	site,
];

export const mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsGet = (enrollments: Enrollment[]) => (
	params: any
) => [
	false,
	null,
	enrollments.filter(e => {
		return (
			(!e.entry ? true : moment(e.entry).isBefore(params.endDate)) &&
			(!e.exit ? true : moment(e.exit).isAfter(moment(params.startDate)))
		);
	}),
];

export const mockApiOrganizationsOrgIdReportsGet = (reports: CdcReport[]) => (params: any) => [
	false,
	null,
	reports,
	(_: any) => {
		return new Promise((resolve, reject) => {
			resolve(reports);
			reject({});
		});
	},
];

export const mockApiOrganizationsIdGet = (organization: Organization) => (params: any) => [
	false,
	null,
	organization,
];

export const mockApiOrganizationsOrgIdReportsIdGet = (report: CdcReport) => (params: any) => [
	false,
	null,
	report,
];

export const mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdDelete = () => (params: any) => [
	false,
	null,
];

export default (mockApi: any) => (query: (api: any) => any) => query(mockApi);
