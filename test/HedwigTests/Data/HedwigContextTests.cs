using Xunit;
using Hedwig.Data;
using Moq;
using Moq.Protected;
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
    public void Add_TemporalEntity_AddsAuthor()
    {
      // If a HedwigContext instance exists
      var opts = new DbContextOptionsBuilder<HedwigContext>()
        .UseInMemoryDatabase<HedwigContext>("db");
      var httpContextAccessor = new TestHttpContextAccessorProvider().HttpContextAccessor;
      var contextMock = new Mock<HedwigContext>(opts.Options, httpContextAccessor);

      var userId = 1;
      contextMock
        .Protected()
        .Setup<int?>("GetCurrentUserId")
        .Returns(userId);
        
      contextMock.CallBase = true;

      // When a temporal entities are added
      var family = new Family();
      var child = new Child { Family = family };
      contextMock.Object.Add(child);

      // Then author is added to the entity
      Assert.Equal(userId, child.AuthorId.Value);
      Assert.Equal(userId, child.Family.AuthorId.Value);
    }

    [Fact]
    public void Update_TemporalEntity_AddsAuthor()
    {
      // If a HedwigContext instance exists
      var opts = new DbContextOptionsBuilder<HedwigContext>()
        .UseInMemoryDatabase<HedwigContext>("db");
      var httpContextAccessor = new TestHedwigContextProvider().HttpContextAccessor;
      var contextMock = new Mock<HedwigContext>(opts.Options, httpContextAccessor);

      var userId = 1;
      contextMock
        .Protected()
        .Setup<int?>("GetCurrentUserId")
        .Returns(userId);

      contextMock.CallBase = true;

      // When temporal entities are updated
      var family = new Family();
      var child = new Child{ Family = family };
      contextMock.Object.Update(child);

      // Then author is added to the entity
      Assert.Equal(userId, child.AuthorId.Value);
      Assert.Equal(userId, child.Family.AuthorId.Value);
    }

    [Fact]
    public void SaveChanges_DoesNotAddReadOnlyEntity()
    {
      using(var context = new TestHedwigContextProvider().Context)
      {
        // If a read-only entity is created
        var now = DateTime.Now;
        var reportingPeriod = new ReportingPeriod {
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
      using(var context = new TestHedwigContextProvider().Context)
      {
        // If a read-only entity is created
        var now = DateTime.Now;
        var reportingPeriod = new ReportingPeriod {
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