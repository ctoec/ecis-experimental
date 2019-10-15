namespace Hedwig.Models
{
	public abstract class Permission
	{
		public int Id { get; set; }

		public int UserId { get; set; }
		public User User { get; set; }
	}
}
