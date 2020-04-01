import { ProcessStepProps } from '../../../components/ProcessList/ProcessStep';
import { DeepNonUndefineable, DeepNonUndefineableArray } from '../../types';
import { Enrollment, Funding, FundingSource, FamilyDetermination, C4KCertificate } from '../../../generated';
import { prettyAge, prettyFundingTime, NO_FUNDING } from '..';
import dateFormatter from '../../dateFormatter';
import { inverseDateSorter } from '../../dateSorter';
import moment from 'moment';
import { scryRenderedComponentsWithType } from 'react-dom/test-utils';
import { c4kCertificateSorter } from '../c4kCertificate';

// sortable process step props include:
// - sortDate, the field to use for sorting
// - sortWeight, a number to use as a sorting tiebreaker to ensure enrollment starts come before funding/determination steps,
// 	and enrollment ends come after
type SortableProcessStepProps = ProcessStepProps & { sortDate: Date | null; sortWeight: number };

/**
 * Generates SortableProcessStepProps array for a given array of enrollments,
 * also creating step props for fundings and family determinations
 * @param enrollment
 * @returns sorted SortableProcessStepProps array
 */
export function getEnrollmentHistoryProps(
	currentEnrollment: DeepNonUndefineable<Enrollment>
): ProcessStepProps[] {
	// allEnrollments is sorted in descending order by Entry
	// (pastEnrollments are sorted thusly in API response)
	var allEnrollments = [
		currentEnrollment,
		...(currentEnrollment.pastEnrollments ? currentEnrollment.pastEnrollments : []),
	];

	var processStepProps: SortableProcessStepProps[] = [];

	allEnrollments.forEach((enrollment, idx) => {
		// enrollment start steps
		if (enrollment.entry) {
			var props = {};
			processStepProps.push(
				getSortableStep({
					heading:
						idx === allEnrollments.length - 1
							? `Changed enrollment to ${prettyAge(enrollment.ageGroup)} in ${enrollment.site.name}`
							: // heading text for first enrollment (last in ordered array)
							  `Enrolled in ${enrollment.site.name}`,
					body: `on ${dateFormatter(enrollment.entry, false)}`,
					stepDate: enrollment.entry,
					stepWeight: -1,
				})
			);
		}

		// enrollment stop steps (only care about withdrawal for the last enrollment)
		if (idx === 0 && enrollment.exit) {
			processStepProps.push(
				getSortableStep({
					heading: `Withdrawn from ${enrollment.site.name}`,
					body: `on ${dateFormatter(enrollment.exit, false)}`,
					stepDate: enrollment.exit,
					stepWeight: 1,
				})
			);
		}

		// funding steps
		processStepProps = processStepProps.concat(
			fundingStepProps(enrollment.fundings, enrollment.exit)
		);

		// only add determination steps and C4K funding steps for the current enrollment (others will be dupes)
		if (idx === 0) {
			// determination steps
			processStepProps = processStepProps.concat(
				determinationStepProps(enrollment.child.family.determinations)
			);

			// C4K certification steps
			processStepProps = processStepProps.concat(
				c4kCertificateStepProps(enrollment.child.c4KCertificates)
			)
		}
	});

	// return all steps sorted by `sortDate`, and sortWeight
	return processStepProps.sort(enrollmentHistoryPropsSorter);
}

/**
 * Generates SortableProcessStepProps array for a given array of fundings
 * @param fundings
 * @param enrollmentExit the value of Exit on the owning enrollment,
 * used to determine if switch to private pay step should be created
 */
function fundingStepProps(
	fundings: DeepNonUndefineable<Funding[]> | null,
	enrollmentExit: Date | null
) {
	var processStepProps: SortableProcessStepProps[] = [];

	if (fundings) {
		fundings.forEach(funding => {
			// CDC Funding start if:
			// - source is CDC
			// - funding has first reporting period
			if (funding.source === FundingSource.CDC && funding.firstReportingPeriod) {
				processStepProps.push(
					getSortableStep({
						heading: `Switched funding to ${funding.source} - ${prettyFundingTime(funding.time)}`,
						body: `on ${dateFormatter(funding.firstReportingPeriod.periodStart, false)}`,
						stepDate: funding.firstReportingPeriod.periodStart,
					})
				);
			}
			// Switch to private pay if:
			// - source is CDC
			// - funding has last reporting period
			// - enrollment still on going
			// TODO: Handle other funding sources
			else if (
				funding.source === FundingSource.CDC &&
				funding.lastReportingPeriod &&
				!enrollmentExit
			) {
				var dayAfterLastReportingPeriodEnd = moment(funding.lastReportingPeriod.periodEnd)
					.add(1, 'days')
					.toDate();
				processStepProps.push(
					getSortableStep({
						heading: `Switched funding to ${NO_FUNDING}`,
						body: `on ${dateFormatter(dayAfterLastReportingPeriodEnd, false)}`,
						stepDate: dayAfterLastReportingPeriodEnd,
					})
				);
			}
		});
	}

	return processStepProps;
}

/**
 * Generates SortableProcessStepProps array for a given array of family determinations
 * @param determinations
 */
function determinationStepProps(
	determinations: DeepNonUndefineable<FamilyDetermination[]> | null
) {
	var processStepProps: SortableProcessStepProps[] = [];
	if (determinations) {
		determinations.forEach(determination => {
			if (!determination.notDisclosed && determination.determinationDate) {
				processStepProps.push(
					getSortableStep({
						heading: 'Income redetermined',
						body: `on ${dateFormatter(determination.determinationDate, false)}`,
						stepDate: determination.determinationDate,
					})
				);
			}
		});
	}

	return processStepProps;
}

/**
 * Generates SortableProcessStepProps array for a given array of C4KCertificates
 * @param c4KCertificates 
 */
function c4kCertificateStepProps(
	c4KCertificates: DeepNonUndefineable<C4KCertificate[]> | null
) {
	var processStepProps: SortableProcessStepProps[] = [];
	if(c4KCertificates) {
		c4KCertificates
			.sort(c4kCertificateSorter)
			.forEach((c4kCertificate, idx) => {
				if(c4kCertificate.startDate) {
					processStepProps.push(getSortableStep({
						heading: idx === 0 ? 'Care 4 Kids certificate added' : 'Care 4 Kids certificate renewed',
						body: `on ${dateFormatter(c4kCertificate.startDate, false)}`,
						stepDate: c4kCertificate.startDate
					}));
				}
			});
	}

	return processStepProps;
}

/**
 * Sorts SortableProcessStepProp objects inversely by sortDate, using sortWeight as a tie breaker
 * @param a
 * @param b
 */
function enrollmentHistoryPropsSorter(a: SortableProcessStepProps, b: SortableProcessStepProps) {
	var dateSorterRes = inverseDateSorter(a.sortDate, b.sortDate);

	if (dateSorterRes !== 0) return dateSorterRes;

	if (a.sortWeight < b.sortWeight) return 1;
	if (a.sortWeight > b.sortWeight) return -1;
	return 0;
}

/**
 * Returns a SortableProcessStepProps object composed from the given parameters,
 * using the stepDate as sortDate, and to get correct value for isNew
 * @param heading
 * @param body
 * @param stepDate
 * @param stepWeight
 */
function getSortableStep(params: {
	heading: string;
	body: string;
	stepDate: Date;
	stepWeight?: number;
}): SortableProcessStepProps {
	return {
		heading: params.heading,
		body: params.body,
		sortDate: params.stepDate,
		sortWeight: params.stepWeight ? params.stepWeight : 0,
		isNew: stepIsNew(params.stepDate),
	};
}

/**
 * Returns true is date is less than 1 week old, else false
 * @param stepDate
 */
function stepIsNew(stepDate: Date) {
	return moment().add(-1, 'week') < moment(stepDate);
}
