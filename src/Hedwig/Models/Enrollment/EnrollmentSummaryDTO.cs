using System;
using System.Collections.Generic;
using Hedwig.Validations;
using Hedwig.Models;

namespace Hedwig.Models
{
	public class EnrollmentSummaryDTO : IHedwigIdEntity<int>
	{
		public int Id { get; set; }
		public Guid ChildId { get; set; }
		public EnrollmentSummaryChildDTO Child { get; set; }
		public int SiteId { get; set; }
		public EnrollmentSummarySiteDTO Site { get; set; }
		public Age? AgeGroup { get; set; }
		public DateTime? Entry { get; set; }
		public DateTime? Exit { get; set; }
		public string ExitReason { get; set; }
		public ICollection<FundingDTO> Fundings { get; set; }
		public List<ValidationError> ValidationErrors { get; set; }
	}
}
