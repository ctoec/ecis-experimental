using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hedwig.Models
{
	public class FamilyDetermination : TemporalEntity
	{
		public int Id { get; set; }

		public int NumberOfPeople { get; set; }

		[Column(TypeName = "decimal(14,2)")]
		public decimal Income { get; set; }

		public DateTime Determined { get; set; }

		public int FamilyId { get; set; }
		public Family Family { get; set; }
	}
}
