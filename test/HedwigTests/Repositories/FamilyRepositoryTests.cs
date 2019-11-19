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

        [Fact]
        public async Task Get_Families_By_Ids_As_Of()
        {
            using(var context = new TestContextProvider().Context) {
                // If a family exists without an addressLine1
                var families = FamilyHelper.CreateFamilies(context, 1);
                var asOf = Utilities.GetAsOfWithSleep();

                // And later addressLine1 is updated to address
                string address = "My address";
                families[0].AddressLine1 = address;
                context.SaveChanges();

                // When the repository is queried for the family:
                var familyRepo = new FamilyRepository(context);
                var ids = new int[] {families[0].Id};

                // - Without an asOf timestamp
                var resCurrent = await familyRepo.GetFamiliesByIdsAsync(ids);
                // - Then the family including the updated caseNumber is returned
                Assert.Equal(address, resCurrent.First().Value.AddressLine1);

                // - With an asOf timestamp that predates the update
                var resAsOf = await familyRepo.GetFamiliesByIdsAsync(ids, asOf);
                // - Then the family without the caseNumber is returned
                Assert.Null(resAsOf.First().Value.AddressLine1);
            }
        }

        [Fact]
        public async Task Get_Family_By_Id()
        {
            using (var context = new TestContextProvider().Context) {
                var family = FamilyHelper.CreateFamily(context);

                var familyRepo = new FamilyRepository(context);
                var res = await familyRepo.GetFamilyByIdAsync(family.Id);

                Assert.Equal(family.Id, res.Id);
            }
        }
    }
}