import React from 'react';
import { render } from '@testing-library/react';
import { Age, FundingTime, CdcReport, FundingSource, Enrollment, Region } from '../../../generated';
import UtilizationTable, { calculateRate } from './UtilizationTable';
import emptyGuid from '../../../utils/emptyGuid';
import cartesianProduct from '../../../utils/cartesianProduct';
import { accessibilityTestHelper } from '../../../tests/helpers';
import {
	mockReport,
	mockCompleteEnrollment,
	mockPartTimeEnrollment,
	mockFullTimeInfantEnrollment,
	mockPartTimeInfantEnrollment,
} from '../../../tests/data';

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
	return { ...mockReport, enrollments };
};

const defaultReport = reportWithEnrollments([mockCompleteEnrollment]);

describe('UtilizationTable', () => {
	it('matches snapshot', () => {
		const { asFragment } = render(<UtilizationTable {...defaultReport} />);
		expect(asFragment()).toMatchSnapshot();
	});

	it('includes a row for each type of enrollment and funding space', () => {
		const report = reportWithEnrollments([
			mockFullTimeInfantEnrollment,
			mockPartTimeInfantEnrollment,
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
