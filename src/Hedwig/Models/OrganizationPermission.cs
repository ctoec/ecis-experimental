namespace Hedwig.Models
{
	public class OrganizationPermission : Permission
	{
		public int OrganizationId { get; set; }
		public Organization Organization { get; set; }
	}
}
