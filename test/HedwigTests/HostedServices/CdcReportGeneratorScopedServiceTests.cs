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
using Microsoft.Extensions.Logging;

namespace HedwigTests.HostedServices
{
	public class CdcReportGeneratorScopedServiceTests
	{
		[Theory]
		[InlineData(true, "2010-10-31", 1)]
		[InlineData(true, "2010-11-01", 1)] 
		[InlineData(true, "2010-11-10", 1)]
		[InlineData(false, "2010-10-31", 0)]
		[InlineData(false, "2010-11-01", 0)]
		[InlineData(false, "2010-11-10", 0)]
		public async Task CreatesReportForOrganization(
			bool hasFundingSpace,
			string today,
			int numOfReportsGenerated
		)
		{
			int organizationId;
			int lastReportingPeriodId;
			using (var context = new TestHedwigContextProvider().Context)
			{
				var organization = OrganizationHelper.CreateOrganization(context);
				organizationId = organization.Id;
				if (hasFundingSpace)
				{
					FundingSpaceHelper.CreateFundingSpace(context, organizationId);
				}

				var lastReportingPeriod = ReportingPeriodHelper.GetOrCreateReportingPeriodForPeriod(
					context,
					period: "2010-10-01",
					periodStart: "2010-10-01",
					periodEnd: "2010-10-31"
				);
				lastReportingPeriodId = lastReportingPeriod.Id;
			}

			using (var context = new TestHedwigContextProvider().Context)
			{
				var logger = new Mock<ILogger<CdcReportGeneratorScopedService>>();
				var orgRepo = new OrganizationRepository(context);
				var reportingPeriodRepo = new ReportingPeriodRepository(context);
				var reportRepo = new ReportRepository(context);
				var dateTime = new Mock<IDateTime>();
				dateTime.Setup(dateTime => dateTime.UtcNow).Returns(DateTime.Parse(today));

				var cdcReportGenerator = new CdcReportGeneratorScopedService(
					logger.Object,
					orgRepo,
					reportingPeriodRepo,
					reportRepo,
					dateTime.Object
				);

				var previousReports = await reportRepo.GetReportsForOrganizationAsync(organizationId);

				await cdcReportGenerator.TryGenerateReports();

				var reports = await reportRepo.GetReportsForOrganizationAsync(organizationId);

				Assert.Empty(previousReports);
				Assert.Equal(numOfReportsGenerated, reports.Count());
				if(numOfReportsGenerated > 0)
				{
					Assert.True(reports.All(report => report.ReportingPeriodId == lastReportingPeriodId));
				}
			}
		}

		[Fact]
		public async Task DoesNotCreateDuplicateReports()
		{
			int organizationId;
			using (var context = new TestHedwigContextProvider().Context)
			{
				var organization = OrganizationHelper.CreateOrganization(context);
				organizationId = organization.Id;
				var fundingSpace = FundingSpaceHelper.CreateFundingSpace(context, organizationId);
				organization.FundingSpaces = new List<FundingSpace> {
					fundingSpace
				};
				var currentReportingPeriod = ReportingPeriodHelper.CreateReportingPeriod(context);
			}

			using (var context = new TestHedwigContextProvider().Context)
			{
				var logger = new Mock<ILogger<CdcReportGeneratorScopedService>>();
				var orgRepo = new OrganizationRepository(context);
				var reportingPeriodRepo = new ReportingPeriodRepository(context);
				var reportRepo = new ReportRepository(context);
				var dateTime = new Mock<IDateTime>();
				dateTime.Setup(dateTime => dateTime.UtcNow).Returns(DateTime.Parse("2019-10-01"));

				var cdcReportGenerator = new CdcReportGeneratorScopedService(
					logger.Object,
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

				Assert.Empty(previousReports);
				Assert.Single(reports);
			}
		}
	}
}
