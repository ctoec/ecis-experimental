using Xunit;
using Hedwig.Models;

namespace HedwigTests.Models
{
    public class TemporalEntityTests
    {
        
        class TemporalModel : TemporalEntity { }
        [Fact]
        public void TemporalEntity_Has_AuthoredBy()
        {
            Assert.NotNull(typeof(TemporalModel).GetProperty("AuthoredBy"));
        }
    }
}