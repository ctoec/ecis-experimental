using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Xunit;
using Hedwig.Models;
using HedwigTests.Helpers;
using HedwigTests.Fixtures;

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
		[InlineData(new string[] { }, false)]
		[InlineData(new string[] { "sites", "funding_spaces" }, true)]
		public async Task OrganizationControllerOrganizationsGet_ReturnsCorrectResponseShape(
			string[] include,
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
				organization,
				include
			);

			var response = await client.SendAsync(request);
			response.EnsureSuccessStatusCode();

			var responseString = await response.Content.ReadAsStringAsync();
			var responseOrganization = JsonConvert.DeserializeObject<Organization>(responseString);

			Assert.NotNull(responseOrganization);
			Assert.Equal(organization.Id, responseOrganization.Id);
			Assert.Equal(organization.Name, responseOrganization.Name);
			Assert.Null(responseOrganization.Reports);
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
				Assert.Null(responseOrganization.Reports);
				Assert.NotNull(responseOrganization.FundingSpaces);
				Assert.All(
					responseOrganization.FundingSpaces,
					fundingSpace =>
					{
						Assert.NotNull(fundingSpace);
						Assert.NotEmpty(fundingSpace.FundingTimeAllocations);
						Assert.All(
							fundingSpace.FundingTimeAllocations,
							allocation => Assert.NotNull(allocation)
						);
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
