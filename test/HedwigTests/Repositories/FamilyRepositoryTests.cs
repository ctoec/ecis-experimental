using System.Threading.Tasks;
using System.Linq;
using System;
using Xunit;
using Hedwig.Repositories;
using HedwigTests.Helpers;

namespace HedwigTests.Repositories
{
    [Collection("SqlServer")]
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
                // If a family exists without a case number
                var families = FamilyHelper.CreateFamilies(context, 1);
                var asOf = Utilities.GetAsOfWithSleep();

                // And later case number is updated to caseNumber
                int caseNumber = 123456;
                families[0].CaseNumber = caseNumber;
                context.SaveChanges();

                // When the repository is queried for the family:
                var familyRepo = new FamilyRepository(context);
                var ids = new int[] {families[0].Id};

                // - Without an asOf timestamp
                var resCurrent = await familyRepo.GetFamiliesByIdsAsync(ids);
                // - Then the family including the updated caseNumber is returned
                Assert.Equal(caseNumber, resCurrent.First().Value.CaseNumber);

                // - With an asOf timestamp that predates the update
                var resAsOf = await familyRepo.GetFamiliesByIdsAsync(ids, asOf);
                // - Then the family without the caseNumber is returned
                Assert.False(resAsOf.First().Value.CaseNumber.HasValue);
            }
        }
    }
}