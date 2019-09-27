using System.Threading.Tasks;
using System.Linq;
using Xunit;
using Hedwig.Repositories;
using HedwigTests.Helpers;

namespace HedwigTests.Repositories
{
    public class FamilyRepositoryTests
    {
        [Fact]
        public async Task Get_Families_By_Ids()
        {
            using (var context = new TestContextProvider().Context){
                // If 5 families with auto-incrementing Ids exist
                var families = FamilyHelper.CreateFamilies(context, 5);

                // When the repository is queried for a subset of Ids
                var familyRepo = new FamilyRepository(context);
                var ids = from f in families.GetRange(1, 3)
                            select f.Id;

                var res = await familyRepo.GetFamiliesByIdsAsync(ids);

                // Then families with those Ids are returned
                Assert.Equal(ids.OrderBy(id => id), res.Keys.OrderBy(id => id));
            }
        }
    }
}