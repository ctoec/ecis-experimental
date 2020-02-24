using Xunit;
using Hedwig.Models;

namespace HedwigTests.Models
{
  public class TemporalEntityTests
  {

	class TemporalModel : TemporalEntity { }
	[Fact]
	public void TemporalEntity_Has_AuthoredByUpdatedAt()
	{
	  Assert.NotNull(typeof(TemporalModel).GetProperty("AuthorId"));
	  Assert.NotNull(typeof(TemporalModel).GetProperty("UpdatedAt"));
	}
  }
}
