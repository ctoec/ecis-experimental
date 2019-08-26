namespace ecis2.Models
{
	public class SitePermission
	{
		public int Id { get; set; }

		public int UserId { get; set; }
		public User User { get; set; }

		public int SiteId { get; set; }
		public Site Site { get; set; }
	}
}
