using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Hedwig.Repositories;
using HedwigTests.Helpers;

namespace HedwigTests.Repositories
{
	public class FamilyDeterminationRepositoryTests
	{
		[Fact]
		public async Task Get_Determinations_By_Family_Id()
		{
			using (var context = new TestContextProvider().Context) {
				// If family determinations exist with family Ids
				var family1 = FamilyHelper.CreateFamily(context);
				var determinationFamily1 = FamilyDeterminationHelper.CreateDeterminationWithFamilyId(context, family1.Id);
				var family2 = FamilyHelper.CreateFamily(context);
				var determination1Family2 = FamilyDeterminationHelper.CreateDeterminationWithFamilyId(context, family2.Id);
				var determination2Family2 = FamilyDeterminationHelper.CreateDeterminationWithFamilyId(context, family2.Id);
				
				// When the repository is queried with a family Id
				var determinationRepo = new FamilyDeterminationRepository(context);
				var res = await determinationRepo.GetDeterminationsByFamilyIdsAsync(new int[] { family2.Id });

				// Then a list of enrollments with that family Id is returned
				var enrollmentIds = (from d in res[family2.Id]
								select d.Id).OrderBy(id => id);
				Assert.Equal(new int[]{ determination1Family2.Id, determination2Family2.Id }, enrollmentIds);

				// And no other site Ids are returned
				Assert.False(res.Contains(family1.Id));
			}	
		}
	}
}
