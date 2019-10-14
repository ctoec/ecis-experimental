using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hedwig.Models
{
  public class Site
  {
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; }

    // Optional FK to prevent cascade delete and associated cycle
    public int? OrganizationId { get; set; }
    public Organization Organization { get; set; }

    public ICollection<Enrollment> Enrollments { get; set; }
  }
}
