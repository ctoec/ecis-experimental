using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
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
		[Theory]
		[InlineData(false)]
		[InlineData(true)]
		public async Task Get_Report_For_Organization(bool submitted)
		{
			using (var context = new TestHedwigContextProvider().Context)
			{
				// Set up test data
				var organization = OrganizationHelper.CreateOrganization(context);
				var reportingPeriod = ReportingPeriodHelper.CreateReportingPeriod(context);
				var report = ReportHelper.CreateCdcReport(context, organization: organization, reportingPeriod: reportingPeriod);
				var site = SiteHelper.CreateSite(context, organization: organization);
				var enrollment = EnrollmentHelper.CreateEnrollment(context, site: site, ageGroup: Age.Preschool);
				var funding = FundingHelper.CreateFunding(context, enrollment: enrollment, firstReportingPeriod: reportingPeriod);

				if (submitted)
				{
					Thread.Sleep(1000);

					report.SubmittedAt = DateTime.Now;
					context.SaveChanges();

					Thread.Sleep(1000);
				}

				enrollment.AgeGroup = Age.SchoolAge;
				context.SaveChanges();

				// When the repository is queried
				var repo = new ReportRepository(context);
				var result = await repo.GetReportForOrganizationAsync(report.Id, organization.Id) as CdcReport;

				// It returns the Report
				Assert.Equal(result.Id, report.Id);

				// It includes the Organization
				Assert.True(result.Organization != null);

				// It includes the Sites
				Assert.True(result.Organization != null && result.Organization.Sites != null);

				// It includes the Enrollments (and Fundings too)
				Assert.True(
					result.Enrollments != null &&
					result.Enrollments.FirstOrDefault().Fundings != null
				);

				var enrollmentResult = result.Enrollments.FirstOrDefault();
				var fundingResult = enrollmentResult.Fundings.FirstOrDefault();

				// A submitted report should return the data as of when it was submitted
				Assert.Equal(submitted ? Age.Preschool : Age.SchoolAge, enrollmentResult.AgeGroup);

			}
		}

		[Fact]
		public void GetReportsForOrganization()
		{
			using (var context = new TestHedwigContextProvider().Context)
			{
				var organization = OrganizationHelper.CreateOrganization(context);
				var reports = ReportHelper.CreateCdcReports(context, 5, organization: organization);
				var reportIds = reports.Select(report => report.Id);
				ReportHelper.CreateCdcReport(context);

				var reportRepo = new ReportRepository(context);
				var result = reportRepo.GetReportsForOrganization(organization.Id);
				var resultIds = result.Select(r => r.Id);
				Assert.Equal(reportIds, resultIds);
			}
		}

		[Theory]
		[InlineData(2010, 1, 1, 2)]
		[InlineData(2010, 6, 1, 2)]
		[InlineData(2010, 7, 1, 2)]
		[InlineData(2009, 7, 1, 2)]
		[InlineData(2009, 6, 1, 0)]
		[InlineData(2011, 1, 1, 2)]
		[InlineData(2011, 9, 1, 1)]
		[InlineData(2012, 6, 1, 1)]
		[InlineData(2012, 9, 1, 0)]
		public void GetReportsForFiscalYear(
			int year,
			int month,
			int day,
			int total
		)
		{
			var reportDate = new DateTime(year, month, day);
			Organization organization;
			using (var context = new TestHedwigContextProvider().Context)
			{
				var dates = new List<DateTime> {
					new DateTime(2010, 1, 1),
					new DateTime(2010, 5, 1),
					new DateTime(2010, 7, 1),
					new DateTime(2011, 2, 1),
					new DateTime(2011, 7, 1),
				};
				organization = OrganizationHelper.CreateOrganization(context);
				foreach (var date in dates)
				{
					var reportingPeriod = ReportingPeriodHelper.CreateReportingPeriod(context, period: date.ToString("yyyy-MM-dd"));
					ReportHelper.CreateCdcReport(context, organization: organization, reportingPeriod: reportingPeriod);
				}
			}

			using (var context = new TestHedwigContextProvider().Context)
			{
				var reportRepo = new ReportRepository(context);
				var result = reportRepo.GetReportsForOrganizationByFiscalYear(organization.Id, reportDate);

				Assert.Equal(total, result.Count());
			}
		}
	}
}
