import React from 'react';
import { render } from '@testing-library/react';
import { Age, FundingTime, CdcReport, FundingSource, Enrollment, Region } from '../../../generated';
import UtilizationTable, { calculateRate } from './UtilizationTable';
import emptyGuid from '../../../utils/emptyGuid';
import cartesianProduct from '../../../utils/cartesianProduct';
import { accessibilityTestHelper } from '../../accessibilityTestHelper';

describe('calculateRate', () => {
	it('includes all possible rates', () => {
		cartesianProduct({
			accredited: [true, false],
			titleI: [true, false],
			region: [
				Region.East,
				Region.NorthCentral,
				Region.NorthWest,
				Region.SouthCentral,
				Region.SouthWest,
			],
			ageGroup: [Age.InfantToddler, Age.Preschool, Age.SchoolAge],
			time: [FundingTime.Full, FundingTime.Part],
		}).forEach(combo => {
			const rate = calculateRate(
				combo.accredited,
				combo.titleI,
				combo.region,
				combo.ageGroup,
				combo.time
			);
			expect(rate).toBeGreaterThan(0);
		});
	});
});

const reportWithEnrollments = (enrollments: Enrollment[]) => {
	const report: CdcReport = {
		id: 1,
		organizationId: 1,
		accredited: true,
		type: FundingSource.CDC,
		enrollments,
		reportingPeriod: {
			id: 1,
			type: FundingSource.CDC,
			period: new Date('2019-09-01'),
			dueAt: new Date('2019-10-15'),
			periodStart: new Date('2019-09-01'),
			periodEnd: new Date('2019-09-28'),
		},
		organization: {
			id: 1,
			name: 'Test Organization',
			fundingSpaces: [
				{
					source: FundingSource.CDC,
					ageGroup: Age.Preschool,
					time: FundingTime.Full,
					capacity: 2,
					organizationId: 1,
				},
			],
			sites: [
				{
					name: 'Test Site',
					region: Region.East,
					titleI: false,
					organizationId: 1,
				},
			],
		},
	};

	return report;
};

const defaultReport = reportWithEnrollments([
	{
		id: 1,
		ageGroup: Age.Preschool,
		siteId: 1,
		childId: emptyGuid(),
		fundings: [
			{
				id: 1,
				source: FundingSource.CDC,
				time: FundingTime.Full,
				enrollmentId: 1,
			},
		],
	},
]);

describe('UtilizationTable', () => {
	it('matches snapshot', () => {
		const { asFragment } = render(<UtilizationTable {...defaultReport} />);
		expect(asFragment()).toMatchSnapshot();
	});

	it('includes a row for each type of enrollment and funding space', () => {
		const report = reportWithEnrollments([
			{
				id: 1,
				ageGroup: Age.InfantToddler,
				siteId: 1,
				childId: emptyGuid(),
				fundings: [
					{
						id: 1,
						source: FundingSource.CDC,
						time: FundingTime.Full,
						enrollmentId: 1,
					},
				],
			},
			{
				id: 2,
				ageGroup: Age.InfantToddler,
				siteId: 1,
				childId: emptyGuid(),
				fundings: [
					{
						id: 1,
						source: FundingSource.CDC,
						time: FundingTime.Part,
						enrollmentId: 1,
					},
				],
			},
		]);

		const { container } = render(<UtilizationTable {...report} />);

		expect(container).toHaveTextContent('Infant/Toddler – full time');
		expect(container).toHaveTextContent('Infant/Toddler – part time');
		expect(container).toHaveTextContent('Preschool – full time');
	});

	it('does not include enrollments without an age', () => {
		const report = reportWithEnrollments([
			{
				id: 1,
				ageGroup: undefined,
				siteId: 1,
				childId: emptyGuid(),
				fundings: [
					{
						id: 1,
						source: FundingSource.CDC,
						time: FundingTime.Full,
						enrollmentId: 1,
					},
				],
			},
		]);

		const { container } = render(<UtilizationTable {...report} />);

		expect(container).toHaveTextContent('0/2 spaces');
	});

	accessibilityTestHelper(<UtilizationTable {...defaultReport} />);
});
