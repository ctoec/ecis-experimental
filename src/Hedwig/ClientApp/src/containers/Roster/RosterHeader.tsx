import React from 'react';
import moment from 'moment';
import { Button, ChoiceList, DatePicker, DateRange } from '../../components';
import getDefaultDateRange from '../../utils/getDefaultDateRange';
import { Site, Organization } from '../../generated';
import { rosterEnrollmentsFormatter } from '../../utils/stringFormatters';
import pluralize from 'pluralize';
import ButtonWithDrowdown from '../../components/ButtonWithDropdown/ButtonWithDrowdown';

type RosterHeaderProps = {
	organization: Organization;
	site?: Site;
	numberOfEnrollments: number;
	showPastEnrollments: boolean;
  toggleShowPastEnrollments: () => void;
  dateRange: DateRange;
  setDateRange: (_: DateRange) => void;
  filterByRange: boolean;
  setFilterByRange: (_: boolean) => void;
}

const RosterHeader: React.FC<RosterHeaderProps> = ({
	organization,
	site,
	numberOfEnrollments,
	showPastEnrollments,
	toggleShowPastEnrollments,
	dateRange,
	setDateRange,
	filterByRange,
	setFilterByRange
}) => {
	const sites = organization.sites || [];

	const handlePastEnrollmentsChange = () => {
		toggleShowPastEnrollments();
		setFilterByRange(false);
		setDateRange(getDefaultDateRange());
	};

	if (!site) {
		const pluralizedNumKids = pluralize('child', numberOfEnrollments, true);

		return (
			<>
				<div className="margin-bottom-2 grid-row flex-first-baseline flex-space-between">
					<h1 className="tablet:grid-col-auto">{organization.name}</h1>
					<div className="tablet:grid-col-auto">
						{/* <Button text="Enroll child" href={`/roster/sites/${site.id}/enroll`} className="margin-right-0" /> */}
					</div>
				</div>
				<div className="margin-bottom-4 grid-row">
					<div className="tablet:grid-col-fill">
						<div className="intro display-flex flex-row flex-wrap flex-justify-start">
							<span className="display-flex flex-first-baseline">
								{pluralizedNumKids} enrolled across&nbsp;
								<ButtonWithDrowdown
									id="site-select"
									appearance="unstyled"
									text={` ${sites.length} sites`}
									options={sites.map(s => ({
										text: s.name || '',
										value: `/roster/sites/${s.id}`
									}))}
								/>
							</span>
						</div>
					</div>
				</div>
			</>
		);
	} else {
		const numKidsEnrolledText = rosterEnrollmentsFormatter(
			numberOfEnrollments,
			showPastEnrollments,
			dateRange,
			filterByRange
		);

		return (
			<>
				<div className="margin-bottom-2 grid-row flex-first-baseline flex-space-between">
					<div className="tablet:grid-col-fill">
						<h1 className="tablet:grid-col-auto">{site.name}</h1>
							<p className="intro display-flex flex-row flex-wrap flex-justify-start">
								{numKidsEnrolledText}
								&nbsp;
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
						<Button text="Enroll child" href={`/roster/sites/${site.id}/enroll`} className="margin-right-0" />
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
							onChange={event => setFilterByRange(event.target.value === 'range')}
							horizontal={true}
							id={'dateSelectionType'}
							selected={filterByRange ? ['range'] : ['date']}
							className="margin-top-neg-3"
							// This is goofy but we're getting rid of this soon anyway
						/>
						<DatePicker
							id="enrollment-roster-datepicker"
							label="Date"
							byRange={filterByRange}
							onChange={(newDateRange: DateRange) => setDateRange(newDateRange)}
							dateRange={dateRange}
							possibleRange={{ startDate: null, endDate: moment().local() }}
							className="margin-top-neg-3"
						/>
					</div>
				)}
			</>
		);
	}
}

export default RosterHeader;