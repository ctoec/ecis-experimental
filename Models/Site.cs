using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ecis2.Models
{
	public class Site
	{
		public int Id { get; set; }

		[Required]
		[StringLength(100)]
		public string Name { get; set; }

		public ICollection<Enrollment> Enrollments { get; set; }
	}
}
