using AutoMapper;
using Hedwig.Models;
using Hedwig.Repositories;
using Hedwig.Validations.Attributes;
using Moq;
using System;
using System.Collections.Generic;
using Xunit;
using ValidationContext = System.ComponentModel.DataAnnotations.ValidationContext;

namespace HedwigTests.Validations.Attributes
{
	public class FundingTimeUtilizationsWeeksUsedDoNotExceedTotalAvailableWeeksTests
	{
		[Theory]
		[InlineData(4, false)]
		[InlineData(12, true)]
		public void IsValid_ReturnsValidationResult_IfWeeksUsedExceedsTotalAvailableWeeks(
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
				Period = new DateTime(2010, 1, 1)
			});

			var reports = new Mock<IReportRepository>();
			reports.Setup(r => r.GetReportsForOrganizationByFiscalYear(It.IsAny<int>(), It.IsAny<DateTime>()))
			.Returns(new List<CdcReport> {
				report
			});
			var organizations = new Mock<IOrganizationRepository>();
			var _mapper = new Mock<IMapper>();
			_mapper.Setup(m => m.Map<Organization, EnrollmentSummaryOrganizationDTO>(It.IsAny<Organization>()))
				.Returns(It.IsAny<EnrollmentSummaryOrganizationDTO>());
			organizations.Setup(o => o.GetOrganizationById(It.IsAny<int>()))
			.Returns(_mapper.Object.Map<EnrollmentSummaryOrganizationDTO>(organization));

			var serviceProvider = new Mock<IServiceProvider>();
			serviceProvider.Setup(v => v.GetService(typeof(IReportRepository)))
			.Returns(reports.Object);
			serviceProvider.Setup(v => v.GetService(typeof(IOrganizationRepository)))
			.Returns(organizations.Object);

			var validationContext = new ValidationContext(report, serviceProvider.Object, new Dictionary<object, object>());
			var attribute = new FundingTimeUtilizationsWeeksUsedDoNotExceedTotalAvailableWeeks();

			// when
			var value = timeSplitUtilizations;
			var result = attribute.GetValidationResult(value, validationContext);

			// then 
			Assert.Equal(returnsValidationResult, result != null);
		}

		[Theory]
		[InlineData(4, false)]
		[InlineData(8, true)]
		[InlineData(12, true)]
		public void IsValid_ReturnsValidationResult_IfWeeksUsedExceedsTotalAvailableWeeks_AndMultipleFundingSpaces(
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
				Period = new DateTime(2010, 1, 1)
			});

			var reports = new Mock<IReportRepository>();
			reports.Setup(r => r.GetReportsForOrganizationByFiscalYear(It.IsAny<int>(), It.IsAny<DateTime>()))
			.Returns(new List<CdcReport> {
				report
			});
			var organizations = new Mock<IOrganizationRepository>();
			var _mapper = new Mock<IMapper>();
			_mapper.Setup(m => m.Map<Organization, EnrollmentSummaryOrganizationDTO>(It.IsAny<Organization>()))
				.Returns(It.IsAny<EnrollmentSummaryOrganizationDTO>());
			organizations.Setup(o => o.GetOrganizationById(It.IsAny<int>()))
			.Returns(_mapper.Object.Map<EnrollmentSummaryOrganizationDTO>(organization));

			var serviceProvider = new Mock<IServiceProvider>();
			serviceProvider.Setup(v => v.GetService(typeof(IReportRepository)))
			.Returns(reports.Object);
			serviceProvider.Setup(v => v.GetService(typeof(IOrganizationRepository)))
			.Returns(organizations.Object);

			var validationContext = new ValidationContext(report, serviceProvider.Object, new Dictionary<object, object>());
			var attribute = new FundingTimeUtilizationsWeeksUsedDoNotExceedTotalAvailableWeeks();

			// when
			var value = timeSplitUtilizations;
			var result = attribute.GetValidationResult(value, validationContext);

			// then 
			Assert.Equal(returnsValidationResult, result != null);
		}
	}
}
