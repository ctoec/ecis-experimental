using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Hedwig.Validations;

namespace Hedwig.Models
{
	public class FamilyDetermination : TemporalEntity, INonBlockingValidatableObject
	{
		[Required]
		public int Id { get; set; }

		public bool NotDisclosed { get; set; } = false;

		public int? NumberOfPeople { get; set; }

		[Column(TypeName = "decimal(14,2)")]
		public decimal? Income { get; set; }

		public DateTime? DeterminationDate { get; set; }

		[Required]
		public int FamilyId { get; set; }
		public Family Family { get; set; }

		[NotMapped]
		public List<ValidationError> ValidationErrors { get; set; }
	}
}
