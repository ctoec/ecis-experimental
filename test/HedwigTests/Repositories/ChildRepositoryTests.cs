using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using Hedwig.Repositories;
using HedwigTests.Helpers;

namespace HedwigTests.Repositories
{
	[Collection("SqlServer")]
	public class ChildRepositoryTests
	{
		[Fact]
		public async Task Get_Children_By_Ids()
		{
			using (var context = new TestContextProvider().Context) {
				// If 5 children with auto-incrementing Ids exist
				var children = ChildHelper.CreateChildren(context, 5);

				// When the repository is queried for a subset of Ids
				var childRepo = new ChildRepository(context);
				var ids = from c in children.GetRange(1, 3)
							select c.Id;

				var res = await childRepo.GetChildrenByIdsAsync(ids);

				// Then children with those Ids are returned
				Assert.Equal(ids.OrderBy(id => id), res.Keys.OrderBy(id => id));
			}
		}

		[Fact]
		public async Task Get_Child_By_Id_As_Of()
		{
			using (var context = new TestContextProvider().Context) {
				// If a child exists
				var child = ChildHelper.CreateChild(context);
				var asOf = Utilities.GetAsOfWithSleep();	

				// And later first name is updated updatedName 
				string updatedName = "UPDATED";
				child.FirstName = updatedName;
				context.SaveChanges();

				// When the repository is queried for the child:
				var childRepo = new ChildRepository(context);

				// - Without an asOf timestamp
				var resCurrent = await childRepo.GetChildByIdAsync(child.Id);
				// - Then the child with the updated first name is returned
				Assert.Equal(updatedName, resCurrent.FirstName);
				
				// - With an asOf timestamp that predates the update
				var resAsOf = await childRepo.GetChildByIdAsync(child.Id, asOf);
				// - Then the child with the original name is returned
				Assert.Equal(ChildHelper.FIRST_NAME, resAsOf.FirstName);
			}
		}
	}
}
