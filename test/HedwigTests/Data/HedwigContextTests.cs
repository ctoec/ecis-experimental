using System.Linq;
using System.Threading.Tasks;
using Hedwig.Models;
using HedwigTests.Fixtures;
using HedwigTests.Helpers;
using Xunit;

namespace HedwigTests.Data
{
	public class HedwigContextTests
	{
		[Fact]
		public void AddedTemporalEntity_IsUpdated_OnSaveChanges()
		{
			using (var context = new TestHedwigContextProvider().Context)
			{
				var family = new Family
				{
					OrganizationId = context.Organizations.First().Id
				};
				context.Add(family);
				context.SaveChanges();

				Assert.NotNull(family.AuthorId);
				Assert.NotNull(family.UpdatedAt);
			}
		}

		[Fact]
		public void UpdatedTemporalEntity_IsUpdated_OnSaveChanges()
		{
			using (var context = new TestHedwigContextProvider().Context)
			{
				var family = FamilyHelper.CreateFamily(context);
				var updatedAt = family.UpdatedAt;
				context.Update(family);
				context.SaveChanges();

				Assert.NotNull(family.AuthorId);
				Assert.NotNull(family.UpdatedAt);
				Assert.NotEqual(updatedAt, family.UpdatedAt);
			}
		}

		[Fact]
		public async Task AddedTemporalEntity_IsUpdated_OnSaveChangesAsync()
		{
			using (var context = new TestHedwigContextProvider().Context)
			{
				var family = new Family
				{
					OrganizationId = context.Organizations.First().Id
				};
				context.Add(family);
				await context.SaveChangesAsync();

				Assert.NotNull(family.AuthorId);
				Assert.NotNull(family.UpdatedAt);
			}
		}

		[Fact]
		public async Task UpdatedTemporalEntity_IsUpdated_OnSaveChangesAsync()
		{
			using (var context = new TestHedwigContextProvider().Context)
			{
				var family = FamilyHelper.CreateFamily(context);
				var updatedAt = family.UpdatedAt;
				context.Update(family);
				await context.SaveChangesAsync();

				Assert.NotNull(family.AuthorId);
				Assert.NotNull(family.UpdatedAt);
				Assert.NotEqual(updatedAt, family.UpdatedAt);
			}
		}
	}
}
