using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Xunit;
using Hedwig.Models;
using HedwigTests.Helpers;
using HedwigTests.Fixtures;

using System;
namespace HedwigTests.Integrations
{
	public class ReportsControllerIntegrationTests : IClassFixture<TestStartupFactory>
	{
		private readonly TestStartupFactory _factory;
		public ReportsControllerIntegrationTests(
			TestStartupFactory factory
		)
		{
			_factory = factory;
		}

		[Fact]
		public async Task ReportControllerOrganizationsReportsGet_ReturnsCorrectResponseShape()
		{
			User user;
			Organization organization;
			Site[] sites;
			Report report;
			using (var context = new TestHedwigContextProvider().Context)
			{
				organization = OrganizationHelper.CreateOrganization(context);
				var site1 = SiteHelper.CreateSite(context, organization: organization);
				var site2 = SiteHelper.CreateSite(context, organization: organization);
				report = ReportHelper.CreateCdcReport(context, organization: organization);
				sites = new Site[] { site1, site2 };
				EnrollmentHelper.CreateEnrollment(context, site: site1);
				user = UserHelper.CreateUser(context);
				PermissionHelper.CreateSitePermission(context, user, site1);
				PermissionHelper.CreateSitePermission(context, user, site2);
				PermissionHelper.CreateOrganizationPermission(context, user, organization);
			}

			var client = _factory.CreateClient();

			var request = HedwigAPIRequests.OrganizationReports(
				user,
				organization
			);

			var response = await client.SendAsync(request);
			response.EnsureSuccessStatusCode();

			var responseString = await response.Content.ReadAsStringAsync();
			var responseReports = JsonConvert.DeserializeObject<List<CdcReport>>(responseString);
			Assert.NotEmpty(responseReports);

			var responseReport = responseReports.First();
			Assert.NotNull(responseReport);
			Assert.Equal(report.Id, responseReport.Id);
			Assert.Null(responseReport.Organization);
			Assert.NotNull(responseReport.ReportingPeriod);
			Assert.Null(responseReport.Enrollments);
		}

		[Fact]
		public async Task ReportControllerOrganizationsReportGet_ReturnsCorrectResponseShape()
		{
			User user;
			Organization organization;
			Site[] sites;
			Report report;
			using (var context = new TestHedwigContextProvider().Context)
			{
				organization = OrganizationHelper.CreateOrganization(context);
				var site1 = SiteHelper.CreateSite(context, organization: organization);
				var site2 = SiteHelper.CreateSite(context, organization: organization);
				report = ReportHelper.CreateCdcReport(context, organization: organization);
				sites = new Site[] { site1, site2 };
				EnrollmentHelper.CreateEnrollment(context, site: site1);
				user = UserHelper.CreateUser(context);
				PermissionHelper.CreateSitePermission(context, user, site1);
				PermissionHelper.CreateSitePermission(context, user, site2);
				PermissionHelper.CreateOrganizationPermission(context, user, organization);
			}

			var client = _factory.CreateClient();

			var request = HedwigAPIRequests.OrganizationReport(
				user,
				organization,
				report
			);

			var response = await client.SendAsync(request);
			response.EnsureSuccessStatusCode();

			var responseString = await response.Content.ReadAsStringAsync();
			var responseReport = JsonConvert.DeserializeObject<CdcReport>(responseString);

			Assert.NotNull(responseReport);
			Assert.Equal(report.Id, responseReport.Id);
			Assert.NotNull(responseReport.Organization);
			Assert.All(
				responseReport.Organization.Sites,
				site =>
				{
					Assert.NotNull(site.Name);
					Assert.Null(site.Organization);
					Assert.Null(site.Enrollments);
				}
			);
			Assert.NotNull(responseReport.Organization.FundingSpaces);
			Assert.All(
				responseReport.Organization.FundingSpaces,
				fundingSpace =>
				{
					Assert.NotNull(fundingSpace);
					Assert.Equal(fundingSpace.Time == FundingTime.Split, fundingSpace.TimeSplit != null);
				}
			);
			Assert.NotNull(responseReport.ReportingPeriod);
			Assert.NotNull(responseReport.Enrollments);
			Assert.All(
				responseReport.Enrollments,
				enrollment =>
				{
					Assert.NotNull(enrollment.Child);
					Assert.Null(enrollment.Child.Family);
					Assert.Null(enrollment.Child.Enrollments);
					Assert.Null(enrollment.Child.Organization);
					Assert.Null(enrollment.Site);
					Assert.All(
						enrollment.Fundings,
						funding =>
						{
							Assert.NotNull(funding.FundingSpace);
							Assert.Equal(funding.FundingSpace.Time == FundingTime.Split, funding.FundingSpace.TimeSplit != null);
							Assert.NotNull(funding.Source);
							Assert.NotNull(funding.FirstReportingPeriod);
							Assert.NotNull(funding.LastReportingPeriod);
						}
					);
					Assert.Null(enrollment.PastEnrollments);
				}
			);
		}

		[Theory]
		[InlineData(3, true)]
		[InlineData(10, false)]
		public async Task ReportControllerOrganizationsReportPut_IsSuccessfull_OrReturnsValidationError(
			int partTimeWeeksUsed,
			bool shouldSucceed
		)
		{
			User user;
			Organization organization;
			FundingSpace fundingSpace;
			Site site;
			CdcReport report;
			using (var context = new TestHedwigContextProvider().Context)
			{
				organization = OrganizationHelper.CreateOrganization(context);
				var reportingPeriod = ReportingPeriodHelper.CreateReportingPeriod(context, period: "2010-01-01", periodStart: "2010-01-01", periodEnd: "2010-01-31");
				fundingSpace = FundingSpaceHelper.CreateFundingSpace(context, organization.Id, time: FundingTime.Split);
				site = SiteHelper.CreateSite(context, organization: organization);
				report = ReportHelper.CreateCdcReport(context, organization: organization, reportingPeriod: reportingPeriod) as CdcReport;
				EnrollmentHelper.CreateEnrollment(context, site: site);
				user = UserHelper.CreateUser(context);
				PermissionHelper.CreateSitePermission(context, user, site);
				PermissionHelper.CreateOrganizationPermission(context, user, organization);
			}

			var timeSplitUtilization = new FundingTimeSplitUtilization
			{
				ReportId = report.Id,
				ReportingPeriodId = report.ReportingPeriodId,
				FundingSpaceId = fundingSpace.Id,
				PartTimeWeeksUsed = partTimeWeeksUsed,
				FullTimeWeeksUsed = 0,
			};
			typeof(FundingTimeSplitUtilization).GetProperty(nameof(FundingTimeSplitUtilization.ReportingPeriod)).SetValue(timeSplitUtilization, report.ReportingPeriod);
			var reportForPut = new CdcReport
			{
				Id = report.Id,
				Accredited = report.Accredited,
				Comment = report.Comment,
				Enrollments = report.Enrollments,
				C4KRevenue = 0,
				FamilyFeesRevenue = 0,
				OrganizationId = report.OrganizationId,
				ReportingPeriodId = report.ReportingPeriodId,
				TimeSplitUtilizations = new List<FundingTimeSplitUtilization> {
					timeSplitUtilization
				},
			};
			typeof(Report).GetProperty(nameof(Report.ReportingPeriod)).SetValue(reportForPut, report.ReportingPeriod);

			var request = HedwigAPIRequests.OrganizationReportPut(
				user,
				organization,
				reportForPut
			);

			var client = _factory.CreateClient();
			var response = await client.SendAsync(request);

			if (shouldSucceed)
			{
				response.EnsureSuccessStatusCode();
			}
			else
			{
				Assert.False(response.IsSuccessStatusCode);
			}
		}
	}
}
