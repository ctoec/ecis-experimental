using System.Collections.Generic;
using Hedwig.Validations;

namespace Hedwig.Models
{
	public class FamilyDTOForRoster
	{
		public int Id { get; set; }
		public string AddressLine1 { get; set; }
		public string AddressLine2 { get; set; }
		public string Town { get; set; }
		public string State { get; set; }
		public string Zip { get; set; }
		public bool Homelessness { get; set; }
		public ICollection<FamilyDeterminationDTOForRoster> Determinations { get; set; }
		public int OrganizationId { get; set; }
		public List<ValidationError> ValidationErrors { get; set; }
	}
}
