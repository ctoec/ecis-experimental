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
		public async Task Get_Fundings_By_Enrollment_Ids()
		{
			using (var context = new TestContextProvider().Context)
			{
				// If fundings exist with enrollment Ids
				var enrollment1 = EnrollmentHelper.CreateEnrollment(context);
				var fundingEnrollment1 = FundingHelper.CreateFunding(context, enrollment: enrollment1);
				var enrollment2 = EnrollmentHelper.CreateEnrollment(context);
				var funding1Enrollment2 = FundingHelper.CreateFunding(context, enrollment: enrollment2);
				var funding2Enrollment2 = FundingHelper.CreateFunding(context, enrollment: enrollment2);

				// When the repository is queried with an enrollment Id
				var fundingRepo = new FundingRepository(context);
				var res = await fundingRepo.GetFundingsByEnrollmentIdsAsync(new int[] { enrollment2.Id });

				// Then a list of fundings with that enrollment Id is returned
				var fundingIds = (from f in res[enrollment2.Id]
													select f.Id).OrderBy(id => id);
				Assert.Equal(new int[] { funding1Enrollment2.Id, funding2Enrollment2.Id }, fundingIds);

				// And no other enrollment Ids are returned
				Assert.False(res.Contains(enrollment1.Id));
			}
		}

		[Fact]
		public async Task Get_Funding_By_Id()
		{
			using (var context = new TestContextProvider().Context) {
				var funding = FundingHelper.CreateFunding(context);

				var fundingRepo = new FundingRepository(context);
				var res = await fundingRepo.GetFundingByIdAsync(funding.Id);

				Assert.Equal(funding.Id, res.Id);
			}
		}

		[Fact]
		public void Create_Funding()
		{
			using (var context = new TestContextProvider().Context) {
				var enrollment = EnrollmentHelper.CreateEnrollment(context);
				var source = FundingSource.CDC;
				var time = FundingTime.Full;

				var fundingRepo = new FundingRepository(context);
				var funding = fundingRepo.CreateFunding(enrollment.Id, source, time);

				Assert.Equal(enrollment.Id, funding.EnrollmentId);
				Assert.Equal(source, funding.Source);
				Assert.Equal(time, funding.Time);
			}
		}

		[Fact]
		public void Update_Funding()
		{
			using (var context = new TestContextProvider().Context) {
				var funding = FundingHelper.CreateFunding(context);
				var time = FundingTime.Part;

				var fundingRepo = new FundingRepository(context);
				var res = fundingRepo.UpdateFunding(funding, time: time);

				Assert.Equal(res.Time, time);
			}
		}
	}
}