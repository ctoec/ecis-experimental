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
import { ApiParamOpts } from '../newUseApi';
import { useEffect } from 'react';

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
	return { loading: false, error: null, data: _enrollments };
};

export const mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet = (enrollments: Enrollment[]) => (
	params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest
) => {
	const thisEnrollment = enrollments.find(e => e.id === params.id);
	if (!thisEnrollment) return { loading: false, error: { status: '400' }, data: null };
	return { loading: false, error: null, data: thisEnrollment };
};

export const mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut = (enrollments: Enrollment[]) => (
	params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest
) => {
	const thisEnrollment = enrollments.find(e => e.id === params.id);
	if (!thisEnrollment) return;
	return { loading: false, error: null, data: thisEnrollment };
};

export const mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdDelete = () => (params: any) => ({
	loading: false,
	error: null,
});

export const mockApiOrganizationsOrgIdChildrenGet = (child: Child) => (params: any) => {
	const mappedChildToEnrollment = [child].reduce<{ [x: string]: Enrollment[] }>((acc, c) => {
		acc[c.id] = c.enrollments || [];
		return acc;
	}, {});
	return { loading: false, error: null, data: mappedChildToEnrollment };
};

export const mockApiOrganizationsOrgIdSitesIdGet = (site: Site) => (params: any) => ({
	loading: false,
	error: null,
	data: site,
});

export const mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsGet = (enrollments: Enrollment[]) => (
	params: any
) => ({
	loading: false,
	error: null,
	data: enrollments.filter(e => {
		return (
			(!e.entry ? true : moment(e.entry).isBefore(params.endDate)) &&
			(!e.exit ? true : moment(e.exit).isAfter(moment(params.startDate)))
		);
	}),
});

export const mockApiOrganizationsOrgIdReportsGet = (reports: CdcReport[]) => (params: any) => ({
	loading: false,
	error: null,
	data: reports,
});

export const mockApiOrganizationsIdGet = (organization: Organization) => (params: any) => ({
	loading: false,
	error: null,
	data: organization,
});

export const mockApiOrganizationsOrgIdReportsIdGet = (report: CdcReport) => (params: any) => ({
	loading: false,
	error: null,
	data: report,
});

export default (mockApi: any) => (
	query: (api: any) => any,
	opts: ApiParamOpts = { skip: false }
) => {
	const { skip, callback, deps } = opts || {};

	useEffect(() => {
		if (callback && !skip) callback();
	}, [skip, ...(deps || [])]);

	console.log(query(mockApi), skip, callback);

	return skip ? { error: null, data: null, loading: false } : query(mockApi);
};
