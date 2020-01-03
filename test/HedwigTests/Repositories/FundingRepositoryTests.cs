using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Hedwig.Repositories;
using HedwigTests.Helpers;
using HedwigTests.Fixtures;
using Hedwig.Models;

namespace HedwigTests.Repositories
{
	public class FundingRepositoryTests
	{
		[Fact]
		public void GetFirstFundingByEnrollmentId_WithZeroFundings()
		{
			using (var context = new TestContextProvider().Context)
			{
				var enrollment = EnrollmentHelper.CreateEnrollment(context);
				var reportingPeriod = ReportingPeriodHelper.CreateReportingPeriod(
					context, periodStart: "2020-01-01", periodEnd: "2020-01-31"
				);

				var fundingRepo = new FundingRepository(context);

				var res = fundingRepo.GetFirstFundingByEnrollmentId(enrollment.Id);

				Assert.Null(res);
			}
		}

		[Fact]
		public void GetFirstFundingByEnrollmentId_WithOneFunding()
		{
			using (var context = new TestContextProvider().Context)
			{
				var enrollment = EnrollmentHelper.CreateEnrollment(context);
				var reportingPeriod = ReportingPeriodHelper.CreateReportingPeriod(
					context, periodStart: "2020-01-01", periodEnd: "2020-01-31"
				);
				var funding = FundingHelper.CreateFunding(
					context: context, enrollment: enrollment, firstReportingPeriod: reportingPeriod
				);

				var fundingRepo = new FundingRepository(context);

				var res = fundingRepo.GetFirstFundingByEnrollmentId(enrollment.Id);

				Assert.Equal(funding, res);
			}
		}

		[Fact]
		public void GetFirstFundingByEnrollmentId_WithTwoFundings()
		{
			using (var context = new TestContextProvider().Context)
			{
				// if
				var enrollment = EnrollmentHelper.CreateEnrollment(context);
				var reportingPeriod1 = ReportingPeriodHelper.CreateReportingPeriod(
					context, periodStart: "2020-01-01", periodEnd: "2020-01-31"
				);
				var reportingPeriod2 = ReportingPeriodHelper.CreateReportingPeriod(
					context, periodStart: "2020-02-01", periodEnd: "2020-02-29"
				);
				var funding1 = FundingHelper.CreateFunding(
					context: context, enrollment: enrollment, firstReportingPeriod: reportingPeriod1
				);
				var funding2 = FundingHelper.CreateFunding(
					context: context, enrollment: enrollment, firstReportingPeriod: reportingPeriod2
				);

				// when
				var fundingRepo = new FundingRepository(context);

				var res = fundingRepo.GetFirstFundingByEnrollmentId(enrollment.Id);

				// then
				Assert.Equal(funding1, res);
			}
		}

		[Fact]
		public void GetFirstFundingByEnrollmentId_WithNullFirstReportingPeriod()
		{
			using (var context = new TestContextProvider().Context)
			{
				var enrollment = EnrollmentHelper.CreateEnrollment(context);
				var funding = FundingHelper.CreateFunding(
					context: context, enrollment: enrollment, firstReportingPeriod: null
				);

				var fundingRepo = new FundingRepository(context);

				var res = fundingRepo.GetFirstFundingByEnrollmentId(enrollment.Id);

				Assert.Equal(funding, res);
			}
		}
	}
}