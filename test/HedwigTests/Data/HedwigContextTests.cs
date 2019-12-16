using Xunit;
using Hedwig.Data;
using Moq;
using Moq.Protected;
using Hedwig.Models;
using Microsoft.EntityFrameworkCore;
using HedwigTests.Fixtures;

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
      var httpContextAccessor = new TestContextProvider().HttpContextAccessor;
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
  }
}