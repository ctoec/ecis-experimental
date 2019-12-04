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

    [Theory(Skip = "Turns out this approach to temporal tables doesn't work")]
    [InlineData(false, new string[] { })]
    [InlineData(false, new string[] { "organizations" })]
    [InlineData(false, new string[] { "fundings", "funding_spaces" })]
    // Tests that the query still runs even if no temporal tables are included
    [InlineData(true, new string[] { "organizations", "sites", "funding_spaces" })]
    [InlineData(true, new string[] { "enrollments" })]
    [InlineData(true, new string[] { "fundings" })]
    public async Task Get_Report_For_Organization(
      bool submitted,
      string[] include
    )
    {
      using (var context = new TestContextProvider().Context)
      {
        // Set up test data
        var organization = OrganizationHelper.CreateOrganization(context);
        var report = ReportHelper.CreateCdcReport(context, organization: organization);
        var site = SiteHelper.CreateSite(context, organization: organization);
        var enrollment = EnrollmentHelper.CreateEnrollment(context, site: site, age: Age.Preschool);
        var funding = FundingHelper.CreateFunding(context, enrollment: enrollment, time: FundingTime.Full);

        if (submitted)
        {
          report.SubmittedAt = DateTime.Now;
          context.SaveChanges();
          enrollment.Age = Age.School;
          funding.Time = FundingTime.Part;
          context.SaveChanges();
        }

        // When the repository is queried
        var repo = new ReportRepository(context);
        var result = await repo.GetReportForOrganizationAsync(report.Id, organization.Id, include) as CdcReport;

        // It returns the Report
        Assert.Equal(result.Id, report.Id);

        // When we include the Organization
        if (include.Contains("organizations"))
        {
          // It is not null
          Assert.True(result.Organization != null);
        }

        // When we include the Site
        if (include.Contains("sites"))
        {
          // It is not null
          Assert.True(result.Organization.Sites.FirstOrDefault() != null);
        }

        Enrollment enrollmentResult;

        // When we include the Enrollment
        if (include.Contains("enrollments"))
        {
          enrollmentResult = result.Organization.Sites.FirstOrDefault().Enrollments.FirstOrDefault();
          // It is not null
          Assert.True(enrollmentResult != null);

          // And if the report was submitted and then subsequently changed
          if (submitted)
          {
            // It uses the Enrollment as of the time the report was submitted
            Assert.Equal(Age.Preschool, enrollmentResult.Age);
          }
        }

        Funding fundingResult;

        // When we include the Funding
        if (include.Contains("fundings"))
        {
          fundingResult = result.Organization.Sites.FirstOrDefault().Enrollments.FirstOrDefault().Fundings.FirstOrDefault();
          // It is not null
          Assert.True(fundingResult != null);

          // And if the report was submitted and then subsequently changed
          if (submitted)
          {
            // It uses the Funding as of the time the report was submitted
            Assert.Equal(FundingTime.Full, fundingResult.Time);
          }
        }
      }
    }
  }
}
