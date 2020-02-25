using System;

namespace Hedwig.Utilities
{
	public class SystemDateTime : IDateTime
	{
		public SystemDateTime()
		{ }

		public DateTime Now
		{
			get { return DateTime.Now; }
		}

		public DateTime UtcNow
		{
			get { return DateTime.UtcNow; }
		}
	}
}
