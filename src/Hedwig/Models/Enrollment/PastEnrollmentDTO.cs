using System;
using System.Collections.Generic;

namespace Hedwig.Models
{
	public class PastEnrollmentDTO : IHedwigIdEntity<int>
	{
		public int Id { get; set; }
		public Guid ChildId { get; set; }
		public EnrollmentChildDTO Child { get; set; }
		public int SiteId { get; set; }
		public SiteDTO Site { get; set; }
		public Age? AgeGroup { get; set; }
		public DateTime Entry { get; set; }
		public DateTime Exit { get; set; }
		public string ExitReason { get; set; }
		public List<FundingDTO> Fundings { get; set; }
	}
}
