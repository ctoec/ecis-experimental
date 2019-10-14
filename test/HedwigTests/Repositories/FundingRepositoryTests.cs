using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Hedwig.Repositories;
using HedwigTests.Helpers;
using HedwigTests.Fixtures;

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
	}
}