import React from 'react';
import { Legend, Column, DateRange, LegendItem } from '../../../../components';
import { Age, Enrollment, Organization, ReportingPeriod } from '../../../../generated';
import { AgeGroupSection } from '../../../RosterColumns/AgeGroupSection';
import { NameColumn } from '../../../RosterColumns/NameColumn';
import { BirthdateColumn } from '../../../RosterColumns/BirthDateColumn';
import { FundingColumn } from '../../../RosterColumns/FundingColumn';
import { getFundingTimeTag } from '../../../../utils/fundingType';
import { SiteColumn } from '../../../RosterColumns/SiteColumn';
import { EnrolledOnColumn } from '../../../RosterColumns/EnrolledOnColumn';
import moment from 'moment';
import { legendDisplayDetails } from '../../../../utils/legendFormatters';
import { getObjectsByAgeGroup } from '../../../../utils/models';

type RosterViewProps = {
	reportingPeriod: ReportingPeriod;
	organization: Organization;
	rosterEnrollments: Enrollment[];
};
const RosterView: React.FC<RosterViewProps> = ({
	reportingPeriod,
	organization,
	rosterEnrollments,
}) => {
	const dateRange: DateRange = {
		startDate: moment.utc(reportingPeriod.periodStart),
		endDate: moment.utc(reportingPeriod.periodEnd),
	};

	let columns: Column<Enrollment>[] = [];
	// Only show the site column if we're in multi-site view,
	// and it exists (more than one site)
	if (organization.sites && organization.sites.length > 1) {
		columns = [
			NameColumn(25),
			BirthdateColumn(17),
			FundingColumn(getFundingTimeTag)(dateRange, 18),
			SiteColumn(20),
			EnrolledOnColumn(20),
		];
	} else {
		columns = [
			NameColumn(30),
			BirthdateColumn(22),
			FundingColumn(getFundingTimeTag)(dateRange, 23),
			EnrolledOnColumn(25),
		];
	}

	const legendItems: LegendItem[] = Object.values(legendDisplayDetails).map(
		({ legendTextFormatter, hidden, symbolGenerator }) => ({
			symbol: symbolGenerator({ className: 'position-relative top-neg-2px' }),
			// If we make date range filterable on the org view, will need to change this so that we don't show ratio on org level roster
			text: legendTextFormatter(rosterEnrollments, {
				showPastEnrollments: false,
				organization,
			}),
			hidden: hidden(organization, rosterEnrollments),
		})
	);

	const enrollmentsByAgeGroup = getObjectsByAgeGroup(rosterEnrollments);
	const fundingSpacesByAgeGroup = getObjectsByAgeGroup(organization.fundingSpaces || []);

	const commonAgeGroupSectionProps = {
		rosterDateRange: dateRange,
		columns,
		site: null,
		forReport: true,
	};

	return (
		<div className="margin-top-2">
			<h1 className="tablet:grid-col-auto">Report roster</h1>
			<Legend items={legendItems} />
			<AgeGroupSection
				{...commonAgeGroupSectionProps}
				ageGroup={Age.InfantToddler}
				ageGroupTitle={`Infant/toddler`}
				enrollments={enrollmentsByAgeGroup[Age.InfantToddler]}
				fundingSpaces={fundingSpacesByAgeGroup[Age.InfantToddler]}
			/>
			<AgeGroupSection
				{...commonAgeGroupSectionProps}
				ageGroup={Age.Preschool}
				ageGroupTitle={`Preschool`}
				enrollments={enrollmentsByAgeGroup[Age.Preschool]}
				fundingSpaces={fundingSpacesByAgeGroup[Age.Preschool]}
			/>
			<AgeGroupSection
				{...commonAgeGroupSectionProps}
				ageGroup={Age.SchoolAge}
				ageGroupTitle={`School age`}
				enrollments={enrollmentsByAgeGroup[Age.SchoolAge]}
				fundingSpaces={fundingSpacesByAgeGroup[Age.SchoolAge]}
			/>
		</div>
	);
};

export default RosterView;
