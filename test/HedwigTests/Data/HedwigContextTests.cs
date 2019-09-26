using Xunit;
using Microsoft.EntityFrameworkCore;
using Hedwig.Data;
using Hedwig.Models;
using Moq;

namespace HedwigTests.Data
{
    public class HedwigContextTests
    {
        [Fact]
        public void GetDbSetForType_Returns_DbSet_Property()
        {
            var contextStub = new Mock<HedwigContext>(new DbContextOptions<HedwigContext>());
            var context = contextStub.Object;

            Assert.Same(context.Enrollments, context.GetDbSetForType<Enrollment>());
            Assert.Same(context.Families, context.GetDbSetForType<Family>());
            Assert.Same(context.FamilyDeterminations, context.GetDbSetForType<FamilyDetermination>());
            Assert.Same(context.Fundings, context.GetDbSetForType<Funding>());
            Assert.Same(context.Sites, context.GetDbSetForType<Site>());
            Assert.Same(context.SitePermissions, context.GetDbSetForType<SitePermission>());
            Assert.Same(context.Users, context.GetDbSetForType<User>());
        }
    }
}