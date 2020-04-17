using System;
using System.Collections.Generic;
using Hedwig.Validations;

namespace Hedwig.Models
{
	public class EnrollmentDTOForRoster
	{
		public int Id { get; set; }
		public Guid ChildId { get; set; }
		public ChildDTOForRoster Child { get; set; }
		public int SiteId { get; set; }
		public SiteDTOForRoster Site { get; set; }
		public Age? AgeGroup { get; set; }
		public DateTime? Entry { get; set; }
		public DateTime? Exit { get; set; }
		public string ExitReason { get; set; }
		public ICollection<FundingDTOForRoster> Fundings { get; set; }
		public List<ValidationError> ValidationErrors { get; set; }
	}
}
