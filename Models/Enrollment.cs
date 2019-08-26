using System;
using System.Collections.Generic;

namespace ecis2.Models
{
	public class Enrollment
	{
		public int Id { get; set; }

		public Guid ChildId { get; set; }
		public Child Child { get; set; }

		public int SiteId { get; set; }
		public Site Site { get; set; }

		public DateTime Entry { get; set; }

		public DateTime? Exit { get; set; }

		public ICollection<Funding> Fundings { get; set; }
	}
}
