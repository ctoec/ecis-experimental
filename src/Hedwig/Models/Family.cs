using System.Collections.Generic;

namespace Hedwig.Models
{
	public class Family : TemporalEntity
	{
		public int Id { get; set; }
		public ICollection<Child> Children { get; set; }
		public string AddressLine1 { get; set; }
		public string AddressLine2 { get; set; }
		public string Town { get; set; }
		public string State { get; set; }
		public string Zip { get; set; }
		public bool Homelessness { get; set; }
		public ICollection<FamilyDetermination> Determinations { get; set; }

		// Optional FK to prevent cascade delete
		// (multiple cascade delete FKs disallowed by SQLServer due to potential for cycles)
		public int? OrganizationId { get; set; }
		public Organization Organization { get; set; }
	}
}
