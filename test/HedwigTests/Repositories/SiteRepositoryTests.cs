using System.Linq;
using System.Threading.Tasks;
using Hedwig.Repositories;
using HedwigTests.Fixtures;
using HedwigTests.Helpers;
using Xunit;

namespace HedwigTests.Repositories
{
	public class SiteRepositoryTests
	{
		[Theory]
		[InlineData(true, true, false)]
		public async Task GetSiteForOrganization_ReturnsSiteWithIdAndOrganizationId_IncludesEntities(
			bool includeEnrollments,
			bool includeFundings,
			bool includeChildren
		)
		{
			int orgId;
			int id;
			using (var context = new TestHedwigContextProvider().Context)
			{
				var enrollment = EnrollmentHelper.CreateEnrollment(context);

				id = enrollment.SiteId;
				orgId = enrollment.Site.OrganizationId;
			}

			using (var context = new TestHedwigContextProvider().Context)
			{
				var siteRepo = new SiteRepository(context);
				var res = await siteRepo.GetSiteForOrganizationAsync(id, orgId);

				Assert.Equal(includeEnrollments, res.Enrollments != null);
				Assert.Equal(includeFundings, res.Enrollments != null && res.Enrollments.All(e => e.Fundings != null));
				Assert.Equal(includeChildren, res.Enrollments != null && res.Enrollments.All(e => e.Child != null));
			}
		}
	}
}
