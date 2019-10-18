using System.Linq;
using System.Threading.Tasks;
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

		[Fact]
		public async Task Update_Report()
		{
			// If a report exists in the DB
			CdcReport report = null;
			using (var context = new TestContextProvider(retainObjects: true).Context)
			{
				report = ReportHelper.CreateCdcReport(context);
			}
			using (var context = new TestContextProvider().Context) {
				var update = ReportHelper.CreateCdcReportObject(
					context,
					report.ReportingPeriod,
					report.Organization,
					submittedAt: "2019-01-01 10:00:00"
				);
				// When the report repository updates the existing report with the report input
				var reportRepo = new ReportRepository(context);
				var updated = await reportRepo.UpdateReport(update);

				// Then the updated report is returned
				Assert.Equal(update.SubmittedAt, updated.SubmittedAt);
			}
		}
	}
}
