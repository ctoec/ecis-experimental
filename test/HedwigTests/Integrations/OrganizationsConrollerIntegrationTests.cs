using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hedwig.Models;
using HedwigTests.Fixtures;
using HedwigTests.Helpers;
using Newtonsoft.Json;
using Xunit;

namespace HedwigTests.Integrations
{
	public class OrganizationsControllerIntegrationTests : IClassFixture<TestStartupFactory>
	{
		private readonly TestStartupFactory _factory;
		public OrganizationsControllerIntegrationTests(
			TestStartupFactory factory
		)
		{
			_factory = factory;
		}

		[Theory]
		[InlineData(true)]
		public async Task OrganizationControllerOrganizationsGet_ReturnsCorrectResponseShape(
			bool isInclude
		)
		{
			User user;
			Organization organization;
			Site[] sites;
			using (var context = new TestHedwigContextProvider().Context)
			{
				organization = OrganizationHelper.CreateOrganization(context);
				var site1 = SiteHelper.CreateSite(context, organization: organization);
				var site2 = SiteHelper.CreateSite(context, organization: organization);
				sites = new Site[] { site1, site2 };
				EnrollmentHelper.CreateEnrollment(context, site: site1);
				user = UserHelper.CreateUser(context);
				PermissionHelper.CreateSitePermission(context, user, site1);
				PermissionHelper.CreateSitePermission(context, user, site2);
				PermissionHelper.CreateOrganizationPermission(context, user, organization);
			}

			var client = _factory.CreateClient();

			var request = HedwigAPIRequests.Organizations(
				user,
				organization
			);

			var response = await client.SendAsync(request);
			response.EnsureSuccessStatusCode();

			var responseString = await response.Content.ReadAsStringAsync();
			var responseOrganization = JsonConvert.DeserializeObject<Organization>(responseString);

			Assert.NotNull(responseOrganization);
			Assert.Equal(organization.Id, responseOrganization.Id);
			Assert.Equal(organization.Name, responseOrganization.Name);
			if (isInclude)
			{
				Assert.NotEmpty(responseOrganization.Sites);
				Assert.All(
					responseOrganization.Sites,
					site =>
					{
						Assert.NotNull(site.Name);
						Assert.Null(site.Organization);
						Assert.Null(site.Enrollments);
					}
				);
				Assert.NotNull(responseOrganization.FundingSpaces);
				Assert.All(
					responseOrganization.FundingSpaces,
					fundingSpace =>
					{
						Assert.NotNull(fundingSpace);
						Assert.Equal(fundingSpace.Time == FundingTime.Split, fundingSpace.TimeSplit != null);
					}
				);
			}
			else
			{
				Assert.Null(responseOrganization.Sites);
				Assert.Null(responseOrganization.FundingSpaces);
			}
		}
	}
}
