using System.ComponentModel.DataAnnotations;

namespace Hedwig.Models
{
	public abstract class OrganizationReport : Report
	{
		[Required]
		public int OrganizationId { get; set; }
		public Organization Organization { get; set; }
	}
}
