using Hedwig.Models;
using Xunit;

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
