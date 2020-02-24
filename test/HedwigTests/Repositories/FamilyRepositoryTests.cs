using System.Threading.Tasks;
using System.Linq;
using Xunit;
using Hedwig.Repositories;
using HedwigTests.Helpers;
using HedwigTests.Fixtures;

namespace HedwigTests.Repositories
{
  public class FamilyRepositoryTests
  {
	[Fact]
	public void GetFamilyById_ReturnsFamilyWithId()
	{
	  using (var context = new TestHedwigContextProvider().Context)
	  {
		var family = FamilyHelper.CreateFamily(context);

		var familyRepo = new FamilyRepository(context);
		var res = familyRepo.GetFamilyById(family.Id);

		Assert.Equal(family.Id, res.Id);
	  }
	}
  }
}
