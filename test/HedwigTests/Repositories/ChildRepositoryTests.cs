using System.Linq;
using System.Threading.Tasks;
using System;
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
		[InlineData(true, true)]

		public async Task GetChildrenForOrganization(
			bool includeFamily,
			bool includeDeterminations
		)
		{
			Guid[] ids;
			int organizationId;
			using (var context = new TestHedwigContextProvider().Context)
			{
				var organization = OrganizationHelper.CreateOrganization(context);
				var children = ChildHelper.CreateChildren(context, 3, organization: organization);
				ids = children.Select(c => c.Id).ToArray();
				organizationId = organization.Id;
			}

			using (var context = new TestHedwigContextProvider().Context)
			{
				var childRepo = new ChildRepository(context);
				var res = await childRepo.GetChildrenForOrganizationAsync(organizationId);

				Assert.Equal(ids.OrderBy(id => id), res.Select(c => c.Id).OrderBy(id => id));
				Assert.Equal(includeFamily, res.TrueForAll(c => c.Family != null));
				Assert.Equal(includeDeterminations, res.TrueForAll(c => c.Family != null && c.Family.Determinations != null));
			}
		}

		[Theory]
		[InlineData(true, true)]
		public async Task GetChildForOrganization(
			bool includeFamily,
			bool includeDeterminations
		)
		{
			Child child;
			using (var context = new TestHedwigContextProvider().Context)
			{
				child = ChildHelper.CreateChild(context);
			}
			using (var context = new TestHedwigContextProvider().Context)
			{
				var childRepo = new ChildRepository(context);
				var res = await childRepo.GetChildForOrganizationAsync(child.Id, child.OrganizationId);

				Assert.Equal(child.Id, res.Id);
				Assert.Equal(includeFamily, res.Family != null);
				Assert.Equal(includeDeterminations, res.Family != null && res.Family.Determinations != null);
			}
		}

		[Fact]
		public void GetChildById_ReturnsChild()
		{
			using (var context = new TestHedwigContextProvider().Context)
			{
				// If a child exists
				string name = "First";
				var child = ChildHelper.CreateChild(context, name);

				// When the repository is queried for the child:
				var childRepo = new ChildRepository(context);
				var res = childRepo.GetChildById(child.Id);

				// Then
				Assert.Equal(name, res.FirstName);
			}
		}
	}
}
