using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Hedwig.Models
{
	public class Site
	{
		public int Id { get; set; }

		[Required]
		[StringLength(100)]
		public string Name { get; set; }

		[Required]
		public bool TitleI { get; set; } = false;

		[Required]
		[JsonConverter(typeof(StringEnumConverter))]
		public Region Region { get; set; }

		[Required]
		public int OrganizationId { get; set; }
		public Organization Organization { get; set; }

		public ICollection<Enrollment> Enrollments { get; set; }
	}
}
