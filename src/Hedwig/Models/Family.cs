using System.Collections.Generic;

namespace Hedwig.Models
{
	public class Family
	{
		public int Id { get; set; }

		public ICollection<Child> Children { get; set; }
		public ICollection<FamilyDetermination> Determinations { get; set; }
	}
}
