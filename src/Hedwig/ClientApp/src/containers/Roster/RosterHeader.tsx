import React from 'react';
import {
	Button,
	ChoiceList,
	DateInput,
	DateRangeInput,
	DateRange,
	InlineIcon,
} from '../../components';
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
};

const RosterHeader: React.FC<RosterHeaderProps> = ({
	organization,
	site,
	numberOfEnrollments,
	showPastEnrollments,
	toggleShowPastEnrollments,
	dateRange,
	setDateRange,
	filterByRange,
	setFilterByRange,
}) => {
	const sites = organization.sites || [];
	const singleSiteProgram = sites.length === 1;

	const handlePastEnrollmentsChange = () => {
		toggleShowPastEnrollments();
		setFilterByRange(false);
		setDateRange(getDefaultDateRange());
	};

	if (!site && !singleSiteProgram) {
		const pluralizedNumKids = pluralize('child', numberOfEnrollments, true);

		return (
			<>
				<div className="grid-row flex-first-baseline flex-space-between">
					<h1 className="tablet:grid-col-auto">{organization.name}</h1>
					<div className="tablet:grid-col-auto">
						<ButtonWithDrowdown
							id="enroll-select"
							className="margin-right-0"
							text="Enroll child"
							dropdownElement={
								<InlineIcon
									icon="arrowDown"
									className="margin-left-1"
									svgProps={{
										fill: 'currentColor',
									}}
								/>
							}
							options={sites.map(s => ({
								text: s.name || '',
								value: `/roster/sites/${s.id}/enroll`,
							}))}
							optionsProps={{
								className: 'position-absolute right-1',
							}}
						/>
					</div>
				</div>
				<div className="margin-bottom-4 grid-row font-sans-lg">
					<div className="tablet:grid-col-fill">
						<div className="intro display-flex flex-row flex-wrap flex-justify-start">
							<span className="display-flex flex-first-baseline">
								{pluralizedNumKids} enrolled across&nbsp;
								<ButtonWithDrowdown
									id="site-select"
									appearance="unstyled"
									className="line-height--small"
									text={<span className="text-bold font-sans-lg"> {sites.length} sites</span>}
									dropdownElement={
										<InlineIcon
											icon="angleArrowDown"
											svgProps={{
												fill: 'currentColor',
											}}
										/>
									}
									options={sites.map(s => ({
										text: s.name || '',
										value: `/roster/sites/${s.id}`,
									}))}
									optionsProps={{
										className: 'font-sans-sm',
									}}
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

		// If site is undefined, then it is a single site program
		// Assumes there is always at least one site in an organization
		const activeSite = site || sites[0];

		return (
			<>
				<div className="margin-bottom-2 grid-row flex-first-baseline flex-space-between">
					<div className="tablet:grid-col-fill">
						<h1 className="tablet:grid-col-auto">{activeSite.name}</h1>
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
						<Button
							text="Enroll child"
							href={`/roster/sites/${activeSite.id}/enroll`}
							className="margin-right-0"
						/>
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
						{filterByRange ? (
							<DateRangeInput
								id="enrollment-roster-datepicker"
								label="Date"
								onChange={newDateRange => (newDateRange ? setDateRange(newDateRange) : null)}
								dateRange={dateRange}
								className="margin-top-neg-3"
							/>
						) : (
							<DateInput
								id="enrollment-roster-datepicker"
								label="Date"
								onChange={newDate => setDateRange({ startDate: newDate, endDate: newDate })}
								date={dateRange.startDate}
								className="margin-top-neg-3"
							/>
						)}
					</div>
				)}
			</>
		);
	}
};

export default RosterHeader;
