using Xunit;
using Hedwig.Models;
using Microsoft.EntityFrameworkCore;
using HedwigTests.Fixtures;
using HedwigTests.Helpers;
using System;
using System.Linq;
using System.Threading.Tasks;

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

	[Fact]
	public void SaveChanges_DoesNotAddReadOnlyEntity()
	{
	  using (var context = new TestHedwigContextProvider().Context)
	  {
		// If a read-only entity is created
		var now = DateTime.Now;
		var reportingPeriod = new ReportingPeriod
		{
		  Type = FundingSource.CDC,
		  Period = now,
		  PeriodStart = now,
		  PeriodEnd = now,
		  DueAt = now
		};
		context.Add(reportingPeriod);

		// When context changes are saved
		context.SaveChanges();

		// Then the changes are not persisted to the DB
		var res = context.ReportingPeriods.Where(rp => rp.Period == now);
		Assert.Empty(res);
	  }
	}

	[Fact]
	public void SaveChanges_DoesNotUpdateReadOnlyEntity()
	{
	  using (var context = new TestHedwigContextProvider().Context)
	  {
		// If a read-only entity is updated
		var reportingPeriod = ReportingPeriodHelper.CreateReportingPeriod(context, type: FundingSource.CDC);
		var updatedType = FundingSource.C4K;
		reportingPeriod.Type = updatedType;
		context.Update(reportingPeriod);

		// When context changes are saved
		context.SaveChanges();

		// Then the changes are not persisted to the DB
		var res = context.ReportingPeriods.AsNoTracking().First(period => period.Id == reportingPeriod.Id);
		Assert.NotEqual(updatedType, res.Type);
	  }
	}

	[Fact]
	public async Task SaveChangesAsync_DoesNotAddReadOnlyEntity()
	{
	  using (var context = new TestHedwigContextProvider().Context)
	  {
		// If a read-only entity is created
		var now = DateTime.Now;
		var reportingPeriod = new ReportingPeriod
		{
		  Type = FundingSource.CDC,
		  Period = now,
		  PeriodStart = now,
		  PeriodEnd = now,
		  DueAt = now
		};
		context.Add(reportingPeriod);

		// When context changes are saved
		await context.SaveChangesAsync();

		// Then the changes are not persisted to the DB
		var res = context.ReportingPeriods.Where(rp => rp.Period == now);
		Assert.Empty(res);
	  }
	}

	[Fact]
	public async Task SaveChangesAsync_DoesNotUpdateReadOnlyEntity()
	{
	  using (var context = new TestHedwigContextProvider().Context)
	  {
		// If a read-only entity is updated
		var reportingPeriod = ReportingPeriodHelper.CreateReportingPeriod(context, type: FundingSource.CDC);
		var updatedType = FundingSource.C4K;
		reportingPeriod.Type = updatedType;
		context.Update(reportingPeriod);

		// When context changes are saved
		await context.SaveChangesAsync();

		// Then the changes are not persisted to the DB
		var res = context.ReportingPeriods.AsNoTracking().First(period => period.Id == reportingPeriod.Id);
		Assert.NotEqual(updatedType, res.Type);
	  }
	}
  }
}
