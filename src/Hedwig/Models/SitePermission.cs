namespace Hedwig.Models
{
	public class SitePermission : Permission
	{
		public int SiteId { get; set; }
		public Site Site { get; set; }
	}
}
