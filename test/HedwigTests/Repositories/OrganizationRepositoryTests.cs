using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Hedwig.Repositories;
using HedwigTests.Helpers;
using HedwigTests.Fixtures;

namespace HedwigTests.Repositories
{
	public class OrganizationRepositoryTests
	{
		[Fact]
		public async Task Get_Organizations_By_Id()
		{
			using (var context = new TestContextProvider().Context)
			{
				// Given
				var org1 = OrganizationHelper.CreateOrganization(context);
				var org2 = OrganizationHelper.CreateOrganization(context);
				var otherOrg = OrganizationHelper.CreateOrganization(context);

				// When the repository is queried with a set of ids
				var orgRepo = new OrganizationRepository(context);
				var result = await orgRepo.GetOrganizationsByIdsAsync(new int[] { org1.Id, org2.Id });

				// Then a list of organizations is returned
				var ids = (from x in result select x.Value.Id).ToArray();
				Assert.Contains(org1.Id, ids);
				Assert.Contains(org2.Id, ids);
				Assert.DoesNotContain(otherOrg.Id, ids);
			}
		}
	}
}
