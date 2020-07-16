import { parse as parseCsv } from 'json2csv';
import { Enrollment } from "../../../../generated";
import { nameFormatter } from "../../../../utils/stringFormatters";
import dateFormatter from "../../../../utils/dateFormatter";
import { prettyMultiRace, prettyEthnicity, prettyGender, prettyAge, prettyFundingSpaceTime, reportingPeriodFormatter } from "../../../../utils/models";
import { propertyDateSorter } from "../../../../utils/dateSorter";

export const  makeRosterCSVBlob = (enrollments: Enrollment[] | undefined | null) => {
	enrollments = enrollments || [];

	const fields = [
		{
			label: 'Name',
			value: (row: Enrollment) => nameFormatter(row.child),
		},
		{
			label: 'Birthdate',
			value: (row: Enrollment) => dateFormatter(row.child?.birthdate),
		},
		{
			label: 'Race',
			value: (row: Enrollment) => prettyMultiRace(row.child, { showAll: true }),
		},
		{
			label: 'Ethnicity',
			value: (row: Enrollment) => prettyEthnicity(row.child),
		},
		{
			label: 'Gender',
			value: (row: Enrollment) => prettyGender(row.child?.gender),
		},
		{
			label: 'Lives with foster family',
			value: (row: Enrollment) => (row.child?.foster ? 'Yes' : 'No'),
		},
		{
			label: 'Experienced homelessness or housing insecurity',
			value: (row: Enrollment) => (row.child?.family?.homelessness ? 'Yes' : 'No'),
		},
		{
			label: 'Household size',
			value: (row: Enrollment) =>
				row.child?.foster
					? 'Exempt'
					: row.child?.family?.determinations?.length
					? row.child?.family?.determinations[0].numberOfPeople
					: 'No data',
		},
		{
			label: 'Annual household income',
			value: (row: Enrollment) =>
				row.child?.foster
					? 'Exempt'
					: row.child?.family?.determinations?.length
					? row.child?.family?.determinations[0].income
					: 'No data',
		},
		{
			label: 'Determination date',
			value: (row: Enrollment) =>
				row.child?.foster
					? 'Exempt'
					: row.child?.family?.determinations?.length
					? dateFormatter(row.child?.family?.determinations[0].determinationDate)
					: 'No data',
		},
		{
			label: 'Enrollment start date',
			value: (row: Enrollment) => dateFormatter(row.entry),
		},
		{
			label: 'Site',
			value: (row: Enrollment) => row.site?.name || '',
		},
		{
			label: 'Age group',
			value: (row: Enrollment) => prettyAge(row.ageGroup),
		},
		{
			label: 'Funding',
			value: (row: Enrollment) => {
				const [mostRecentFunding] = (row.fundings || []).sort((a, b) =>
					propertyDateSorter(a, b, (f) => f?.firstReportingPeriod?.period)
				);
				return mostRecentFunding
					? `${prettyAge(row.ageGroup)} - ${prettyFundingSpaceTime(mostRecentFunding.fundingSpace)}`
					: 'No data';
			},
		},
		{
			label: 'First reporting period',
			value: (row: Enrollment) => {
				const [mostRecentFunding] = row.fundings || [];
				return mostRecentFunding
					? reportingPeriodFormatter(mostRecentFunding.firstReportingPeriod)
					: 'No data';
			},
		},
		{
			label: 'Last reporting period',
			value: (row: Enrollment) => {
				const [mostRecentFunding] = row.fundings || [];
				return mostRecentFunding
					? mostRecentFunding.lastReportingPeriod
						? reportingPeriodFormatter(mostRecentFunding.lastReportingPeriod)
						: 'ongoing'
					: 'No data';
			},
		},
		{
			label: 'Recieves Care 4 Kids',
			value: (row: Enrollment) => {
				const [mostRecentCert] = (row.child?.c4KCertificates || []).sort((a, b) =>
					propertyDateSorter(a, b, (c) => c.startDate)
				);
				return mostRecentCert && (!mostRecentCert.endDate || mostRecentCert.endDate > new Date())
					? 'Yes'
					: 'No';
			},
		},
		{
			label: 'Care 4 Kids ID',
			value: 'child.c4KFamilyCaseNumber',
			default: '',
		},
		{
			label: 'Care 4 Kids certificate start date',
			value: (row: Enrollment) => {
				const [mostRecentCert] = row.child?.c4KCertificates || [];
				return mostRecentCert
					? mostRecentCert.startDate
						? dateFormatter(mostRecentCert.startDate)
						: 'No data'
					: '';
			},
		},
	];

	const enrollmentsCsv = parseCsv(enrollments, { fields });
	return new Blob([enrollmentsCsv], { type: 'text/csv' });
};
