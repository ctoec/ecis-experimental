namespace Hedwig.Models
{
	public abstract class OrganizationReport : Report
	{
		public int OrganizationId { get; set; }
		public Organization Organization { get; set; }
	}
}
