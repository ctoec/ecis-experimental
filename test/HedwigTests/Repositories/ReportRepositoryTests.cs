using System.Linq;
using System.Threading.Tasks;
using System;
using Xunit;
using Hedwig.Repositories;
using Hedwig.Models;
using HedwigTests.Helpers;
using HedwigTests.Fixtures;

namespace HedwigTests.Repositories
{
  public class ReportRepositoryTests
  {
    [Fact]
    public async Task Get_Reports_For_User_With_Organization_Permission()
    {
      using (var context = new TestContextProvider().Context)
      {
        // If organization permissions exist with user Ids, and each has an associated report
        var user = UserHelper.CreateUser(context);
        var orgPermission1 = PermissionHelper.CreateOrganizationPermission(context, user: user);
        var orgPermission2 = PermissionHelper.CreateOrganizationPermission(context, user: user);
        var report1 = ReportHelper.CreateCdcReport(context, organization: orgPermission1.Organization);
        var report2 = ReportHelper.CreateCdcReport(context, organization: orgPermission2.Organization);

        var otherUser = UserHelper.CreateUser(context);
        var otherOrganizationPermission = PermissionHelper.CreateOrganizationPermission(context, user: otherUser);
        var otherReport = ReportHelper.CreateCdcReport(context, organization: otherOrganizationPermission.Organization);

        // When the report repository is queried with a user id
        var reportRepo = new ReportRepository(context);
        var result = await reportRepo.GetReportsByUserIdAsync(user.Id);

        // Then a list of reports for which that user has permission is returned
        var reportIds = (from x in result select x.Id).ToArray();
        Assert.Contains(report1.Id, reportIds);
        Assert.Contains(report2.Id, reportIds);
        Assert.DoesNotContain(otherReport.Id, reportIds);
      }
    }

    [Theory]
    [InlineData("organizations")]
    [InlineData("organizations", "sites", "funding_spaces")]
    public async Task Get_Report_For_Organization(params string[] include)
    {
      using (var context = new TestContextProvider().Context)
      {
        // Set up test data
        var organization = OrganizationHelper.CreateOrganization(context);
        var report = ReportHelper.CreateCdcReport(context, organization: organization);
        var site = SiteHelper.CreateSite(context, organization: organization);

        // When the repository is queried
        var repo = new ReportRepository(context);
        var result = await repo.GetReportForOrganizationAsync(report.Id, organization.Id, include) as CdcReport;

        // It returns the Report
        Assert.Equal(result.Id, report.Id);

        // When we include the Organization
        if (include.Contains("organizations"))
        {
          // It is loaded
          Assert.True(context.Entry(result).Reference(report => report.Organization).IsLoaded);
        }

        var sitesIsLoaded = context.Entry(result)
          .Reference(report => report.Organization)
          .TargetEntry
          .Collection(organization => organization.Sites)
          .IsLoaded;

        // Site is loaded when we include it
        Assert.Equal(include.Contains("sites"), sitesIsLoaded);
      }
    }
  }
}
