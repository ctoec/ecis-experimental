using System.ComponentModel.DataAnnotations;

namespace Hedwig.Models
{
	public class CdcReport : OrganizationReport
	{
		[Required]
		public bool Accredited { get; set; } = false;
	}
}
