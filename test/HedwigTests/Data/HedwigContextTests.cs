using Xunit;
using Hedwig.Data;
using Moq;
using Moq.Protected;
using Hedwig.Models;
using Microsoft.EntityFrameworkCore;

namespace HedwigTests.Data
{
    public class HedwigContextTests
    {
        [Fact]
        public void Add_TemporalEntity_AddsAuthor()
        {
            // If a HedwigContext instance exists
            var opts = new DbContextOptionsBuilder<HedwigContext>()
                .UseInMemoryDatabase("db");
            var contextMock = new Mock<HedwigContext>(opts.Options);
            var child = new Child();
            contextMock.CallBase = true;
            
            // When a temporal entity is added
            contextMock.Object.Add(child);            

            // Then author is added to the entity
            contextMock
                .Protected()
                .Verify("AddAuthorToTemporalEntity", Times.Once(), new object[]{child});
        }

        [Fact]
        public void Update_TemporalEntity_AddsAuthor()
        {
            // If a HedwigContext instance exists
            var opts = new DbContextOptionsBuilder<HedwigContext>()
                .UseInMemoryDatabase("db");
            var contextMock = new Mock<HedwigContext>(opts.Options);
            var child = new Child();
            contextMock.Setup(c => c.Update(child)).CallBase();
            
            // When a temporal entity is updated
            contextMock.Object.Update(child);            

            // Then author is added to the entity
            contextMock
                .Protected()
                .Verify("AddAuthorToTemporalEntity", Times.Once(), new object[]{child});
        }
    }
}