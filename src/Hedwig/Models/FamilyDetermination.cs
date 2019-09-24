using System;

namespace Hedwig.Models
{
	public class FamilyDetermination
	{
		public int Id { get; set; }

		public int NumberOfPeople { get; set; }

		public decimal Income { get; set; }

		public DateTime Determined { get; set; }

		public int FamilyId { get; set; }
		public Family Family { get; set; }
	}
}
