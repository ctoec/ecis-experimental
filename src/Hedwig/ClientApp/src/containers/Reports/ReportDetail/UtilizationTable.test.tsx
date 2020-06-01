import React from 'react';
import { render } from '@testing-library/react';
import { Age, FundingTime, FundingSource, Enrollment, Region, Funding } from '../../../generated';
import UtilizationTable from './UtilizationTable';
import emptyGuid from '../../../utils/emptyGuid';
import cartesianProduct from '../../../utils/cartesianProduct';
import { accessibilityTestHelper } from '../../../tests/helpers';
import {
	mockReport,
	mockCompleteEnrollment,
	mockPartTimeEnrollment,
	mockFullTimeInfantEnrollment,
	mockPartTimeInfantEnrollment,
	mockDefaultReport,
} from '../../../tests/data';
import { mockFundingSpaces } from '../../../tests/data/fundingSpace';
import { prettyAge, prettyFundingTime } from '../../../utils/models';
import { calculateRate } from '../../../utils/utilizationTable';
import FormContext from '../../../components/Form_New/FormContext';

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
		}).forEach((combo) => {
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
		const { asFragment } = render(
			<FormContext.Provider
				value={{
					data: defaultReport,
					dataDriller: undefined,
					updateData: jest.fn(),
				}}
			>
				<UtilizationTable />
			</FormContext.Provider>
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it('includes a row for each type of funding space', () => {
		const report = mockReport;
		const { container } = render(
			<FormContext.Provider
				value={{
					data: defaultReport,
					dataDriller: undefined,
					updateData: jest.fn(),
				}}
			>
				<UtilizationTable />
			</FormContext.Provider>
		);

		// mockReport belongs to mockSingleSiteOrganization, which has all mockFundingSpaces
		mockFundingSpaces.forEach((space) => {
			expect(container).toHaveTextContent(
				`${prettyAge(space.ageGroup)} – ${prettyFundingTime(space.time, {
					splitTimeText: 'pt/ft split',
				})}`
			);
		});
	});

	it('has the correct utilization ratios', () => {
		// Default report has 2 full time preschool spaces
		// These mocked enrollments are one of each full and part infant/toddler and preschool
		const mockReport = {
			...mockDefaultReport,
			enrollments: [
				mockPartTimeInfantEnrollment,
				mockFullTimeInfantEnrollment,
				mockCompleteEnrollment, // full time, preschool
				mockPartTimeEnrollment, // part time, preschool
			],
		};

		const { getAllByText } = render(
			<FormContext.Provider
				value={{
					data: mockReport,
					dataDriller: undefined,
					updateData: jest.fn(),
				}}
			>
				<UtilizationTable />
			</FormContext.Provider>
		);
		const oneOfZeros = getAllByText(/1\/\d* spaces/);
		expect(oneOfZeros).toHaveLength(4);
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
						enrollmentId: 1,
						fundingSpace: {
							organizationId: 1,
							capacity: 1,
							time: FundingTime.Split,
							timeSplit: { fullTimeWeeks: 10, partTimeWeeks: 42 },
						},
					} as Funding,
				],
			},
		]);

		const { container } = render(
			<FormContext.Provider
				value={{
					data: report,
					dataDriller: undefined,
					updateData: jest.fn(),
				}}
			>
				<UtilizationTable />
			</FormContext.Provider>
		);

		expect(container).toHaveTextContent('0/10 spaces');
	});

	accessibilityTestHelper(
		<FormContext.Provider
			value={{
				data: defaultReport,
				dataDriller: undefined,
				updateData: jest.fn(),
			}}
		>
			<UtilizationTable />
		</FormContext.Provider>
	);
});
