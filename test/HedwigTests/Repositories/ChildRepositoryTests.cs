using System.Linq;
using System.Threading.Tasks;
using System;
using Microsoft.EntityFrameworkCore;
using Xunit;
using Hedwig.Repositories;
using HedwigTests.Helpers;
using HedwigTests.Fixtures;
using Hedwig.Models;

namespace HedwigTests.Repositories
{
	public class ChildRepositoryTests
	{
		[Theory]
		[InlineData(new string[]{}, false, false)]
		[InlineData(new string[]{"family"}, true, false)]
		[InlineData(new string[]{"determinations"}, false, false)]
		[InlineData(new string[]{"family", "determinations"}, true, true)]

		public async Task GetChildrenForOrganization(
			string[] include,
			bool includeFamily,
			bool includeDeterminations
		)
		{
			Guid[] ids;
			int organizationId;
			using (var context = new TestContextProvider().Context)
			{
				var organization = OrganizationHelper.CreateOrganization(context);
				var children = ChildHelper.CreateChildren(context, 3, organization: organization);
				ids = children.Select(c => c.Id).ToArray();
				organizationId = organization.Id;
			}

			using (var context = new TestContextProvider().Context)
			{
				var childRepo = new ChildRepository(context);
				var res = await childRepo.GetChildrenForOrganizationAsync(organizationId, include);

				Assert.Equal(ids.OrderBy(id => id), res.Select(c => c.Id).OrderBy(id => id));
				Assert.Equal(includeFamily, res.TrueForAll(c => c.Family != null));
				Assert.Equal(includeDeterminations, res.TrueForAll(c => c.Family != null && c.Family.Determinations != null));
			}
		}

		[Theory]
		[InlineData(new string[]{}, false, false)]
		[InlineData(new string[]{"family"}, true, false)]
		[InlineData(new string[]{"determinations"}, false, false)]
		[InlineData(new string[]{"family", "determinations"}, true, true)]
		public async Task GetChildForOrganization(
			string[] include,
			bool includeFamily,
			bool includeDeterminations
		)
		{
			Child child;
			using (var context = new TestContextProvider().Context)
			{
				child = ChildHelper.CreateChild(context);
			}
			using (var context = new TestContextProvider().Context)
			{	
				var childRepo = new ChildRepository(context);
				var res = await childRepo.GetChildForOrganizationAsync(child.Id, child.OrganizationId.Value, include);

				Assert.Equal(child.Id, res.Id);
				Assert.Equal(includeFamily, res.Family != null);
				Assert.Equal(includeDeterminations, res.Family != null && res.Family.Determinations != null);
			}
		}

		[Fact]
		public void AddChild()
		{
			using (var context = new TestContextProvider().Context)
			{
				var child = new Child();

				var childRepo = new ChildRepository(context);
				childRepo.AddChild(child);

				Assert.Equal(EntityState.Added, context.Entry(child).State);
			}
		}

		[Fact]
		public void UpdateChild()
		{
			using (var context = new TestContextProvider().Context)
			{
				var child = new Child();

				var childRepo = new ChildRepository(context);
				childRepo.UpdateChild(child);

				Assert.Equal(EntityState.Modified, context.Entry(child).State);
			}
		}
		[Fact]
		public async Task Get_Children_By_Ids()
		{
			using (var context = new TestContextProvider().Context)
			{
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
			using (var context = new TestContextProvider().Context)
			{
				// If a child exists
				string originalName = "First";
				var child = ChildHelper.CreateChild(context, firstName: originalName);
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
				Assert.Equal(originalName, resAsOf.FirstName);
			}
		}

		[Fact]
		public async Task Get_Children_By_Family_Id()
		{
			using (var context = new TestContextProvider().Context)
			{
				// If 5 children exist
				var children = ChildHelper.CreateChildren(context, 5);
				var families = FamilyHelper.CreateFamilies(context, 4);
				for (int i = 0; i < 4; ++i)
				{
					children[i].Family = families[i];
				}
				children[4].Family = families[3];
				context.SaveChanges();

				// When the repository is queried for a subset of family Ids
				var childRepo = new ChildRepository(context);
				var ids = (from f in families.GetRange(1, 3) select f.Id).OrderBy(id => id).ToList();

				var res = await childRepo.GetChildrenByFamilyIdsAsync(ids);

				// Then only children with those family ideas are returned
				Assert.Equal(new int?[] { children[1].FamilyId }, (from c in res[ids[0]] select c.FamilyId).ToArray());
				Assert.Equal(new int?[] { children[2].FamilyId }, (from c in res[ids[1]] select c.FamilyId).ToArray());
				Assert.Equal(new int?[] { children[3].FamilyId, children[4].FamilyId }, (from c in res[ids[2]] select c.FamilyId).ToArray());

				// And no other site Ids are returned
				Assert.False(res.Contains(families[0].Id));
			}
		}
	}
}
