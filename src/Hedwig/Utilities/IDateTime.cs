using System;

namespace Hedwig.Utilities
{
	public interface IDateTime
	{
		DateTime Now { get; }

		DateTime UtcNow { get; }
	}
}