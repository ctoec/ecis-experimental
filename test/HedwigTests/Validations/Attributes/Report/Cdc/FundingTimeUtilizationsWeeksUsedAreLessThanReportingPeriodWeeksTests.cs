using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Moq;
using Xunit;
using Hedwig.Models;
using Hedwig.Repositories;
using Hedwig.Validations.Attributes;

namespace HedwigTests.Validations.Attributes
{
	public class FundingTimeUtilizationsWeeksUsedAreLessThanReportingPeriodWeeksTests
	{
		[Theory]
		[InlineData(4, false)]
		[InlineData(8, true)]
		public void IsValid_ReturnsValidationResult_IfWeeksUsedExceedsWeeksInReportingPeriod(
			int fullTimeWeeksUsed,
			bool returnsValidationResult
		)
		{
			// if
			var fundingSpaces = new List<FundingSpace> {
				new FundingSpace {
					Id = 1,
					OrganizationId = 1,
					AgeGroup = Age.InfantToddler,
					TimeSplit = new FundingTimeSplit {
						FullTimeWeeks = 10,
						PartTimeWeeks = 42
					},
				}
			};
			var organization = new Organization
			{
				Id = 1,
				FundingSpaces = fundingSpaces,
			};
			var timeSplitUtilizations = new List<FundingTimeSplitUtilization> {
				new FundingTimeSplitUtilization {
					FundingSpaceId = 1,
					FullTimeWeeksUsed = fullTimeWeeksUsed,
					PartTimeWeeksUsed = 0,
				},
			};
			var report = new CdcReport
			{
				OrganizationId = organization.Id,
				TimeSplitUtilizations = timeSplitUtilizations,
			};
			typeof(Report).GetProperty(nameof(Report.ReportingPeriod)).SetValue(report, new ReportingPeriod
			{
				Period = new DateTime(2010, 1, 1),
				PeriodStart = new DateTime(2010, 1, 1),
				PeriodEnd = new DateTime(2010, 1, 31)
			});

			var organizations = new Mock<IOrganizationRepository>();
			organizations.Setup(o => o.GetOrganizationById(It.IsAny<int>(), It.IsAny<string[]>()))
			.Returns(organization);

			var serviceProvider = new Mock<IServiceProvider>();
			serviceProvider.Setup(v => v.GetService(typeof(IOrganizationRepository)))
			.Returns(organizations.Object);

			var validationContext = new ValidationContext(report, serviceProvider.Object, new Dictionary<object, object>());
			var attribute = new FundingTimeUtilizationsWeeksUsedAreLessThanReportingPeriodWeeks();

			// when
			var value = timeSplitUtilizations;
			var result = attribute.GetValidationResult(value, validationContext);

			// then 
			Assert.Equal(returnsValidationResult, result != null);
		}

		[Theory]
		[InlineData(2, false)]
		[InlineData(3, false)]
		[InlineData(6, true)]
		public void IsValid_ReturnsValidationResult_IfWeeksUsedExceedsWeekInReportingPeriod_AndMultipleFundingSpaces(
			int fullTimeWeeksUsed,
			bool returnsValidationResult
		)
		{
			// if
			var fundingSpaces = new List<FundingSpace> {
				new FundingSpace {
					Id = 1,
					OrganizationId = 1,
					AgeGroup = Age.InfantToddler,
					TimeSplit = new FundingTimeSplit {
						FullTimeWeeks = 10,
						PartTimeWeeks = 42
					},
				},
				new FundingSpace {
					Id = 2,
					OrganizationId = 1,
					AgeGroup = Age.SchoolAge,
					TimeSplit = new FundingTimeSplit {
						FullTimeWeeks = 5,
						PartTimeWeeks = 47
					},
				},
				new FundingSpace {
					Id = 3,
					OrganizationId = 1,
					AgeGroup = Age.Preschool,
				}
			};
			var organization = new Organization
			{
				Id = 1,
				FundingSpaces = fundingSpaces,
			};
			var timeSplitUtilizations = new List<FundingTimeSplitUtilization> {
				new FundingTimeSplitUtilization {
					FundingSpaceId = 1,
					FullTimeWeeksUsed = fullTimeWeeksUsed,
					PartTimeWeeksUsed = 0,
				},
				new FundingTimeSplitUtilization {
					FundingSpaceId = 2,
					FullTimeWeeksUsed = fullTimeWeeksUsed,
					PartTimeWeeksUsed = 0,
				},
			};
			var report = new CdcReport
			{
				OrganizationId = organization.Id,
				TimeSplitUtilizations = timeSplitUtilizations,
			};
			typeof(Report).GetProperty(nameof(Report.ReportingPeriod)).SetValue(report, new ReportingPeriod
			{
				Period = new DateTime(2010, 1, 1),
				PeriodStart = new DateTime(2010, 1, 1),
				PeriodEnd = new DateTime(2010, 1, 31)
			});

			var organizations = new Mock<IOrganizationRepository>();
			organizations.Setup(o => o.GetOrganizationById(It.IsAny<int>(), It.IsAny<string[]>()))
			.Returns(organization);

			var serviceProvider = new Mock<IServiceProvider>();
			serviceProvider.Setup(v => v.GetService(typeof(IOrganizationRepository)))
			.Returns(organizations.Object);

			var validationContext = new ValidationContext(report, serviceProvider.Object, new Dictionary<object, object>());
			var attribute = new FundingTimeUtilizationsWeeksUsedAreLessThanReportingPeriodWeeks();

			// when
			var value = timeSplitUtilizations;
			var result = attribute.GetValidationResult(value, validationContext);

			// then 
			Assert.Equal(returnsValidationResult, result != null);
		}
	}
}
