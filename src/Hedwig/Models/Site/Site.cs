using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json;

namespace Hedwig.Models
{
	public class Site : IHedwigIdEntity<int>
	{
		[Required]
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

		public int? FacilityCode { get; set; }
		public int? LicenseNumber { get; set; }
		public int? NaeycId { get; set; }
		public int? RegistryId { get; set; }

		public ICollection<Enrollment> Enrollments { get; set; }
	}
}
