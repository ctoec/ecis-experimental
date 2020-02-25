using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hedwig.Models
{
  public class CdcReport : OrganizationReport
  {
	[Required]
	public bool Accredited { get; set; } = false;

	[Column(TypeName = "decimal(18,2)")]
	public decimal C4KRevenue { get; set; }
	public bool RetroactiveC4KRevenue { get; set; } = false;

	[Column(TypeName = "decimal(18,2)")]
	[Required]
	public decimal? FamilyFeesRevenue { get; set; }

	public string Comment { get; set; }
  }
}
