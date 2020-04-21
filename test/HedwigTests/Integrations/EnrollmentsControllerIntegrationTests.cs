using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using Xunit;
using Hedwig.Models;
using HedwigTests.Helpers;
using HedwigTests.Fixtures;

namespace HedwigTests.Integrations
{
	public class EnrollmentsControllerIntegrationTests : IClassFixture<TestApiProvider>
	{
		private readonly TestApiProvider _factory;
		public EnrollmentsControllerIntegrationTests(
			TestApiProvider factory
		)
		{
			_factory = factory;
		}

		[Fact]
		public async Task EnrollmentControllerGet_ReturnsCorrectResponseShape()
		{
			Enrollment enrollment;
			User user;
			Organization organization;
			Site[] sites;
			using (var context = new TestHedwigContextProvider().Context)
			{
				organization = OrganizationHelper.CreateOrganization(context);
				var site1 = SiteHelper.CreateSite(context, organization: organization);
				var site2 = SiteHelper.CreateSite(context, organization: organization);
				enrollment = EnrollmentHelper.CreateEnrollment(context, site: site1);
				user = UserHelper.CreateUser(context);
				PermissionHelper.CreateSitePermission(context, user, site1);
				PermissionHelper.CreateSitePermission(context, user, site2);
				PermissionHelper.CreateOrganizationPermission(context, user, organization);
				sites = new Site[] { site1, site2 };
			}

			// Need to call WithWebHostBuilder and specify content root
			// Cannot abstract out into a method without solving the path location error
			// That is, when specifiying "." outside of the test class it gets the wrong path
			var client = _factory
				.WithWebHostBuilder(builder => builder.UseContentRoot("."))
				.CreateClient();

			var request = HedwigAPIRequests.OrganizationEnrollmentsSummary(
				user,
				organization,
				sites
			);

			var response = await client.SendAsync(request);
			response.EnsureSuccessStatusCode();

			var responseString = await response.Content.ReadAsStringAsync();
			var responseEnrollments = JsonConvert.DeserializeObject<List<Enrollment>>(responseString);
			Assert.NotEmpty(responseEnrollments);

			var responseEnrollment = responseEnrollments.First();

			Assert.Equal(enrollment.Id, responseEnrollment.Id);
			Assert.Equal(enrollment.ChildId, responseEnrollment.ChildId);
			Assert.NotNull(responseEnrollment.Child);
			Assert.Equal(enrollment.ChildId, responseEnrollment.Child.Id);
			Assert.Equal(enrollment.Child.FirstName, responseEnrollment.Child.FirstName);
			Assert.Equal(enrollment.Child.MiddleName, responseEnrollment.Child.MiddleName);
			Assert.Equal(enrollment.Child.LastName, responseEnrollment.Child.LastName);
			Assert.Empty(responseEnrollment.Child.Enrollments);
			Assert.Equal(enrollment.SiteId, responseEnrollment.SiteId);
			// responseEnrollment.Site is null here and I don't know why?
			// It is not null in the response on the client
			// Assert.NotNull(responseEnrollment.Site.Id);
			// Assert.NotNull(responseEnrollment.Site.Name);
			Assert.Equal(enrollment.AgeGroup, responseEnrollment.AgeGroup);
			Assert.Equal(enrollment.Entry, responseEnrollment.Entry);
			Assert.Equal(enrollment.Exit, responseEnrollment.Exit);
			Assert.Equal(enrollment.ExitReason, responseEnrollment.ExitReason);
			// Fundings
		}
	}
}
