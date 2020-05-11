namespace Hedwig.Utilities.DateTime
{
	public class SystemDateTime : IDateTime
	{
		public SystemDateTime()
		{ }

		public System.DateTime Now
		{
			get { return System.DateTime.Now; }
		}

		public System.DateTime UtcNow
		{
			get { return System.DateTime.UtcNow; }
		}
	}
}
