import React, { useState, useContext } from 'react';
import idx from 'idx';
import moment from 'moment';
import enrollmentTextFormatter from '../../utils/enrollmentTextFormatter';
import getDefaultDateRange from '../../utils/getDefaultDateRange';
import { fundingSourceDetails } from '../../utils/fundingTypeFormatters';
import getFundingSpaceCapacity from '../../utils/getFundingSpaceCapacity';
import getIdForUser from '../../utils/getIdForUser';
import {
	Tag,
	DatePicker,
	DateRange,
	Button,
	ChoiceList,
	Legend,
	LegendItem,
	InlineIcon,
} from '../../components';
import useApi from '../../hooks/useApi';
import { Age, Enrollment, FundingSpace, FundingSource } from '../../generated';
import UserContext from '../../contexts/User/UserContext';
import AgeGroupSection from './AgeGroupSection';
import { getObjectsByAgeGroup } from '../../utils/ageGroupUtils';
import { DeepNonUndefineable } from '../../utils/types';
import { isFunded } from '../../utils/models';
import CommonContainer from '../CommonContainer';

export default function Roster() {
	const [showPastEnrollments, toggleShowPastEnrollments] = useState(false);
	const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
	const [byRange, setByRange] = useState(false);
	const handlePastEnrollmentsChange = () => {
		toggleShowPastEnrollments(!showPastEnrollments);
		setByRange(false);
		setDateRange(getDefaultDateRange());
	};

	const { user } = useContext(UserContext);
	const siteParams = {
		id: getIdForUser(user, 'site'),
		orgId: getIdForUser(user, 'org'),
		include: ['organizations', 'funding_spaces'],
	};
	const [siteLoading, siteError, site] = useApi(
		api => api.apiOrganizationsOrgIdSitesIdGet(siteParams),
		[user]
	);

	const enrollmentsParams = {
		orgId: getIdForUser(user, 'org'),
		siteId: getIdForUser(user, 'site'),
		include: ['child', 'fundings'],
		startDate: (dateRange && dateRange.startDate && dateRange.startDate.toDate()) || undefined,
		endDate: (dateRange && dateRange.endDate && dateRange.endDate.toDate()) || undefined,
	};
	const [enrollmentLoading, enrollmentError, enrollments] = useApi(
		api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsGet(enrollmentsParams),
		[user, dateRange]
	);

	if (siteLoading || siteError || !site || enrollmentLoading || enrollmentError || !enrollments) {
		return <div className="Roster"></div>;
	}

	const incompleteEnrollments = enrollments.filter<DeepNonUndefineable<Enrollment>>(enrollment => !enrollment.ageGroup || !enrollment.entry);
	const completeEnrollments = enrollments.filter<DeepNonUndefineable<Enrollment>>(enrollment => !incompleteEnrollments.includes(enrollment));

	const completeEnrollmentsByAgeGroup = getObjectsByAgeGroup(completeEnrollments);

	const fundingSpaces = idx(site, _ => _.organization.fundingSpaces) || [];
	const fundingSpacesByAgeGroup = getObjectsByAgeGroup(fundingSpaces);

	const numKidsEnrolledText = enrollmentTextFormatter(
		enrollments.length,
		showPastEnrollments,
		dateRange,
		byRange
	);

	const legendItems: LegendItem[] = [];

	Object.keys(fundingSourceDetails).forEach(source => {
		const capacityForFunding = getFundingSpaceCapacity(site.organization, { source });
		const enrolledForFunding = enrollments.filter<DeepNonUndefineable<Enrollment>>(
			enrollment => isFunded(enrollment, { source })
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
			symbol: <Tag text={source} color={fundingSourceDetails[source].colorToken} className="position-relative top-neg-2px" />,
		});
	});

	// CDC funded enrollments with validationErrors are considered to be missing information
	const missingInformationEnrollmentsCount = enrollments.filter<DeepNonUndefineable<Enrollment>>(enrollment => 
		isFunded(enrollment, { source: FundingSource.CDC })
		&& !!enrollment.validationErrors && enrollment.validationErrors.length > 0 
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
		<CommonContainer>
			<div className="grid-container">
				<div className="grid-row flex-first-baseline flex-space-between">
					<h1 className="tablet:grid-col-auto">{site.name}</h1>
					<div className="tablet:grid-col-auto">
						<Button text="Enroll child" href={`/roster/sites/${site.id}/enroll`} className="margin-right-0" />
					</div>
				</div>
				<div className="grid-row">
					<div className="tablet:grid-col-fill">
						<p className="usa-intro display-flex flex-row flex-wrap flex-justify-start">
							<span className="margin-right-2 flex-auto">{numKidsEnrolledText}</span>
							<Button
								text={
									showPastEnrollments ? 'View only current enrollments' : 'Filter for past enrollments'
								}
								appearance="unstyled"
								onClick={handlePastEnrollmentsChange}
							/>
						</p>
					</div>
				</div>
				{showPastEnrollments && (
					<div className="padding-bottom-2">
						<ChoiceList
							type="radio"
							legend="Select date or date range"
							options={[
								{
									text: 'By date',
									value: 'date',
								},
								{
									text: 'By range',
									value: 'range',
								},
							]}
							onChange={event => setByRange(event.target.value === 'range')}
							horizontal={true}
							id={'dateSelectionType'}
							selected={byRange ? ['range'] : ['date']}
							className="margin-top-neg-3"
							// This is goofy but we're getting rid of this soon anyway
						/>
						<DatePicker
							id="enrollment-roster-datepicker"
							label="Date"
							byRange={byRange}
							onChange={(newDateRange: DateRange) => setDateRange(newDateRange)}
							dateRange={dateRange}
							possibleRange={{ startDate: null, endDate: moment().local() }}
							className="margin-top-neg-3"
						/>
					</div>
				)}
				<Legend items={legendItems} />
				<AgeGroupSection
					ageGroup={Age.InfantToddler}
					ageGroupTitle={`Infant/toddler`}
					enrollments={completeEnrollmentsByAgeGroup[Age.InfantToddler]}
					fundingSpaces={fundingSpacesByAgeGroup[Age.InfantToddler] as FundingSpace[]}
					rosterDateRange={dateRange}
					showPastEnrollments={showPastEnrollments}
				/>
				<AgeGroupSection
					ageGroup={Age.Preschool}
					ageGroupTitle={`Preschool`}
					enrollments={completeEnrollmentsByAgeGroup[Age.Preschool]}
					fundingSpaces={fundingSpacesByAgeGroup[Age.Preschool] as FundingSpace[]}
					rosterDateRange={dateRange}
					showPastEnrollments={showPastEnrollments}
				/>
				<AgeGroupSection
					ageGroup={Age.SchoolAge}
					ageGroupTitle={`School age`}
					enrollments={completeEnrollmentsByAgeGroup[Age.SchoolAge]}
					fundingSpaces={fundingSpacesByAgeGroup[Age.SchoolAge] as FundingSpace[]}
					rosterDateRange={dateRange}
					showPastEnrollments={showPastEnrollments}
				/>
				<AgeGroupSection
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
