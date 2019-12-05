namespace Hedwig.Models
{
	public abstract class Permission
	{
		public int Id { get; set; }

		// Optional FK to prevent cascade delete
		// (multiple cascade delete FKs disallowed by SQLServer due to potential for cycles)
		public int? UserId { get; set; }
		public User User { get; set; }
	}
}
