using System.Collections.Generic;
using Hedwig.Validations;
using Hedwig.Validations.Attributes;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Hedwig.Models
{
	public class Family : TemporalEntity, INonBlockingValidatableObject
	{
		
		[Required]
		public int Id { get; set; }
		public ICollection<Child> Children { get; set; }
		public string AddressLine1 { get; set; }
		public string AddressLine2 { get; set; }
		public string Town { get; set; }
		public string State { get; set; }
		public string Zip { get; set; }
		public bool Homelessness { get; set; }
		public ICollection<FamilyDetermination> Determinations { get; set; }

		[Required]
		[OrgIdFromPath]
		public int OrganizationId { get; set; }
		public Organization Organization { get; set; }

		[NotMapped]
		public List<ValidationError> ValidationErrors { get; set; }
	}
}
