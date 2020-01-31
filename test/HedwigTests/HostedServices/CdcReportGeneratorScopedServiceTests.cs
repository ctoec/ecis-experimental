using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Xunit;
using Moq;
using Hedwig.Repositories;
using HedwigTests.Helpers;
using HedwigTests.Fixtures;
using Hedwig.Models;
using Hedwig.HostedServices;
using Hedwig.Utilities;

namespace HedwigTests.HostedServices
{
	public class CdcReportGeneratorScopedServiceTests
	{
		[Theory]
		[InlineData(true, 2019, 10, 1, 1)] // default in CreateReportingPeriod
		[InlineData(true, 2019, 10, 2, 0)]
		[InlineData(false, 2019, 10, 1, 0)]
		[InlineData(false, 2019, 10, 2, 0)]
		public async Task CreatesReportForOrganization(
			bool hasFundingSpace,
			int year,
			int month,
			int day,
			int numOfReportsGenerated
		)
		{
			int organizationId;
			using (var context = new TestContextProvider().Context)
			{
				var organization = OrganizationHelper.CreateOrganization(context);
				organizationId = organization.Id;
				var fundingSpace = FundingSpaceHelper.CreateFundingSpace(organizationId);
				if (hasFundingSpace)
				{
					organization.FundingSpaces = new List<FundingSpace> {
						fundingSpace
					};
				}
				var currentReportingPeriod = ReportingPeriodHelper.CreateReportingPeriod(context);
			}

			using (var context = new TestContextProvider().Context)
			{
				var orgRepo = new OrganizationRepository(context);
				var reportingPeriodRepo = new ReportingPeriodRepository(context);
				var reportRepo = new ReportRepository(context);
				var dateTime = new Mock<IDateTime>();
				dateTime.Setup(dateTime => dateTime.UtcNow).Returns(new DateTime(
					year, month, day 
				));

				var cdcReportGenerator = new CdcReportGeneratorScopedService(
					orgRepo,
					reportingPeriodRepo,
					reportRepo,
					dateTime.Object
				);

				var previousReports = await reportRepo.GetReportsForOrganizationAsync(organizationId);

				await cdcReportGenerator.TryGenerateReports();

				var reports = await reportRepo.GetReportsForOrganizationAsync(organizationId);

				Assert.Equal(previousReports.Count, 0);
				Assert.Equal(reports.Count, numOfReportsGenerated);
			}
		}

		public async Task DoesNotCreateDuplicateReports()
		{
			int organizationId;
			using (var context = new TestContextProvider().Context)
			{
				var organization = OrganizationHelper.CreateOrganization(context);
				organizationId = organization.Id;
				var fundingSpace = FundingSpaceHelper.CreateFundingSpace(organizationId);
				organization.FundingSpaces = new List<FundingSpace> {
					fundingSpace
				};
				var currentReportingPeriod = ReportingPeriodHelper.CreateReportingPeriod(context);
			}

			using (var context = new TestContextProvider().Context)
			{
				var orgRepo = new OrganizationRepository(context);
				var reportingPeriodRepo = new ReportingPeriodRepository(context);
				var reportRepo = new ReportRepository(context);
				var dateTime = new Mock<IDateTime>();
				dateTime.Setup(dateTime => dateTime.UtcNow).Returns(new DateTime(
					2019, 10, 1 
				));

				var cdcReportGenerator = new CdcReportGeneratorScopedService(
					orgRepo,
					reportingPeriodRepo,
					reportRepo,
					dateTime.Object
				);

				var previousReports = await reportRepo.GetReportsForOrganizationAsync(organizationId);

				await cdcReportGenerator.TryGenerateReports();
				await cdcReportGenerator.TryGenerateReports();
				await cdcReportGenerator.TryGenerateReports();

				var reports = await reportRepo.GetReportsForOrganizationAsync(organizationId);

				Assert.Equal(previousReports.Count, 0);
				Assert.Equal(reports.Count, 1);
			}
		}
	}
}
