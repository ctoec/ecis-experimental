using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Hedwig.Repositories;
using HedwigTests.Helpers;
using HedwigTests.Fixtures;
using System;

namespace HedwigTests.Repositories
{
  public class FamilyDeterminationRepositoryTests
  {
	[Fact]
	public void GetDeterminationByFamilyId_ReturnsDeterminationsWithFamilyId()
	{
	  using (var context = new TestHedwigContextProvider().Context)
	  {
		// If family determinations exist with family Id
		var family = FamilyHelper.CreateFamily(context);
		var determination = FamilyDeterminationHelper.CreateDetermination(context, family: family);

		// When the repository is queried with a family Id
		var determinationRepo = new FamilyDeterminationRepository(context);
		var res = determinationRepo.GetDeterminationsByFamilyId(family.Id);

		// Then a list of enrollments with that family Id is returned
		Assert.Single(res);
		Assert.Equal(determination, res.First());
	  }
	}
  }
}
