import React, { useState, useContext } from 'react';
import enrollmentTextFormatter from '../../utils/enrollmentTextFormatter';
import getDefaultDateRange from '../../utils/getDefaultDateRange';
import getFundingSpaceCapacity from '../../utils/getFundingSpaceCapacity';
import getIdForUser from '../../utils/getIdForUser';
import Tag from '../../components/Tag/Tag';
import { DateRange } from '../../components/DatePicker/DatePicker';
import Button from '../../components/Button/Button';
import RadioGroup from '../../components/RadioGroup/RadioGroup';
import Legend, { LegendItem } from '../../components/Legend/Legend';
import useApi from '../../hooks/useApi';
import DateSelectionForm from './DateSelectionForm';
import { Age, FundingSource, FundingTime } from '../../generated';
import InlineIcon from '../../components/InlineIcon/InlineIcon';
import UserContext from '../../contexts/User/UserContext';
import AgeGroupSection, { SpecificTableProps } from './AgeGroupSection';
import { fundingSourceDetails } from '../../utils/getColorForFundingType';

type FundingCapacities = {
	[time: string]: number | undefined;
};
type AgeGroupDetails = {
	[ageGroup: string]: {
		tableProps: SpecificTableProps;
		fundingCapacities: FundingCapacities;
	};
};

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
	const [sLoading, sError, site] = useApi(api => api.apiOrganizationsOrgIdSitesIdGet(siteParams), [
		user,
	]);

	const enrollmentsParams = {
		orgId: getIdForUser(user, 'org'),
		siteId: getIdForUser(user, 'site'),
		include: ['child', 'fundings'],
		startDate: (dateRange && dateRange.startDate && dateRange.startDate.toDate()) || undefined,
		endDate: (dateRange && dateRange.endDate && dateRange.endDate.toDate()) || undefined,
	};
	const [eLoading, eError, enrollments] = useApi(
		api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsGet(enrollmentsParams),
		[user, dateRange]
	);

	if (sLoading || sError || !site || eLoading || eError || !enrollments) {
		return <div className="Roster"></div>;
	}

	const incompleteEnrollments = enrollments.filter(e => !e.age || !e.entry);
	const incompleteTableProps: SpecificTableProps = {
		id: 'incomplete-roster-table',
		data: incompleteEnrollments.filter(e => !e.age),
	};

	const completeEnrollments = enrollments.filter(e => !incompleteEnrollments.includes(e));

	const detailsByAgeGroup = {} as AgeGroupDetails;
	Object.values(Age).forEach(ageGroup => {
		const tableProps = {
			id: `${ageGroup}-roster-table`,
			data: completeEnrollments.filter(e => e.age === ageGroup),
		};
		const fundingCapacities = {} as FundingCapacities;
		Object.values(FundingTime).forEach(time => {
			fundingCapacities[time] = getFundingSpaceCapacity(site.organization, { ageGroup, time });
		});
		detailsByAgeGroup[ageGroup] = {
			tableProps,
			fundingCapacities,
		};
	});

	const numKidsEnrolledText = enrollmentTextFormatter(
		enrollments.length,
		showPastEnrollments,
		dateRange,
		byRange
	);

	const legendItems: LegendItem[] = Object.keys(fundingSourceDetails).map(source => {
		const ratioLegendSources: string[] = [FundingSource.CDC];
		const capacityForFunding = getFundingSpaceCapacity(site.organization, { source });
		const enrolledForFunding = enrollments.filter(
			e => e.fundings && e.fundings.filter(f => f.source === source).length > 0
		).length;

		// If funding source enrollments should be displayed as a ratio,
		// and capacity info for funding source exists,
		// set ratio to enrollments/capacity. Otherwise: undefined
		const enrolledOverCapacity =
			ratioLegendSources.includes(source) && capacityForFunding
				? { a: enrolledForFunding, b: capacityForFunding }
				: undefined;

		return {
			text: fundingSourceDetails[source].fullTitle,
			symbol: <Tag text={source} color={fundingSourceDetails[source].colorToken} />,
			number: enrolledForFunding,
			ratio: enrolledOverCapacity,
		};
	});

	legendItems.push({
		text: 'Missing information',
		symbol: <InlineIcon icon="incomplete" />,
	});

	return (
		<div className="Roster">
			<section className="grid-container">
				<h1 className="grid-col-auto">{site.name}</h1>
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
					<div className="tablet:grid-col-auto">
						<Button text="Enroll child" href={`/roster/sites/${site.id}/enroll`} />
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
							onReset={() => {
								setByRange(false);
								setDateRange(getDefaultDateRange());
							}}
							onSubmit={(newDateRange: DateRange) => setDateRange(newDateRange)}
						/>
					</div>
				)}
				<Legend items={legendItems} />
				<AgeGroupSection ageGroupTitle={`Infant/toddler`} {...detailsByAgeGroup[Age.Infant]} />
				<AgeGroupSection ageGroupTitle={`Preschool`} {...detailsByAgeGroup[Age.Preschool]} />
				<AgeGroupSection ageGroupTitle={`Preschool`} {...detailsByAgeGroup[Age.School]} />
				<AgeGroupSection
					ageGroupTitle={`Incomplete enrollments`}
					tableProps={incompleteTableProps}
				/>
			</section>
		</div>
	);
}
