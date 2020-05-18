namespace Hedwig.Utilities.DateTime
{
	public interface IDateTime
	{
		System.DateTime Now { get; }

		System.DateTime UtcNow { get; }
	}
}
