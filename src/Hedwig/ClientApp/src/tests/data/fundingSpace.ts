import { FundingSource, Age, FundingTime, FundingSpace } from '../../generated';
import { augustReportingPeriod } from './reportingPeriod';

export const mockFundingSpaces: FundingSpace[] = [];

export const mockFullTimeInfantSpace = {
	id: 1,
	source: FundingSource.CDC,
	ageGroup: Age.InfantToddler,
	time: FundingTime.Full,
	capacity: 10,
	organizationId: 1,
};
mockFundingSpaces.push(mockFullTimeInfantSpace);

export const mockFullTimePreschoolSpace = {
	...mockFullTimeInfantSpace,
	id: 2,
	ageGroup: Age.Preschool,
};
mockFundingSpaces.push(mockFullTimePreschoolSpace);

export const mockFullTimeSchoolAgeSpace = {
	...mockFullTimeInfantSpace,
	id: 3,
	ageGroup: Age.SchoolAge,
};
mockFundingSpaces.push(mockFullTimeSchoolAgeSpace);

export const mockPartTimeInfantSpace = {
	...mockFullTimeInfantSpace,
	id: 4,
	time: FundingTime.Part,
};
mockFundingSpaces.push(mockPartTimeInfantSpace);

export const mockPartTimePreschoolSpace = {
	...mockPartTimeInfantSpace,
	id: 5,
	ageGroup: Age.Preschool,
};
mockFundingSpaces.push(mockPartTimePreschoolSpace);

export const mockPartTimeSchoolAgeSpace = {
	...mockPartTimeInfantSpace,
	id: 6,
	ageGroup: Age.SchoolAge,
};
mockFundingSpaces.push(mockPartTimeSchoolAgeSpace);

export const mockSplitTimeInfantSpace = {
	...mockFullTimeInfantSpace,
	id: 7,
	time: FundingTime.Split,
	timeSplit: {
		id: 1,
		fundingSpaceId: mockFundingSpaces.length,
		fullTimeWeeks: 42,
		partTimeWeeks: 10,
	},
};
mockFundingSpaces.push(mockSplitTimeInfantSpace);

export const mockSplitTimeInfantSpaceWithPreviousUtilizations = {
	...mockSplitTimeInfantSpace,
	timeSplitUtilizations: [
		{
			fundingSpaceId: 7,
			reportingPeriod: augustReportingPeriod,
			report: {
				submittedAt: new Date('2019-09-14'),
			},
			fullTimeWeeksUsed: 0,
			partTimeWeeksUsed: 5,
		},
	],
};
