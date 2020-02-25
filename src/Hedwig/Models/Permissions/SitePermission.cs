using System.ComponentModel.DataAnnotations;

namespace Hedwig.Models
{
	public class SitePermission : Permission
	{
		[Required]
		public int SiteId { get; set; }
		public Site Site { get; set; }
	}
}
