using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Hedwig.Repositories;
using HedwigTests.Helpers;

namespace HedwigTests.Repositories
{
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
	}
}	
