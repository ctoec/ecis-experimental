using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hedwig.Models
{
  public class CdcReport : OrganizationReport
  {
    [Required]
    public bool Accredited { get; set; } = false;

    public decimal C4KRevenue { get; set; }
    public bool RetroactiveC4KRevenue { get; set; } = false;

    public decimal FamilyFeesRevenue { get; set; }
  }
}
