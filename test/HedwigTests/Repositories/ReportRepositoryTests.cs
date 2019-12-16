using System.Linq;
using System.Threading.Tasks;
using System;
using Xunit;
using Hedwig.Repositories;
using Hedwig.Models;
using HedwigTests.Helpers;
using HedwigTests.Fixtures;
using System.Threading;

namespace HedwigTests.Repositories
{
  public class ReportRepositoryTests
  {
    [Theory]
    [InlineData(false, new string[] { })]
    [InlineData(false, new string[] { "organizations" })]
    [InlineData(false, new string[] { "organizations", "sites", "funding_spaces" })]
    [InlineData(false, new string[] { "organizations", "sites", "funding_spaces", "enrollments" })]
    [InlineData(true, new string[] { "organizations", "sites", "funding_spaces", "enrollments" })]
    public async Task Get_Report_For_Organization(bool submitted, string[] include)
    {
      using (var context = new TestContextProvider().Context)
      {
        // Set up test data
        var organization = OrganizationHelper.CreateOrganization(context);
        var report = ReportHelper.CreateCdcReport(context, organization: organization);
        var site = SiteHelper.CreateSite(context, organization: organization);
        var enrollment = EnrollmentHelper.CreateEnrollment(context, site: site, ageGroup: Age.Preschool);
        var funding = FundingHelper.CreateFunding(context, enrollment: enrollment, time: FundingTime.Full);

        if (submitted)
        {
          Thread.Sleep(1000);

          report.SubmittedAt = DateTime.Now;
          context.SaveChanges();

          Thread.Sleep(1000);
        }

        enrollment.AgeGroup = Age.SchoolAge;
        funding.Time = FundingTime.Part;
        context.SaveChanges();

        // When the repository is queried
        var repo = new ReportRepository(context);
        var result = await repo.GetReportForOrganizationAsync(report.Id, organization.Id, include) as CdcReport;

        // It returns the Report
        Assert.Equal(result.Id, report.Id);

        // It includes the Organization
        Assert.Equal(include.Contains("organizations"), result.Organization != null);

        // It includes the Sites
        Assert.Equal(include.Contains("sites"), result.Organization != null && result.Organization.Sites != null);

        // It includes the Enrollments (and Fundings too)
        Assert.Equal(
          include.Contains("enrollments"),
          result.Organization != null &&
            result.Organization.Sites != null &&
            result.Organization.Sites.FirstOrDefault().Enrollments != null &&
            result.Organization.Sites.FirstOrDefault().Enrollments.FirstOrDefault().Fundings != null
        );

        // When it includes enrollments
        if (include.Contains("enrollments"))
        {
          var enrollmentResult = result.Organization.Sites.FirstOrDefault().Enrollments.FirstOrDefault();
          var fundingResult = enrollmentResult.Fundings.FirstOrDefault();

          // A submitted report should return the data as of when it was submitted
          Assert.Equal(submitted ? Age.Preschool : Age.SchoolAge, enrollmentResult.AgeGroup);
          Assert.Equal(submitted ? FundingTime.Full : FundingTime.Part, fundingResult.Time);
        }
      }
    }

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
    [Fact]
    public async Task GetReportsForOrganization()
    {
      using (var context = new TestContextProvider().Context)
      {
        var organization = OrganizationHelper.CreateOrganization(context);
        var reports = ReportHelper.CreateCdcReports(context, 5, organization: organization);
        ReportHelper.CreateCdcReport(context);

        var reportRepo = new ReportRepository(context);
        var result = await reportRepo.GetReportsForOrganizationAsync(organization.Id);

        Assert.Equal(reports, result);
      }
    }
  }
}
