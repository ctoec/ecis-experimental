import React from 'react';
import { Legend, Alert, Column } from '@ctoec/component-library';
import { Age, Enrollment, FundingSource } from '../../../../generated';
import { somethingWentWrongAlert } from '../../../../utils/stringFormatters/alertTextMakers';
import { useRoster } from '../../../../hooks/useRoster';
import { AgeGroupSection } from '../../../RosterColumns/AgeGroupSection';
import { NameColumn } from '../../../RosterColumns/NameColumn';
import { BirthdateColumn } from '../../../RosterColumns/BirthDateColumn';
import { FundingColumn } from '../../../RosterColumns/FundingColumn';
import { getFundingTimeTag } from '../../../../utils/fundingType';
import { SiteColumn } from '../../../RosterColumns/SiteColumn';
import { EnrolledOnColumn } from '../../../RosterColumns/EnrolledOnColumn';

function onlyCdcFundedEnrollments(enrollments: Enrollment[]) {
	return enrollments.filter((e) => e.fundings?.find((f) => f.source === FundingSource.CDC));
}

export default function RosterView() {
	const {
		showPastEnrollments,
		dateRange,
		organizationLoading,
		enrollmentsLoading,
		organization,
		site,
		enrollments,
		completeEnrollmentsByAgeGroup,
		fundingSpacesByAgeGroup,
		legendItems,
	} = useRoster();

	// If we are still loading, show a loading page
	if (organizationLoading || enrollmentsLoading) {
		return <>Loading...</>;
	}

	// If we stopped loading, and still don't have these values
	// Then an error other than a validation error ocurred.
	// (In staging, it is likely that a new deployment happened.
	// This changes the ids of the objects. Thus, when a user
	// navigates back to roster 401/403 errors to occur.
	// This can be resolved with a hard refresh. We don't do that
	// because if it truly is a 500 error, we would get an infite
	// loop). For now, show a general purpose alert message.
	if (!organization || !enrollments) {
		return <Alert {...somethingWentWrongAlert}></Alert>;
	}

	let columns: Column<Enrollment>[] = [];
	// Only show the site column if we're in multi-site view,
	// and it exists (more than one site)
	if (!site && organization.sites && organization.sites.length > 1) {
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

	const commonAgeGroupSectionProps = {
		site,
		rosterDateRange: dateRange,
		columns,
		showPastEnrollments,
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
				enrollments={onlyCdcFundedEnrollments(completeEnrollmentsByAgeGroup[Age.InfantToddler])}
				fundingSpaces={fundingSpacesByAgeGroup[Age.InfantToddler]}
			/>
			<AgeGroupSection
				{...commonAgeGroupSectionProps}
				ageGroup={Age.Preschool}
				ageGroupTitle={`Preschool`}
				enrollments={onlyCdcFundedEnrollments(completeEnrollmentsByAgeGroup[Age.Preschool])}
				fundingSpaces={fundingSpacesByAgeGroup[Age.Preschool]}
			/>
			<AgeGroupSection
				{...commonAgeGroupSectionProps}
				ageGroup={Age.SchoolAge}
				ageGroupTitle={`School age`}
				enrollments={onlyCdcFundedEnrollments(completeEnrollmentsByAgeGroup[Age.SchoolAge])}
				fundingSpaces={fundingSpacesByAgeGroup[Age.SchoolAge]}
			/>
		</div>
	);
}
