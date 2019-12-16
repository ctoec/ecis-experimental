import React, { useState, useContext } from 'react';
import idx from 'idx';
import enrollmentTextFormatter from '../../utils/enrollmentTextFormatter';
import getDefaultDateRange from '../../utils/getDefaultDateRange';
import { fundingSourceDetails } from '../../utils/fundingTypeFormatters';
import getFundingSpaceCapacity from '../../utils/getFundingSpaceCapacity';
import getIdForUser from '../../utils/getIdForUser';
import Tag from '../../components/Tag/Tag';
import { DateRange } from '../../components/DatePicker/DatePicker';
import Button from '../../components/Button/Button';
import RadioGroup from '../../components/RadioGroup/RadioGroup';
import Legend, { LegendItem } from '../../components/Legend/Legend';
import useApi from '../../hooks/useApi';
import DateSelectionForm from './DateSelectionForm';
import { Age, Enrollment, FundingSpace, Funding } from '../../generated';
import InlineIcon from '../../components/InlineIcon/InlineIcon';
import UserContext from '../../contexts/User/UserContext';
import AgeGroupSection from './AgeGroupSection';
import { getObjectsByAgeGroup } from '../../utils/ageGroupUtils';
import { DeepNonUndefineable } from '../../utils/types';

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

	// Note: These explicit is(In)CompleteEnrollment functions is necessary due to Typescript limitations
	function isIncompleteEnrollment(
		enrollment: DeepNonUndefineable<Enrollment>
	): enrollment is DeepNonUndefineable<Enrollment> {
		return !enrollment.ageGroup || !enrollment.entry;
	}
	function isCompleteEnrollment(
		enrollment: DeepNonUndefineable<Enrollment>
	): enrollment is DeepNonUndefineable<Enrollment> {
		return !isIncompleteEnrollment(enrollment);
	}
	// As is the type annotation on filter
	const incompleteEnrollments = enrollments.filter<DeepNonUndefineable<Enrollment>>(
		isIncompleteEnrollment
	);
	const completeEnrollments = enrollments.filter<DeepNonUndefineable<Enrollment>>(
		isCompleteEnrollment
	);
	function isAgeIncomplete(
		enrollment: DeepNonUndefineable<Enrollment>
	): enrollment is DeepNonUndefineable<Enrollment> {
		return !enrollment.ageGroup;
	}

	const completeEnrollmentsByAgeGroup = getObjectsByAgeGroup(completeEnrollments);
	function isInfant(
		enrollment: DeepNonUndefineable<Enrollment>
	): enrollment is DeepNonUndefineable<Enrollment> {
		return enrollment.ageGroup === Age.InfantToddler;
	}

	function isPreschool(
		enrollment: DeepNonUndefineable<Enrollment>
	): enrollment is DeepNonUndefineable<Enrollment> {
		return enrollment.ageGroup === Age.Preschool;
	}

	function isSchool(
		enrollment: DeepNonUndefineable<Enrollment>
	): enrollment is DeepNonUndefineable<Enrollment> {
		return enrollment.ageGroup === Age.SchoolAge;
	}

	const fundingSpaces = idx(site, _ => _.organization.fundingSpaces) || [];
	const fundingSpacesByAgeGroup = getObjectsByAgeGroup(fundingSpaces);

	const numKidsEnrolledText = enrollmentTextFormatter(
		enrollments.length,
		showPastEnrollments,
		dateRange,
		byRange
	);

	const legendItems: (LegendItem | undefined)[] = Object.keys(fundingSourceDetails).map(source => {
		function isEnrolledForFunding(
			enrollment: DeepNonUndefineable<Enrollment>
		): enrollment is DeepNonUndefineable<Enrollment> {
			const matchesSource = (
				funding: DeepNonUndefineable<Funding>
			): funding is DeepNonUndefineable<Funding> => {
				return funding.source === source;
			};
			return enrollment.fundings
				? enrollment.fundings.filter<DeepNonUndefineable<Funding>>(matchesSource).length > 0
				: false;
		}
		const capacityForFunding = getFundingSpaceCapacity(site.organization, source);
		const enrolledForFunding = enrollments.filter<DeepNonUndefineable<Enrollment>>(
			isEnrolledForFunding
		).length;

		if (enrolledForFunding === 0) {
			return undefined;
		}

		return {
			text: fundingSourceDetails[source].legendTextFormatter(
				fundingSourceDetails[source].fullTitle,
				enrolledForFunding,
				capacityForFunding
			),
			symbol: <Tag text={source} color={fundingSourceDetails[source].colorToken} />,
		};
	});

	if (incompleteEnrollments.length) {
		legendItems.push({
			text: (
				<>
					<span className="text-bold">{incompleteEnrollments.length}</span>
					<span> missing information</span>
				</>
			),
			symbol: <InlineIcon icon="incomplete" />,
		});
	}

	return (
		<div className="Roster">
			<section className="grid-container">
				<div className="grid-row flex-first-baseline flex-space-between">
					<h1 className="tablet:grid-col-auto">{site.name}</h1>
					<div className="tablet:grid-col-auto">
						<Button text="Enroll child" href={`/roster/sites/${site.id}/enroll`} />
					</div>
				</div>
				<div className="grid-row">
					<div className="tablet:grid-col-fill">
						<p className="usa-intro display-flex flex-row flex-wrap flex-justify-start">
							<span className="margin-right-2 flex-auto">{numKidsEnrolledText}</span>
							<Button
								text={
									showPastEnrollments ? 'View only current enrollments' : 'View past enrollments'
								}
								appearance="unstyled"
								onClick={handlePastEnrollmentsChange}
							/>
						</p>
					</div>
				</div>
				{showPastEnrollments && (
					<div className="usa-fieldset">
						<RadioGroup
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
							groupName={'dateSelectionType'}
							legend="Select date or date range."
							selected={byRange ? 'range' : 'date'}
						/>
						<DateSelectionForm
							inputDateRange={dateRange}
							byRange={byRange}
							onSubmit={(newDateRange: DateRange) => setDateRange(newDateRange)}
						/>
					</div>
				)}
				<Legend items={legendItems} />
				<AgeGroupSection
					ageGroup={Age.InfantToddler}
					ageGroupTitle={`Infant/toddler`}
					enrollments={completeEnrollmentsByAgeGroup[Age.InfantToddler]}
					fundingSpaces={fundingSpacesByAgeGroup[Age.InfantToddler] as FundingSpace[]}
				/>
				<AgeGroupSection
					ageGroup={Age.Preschool}
					ageGroupTitle={`Preschool`}
					enrollments={completeEnrollmentsByAgeGroup[Age.Preschool]}
					fundingSpaces={fundingSpacesByAgeGroup[Age.Preschool] as FundingSpace[]}
				/>
				<AgeGroupSection
					ageGroup={Age.SchoolAge}
					ageGroupTitle={`School age`}
					enrollments={completeEnrollmentsByAgeGroup[Age.SchoolAge]}
					fundingSpaces={fundingSpacesByAgeGroup[Age.SchoolAge] as FundingSpace[]}
				/>
				<AgeGroupSection
					ageGroup="incomplete"
					ageGroupTitle={`Incomplete enrollments`}
					enrollments={incompleteEnrollments.filter<DeepNonUndefineable<Enrollment>>(
						isAgeIncomplete
					)}
				/>
			</section>
		</div>
	);
}
