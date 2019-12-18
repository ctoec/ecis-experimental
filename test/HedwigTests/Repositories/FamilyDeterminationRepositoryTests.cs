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
		public async Task Get_Determinations_By_Family_Id()
		{
			using (var context = new TestContextProvider().Context)
			{
				// If family determinations exist with family Ids
				var family1 = FamilyHelper.CreateFamily(context);
				var determinationFamily1 = FamilyDeterminationHelper.CreateDetermination(context, family: family1);
				var family2 = FamilyHelper.CreateFamily(context);
				var determination1Family2 = FamilyDeterminationHelper.CreateDetermination(context, family: family2);
				var determination2Family2 = FamilyDeterminationHelper.CreateDetermination(context, family: family2);

				// When the repository is queried with a family Id
				var determinationRepo = new FamilyDeterminationRepository(context);
				var res = await determinationRepo.GetDeterminationsByFamilyIdsAsync(new int[] { family2.Id });

				// Then a list of enrollments with that family Id is returned
				var enrollmentIds = (from d in res[family2.Id]
														 select d.Id).OrderBy(id => id);
				Assert.Equal(new int[] { determination1Family2.Id, determination2Family2.Id }, enrollmentIds);

				// And no other site Ids are returned
				Assert.False(res.Contains(family1.Id));
			}
		}

		[Fact]
		public async Task Get_Determination_By_Id()
		{
			using (var context = new TestContextProvider().Context) {
				var determination = FamilyDeterminationHelper.CreateDetermination(context);

				var determinationRepo = new FamilyDeterminationRepository(context);
				var res = await determinationRepo.GetDeterminationByIdAsync(determination.Id);

				Assert.Equal(determination.Id, res.Id);
			}
		}

		[Fact]
		public void Create_Family_Determination()
		{
			using(var context = new TestContextProvider().Context)
			{
				var numberOfPeople = 4;
				var income = 20000M;
				var determined = DateTime.Now;
				var family = FamilyHelper.CreateFamily(context);

				var determinationRepo = new FamilyDeterminationRepository(context);
				var determination = determinationRepo.CreateFamilyDetermination(
					numberOfPeople,
					income,
					determined,
					family.Id
				);

				Assert.Equal(numberOfPeople, determination.NumberOfPeople);
				Assert.Equal(income, determination.Income);
				Assert.Equal(determined, determination.DeterminationDate);
				Assert.Equal(family.Id, determination.FamilyId);
			}
		}
	}
}
