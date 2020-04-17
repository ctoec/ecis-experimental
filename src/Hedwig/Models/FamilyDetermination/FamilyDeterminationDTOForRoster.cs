using System;
using System.Collections.Generic;
using Hedwig.Validations;

namespace Hedwig.Models
{
	public class FamilyDeterminationDTOForRoster
	{
		public int Id { get; set; }
		public bool NotDisclosed { get; set; } = false;
		public int? NumberOfPeople { get; set; }
		public decimal? Income { get; set; }
		public DateTime? DeterminationDate { get; set; }
		public int FamilyId { get; set; }
		public List<ValidationError> ValidationErrors { get; set; }
	}
}
