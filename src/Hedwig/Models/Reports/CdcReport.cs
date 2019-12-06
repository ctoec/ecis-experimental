using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hedwig.Models
{
  public class CdcReport : OrganizationReport
  {
    [Required]
    public bool Accredited { get; set; } = false;
  }
}
