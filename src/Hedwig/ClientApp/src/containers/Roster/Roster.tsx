import React from 'react';
import { Legend, Alert } from '../../components';
import { Age } from '../../generated';
import AgeGroupSection from './AgeGroupSection';
import CommonContainer from '../CommonContainer';
import RosterHeader from './RosterHeader';
import { somethingWentWrongAlert } from '../../utils/stringFormatters/alertTextMakers';
import { useRoster } from '../../hooks/useRoster';

export default function Roster() {
	const {
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
		enrollments,
		siteRosterContainerProps,
		completeEnrollmentsByAgeGroup,
		fundingSpacesByAgeGroup,
		incompleteEnrollments,
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

	const commonAgeGroupSectionProps = {
		organization,
		site,
		rosterDateRange: dateRange,
		showPastEnrollments,
	};

	return (
		<CommonContainer {...siteRosterContainerProps}>
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
			</div>
		</CommonContainer>
	);
}
