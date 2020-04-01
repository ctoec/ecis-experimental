import { fundingStepProps } from './';
import { cdcReportingPeriods } from '../../../tests/data';
import { DeepNonUndefineable } from '../../types';
import { Funding, FamilyDetermination, C4KCertificate, Enrollment, Age } from '../../../generated';
import moment from 'moment';
import {
	determinationStepProps,
	c4kCertificateStepProps,
	enrollmentStepProps,
	getSortableStep,
} from './history';

describe('enrollment history utils', () => {
	describe('enrollmentStepProps', () => {
		it.each([
			[2, 3, null, 0, ''],
			[2, 3, new Date(), 1, 'Enrolled in'],
			[0, 3, null, 0, ''],
			[0, 3, new Date(), 1, 'Changed enrollment to '],
		])(
			'creates enrolled in or change enrollment step for enrollment if it has entry',
			(idx, count, entry, expectedSteps, headingTextMatch) => {
				var enrollment = {
					entry,
					site: { name: '' },
				} as DeepNonUndefineable<Enrollment>;

				var steps = enrollmentStepProps(enrollment, idx, count);
				expect(steps.length).toEqual(expectedSteps);
				if (expectedSteps) {
					var [step] = steps;
					expect(step.heading).toMatch(headingTextMatch);
					expect(step).toHaveProperty('sortDate', entry);
					expect(step).toHaveProperty('sortWeight', -1);
				}
			}
		);

		it.each([
			[0, new Date(), 1],
			[0, null, 0],
			[1, new Date(), 0],
		])(
			'creates withdrawn from step for last enrollment if it has exit',
			(idx, exit, expectedSteps) => {
				var enrollment = {
					exit,
					site: { name: '' },
				} as DeepNonUndefineable<Enrollment>;

				var steps = enrollmentStepProps(enrollment, idx, 1);
				expect(steps.length).toEqual(expectedSteps);
				if (expectedSteps) {
					var [step] = steps;
					expect(step.heading).toMatch(/Withdrawn from/);
					expect(step).toHaveProperty('sortDate', exit);
					expect(step).toHaveProperty('sortWeight', 1);
				}
			}
		);
	});

	describe('fundingStepProps', () => {
		it('creates switched to CDC step for cdc fundings with first reporting period', () => {
			var fundings = [
				// CDC funding with first reporting period
				{
					source: 'CDC',
					firstReportingPeriod: cdcReportingPeriods[0],
				},
				// CDC funding without first reporting period
				{
					source: 'CDC',
				},
				// sourceless funding
				{
					source: null,
				},
			] as DeepNonUndefineable<Funding[]>;

			var steps = fundingStepProps(fundings, null);

			expect(steps).toHaveLength(1);
			var [step] = steps;
			expect(step).toHaveProperty('heading', 'Switched funding to CDC');
			expect(step).toHaveProperty('sortDate', cdcReportingPeriods[0].periodStart);
			expect(step).toHaveProperty('sortWeight', 0);
		});

		it.each([true, false])(
			'creates switched to private pay step for cdc funding with last reporting period if funding ended before enrollment',
			enrollmentExitIsNull => {
				var fundings = [
					{
						source: 'CDC',
						lastReportingPeriod: cdcReportingPeriods[1],
					},
				] as DeepNonUndefineable<Funding[]>;

				var enrollmentExit = enrollmentExitIsNull
					? null
					: moment(fundings[0].lastReportingPeriod.periodEnd)
							.add(1, 'month')
							.toDate();

				var steps = fundingStepProps(fundings, enrollmentExit);

				expect(steps).toHaveLength(1);
				var [step] = steps;
				expect(step).toHaveProperty('heading', 'Switched funding to private pay');
				expect(step).toHaveProperty(
					'sortDate',
					moment(fundings[0].lastReportingPeriod.periodEnd)
						.add(1, 'day')
						.toDate()
				);
				expect(step).toHaveProperty('sortWeight', 0);
			}
		);

		it('does not create switched to private pay step for cdc funding if funding ended with enrollment', () => {
			var fundings = [
				{
					source: 'CDC',
					lastReportingPeriod: cdcReportingPeriods[1],
				},
			] as DeepNonUndefineable<Funding[]>;

			var enrollmentExit = fundings[0].lastReportingPeriod.periodEnd;

			var steps = fundingStepProps(fundings, enrollmentExit);

			expect(steps).toHaveLength(0);
		});
	});

	describe('determinationStepProps', () => {
		it.each([
			[false, new Date(), 1],
			[false, undefined, 0],
			[true, new Date(), 0],
			[true, undefined, 0],
		])(
			'creates income redetermined step for each disclosed income determination with determination date',
			(notDisclosed, determinationDate, expectedSteps) => {
				var determinations = [
					{
						notDisclosed,
						determinationDate,
					},
				] as DeepNonUndefineable<FamilyDetermination[]>;

				var steps = determinationStepProps(determinations);

				expect(steps.length).toEqual(expectedSteps);
			}
		);
	});

	describe('c4kCertificateStepProps', () => {
		it('creates step for every c4k cert with start date, with special copy for first cert', () => {
			var firstDate = new Date();
			var c4kCerts = [
				{
					startDate: firstDate,
				},
				{
					startDate: moment(firstDate)
						.add(1, 'year')
						.toDate(),
				},
			] as DeepNonUndefineable<C4KCertificate[]>;

			var steps = c4kCertificateStepProps(c4kCerts);

			expect(steps).toHaveLength(2);
			var [first, second] = steps;
			expect(first).toHaveProperty('heading', 'Care 4 Kids certificate added');
			expect(second).toHaveProperty('heading', 'Care 4 Kids certificate renewed');
		});
	});

	describe('getSortableStep', () => {
		it.each([
			[0, true],
			[-10, false],
		])('creates step with correct isNew value based on stepDate argument', (daysAgo, isNew) => {
			var step = getSortableStep({
				heading: '',
				body: '',
				stepDate: moment()
					.add(daysAgo, 'days')
					.toDate(),
			});

			expect(step).toHaveProperty('isNew', isNew);
		});
	});
});
