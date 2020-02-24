using System.ComponentModel.DataAnnotations;

namespace Hedwig.Models
{
  public class OrganizationPermission : Permission
  {
	[Required]
	public int OrganizationId { get; set; }
	public Organization Organization { get; set; }
  }
}
